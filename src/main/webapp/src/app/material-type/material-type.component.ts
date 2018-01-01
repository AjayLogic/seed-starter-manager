import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { MaterialTypeService } from './material-type.service';

import { SimpleDialogComponent } from '../shared/ui/simple-dialog/simple-dialog.component';

import { MaterialType } from '../model/material-type';
import { ServiceError } from '../model/service-error';
import { ErrorType } from '../model/error-type.enum';

@Component({
  selector: 'app-material-type',
  templateUrl: './material-type.component.html',
  styleUrls: ['./material-type.component.css']
})
export class MaterialTypeComponent implements OnInit, OnDestroy {

  @ViewChild('inputNameRef') inputNameRef: ElementRef;
  @ViewChild('inputNameLabelRef') inputNameLabelRef: ElementRef;

  @ViewChild('materialDialog') materialDialog: SimpleDialogComponent;
  @ViewChild('deleteMaterialDialog') deleteMaterialDialog: SimpleDialogComponent;

  inputName: FormControl;

  materials: MaterialType[];
  latestMaterialTypeClicked: MaterialType;

  isEditing: boolean = false;

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
    return this.materials && this.materials.length > 0;
  }

  get errorMessages(): any {
    return {
      required: 'The material must have a name',
      maxlength: 'The material name must have less than ' + this.maxMaterialName + ' characters',
      conflict: 'This material already exists'
    };
  }

  addMaterial(): void {
    if (this.isMaterialNameValid(this.inputName)) {
      this.materialTypeService.save({
        id: this.latestMaterialTypeClicked ? this.latestMaterialTypeClicked.id : null,
        name: this.inputName.value
      });
      this.closeAndResetMaterialModal();
    } else {
      this.renderer.addClass(this.inputNameRef.nativeElement, 'invalid');
    }
  }

  deleteMaterial(): void {
    if (!this.latestMaterialTypeClicked.uses) {
      this.materialTypeService.delete(this.latestMaterialTypeClicked);
      this.closeAndResetMaterialModal();
      this.deleteMaterialDialog.close();
    }
  }

  openEditDialog(materialType: MaterialType): void {
    this.isEditing = true;
    this.latestMaterialTypeClicked = materialType;

    // Avoids that the label appears behind of the input field text
    this.renderer.addClass(this.inputNameLabelRef.nativeElement, 'active');
    this.inputName.reset();
    this.inputName.setValue(materialType.name);
    this.materialDialog.open();
  }

  openAddDialog(): void {
    this.isEditing = false;
    this.inputName.reset();
    this.materialDialog.open();
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

  private closeAndResetMaterialModal(): void {
    this.materialDialog.close();
    this.inputName.reset();
    this.latestMaterialTypeClicked = null;

    // Avoids that the label appears on top of the input field
    this.renderer.removeClass(this.inputNameLabelRef.nativeElement, 'active');
  }

}
