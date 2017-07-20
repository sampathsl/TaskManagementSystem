package com.sampath.tms.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sampath.tms.domain.Task;
import com.sampath.tms.repositories.TaskRepository;

/**
 * Created by SAMPATH on 5/12/2017.
 */
@Service("taskService")
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Transactional
    @Override
    public List<Task> listAll() {
        List<Task> tasks = new ArrayList<>();
        taskRepository.findAll().forEach(tasks::add);
        return tasks;
    }

    @Transactional
    @Override
    public Task getById(UUID id) {
        return taskRepository.findOne(id);
    }

    @Transactional
    @Override
    public Task saveOrUpdate(Task task) {
        taskRepository.save(task);
        return task;
    }

    @Transactional
    @Override
    public void delete(UUID id) {
        taskRepository.delete(id);
    }

    @Transactional
	@Override
	public List<Task> listAllTaskByDueDateAndPriority() {
		return taskRepository.listAllTaskByDueDateAndPriority().collect(Collectors.toCollection(ArrayList::new));
	}

}
