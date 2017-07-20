package com.sampath.tms.scheduler;

import java.util.Calendar;
import java.util.Date;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;

import com.sampath.tms.services.TaskService;
import org.springframework.stereotype.Component;

import com.sampath.tms.domain.Task;
import com.sampath.tms.domain.enums.TaskStatus;

/**
 * Created by SAMPATH on 5/12/2017.
 * Task scheduler application - inputs sample tasks
 */
@Component
public class TaskScheduler extends TimerTask {

    private TaskService taskService;

    public TaskScheduler(TaskService taskService) {
        this.taskService = taskService;
    }

    private final static Timer timer = new Timer();

    /**
     * Creating sample tasks with random data
     * @param id - task id
     */
    public void createSampleTasks(Long id) {

        final Date createdAt = new Date();
        final Date updatedAt = null;
        Calendar c = Calendar.getInstance();
        c.add(Calendar.DATE,new Random().nextInt(id.intValue() + 1));
        final Date dueDate = c.getTime();
        final String title = "TASK - " + id;
        final String description = "This is Sample Task - " + id;
        final Integer priority = new Random().nextInt(6);
        final TaskStatus taskStatus = TaskStatus.values()[new Random().nextInt(TaskStatus.values().length)];
        
        Date resolvedAt = null;
        Date reminderAt = null;
        
        if(taskStatus.equals(TaskStatus.COMPLETED)){
        	c.add(Calendar.DATE,new Random().nextInt(5));
            resolvedAt = c.getTime();
        }
        
        if(taskStatus.equals(TaskStatus.POSTPONED)){
        	long timeStamp = dueDate.getTime() + 3600000;
        	reminderAt = new Date();
        }

        final Task t = new Task(createdAt,updatedAt,dueDate,resolvedAt,
                title,description,priority,taskStatus,reminderAt);

        try {
            taskService.saveOrUpdate(t);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public void run() {
        int delay = (1 + new Random().nextInt(5)) * 10000;
        timer.schedule(new TaskScheduler(taskService),delay);
        createSampleTasks(Index.getNextId());
    }

}
