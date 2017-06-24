import {Component, OnDestroy, OnInit} from '@angular/core';

import {Task} from '../task.model';
import {TaskService} from '../task.service';
import {TaskStatus} from '../task-status';
import {Router} from '@angular/router';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {NgxPaginationModule} from 'ngx-pagination';
import {Observable} from 'rxjs/Observable';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {SharedService} from '../../shared-service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  providers : [Ng2Bs3ModalModule, NgxPaginationModule],
})

export class TasksListComponent implements OnInit, OnDestroy {

    tasks: Task[] = [];
    timerSubscription: AnonymousSubscription;
    postsSubscription: AnonymousSubscription;
    updateTask: SharedService;

    constructor(private taskService: TaskService , private router: Router , private sharedService: SharedService) {
        this.updateTask = sharedService;
    }

    ngOnInit() {
      this.refreshData();
      // check any item updated
      this.updateTask.getEmittedUpdateValue().subscribe(oldItem => this.refreshData());
    }

    ngOnDestroy(): void {
      if (this.postsSubscription) {
        this.postsSubscription.unsubscribe();
      }
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
    }

    refreshData() {
      this.postsSubscription = this.taskService.getAllTasks('').subscribe(tasks => {
        if (Object.keys(tasks).length > 0) {
          this.tasks = tasks;
        } else {
          this.tasks = [];
        }
        this.subscribeToData();
      });
    }

    subscribeToData() {
      this.timerSubscription = Observable.timer(5000).first().subscribe(() => this.refreshData());
    }

    getDueDateLabel(task: Task) {
      return task.taskStatus === TaskStatus.COMPLETED ? 'label-success' : 'label-primary';
    }

    onTaskCreated(task: Task) {
        this.tasks.push(task);
    }

}
