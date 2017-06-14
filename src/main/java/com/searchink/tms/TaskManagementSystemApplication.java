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

    @Autowired
    public TaskManagementSystemApplication(TaskService taskService){
        TaskManagementSystemApplication.taskService = taskService;
    }
    
    @PostConstruct
    void started() {
      TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

	public static void main(String[] args) {
		SpringApplication.run(TaskManagementSystemApplication.class, args);
		new TaskScheduler(taskService).run();
	}
}
