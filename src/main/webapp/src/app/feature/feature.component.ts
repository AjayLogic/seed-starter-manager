import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { FeatureService } from './feature.service';
import { Feature } from '../model/feature';
import { ServiceError } from '../model/service-error';
import { ErrorType } from '../model/error-type.enum';
import { SimpleDialogComponent } from '../shared/simple-dialog/simple-dialog.component';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent implements OnInit, OnDestroy {

  @ViewChild('inputNameRef') inputNameRef: ElementRef;
  @ViewChild('inputNameLabelRef') inputNameLabelRef: ElementRef;

  @ViewChild('inputEditNameRef') inputEditNameRef: ElementRef;
  @ViewChild('inputEditNameLabelRef') inputNameEditLabelRef: ElementRef;

  @ViewChild('addFeatureDialog') addFeatureDialog: SimpleDialogComponent;
  @ViewChild('editFeatureDialog') editFeatureDialog: SimpleDialogComponent;

  features: Feature[];

  inputName: FormControl;
  inputEditName: FormControl;

  private readonly maxFeatureName = 50; // TODO: fetch this information from database
  private latestFeatureClicked: Feature;
  private subject: Subject<void> = new Subject();

  constructor(private featureService: FeatureService,
              private renderer: Renderer2) {}

  ngOnInit(): void {
    this.fetchAllFeatures();
    this.registerForErrors();
    this.initializeFormControls();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  private fetchAllFeatures(): void {
    this.featureService.features
      .takeUntil(this.subject)
      .subscribe((features: Feature[]) => this.onFeaturesUpdated(features));
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

    this.inputEditName = new FormControl('', [
      Validators.required, Validators.maxLength(this.maxFeatureName), this.uniqueFeature.bind(this)
    ]);
  }

  private uniqueFeature(formControl: AbstractControl): ValidationErrors {
    const currentFeatureName = formControl.value;
    let isFeatureDuplicated = this.features.some((feature: Feature) => {
      return feature.name == currentFeatureName;
    });

    return isFeatureDuplicated ? { conflict: true } : null;
  }

  private onFeaturesUpdated(features: Feature[]): void {
    this.features = features;
  }

  addFeature(): void {
    if (this.isFeatureNameValid(this.inputName)) {
      const featureName: string = this.inputName.value;
      this.featureService.createOrUpdateFeature({ id: null, name: featureName });
      this.closeAndResetModal();
    } else {
      this.renderer.addClass(this.inputNameRef.nativeElement, 'invalid');
    }
  }

  private isFeatureNameValid(input: FormControl): boolean {
    const feature = input.value;
    return !(!feature || feature.trim().length == 0 || input.invalid);
  }

  private closeAndResetModal(): void {
    this.addFeatureDialog.close();
    this.inputName.reset();

    // Avoids that the label appears on top of the input field
    this.renderer.removeClass(this.inputNameLabelRef.nativeElement, 'active');
  }

  openEditDialog(feature: Feature): void {
    this.latestFeatureClicked = feature;

    // Avoids that the label appears behind of the input field text
    this.renderer.addClass(this.inputNameEditLabelRef.nativeElement, 'active');
    this.inputEditName.setValue(feature.name);
    this.editFeatureDialog.open();
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

  getInputFieldClass(input: FormControl): string {
    return input.valid ? 'valid' :
      input.invalid && input.touched || input.invalid && input.dirty ? 'invalid' : '';
  }

}
