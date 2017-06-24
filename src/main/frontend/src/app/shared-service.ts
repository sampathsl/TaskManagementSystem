/**
 * Created by SAMPATH on 6/10/2017.
 */
import {Component, Injectable, Input, Output, EventEmitter} from '@angular/core';

@Injectable()
export class SharedService {

  @Output() update: EventEmitter<any> = new EventEmitter();

  constructor() {}

  updateTask()
  {
    this.update.emit(true);
  }

  getEmittedUpdateValue()
  {
    return this.update;
  }

}
