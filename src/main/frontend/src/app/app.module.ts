import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TasksListComponent } from './tasks/task-list/task-list.component';
import { TasksComponent } from "./tasks/tasks.component";

import { TaskService } from './tasks/task.service';
import { HeaderComponent } from './header/header.component';
import { AddTaskComponent } from './tasks/add-task/add-task.component';
import { AppRoutes } from "./app.routing";
import { DatepickerModule , TimepickerModule } from "ng2-bootstrap";
import { DateFormatPipe } from "./tasks/pipes/date-format.pipe";
import { CommonModule } from '@angular/common';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { KeysPipe } from "./keys-pipe";
import { Ng2Bs3ModalModule } from "ng2-bs3-modal/ng2-bs3-modal";
import { NgxPaginationModule } from "ngx-pagination";
import { EditTaskComponent } from "./tasks/edit-task/edit-task.componenet";
import {ClickOutsideDirective} from "./ng2-click-outside.directive";
import {ClickOutsideModule} from "./ng2-click-outside.module";
import {SharedService} from "./shared-service";


@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    TasksListComponent,
    HeaderComponent,
    AddTaskComponent,
    EditTaskComponent,
    KeysPipe,
    DateFormatPipe
  ],
  exports: [KeysPipe],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutes,
    DatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    Ng2Bs3ModalModule,
    NgxPaginationModule,
    ClickOutsideModule
  ],
  providers: [TaskService, DateFormatPipe , ClickOutsideDirective , ClickOutsideModule , SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
