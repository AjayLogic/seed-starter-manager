import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { FeatureService } from './feature.service';

import { SimpleDialogComponent } from '../shared/ui/simple-dialog/simple-dialog.component';

import { Feature } from '../model/feature';
import { ServiceError } from '../model/service-error';
import { ErrorType } from '../model/error-type.enum';
import { ServiceEvent } from '../model/service-event.enum';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent implements OnInit, OnDestroy {

  @ViewChild('inputNameRef') inputNameRef: ElementRef;
  @ViewChild('inputNameLabelRef') inputNameLabelRef: ElementRef;

  @ViewChild('featureDialog') featureDialog: SimpleDialogComponent;
  @ViewChild('deleteFeatureDialog') deleteFeatureDialog: SimpleDialogComponent;

  features: Feature[];
  latestFeatureClicked: Feature;

  inputName: FormControl;
  isEditing: boolean = false;

  private readonly maxFeatureName = 50; // TODO: fetch this information from database
  private subject: Subject<void> = new Subject();

  constructor(private featureService: FeatureService,
              private renderer: Renderer2) {}

  ngOnInit(): void {
    this.fetchAllFeatures();
    this.registerForServiceEvents();
    this.registerForErrors();
    this.initializeFormControls();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  addFeature(): void {
    if (this.isFeatureNameValid(this.inputName)) {
      const featureName: string = this.inputName.value;
      this.featureService.save({
        id: this.latestFeatureClicked ? this.latestFeatureClicked.id : null,
        name: featureName
      });
    } else {
      this.renderer.addClass(this.inputNameRef.nativeElement, 'invalid');
    }
  }

  deleteFeature(): void {
    if (!this.latestFeatureClicked.uses) {
      this.featureService.delete(this.latestFeatureClicked);
    }
  }

  openAddDialog(): void {
    this.isEditing = false;
    this.featureDialog.open();
  }

  openEditDialog(feature: Feature): void {
    this.isEditing = true;
    this.latestFeatureClicked = feature;

    // Avoids that the label appears behind of the input field text
    this.renderer.addClass(this.inputNameLabelRef.nativeElement, 'active');
    this.inputName.reset();
    this.inputName.setValue(feature.name);
    this.featureDialog.open();
  }

  get hasFeatures(): boolean {
    return Array.isArray(this.features) && this.features.length > 0;
  }

  get errorMessages(): any {
    return {
      required: 'Feature must have a name',
      maxlength: 'The feature name must have less than ' + this.maxFeatureName + ' characters',
      conflict: 'This Feature already exists'
    };
  }

  private fetchAllFeatures(): void {
    this.featureService.features
      .takeUntil(this.subject)
      .subscribe((features: Feature[]) => this.features = features);
  }

  private registerForServiceEvents(): void {
    this.featureService.events
      .takeUntil(this.subject)
      .subscribe((event: ServiceEvent) => {
        switch (event) {
          case ServiceEvent.ENTITY_CREATED:
            this.onFeatureCreated();
            break;
          case ServiceEvent.ENTITY_UPDATED:
            this.onFeatureUpdated();
            break;
          case ServiceEvent.ENTITY_DELETED:
            this.onFeatureDeleted();
            break;
        }
      });
  }

  private registerForErrors(): void {
    this.featureService.errors
      .takeUntil(this.subject)
      .subscribe((error: ServiceError) => {
        if (error) {
          switch (error.type) {
            case ErrorType.EMPTY:
              // TODO: Show the proper image on the template and highlight the add feature button
              break;
            case ErrorType.GATEWAY_TIMEOUT:
              // TODO: Show the proper error dialog
              break;
            default:
              console.log('Cannot match any error type for the error: ', error);
          }
        }
      });
  }

  private initializeFormControls(): void {
    this.inputName = new FormControl('', [
      Validators.required, Validators.maxLength(this.maxFeatureName), this.uniqueFeature.bind(this)
    ]);
  }

  private uniqueFeature(formControl: AbstractControl): ValidationErrors {
    const currentFeatureName = formControl.value;
    let isFeatureDuplicated = this.features.some((feature: Feature) => {
      return formControl.dirty && feature.name == currentFeatureName;
    });

    return isFeatureDuplicated ? { conflict: true } : null;
  }

  private isFeatureNameValid(input: FormControl): boolean {
    const feature = input.value;
    return !(!feature || feature.trim().length == 0 || input.invalid);
  }

  private closeAndResetModal(): void {
    this.latestFeatureClicked = null;
    this.featureDialog.close();
    this.inputName.reset();

    // Avoids that the label appears on top of the input field
    this.renderer.removeClass(this.inputNameLabelRef.nativeElement, 'active');
  }

  private onFeatureCreated(): void {
    this.closeAndResetModal();
  }

  private onFeatureUpdated(): void {
    this.closeAndResetModal();
  }

  private onFeatureDeleted(): void {
    this.featureDialog.close();
    this.deleteFeatureDialog.close();
  }

}
