import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { MaterialTypeService } from './material-type.service';
import { MaterialType } from '../model/material-type';
import { ServiceError } from '../model/service-error';
import { ErrorType } from '../model/error-type.enum';

@Component({
  selector: 'app-material-type',
  templateUrl: './material-type.component.html',
  styleUrls: ['./material-type.component.css']
})
export class MaterialTypeComponent implements OnInit, OnDestroy {

  inputName: FormControl;

  materials: MaterialType[];

  private readonly maxMaterialName = 50; // TODO: fetch this information from database
  private subject: Subject<void> = new Subject();

  constructor(private materialTypeService: MaterialTypeService) {}

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

}
