package com.searchink.tms.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.stream.Stream;
import com.searchink.tms.domain.Task;

/**
 * Created by SAMPATH on 5/12/2017.
 */

public interface TaskRepository extends CrudRepository<Task,UUID> {
	
	/**
	 * Get the list of task according to the task due_date and task priority
	 * @return
	 */
	@Query("SELECT t FROM Task t ORDER BY due_date ASC , priority DESC")
	public Stream<Task> listAllTaskByDueDateAndPriority();
	
}
