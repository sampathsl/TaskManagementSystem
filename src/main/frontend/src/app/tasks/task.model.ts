import {TaskStatus} from './task-status';

export class Task {


  public createdAt: string;
  public updatedAt: string;
  public dueDate: string;
  public resolvedAt: string;
  public reminderAt: string;
  public title: string;
  public description: string;
  public priority: number;
  public taskStatus: TaskStatus;
  public id: string;
  public version: string;


  constructor(createdAt: string, updatedAt: string, dueDate: string,
              resolvedAt: string, title: string, description: string, priority: number,
              taskStatus: TaskStatus, id: string, version: string, reminderAt: string) {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.dueDate = dueDate;
    this.resolvedAt = resolvedAt;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.taskStatus = taskStatus;
    this.id = id;
    this.version = version;
    this.reminderAt = reminderAt;
  }

}
