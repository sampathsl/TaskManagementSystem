import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/Rx';
import {Task} from './task.model';
import {DateFormatPipe} from './pipes/date-format.pipe';

@Injectable()
export class TaskService {

  mainURI = '/api/v1/tasks';

  toUTCDate = function(date){
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  constructor(private http: Http, private dateFormatPipe: DateFormatPipe) {
  }

  getTask(UUID: String) {
    return this.http.get(this.mainURI + '/' + UUID)
      .map(
        (response: Response) => {
          return response.json() ? response.json() : {};
        }
      );
  }

  getAllTasks(params: string) {
    return this.http.get(this.mainURI + params)
        .map(
          (response: Response) => {
            return response.json() ? response.json() : {};
          }
        );
  }

  saveTask(task: Task, checked: boolean) {

    task = new Task(this.dateFormatPipe.transform(task.createdAt), this.dateFormatPipe.transform(task.updatedAt),
      this.dateFormatPipe.transform(task.dueDate), this.dateFormatPipe.transform(task.resolvedAt), task.title, task.description,
        task.priority, task.taskStatus, task.id, task.version, this.dateFormatPipe.transform(task.reminderAt));
    return this.http.post(this.mainURI, task)
      /*.map(
        (response: Response) => {
          return response.json() ? response.json() : {};
        }
      )*/;

  }

  updateTask(task: Task, checked: boolean) {

    task = new Task(this.dateFormatPipe.transform(task.createdAt),
      this.dateFormatPipe.transform(this.toUTCDate(new Date()).toString().toString()),
      this.dateFormatPipe.transform(task.dueDate), this.dateFormatPipe.transform(task.resolvedAt), task.title, task.description,
      task.priority, task.taskStatus, task.id, task.version, this.dateFormatPipe.transform(task.reminderAt));

    if (checked) {
      return this.http.put(this.mainURI + '/' + task.id, task)
        .map(
          (response: Response) => {
            return response.json() ? response.json() : {};
          }
        );
    }

  }

}
