package com.searchink.tms;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.searchink.tms.scheduler.TaskScheduler;
import com.searchink.tms.services.TaskService;

@SpringBootApplication
public class TaskManagementSystemApplication {
	
	private static TaskService taskService;

	/**
	 * Initiate task service
	 * @param taskService
	 */
    @Autowired
    public TaskManagementSystemApplication(TaskService taskService){
        TaskManagementSystemApplication.taskService = taskService;
    }
    
    /**
     * Set UTC time zone
     */
    @PostConstruct
    void started() {
      TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    /**
     * Spring boot application starting point
     * @param args
     */
	public static void main(String[] args) {
		SpringApplication.run(TaskManagementSystemApplication.class, args);
		new TaskScheduler(taskService).run();
	}
}
