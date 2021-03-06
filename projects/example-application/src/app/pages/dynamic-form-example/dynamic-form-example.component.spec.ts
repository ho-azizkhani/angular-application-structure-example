import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateStore } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { DynamicField } from '../../shared/components/dynamic-form/shared/dynamic-field.model';
import { SharedModule } from '../../shared/shared.module';
import { DynamicFormExampleComponent } from './dynamic-form-example.component';
import { DynamicFormExampleService } from './dynamic-form-example.service';

const BASE_MODULES = [
  CommonModule,
  RouterModule,
  RouterTestingModule,
  HttpClientModule,
  HttpClientTestingModule,
  BrowserAnimationsModule,
  ReactiveFormsModule
];
const APP_MODULES = [SharedModule];
const VENDORS_MODULES = [TranslateModule.forChild({ extend: true })];

const stubData = [
  {
    controlType: 0,
    key: "name",
    hidden: false,
    label: "Name",
    required: true,
    options: [],
    order: 1,
    type: "text",
    validators: [],
    value: "",
  },
  {
    controlType: 1,
    key: "confirm",
    hidden: false,
    label: "Checkbox with confirmation",
    required: false,
    options: [],
    order: 3,
    type: "check",
    validators: [],
    value: false
  }
];

class DynamicFormExampleServiceMock extends DynamicFormExampleService
{
  override getDynamicFields(): Observable<DynamicField<any>[]>
  {
    return new Observable<any>(observer =>
    {
      observer.next(
        stubData
      );
    });
  }
}

describe('DynamicFormExampleComponent', () =>
{
  let component: DynamicFormExampleComponent;
  let fixture: ComponentFixture<DynamicFormExampleComponent>;

  let de: DebugElement;
  let el: HTMLElement;

  let newDynamicFormExampleServiceMock = new DynamicFormExampleServiceMock();

  beforeEach(async () =>
  {
    await TestBed.configureTestingModule({
      declarations: [DynamicFormExampleComponent],
      imports: [
        ...BASE_MODULES,
        ...APP_MODULES,
        ...VENDORS_MODULES
      ],
      providers: [
        TranslateStore,
        { provide: DynamicFormExampleService }
      ]
    })
      .overrideProvider(DynamicFormExampleService, { useValue: newDynamicFormExampleServiceMock })
      .compileComponents();
  });

  beforeEach(() =>
  {
    fixture = TestBed.createComponent(DynamicFormExampleComponent);
    component = fixture.componentInstance;

    component.dynamicFields$ = newDynamicFormExampleServiceMock.getDynamicFields();
    component.ngOnInit();

    fixture.detectChanges();

    de = fixture.debugElement.query(By.css('form'));
    el = de.nativeElement;
  });

  it('should create', () =>
  {
    expect(component).toBeTruthy();
  });

  it('should render input elements', async () =>
  {
    const compiled = fixture.debugElement.nativeElement;

    const nameInput = compiled.querySelector('input[id="name"]');
    const confirmInput = compiled.querySelector('input[id="confirm"]');

    expect(nameInput).toBeTruthy();
    expect(confirmInput).toBeTruthy();
  });

  it('should render submit input', async () =>
  {
    const compiled = fixture.debugElement.nativeElement;

    const submitInput = compiled.querySelector('button[id="submit"]');

    expect(submitInput).toBeTruthy();
  });
});



