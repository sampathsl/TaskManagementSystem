import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TaskStatus} from '../task-status';
import {TaskService} from '../task.service';
import {DatepickerModule} from 'ng2-bootstrap';
import {Task} from '../task.model';
import {SharedService} from '../../shared-service';
import {DateFormatPipe} from '../pipes/date-format.pipe';
import {ResponseData} from '../response-data';

@Component({
  selector: 'app-modal',
  templateUrl : './edit-task.component.html',
  styleUrls : ['./edit-task.component.css'],
})

export class EditTaskComponent implements OnInit {

  visible = false;
  visibleAnimate = false;

  responseData: ResponseData = new ResponseData('');
  updateForm: FormGroup;
  submitted: boolean;
  events: any[] = [];
  showDatePickerDueDate: boolean;
  showDatePickerResovedDate: boolean;
  showDatePickerReminderDate: boolean;
  showReminderDateField: boolean;

  taskStates_ = TaskStatus;
  task: Task;
  keys = Object.keys(this.taskStates_).filter(Number);

  createdAt: FormControl;
  updatedAt: FormControl;
  dueDate: FormControl;
  resolvedAt: FormControl;
  title: FormControl;
  description: FormControl;
  priority: FormControl;
  taskStatus: FormControl;
  id: FormControl;
  version: FormControl;
  reminderAt: FormControl;

  @Input() dueDateText: FormControl;
  dueDateDate: Date;

  @Input() resolvedDateText: FormControl;
  resolvedDateDate: Date;

  @Output() dateModelChange: EventEmitter<Date> = new EventEmitter();

  @Input() reminderDateText: FormControl;
  reminderDateDate: Date;

