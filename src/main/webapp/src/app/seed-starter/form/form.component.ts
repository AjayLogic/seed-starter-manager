import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { FeatureService } from '../../feature/feature.service';
import { MaterialTypeService } from '../../material-type/material-type.service';
import { SeedVarietyService } from '../../seed-variety/seed-variety.service';

import { Feature } from '../../model/feature';
import { MaterialType } from '../../model/material-type';
import { SeedVariety } from '../../model/seed-variety';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {

  seedStarterForm: FormGroup;

  datePlantedFormControl: FormControl;
  materialTypeFormControl: FormControl;
  coveredFormControl: FormControl;

  featuresFormArray: FormArray;
  rowsFormArray: FormArray[] = [];

  materials: MaterialType[];
  features: Feature[];
  seedVarieties: SeedVariety[];

  // TODO: Fetch the min/max values from the server
  private readonly minSeedsPerCell = 1;
  private readonly maxSeedsPerCell = 10;

  private subject: Subject<void> = new Subject();

  constructor(private featureService: FeatureService,
              private materialTypeService: MaterialTypeService,
              private seedVarietyService: SeedVarietyService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initializeFormControls();
    this.fetchAllMaterialTypes();
    this.fetchAllFeatures();
    this.fetchAllSeedVarieties();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  addRow(): void {
    const seedVarietyControl = new FormControl(this.seedVarieties[0].name, Validators.required);
    const seedsPerCellControl = new FormControl(this.minSeedsPerCell,
      [Validators.min(this.minSeedsPerCell), Validators.max(this.maxSeedsPerCell)]);
    let controls = [seedVarietyControl, seedsPerCellControl];

    this.rowsFormArray.push(this.formBuilder.array(controls));
  }

  removeRow(index: number): void {
    if (index >= 0 && index < this.rowsFormArray.length) {
      this.rowsFormArray.splice(index, 1);
    }
  }

  get errorMessages(): any {
    return {
      required: 'This field is required!',
      min: `This cell must have at least ${this.minSeedsPerCell} seed`,
      max: `This cell can't have more than ${this.maxSeedsPerCell} seeds`
    };
  }

  private fetchAllMaterialTypes(): void {
    this.materialTypeService.materials
      .takeUntil(this.subject)
      .subscribe((materials: MaterialType[]) => {
        this.materials = materials;

        if (this.materials.length > 0) {
          // Sets the initial value of the materialTypeFormControl
          this.materialTypeFormControl.setValue(this.materials[0]);
        }
      });
  }

  private fetchAllFeatures(): void {
    this.featureService.features
      .takeUntil(this.subject)
      .subscribe((features: Feature[]) => {
        this.features = features;

        if (this.features.length > 0) {
          // Creates a FormControl for each retrieved Feature
          this.seedStarterForm.addControl('features', this.mapFeaturesToFormArray(features));
          this.featuresFormArray = this.seedStarterForm.get('features') as FormArray;
        }
      });
  }

  private fetchAllSeedVarieties(): void {
    this.seedVarietyService.varieties
      .takeUntil(this.subject)
      .subscribe((varieties: SeedVariety[]) => this.seedVarieties = varieties);
  }

  private initializeFormControls(): void {
    this.seedStarterForm = this.formBuilder.group({
      datePlanted: ['', Validators.required],
      materialType: ['', Validators.required],
      covered: false
    });

    this.datePlantedFormControl = this.seedStarterForm.get('datePlanted') as FormControl;
    this.materialTypeFormControl = this.seedStarterForm.get('materialType') as FormControl;
    this.coveredFormControl = this.seedStarterForm.get('covered') as FormControl;
  }

  /**
   * Creates a {@link FormControl} instance for each {@link Feature}.
   * @return a {@link FormArray} containing all FormControl's.
   */
  private mapFeaturesToFormArray(features: Feature[]): FormArray {
    if (features) {
      const controls = features.map(() => {
        return this.formBuilder.control(false);
      });

      return this.formBuilder.array(controls);
    }

    return this.formBuilder.array([]);
  }

}
