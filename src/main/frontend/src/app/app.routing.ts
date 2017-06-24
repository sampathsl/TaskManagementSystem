/**
 * Created by SAMPATH on 5/14/2017.
 */

import { Routes,RouterModule } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import {AddTaskComponent} from "./tasks/add-task/add-task.component";

const router: Routes = [

  /*{ path : '' , redirectTo : '/api/v1/tasks' , pathMatch : 'full' },*/
  { path: '' , component : TasksComponent },
  { path: 'addTask' , component : AddTaskComponent }

];

export const AppRoutes = RouterModule.forRoot(router);