  toUTCDate = function(date){
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
      date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  constructor(@Inject(FormBuilder) fb: FormBuilder, private taskService: TaskService ,
              private datepickerModule: DatepickerModule, private _eref: ElementRef, private sharedService: SharedService,
              private dateFormatPipe: DateFormatPipe) {
    this.submitted = false;
    this.showDatePickerDueDate = false;
    this.showDatePickerResovedDate = false;
    this.showDatePickerReminderDate = false;
    this.showReminderDateField = false;
    this.dueDateDate = this.toUTCDate(new Date());
    this.resolvedDateDate = this.toUTCDate(new Date());
    this.reminderDateDate = this.toUTCDate(new Date());
  }

  ngOnInit() {
    this.createFormControls(new Task(this.toUTCDate(new Date()).toDateString(), this.toUTCDate(new Date()).toDateString(),
      this.toUTCDate(new Date()).toDateString(), this.toUTCDate(new Date()).toDateString(), '', '', 0, TaskStatus.ACTIVE, '', '', ''));
    this.createForm();
    this.subscribeToFormChanges();
  }

  public updateExecuted(): void {
    this.sharedService.updateTask();
  }

  subscribeToFormChanges() {
    const myFormStatusChanges = this.updateForm.statusChanges;
    const myFormValueChanges = this.updateForm.valueChanges;
    myFormStatusChanges.subscribe(value => this.events.push({ event: 'STATUS_CHANGED', object: value }));
    myFormValueChanges.subscribe(value => this.events.push({ event: 'VALUE_CHANGED', object: value }));
  }

  createFormControls(task: Task) {

    this.createdAt = new FormControl(task.createdAt);
    this.updatedAt = new FormControl(task.updatedAt);
    this.dueDate = new FormControl(task.dueDate, Validators.required);
    this.dueDateText = new FormControl(task.dueDate);
    this.resolvedAt = new FormControl(task.resolvedAt);
    this.resolvedDateText = new FormControl(task.resolvedAt);
    this.title = new FormControl(task.title, [Validators.required, Validators.pattern(".{5,50}")]);
    this.description = new FormControl(task.description, [Validators.required, Validators.pattern(".{5,200}")]);
    this.priority = new FormControl(task.priority, Validators.required);
    this.taskStatus = new FormControl(task.taskStatus, Validators.required);
    this.id = new FormControl(task.id, Validators.required);
    this.version = new FormControl(task.version, Validators.required);
    this.reminderAt = new FormControl(task.reminderAt);
    this.reminderDateText = new FormControl({value: task.reminderAt , disabled: (task.taskStatus === TaskStatus.ACTIVE ||
    task.taskStatus === TaskStatus.COMPLETED) ? true : false });

  }

  createForm() {

    this.updateForm = new FormGroup({
      createdAt : this.createdAt,
      updatedAt : this.updatedAt,
      dueDate : this.dueDate,
      dueDateText : this.dueDateText,
      resolvedAt : this.resolvedAt,
      resolvedDateText : this.resolvedDateText,
      title : this.title,
      description : this.description,
      priority : this.priority,
      taskStatus : this.taskStatus,
      id : this.id,
      version : this.version,
      reminderAt : this.reminderAt,
      reminderDateText : this.reminderDateText
    });

  }

  updateTaskSubmit(model: Task, isValidForm: boolean) {

    this.submitted = true;

    if (isValidForm && this.dueDate != null && this.dueDateText != null) {

      this.task = new Task(
        model.createdAt,
        model.updatedAt,
        this.dueDateText.value,
        this.resolvedDateText.value,
        model.title,
        model.description,
        model.priority,
        model.taskStatus,
        model.id,
        model.version,
        this.reminderDateText.value
      );

      this.taskService.updateTask( this.task, isValidForm )
        .subscribe(
          (data: any) => {
            this.responseData = data;
            if (this.responseData) {
              this.hide();
              this.updateExecuted();
            } else {
              // show error message
            }
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
    this.showDatePickerReminderDate = false;
  }

  showPopupResovedDate() {
    this.showDatePickerDueDate = false;
    this.showDatePickerResovedDate = true;
    this.showDatePickerReminderDate = false;
  }

  showPopupReminderDate() {
    this.showDatePickerDueDate = false;
    this.showDatePickerResovedDate = false;
    this.showDatePickerReminderDate = true;
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

  onSelectionDoneReminderDate(event) {
    this.reminderDateDate = event;
    this.applyReminderDate();
    this.closeDatepickerReminderDate();
  }

  onSelectionDoneTaskStatus(value) {
    if (value && value === 'POSTPONED') {
      this.showReminderDateField = true;
      if (this.updateForm.controls['reminderDateText'].value == null) {
        this.updateForm.controls['reminderDateText'].setValue(this.dateFormatPipe.transformDate(this.toUTCDate(new Date())));
      }
    } else {
      this.showReminderDateField = false;
    }
  }

  private applyDueDate(): void {
    const date = this.dateFormatPipe.transformDate(this.dueDateDate);
    this.updateForm.controls['dueDateText'].setValue(date);
    this.dateModelChange.emit(this.dueDateDate);
  }

  private applyResolvedDate(): void {
    const date = this.dateFormatPipe.transformDate(this.resolvedDateDate);
    this.updateForm.controls['resolvedDateText'].setValue(date);
    this.dateModelChange.emit(this.dueDateDate);
  }

  private applyReminderDate(): void {
    const date = this.dateFormatPipe.transformDate(this.reminderDateDate);
    this.updateForm.controls['reminderDateText'].setValue(date);
    this.dateModelChange.emit(this.reminderDateDate);
  }

  closeDatepickerDueDate() {
    this.showDatePickerDueDate = false;
  }

  closeDatepickerResolvedDate() {
    this.showDatePickerResovedDate = false;
  }

  closeDatepickerReminderDate() {
    this.showDatePickerReminderDate = false;
  }

  clickOutside(event) {
    this.showDatePickerDueDate = false;
    this.showDatePickerResovedDate = false;
    this.showDatePickerReminderDate = false;
  }

  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.showDatePickerDueDate = false;
      this.showDatePickerResovedDate = false;
      this.showDatePickerReminderDate = false;
    }
  }

  onClickedOutsideDueDate(event) {
    if (this.showDatePickerDueDate)  { this.closeDatepickerDueDate(); }
  }

  onClickedOutsideResolvedDate(event) {
    if (this.showDatePickerResovedDate) { this.closeDatepickerResolvedDate(); }
  }

  onClickedOutsideReminderDate(event) {
    if (this.showDatePickerReminderDate) { this.closeDatepickerReminderDate(); }
  }

  public show(id: String): void {

    this.taskService.getTask(id).subscribe(task => {

      this.task = task;

      this.createFormControls(this.task);
      this.createForm();
      if (this.task.dueDate != null) {
        this.updateForm.controls['dueDateText'].setValue(this.dateFormatPipe.transform(this.task.dueDate));
      }
      if (this.task.resolvedAt != null) {
        this.updateForm.controls['resolvedDateText'].setValue(this.dateFormatPipe.transform(this.task.resolvedAt));
      }
      if (this.task.reminderAt != null) {
        this.updateForm.controls['reminderDateText'].setValue(this.dateFormatPipe.transform(this.task.reminderAt));
      }

      this.visible = true;

      if (this.task.taskStatus.toString() === 'POSTPONED') {
        this.showReminderDateField = true;
      }
      setTimeout(() => this.visibleAnimate = true, 100);
    });

  }

  public hide(): void {
    this.visibleAnimate = false;
    this.showReminderDateField = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

  changeDueDate(dueDateVal) {

    if (dueDateVal != null && dueDateVal !== ''
      && (!dueDateVal.match(/^(0[1-9]|[12][0-9]|3[01])[\- \/.](?:(0[1-9]|1[012])[\-\/.](19|20)[0-9]{2})$/))){
      this.dueDate = new FormControl(this.dateFormatPipe.transform(dueDateVal), Validators.required);
      this.dueDateDate = new Date(this.dateFormatPipe.transformDate(dueDateVal));
    } else {
      this.dueDate = new FormControl(null, Validators.required);
      this.dueDateDate = null;
    }

  }

}
