import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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

  @ViewChild('addFeatureDialog') addFeatureDialog: SimpleDialogComponent;

  features: Feature[];
  readonly maxFeatureName = 50; // TODO: fetch this information from database

  private inputName: FormControl;
  private subject: Subject<void> = new Subject();

  constructor(private featureService: FeatureService,
              private renderer: Renderer2) {}

  ngOnInit(): void {
    this.fetchAllFeatures();
    this.registerForErrors();
    this.initializeAddFeatureForm();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  private fetchAllFeatures(): void {
    this.featureService.features
      .takeUntil(this.subject)
      .subscribe((features: Feature[]) => this.features = features);
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

  private initializeAddFeatureForm(): void {
    this.inputName = new FormControl('', [
      Validators.required, Validators.maxLength(this.maxFeatureName)
    ]);
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

  get hasFeatures(): boolean {
    return Array.isArray(this.features) && this.features.length > 0;
  }

  getInputFieldClass(input: FormControl): string {
    return input.valid ? 'valid' :
      input.invalid && input.touched || input.invalid && input.dirty ? 'invalid' : '';
  }

}
