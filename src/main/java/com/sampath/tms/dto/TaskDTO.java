package com.sampath.tms.dto;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Range;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.sampath.tms.domain.enums.TaskStatus;

public class TaskDTO implements Serializable {
	
	private static final long serialVersionUID = 5545512118451221L;
	
	private UUID id;
    private Long version;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private final Date createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private final Date updatedAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private final Date dueDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private final Date resolvedAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private final Date reminderAt;

    @NotNull(message = "Title can''t be empty!")
    @Size(min = 2, max = 100 , message = "Title length should be between 2 and 100!")
    private final String title;

    @NotNull(message = "Description can''t be empty!")
    @Size(min = 2, max = 140, message = "Description length should be between 2 and 140!")
    private final String description;

    @NotNull
    @Range(min = 0, max= 5 , message = "Priority should be between 0 and 5!")
    private final Integer priority;

    @NotNull(message = "TaskStatus can''t be empty!")
    private final TaskStatus taskStatus;

    protected TaskDTO() {
        this.id = UUID.randomUUID();
        this.version = 0l;
        this.createdAt = new Date();
        this.updatedAt = null;
        this.dueDate = new Date();
        this.resolvedAt = null;
        this.title = "";
        this.description = "";
        this.priority = 0;
        this.taskStatus = TaskStatus.ACTIVE;
        this.reminderAt = null;
    }

    public TaskDTO(UUID uuid,Long version,Date createdAt, Date updatedAt, Date dueDate, Date resolvedAt,
                String title, String description, Integer priority, TaskStatus taskStatus,Date reminderAt) {
    	this.id = uuid;
    	this.version = version;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.dueDate = dueDate;
        this.resolvedAt = resolvedAt;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.taskStatus = taskStatus;
        this.reminderAt = reminderAt;
    }

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public Date getDueDate() {
		return dueDate;
	}

	public Date getResolvedAt() {
		return resolvedAt;
	}

	public String getTitle() {
		return title;
	}

	public String getDescription() {
		return description;
	}

	public Integer getPriority() {
		return priority;
	}

	public TaskStatus getTaskStatus() {
		return taskStatus;
	}

	public Date getReminderAt() {
		return reminderAt;
	}

	@Override
	public String toString() {
		return "TaskDTO [id=" + id + ", version=" + version + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt
				+ ", dueDate=" + dueDate + ", resolvedAt=" + resolvedAt + ", reminderAt=" + reminderAt + ", title="
				+ title + ", description=" + description + ", priority=" + priority + ", taskStatus=" + taskStatus
				+ "]";
	}
	
}
