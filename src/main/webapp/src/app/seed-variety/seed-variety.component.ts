import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SeedVarietyService } from './seed-variety.service';
import { SeedVariety } from '../model/seed-variety';
import { ServiceError } from '../model/service-error';
import { ErrorType } from '../model/error-type.enum';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-seed-variety',
  templateUrl: './seed-variety.component.html',
  styleUrls: ['./seed-variety.component.css']
})
export class SeedVarietyComponent implements OnInit, OnDestroy {

  @ViewChild('seedVarietyImage') seedVarietyImage: ElementRef;

  inputName: FormControl;

  varieties: SeedVariety[];

  private readonly maxSeedVarietyName = 50; // TODO: fetch this information from database
  private latestSelectedSeedVarietyImage: File;
  private imagePlaceholder: string;
  private subject: Subject<void> = new Subject();

  constructor(private seedVarietyService: SeedVarietyService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.fetchAllSeedVarieties();
    this.registerForErrors();
    this.initializeFormControls();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
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

  getInputFieldClass(input: FormControl): string {
    return input.valid ? 'valid' :
      input.invalid && input.touched || input.invalid && input.dirty ? 'invalid' : '';
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

  private fetchAllSeedVarieties(): void {
    this.seedVarietyService.varieties
      .takeUntil(this.subject)
      .subscribe((varieties: SeedVariety[]) => this.varieties = varieties);
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

}
