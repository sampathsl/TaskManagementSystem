package com.sampath.tms;

import com.sampath.tms.scheduler.TaskScheduler;
import com.sampath.tms.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

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
