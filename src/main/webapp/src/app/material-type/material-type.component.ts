import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { MaterialTypeService } from './material-type.service';
import { MaterialType } from '../model/material-type';
import { ServiceError } from '../model/service-error';
import { ErrorType } from '../model/error-type.enum';
import { SimpleDialogComponent } from '../shared/simple-dialog/simple-dialog.component';

@Component({
  selector: 'app-material-type',
  templateUrl: './material-type.component.html',
  styleUrls: ['./material-type.component.css']
})
export class MaterialTypeComponent implements OnInit, OnDestroy {

  @ViewChild('inputNameRef') inputNameRef: ElementRef;
  @ViewChild('inputNameLabelRef') inputNameLabelRef: ElementRef;

  @ViewChild('addMaterialDialog') addFeatureDialog: SimpleDialogComponent;

  inputName: FormControl;

  materials: MaterialType[];

  private readonly maxMaterialName = 50; // TODO: fetch this information from database
  private subject: Subject<void> = new Subject();

  constructor(private materialTypeService: MaterialTypeService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.fetchAllMaterialTypes();
    this.registerForErrors();
    this.initializeFormControls();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  get hasMaterials(): boolean {
    return Array.isArray(this.materials) && this.materials.length > 0;
  }

  get errorMessages(): any {
    return {
      required: 'The material must have a name',
      maxlength: 'The material name must have less than ' + this.maxMaterialName + ' characters',
      conflict: 'This material already exists'
    };
  }

  getInputFieldClass(input: FormControl): string {
    return input.valid ? 'valid' :
      input.invalid && input.touched || input.invalid && input.dirty ? 'invalid' : '';
  }

  addMaterial(): void {
    if (this.isMaterialNameValid(this.inputName)) {
      const materialName: string = this.inputName.value;
      this.materialTypeService.createOrUpdateMaterial({ id: null, name: materialName });
      this.closeAndResetAddMaterialTypeModal();
    } else {
      this.renderer.addClass(this.inputNameRef.nativeElement, 'invalid');
    }
  }

  private fetchAllMaterialTypes(): void {
    this.materialTypeService.materials
      .takeUntil(this.subject)
      .subscribe((materials: MaterialType[]) => this.materials = materials);
  }

  private registerForErrors(): void {
    this.materialTypeService.errors
      .takeUntil(this.subject)
      .subscribe((error: ServiceError) => {
        if (error) {
          switch (error.type) {
            case ErrorType.EMPTY:
              // TODO: Show the proper image on the template and pulse the add material button
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
      Validators.required, Validators.maxLength(this.maxMaterialName), this.uniqueMaterialType.bind(this)
    ]);
  }

  private uniqueMaterialType(formControl: AbstractControl): ValidationErrors {
    const currentMaterialName = formControl.value;
    let isMaterialDuplicated = this.materials.some((material: MaterialType) => {
      return formControl.dirty && material.name == currentMaterialName;
    });

    return isMaterialDuplicated ? { conflict: true } : null;
  }

  private isMaterialNameValid(input: FormControl): boolean {
    const material = input.value;
    return !(!material || material.trim().length == 0 || input.invalid);
  }

  private closeAndResetAddMaterialTypeModal(): void {
    this.addFeatureDialog.close();
    this.inputName.reset();

    // Avoids that the label appears on top of the input field
    this.renderer.removeClass(this.inputNameLabelRef.nativeElement, 'active');
  }

}
