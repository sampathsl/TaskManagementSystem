package com.sampath.tms.services;

import com.sampath.tms.domain.Task;

import java.util.List;
import java.util.UUID;

/**
 * Created by SAMPATH on 5/12/2017.
 */
public interface TaskService {

    List<Task> listAll();

    Task getById(UUID id);

    Task saveOrUpdate(Task task);

    void delete(UUID id);
    
    List<Task> listAllTaskByDueDateAndPriority();

}
