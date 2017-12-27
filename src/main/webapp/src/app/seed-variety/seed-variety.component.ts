import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { SeedVarietyService } from './seed-variety.service';

import { SimpleDialogComponent } from '../shared/ui/simple-dialog/simple-dialog.component';

import { SeedVariety } from '../model/seed-variety';
import { ServiceEvent } from '../model/service-event.enum';
import { ServiceError } from '../model/service-error';
import { ErrorType } from '../model/error-type.enum';
import { ToastService } from '../shared/ui/toast-service/toast.service';

@Component({
  selector: 'app-seed-variety',
  templateUrl: './seed-variety.component.html',
  styleUrls: ['./seed-variety.component.css']
})
export class SeedVarietyComponent implements OnInit, OnDestroy {

  @ViewChild('seedVarietyImage') seedVarietyImage: ElementRef;

  @ViewChild('inputNameRef') inputNameRef: ElementRef;
  @ViewChild('inputNameLabelRef') inputNameLabelRef: ElementRef;

  @ViewChild('addSeedVarietyDialog') addSeedVarietyDialog: SimpleDialogComponent;
  @ViewChild('deletionDialog') deletionDialog: SimpleDialogComponent;

  inputName: FormControl;
  varieties: SeedVariety[];
  latestSeedVarietyClicked: SeedVariety;

  private readonly maxSeedVarietyName = 50; // TODO: fetch this information from database
  private latestSelectedSeedVarietyImage: File;
  private imagePlaceholder: string;
  private subject: Subject<void> = new Subject();

  constructor(private seedVarietyService: SeedVarietyService,
              private toastService: ToastService,
              private renderer: Renderer2) {}

  ngOnInit(): void {
    this.fetchAllSeedVarieties();
    this.registerForServiceEvents();
    this.registerForErrors();
    this.initializeFormControls();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  saveSeedVariety(): void {
    if (this.isVarietyNameValid(this.inputName)) {
      const seedVarietyName = this.inputName.value;
      this.seedVarietyService.createOrUpdateVariety({
        id: this.latestSeedVarietyClicked ? this.latestSeedVarietyClicked.id : null,
        name: seedVarietyName,
        imageName: this.latestSelectedSeedVarietyImage
      });
    } else {
      this.renderer.addClass(this.inputNameRef.nativeElement, 'invalid');
    }
  }

  showEditDialog(variety: SeedVariety): void {
    this.latestSeedVarietyClicked = variety;
    this.inputName.setValue(variety.name);
    this.renderer.addClass(this.inputNameLabelRef.nativeElement, 'active');
    this.addSeedVarietyDialog.open();
  }

  showDeletionDialog(variety: SeedVariety): void {
    this.latestSeedVarietyClicked = variety;
    this.deletionDialog.open();
  }

  deleteVariety(variety: SeedVariety): void {
    if (!variety.uses) {
      this.seedVarietyService.deleteSeedVariety(variety);
    }
  }

  onSeedVarietyImageSelected(changeEvent: any) {
    const fileList: FileList = changeEvent.target.files;
    if (fileList.length > 0) {
      let fileReader: FileReader = new FileReader();
      fileReader.onload = () => {
        this.renderer.setAttribute(this.seedVarietyImage.nativeElement, 'src', fileReader.result);
      };

      const selectedImageFile = fileList.item(0);
      this.latestSelectedSeedVarietyImage = selectedImageFile;
      fileReader.readAsDataURL(selectedImageFile);
    }
  }

  removeLastSelectedImage(): void {
    this.latestSelectedSeedVarietyImage = null;
    this.renderer.setAttribute(this.seedVarietyImage.nativeElement, 'src', this.imagePlaceholder);
  }

  onAddSeedVarietyCancelled(): void {
    // Wait until the dialog close, and then removes the previously chosen image
    setTimeout(() => {
      this.removeLastSelectedImage();
    }, 350);
  }

  get errorMessages(): any {
    return {
      required: 'The seed variety must have a name',
      maxlength: 'The variety name must have less than ' + this.maxSeedVarietyName + ' characters',
      conflict: 'This seed variety already exists'
    };
  }

  private initializeFormControls(): void {
    this.imagePlaceholder = this.seedVarietyImage.nativeElement.src;

    this.inputName = new FormControl('', [
      Validators.required, Validators.maxLength(this.maxSeedVarietyName), this.uniqueSeedVariety.bind(this)
    ]);
  }

  private uniqueSeedVariety(formControl: AbstractControl): ValidationErrors {
    const currentVarietyName = formControl.value;
    let isVarietyDuplicated = this.varieties.some((seedVariety: SeedVariety) => {
      return formControl.dirty && seedVariety.name == currentVarietyName;
    });

    return isVarietyDuplicated ? { conflict: true } : null;
  }

  private isVarietyNameValid(input: FormControl): boolean {
    const variety = input.value;
    return !(!variety || variety.trim().length == 0 || input.invalid);
  }

  private closeAndResetAddSeedVarietyModal(): void {
    this.latestSeedVarietyClicked = null;
    this.addSeedVarietyDialog.close();

    // Resets the seed variety name input field
    this.inputName.reset();

    // Remove the previously chosen image
    this.removeLastSelectedImage();

    // Avoids that the label appears on top of the input field
    this.renderer.removeClass(this.inputNameLabelRef.nativeElement, 'active');
  }

  private fetchAllSeedVarieties(): void {
    this.seedVarietyService.varieties
      .takeUntil(this.subject)
      .subscribe((varieties: SeedVariety[]) => this.varieties = varieties);
  }

  private registerForServiceEvents(): void {
    this.seedVarietyService.events
      .takeUntil(this.subject)
      .subscribe((event: ServiceEvent) => {
        switch (event) {
          case ServiceEvent.ENTITY_CREATED:
            this.onSeedVarietyCreated();
            break;
          case ServiceEvent.ENTITY_UPDATED:
            this.onSeedVarietyUpdated();
            break;
          case ServiceEvent.ENTITY_DELETED:
            this.onSeedVarietyDeleted();
            break;
        }
      });
  }

  private registerForErrors(): void {
    this.seedVarietyService.errors
      .takeUntil(this.subject)
      .subscribe((error: ServiceError) => {
        if (error) {
          switch (error.type) {
            case ErrorType.GATEWAY_TIMEOUT:
              // TODO: Show the proper error dialog
              break;
            default:
              console.log('Cannot match any error type for the error: ', error);
          }
        }
      });
  }

  private onSeedVarietyCreated(): void {
    this.closeAndResetAddSeedVarietyModal();
    this.toastService.showMessage('Variety Added Successfully!');
  }

  private onSeedVarietyUpdated(): void {
    this.closeAndResetAddSeedVarietyModal();
    this.toastService.showMessage('Updated Successfully!');
  }

  private onSeedVarietyDeleted(): void {
    this.latestSeedVarietyClicked = null;
    this.deletionDialog.close();
    this.toastService.showMessage('Variety Deleted Successfully!');
  }

}
