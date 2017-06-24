import {Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Output} from '@angular/core';
import {Task} from '../task.model';
import {TaskStatus} from '../task-status';
import {TaskService} from '../task.service';
import {Router} from '@angular/router';
import {DatepickerModule} from 'ng2-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SharedService} from '../../shared-service';
import {DateFormatPipe} from '../pipes/date-format.pipe';
import {ResponseData} from 'app/tasks/response-data';

@Component({
  selector : 'app-add-task',
  templateUrl : './add-task.component.html',
  styleUrls : ['./add-task.component.css'],
  providers : [DatepickerModule, FormBuilder],
  /*host : {
    '(document:click)': 'onClick($event)'
  }*/
})

export class AddTaskComponent implements OnInit {

  responseData: ResponseData = new ResponseData('');
  addForm: FormGroup;
  submitted: boolean;
  events: any[] = [];
  showDatePickerDueDate: boolean;
  showDatePickerResovedDate: boolean;

  public taskStates_ = TaskStatus;
  public task: Task;
  public keys = Object.keys(this.taskStates_).filter(Number);

  createdAt: FormControl;
  updatedAt: FormControl;
  dueDate: FormControl;
  resolvedAt: FormControl;
  title: FormControl;
  description: FormControl;
  priority: FormControl;
  taskStatus: FormControl;

  @Input() dueDateText: FormControl;
  dueDateDate: Date;
  @Input() resolvedDateText: FormControl;
  resolvedDateDate: Date;
  @Output() dateModelChange: EventEmitter<Date> = new EventEmitter();

  @HostListener('(document:click)') onClickOutSide() {
    this.onClick('$event');
  }

  toUTCDate = function(date){
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
      date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  constructor(@Inject(FormBuilder) fb: FormBuilder, private taskService: TaskService , private router: Router ,
              private datepickerModule: DatepickerModule, private _eref: ElementRef, private sharedService: SharedService,
              private dateFormatPipe: DateFormatPipe) {
    this.submitted = false;
    this.showDatePickerDueDate = false;
    this.showDatePickerResovedDate = false;
    this.dueDateDate = this.toUTCDate(new Date());
    this.resolvedDateDate = this.toUTCDate(new Date());
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.subscribeToFormChanges();
  }

  subscribeToFormChanges() {
    const myFormStatusChanges = this.addForm.statusChanges;
    const myFormValueChanges = this.addForm.valueChanges;
    myFormStatusChanges.subscribe(value => this.events.push({ event: 'STATUS_CHANGED', object: value }));
    myFormValueChanges.subscribe(value => this.events.push({ event: 'VALUE_CHANGED', object: value }));
  }

  createFormControls() {

    this.createdAt = new FormControl(this.toUTCDate(new Date()), Validators.required);
    this.updatedAt = new FormControl(null);
    this.dueDate = new FormControl(null, Validators.required);
    this.dueDateText = new FormControl(null);
    this.resolvedAt = new FormControl(null);
    this.resolvedDateText = new FormControl(null);
    this.title = new FormControl('', [Validators.required, Validators.pattern(".{5,50}")]);
    this.description = new FormControl('', [Validators.required, Validators.pattern(".{5,200}")]);
    this.priority = new FormControl("0", Validators.required);
    this.taskStatus = new FormControl('ACTIVE', Validators.required);

  }

  createForm() {

    this.addForm = new FormGroup({
      createdAt : this.createdAt,
      updatedAt : this.updatedAt,
      dueDate : this.dueDate,
      dueDateText : this.dueDateText,
      resolvedAt : this.resolvedAt,
      resolvedDateText : this.resolvedDateText,
      title : this.title,
      description : this.description,
      priority : this.priority,
      taskStatus : this.taskStatus
    });

  }

  addTaskSubmit(model: Task, isValidForm: boolean) {

    this.submitted = true;

    if(isValidForm) {

      this.task = new Task(
        model.createdAt,
        model.updatedAt,
        this.dueDateText.value,
        this.resolvedDateText.value,
        model.title,
        model.description,
        model.priority,
        model.taskStatus,
        '',
        '',
        ''
      );

      this.taskService.saveTask(this.task, isValidForm)
        .subscribe(
          (data: any) => {
            this.responseData = data;
            this.router.navigate(['/addTask']);
          },
          function (error) {
            // console.log(error);
          },
          function () {
            // console.log('finally');
          }
        );

    }

  }

  isEmptyObject(obj) {
    return (obj && Object.keys(obj).length === 0);
  }

  showPopupDueDate() {
    this.showDatePickerDueDate = true;
    this.showDatePickerResovedDate = false;
  }

  showPopupResovedDate() {
    this.showDatePickerDueDate = false;
    this.showDatePickerResovedDate = true;
  }

  onSelectionDoneDueDate(event) {
    this.dueDateDate = event;
    this.applyDueDate();
    this.closeDatepickerDueDate();
  }

  onSelectionDoneResolvedDate(event) {
    this.resolvedDateDate = event;
    this.applyResolvedDate();
    this.closeDatepickerResolvedDate();
  }

  private applyDueDate(): void {
    const date = this.dateFormatPipe.transformDate(this.dueDateDate);
    this.addForm.controls['dueDateText'].setValue(date);
    this.dateModelChange.emit(this.dueDateDate);
  }

  private applyResolvedDate(): void {
    const date = this.dateFormatPipe.transformDate(this.resolvedDateDate);
    this.addForm.controls['resolvedDateText'].setValue(date);
    this.dateModelChange.emit(this.dueDateDate);
  }

  closeDatepickerDueDate() {
    this.showDatePickerDueDate = false;
  }

  closeDatepickerResolvedDate() {
    this.showDatePickerResovedDate = false;
  }

  clickOutside(event) {
    this.showDatePickerDueDate = false;
    this.showDatePickerResovedDate = false;
  }

  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.showDatePickerDueDate = false;
      this.showDatePickerResovedDate = false;
    }
  }

  onClickedOutsideDueDate(event) {
    if (this.showDatePickerDueDate) {this.closeDatepickerDueDate()};
  }

  onClickedOutsideResolvedDate(event) {
    if (this.showDatePickerResovedDate) {this.closeDatepickerResolvedDate()};
  }

}
