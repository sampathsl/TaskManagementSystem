package com.sampath.tms.controller;

import com.sampath.tms.domain.Task;
import com.sampath.tms.domain.enums.TaskStatus;
import com.sampath.tms.dto.TaskDTO;
import com.sampath.tms.services.TaskService;
import com.sampath.tms.util.CustomErrorType;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Created by SAMPATH on 5/12/2017.
 */
@RestController
@RequestMapping("/api/v1")
public class TaskController {
	
	private static final Logger logger = LogManager.getLogger(TaskController.class);
	
	@Autowired
	private TaskService taskService;
	
	@RequestMapping(value = "/tasks", method = RequestMethod.GET)
	public ResponseEntity<List<TaskDTO>> listAllTasks() {
		
		logger.info("IN listAllTasks METHOD");
		
		//List<Task> tasks = taskService.listAll();
		List<Task> tasks = taskService.listAllTaskByDueDateAndPriority();
		
		long currentTimeStamp = new Date().getTime();
		
		//filter task - postponed task are not showing 
		tasks.removeIf( task -> (task.getReminderAt() != null && task.getReminderAt() != null && task.getReminderAt().getTime() > currentTimeStamp && 
				task.getTaskStatus().equals(TaskStatus.POSTPONED)) );
		
        if (tasks.isEmpty()) {
			return new ResponseEntity(HttpStatus.NO_CONTENT);
		}
        
		return new ResponseEntity<List<TaskDTO>>(tasks.stream()
                .map(t -> convertToDto(t))
                .collect(Collectors.toList()), HttpStatus.OK);

	}

	@RequestMapping(value = "/tasks/{uuid}", method = RequestMethod.GET)
	public ResponseEntity<?> getTask(@Valid @PathVariable("uuid") UUID uuid) {
		
		logger.info("IN getTask METHOD");
		
		Task task = taskService.getById(uuid);
		
		if (task == null) {
			return new ResponseEntity(new CustomErrorType("Task with uuid " + uuid
					+ " not found"), HttpStatus.NOT_FOUND);
		}
		
		return new ResponseEntity<TaskDTO>(convertToDto(task), HttpStatus.OK);
		
	}
	
	private ResponseEntity<List<CustomErrorType>> getErrors(Errors errors) {
		
        return ResponseEntity.badRequest().body(errors.getAllErrors()
				.stream()
				.map(msg -> new CustomErrorType(msg.getDefaultMessage()))
				.collect(Collectors.toList()));
        
	}
	
	@RequestMapping(value = "/tasks", method = RequestMethod.POST)
	public ResponseEntity<?> createTask(@Valid @RequestBody TaskDTO taskDTO, UriComponentsBuilder ucBuilder, Errors errors) {
		
		if (errors.hasErrors()) {
			return getErrors(errors);
        }

		Task task = taskService.saveOrUpdate(convertToEntity(taskDTO));
		HttpHeaders headers = new HttpHeaders();
		headers.setLocation(ucBuilder.path("/api/tasks/{uuid}").buildAndExpand(task.getId()).toUri());
		return new ResponseEntity<String>(headers, HttpStatus.CREATED);
		
	}
	
	@RequestMapping(value = "/tasks/{uuid}", method = RequestMethod.PUT)
	public ResponseEntity<?> updateTask(@Valid @PathVariable("uuid") UUID uuid,@Valid @RequestBody TaskDTO taskDTO, Errors errors) {
		
		logger.info("IN updateTask METHOD");
		
		if (errors.hasErrors()) {
			return getErrors(errors);
        }
		
		if(taskDTO.getId() != null && (taskDTO.getVersion() == null || (taskDTO.getVersion() != null && taskDTO.getVersion().equals(""))) ){
			return new ResponseEntity(new CustomErrorType("Unable to upate. Task with uuid " + uuid + " not found."),
					HttpStatus.NOT_FOUND);
		}
		
		Task currentTask = taskService.getById(uuid);

		if (currentTask == null) {
			return new ResponseEntity(new CustomErrorType("Unable to upate. Task with uuid " + uuid + " not found."),
					HttpStatus.NOT_FOUND);
		}

		Task taskNew = convertToEntity(taskDTO);
		
		try {
			taskService.saveOrUpdate(taskNew);
			Task updatedTask = taskService.getById(uuid);
			return new ResponseEntity<Task>(updatedTask, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity(new CustomErrorType("Task update is not allowed.Please reload your edit task view."),
					HttpStatus.NOT_FOUND);
		
	}
	
	/**
	 * Convert Task data transfer object to task entity
	 * @param taskDTO
	 * @return
	 */
	private Task convertToEntity(TaskDTO taskDTO) {
		
		Task task = null;
		
	    if (taskDTO.getId() != null && taskDTO.getVersion() != null) {
	    	Task oldTask = taskService.getById(taskDTO.getId());
	    	if(oldTask != null){
	    		task = new Task(taskDTO.getId(),taskDTO.getVersion(),taskDTO.getCreatedAt(), taskDTO.getUpdatedAt(), taskDTO.getDueDate(), taskDTO.getResolvedAt(), taskDTO.getTitle(),
		    			taskDTO.getDescription(), taskDTO.getPriority(), taskDTO.getTaskStatus(), taskDTO.getReminderAt());
	    	} else {
	    		task = new Task(taskDTO.getCreatedAt(), taskDTO.getUpdatedAt(), taskDTO.getDueDate(), taskDTO.getResolvedAt(), taskDTO.getTitle(),
		    			taskDTO.getDescription(), taskDTO.getPriority(), taskDTO.getTaskStatus(), taskDTO.getReminderAt());
	    	}
	    }
	    else {
	    	task = new Task(taskDTO.getCreatedAt(), taskDTO.getUpdatedAt(), taskDTO.getDueDate(), taskDTO.getResolvedAt(), taskDTO.getTitle(),
	    			taskDTO.getDescription(), taskDTO.getPriority(), taskDTO.getTaskStatus(), taskDTO.getReminderAt());
	    }
	    
	    return task;
	    
	}
	
	/**
	 * Convert task entity to task data transfer object
	 * @param task
	 * @return
	 */
	private TaskDTO convertToDto(Task task){
		
		TaskDTO taskDTO = null;
		
		if(task.getId() != null && task.getVersion() != null){
			taskDTO = new TaskDTO(task.getId(), task.getVersion(), task.getCreatedAt(), task.getUpdatedAt(), 
					task.getDueDate(), task.getResolvedAt(), task.getTitle(), task.getDescription(), task.getPriority(), task.getTaskStatus(), task.getReminderAt());
		} 
		else {
			taskDTO = new TaskDTO(null, null, task.getCreatedAt(), task.getUpdatedAt(), 
					task.getDueDate(), task.getResolvedAt(), task.getTitle(), task.getDescription(), task.getPriority(), task.getTaskStatus(), task.getReminderAt());
		}
		
	    return taskDTO;
	    
	}

}
