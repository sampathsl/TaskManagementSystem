import {FormControl} from '@angular/forms';

export class TaskForm {


  public createdAt: FormControl;
  public updatedAt: FormControl;
  public dueDate: FormControl;
  public resolvedAt: FormControl;
  public title: FormControl;
  public description: FormControl;
  public priority: FormControl;
  public taskStatus: FormControl;
  public UUID: FormControl;


  constructor(createdAt: FormControl, updatedAt: FormControl, dueDate: FormControl,
              resolvedAt: FormControl, title: FormControl, description: FormControl, priority: FormControl,
              taskStatus: FormControl) {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.dueDate = dueDate;
    this.resolvedAt = resolvedAt;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.taskStatus = taskStatus;
  }

}
