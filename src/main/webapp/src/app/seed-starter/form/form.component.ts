import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { toast } from 'angular2-materialize';

import { FeatureService } from '../../feature/feature.service';
import { MaterialTypeService } from '../../material-type/material-type.service';
import { SeedVarietyService } from '../../seed-variety/seed-variety.service';
import { SeedStarterService } from '../seed-starter.service';

import { Feature } from '../../model/feature';
import { MaterialType } from '../../model/material-type';
import { SeedVariety } from '../../model/seed-variety';
import { SeedStarter } from '../../model/seed-starter';
import { Row } from '../../model/row';
import { ServiceEvent } from '../../model/service-event.enum';

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
              private seedStarterService: SeedStarterService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initializeFormControls();
    this.registerForServiceEvents();
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

    // Creates a new FormArray containing the above created controls
    let newRow: FormArray = this.formBuilder.array([seedVarietyControl, seedsPerCellControl]);

    // Creates a unique name for the newRow, by converting the Math.random() return value
    // to the base 36 (numbers + letters), and then extracts the first 10 characters after
    // the decimal separator.
    const controlName = 'row-' + Math.random().toString(36).substr(2, 10);

    // Adds a new property called 'controlName' to the newRow, to be used into the removeRow
    // method to remove the correspondent control from the seedStarterForm.
    newRow['controlName'] = controlName;

    // Add the newRow to the rowsFormArray so that it be rendered by the view
    this.rowsFormArray.push(newRow);

    // Add the newRow to the seedStarterForm so that it is validated before save the seed starter
    this.seedStarterForm.addControl(controlName, newRow);
  }

  removeRow(index: number, controlName: string): void {
    if (index >= 0 && index < this.rowsFormArray.length) {
      this.rowsFormArray.splice(index, 1);
      this.seedStarterForm.removeControl(controlName);
    }
  }

  saveSeedStarter(): void {
    if (this.seedStarterForm.valid) {
      const newSeedStarter: SeedStarter = {
        id: null,
        datePlanted: this.getSelectedDatePlanted(),
        materialType: this.getSelectedMaterialType(),
        covered: this.coveredFormControl.value,
        features: this.getSelectedFeatures(),
        rows: this.getAddedRows()
      };

      this.seedStarterService.createOrUpdateSeedStarter(newSeedStarter);
    } else {
      // TODO: show all required fields not filled
      toast('Please fill all required fields', 2000, 'toast-error');
    }
  }

  get errorMessages(): any {
    return {
      required: 'This field is required!',
      min: `This cell must have at least ${this.minSeedsPerCell} seed`,
      max: `This cell can't have more than ${this.maxSeedsPerCell} seeds`
    };
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

  private registerForServiceEvents(): void {
    this.seedStarterService.events
      .takeUntil(this.subject)
      .subscribe((event: ServiceEvent) => {
        switch (event) {
          case ServiceEvent.ENTITY_CREATED:
            this.onSeedStarterCreated();
            break;
        }
      });
  }

  private fetchAllMaterialTypes(): void {
    this.materialTypeService.materials
      .takeUntil(this.subject)
      .subscribe((materials: MaterialType[]) => {
        if (materials.length > 0) {
          this.materials = materials;

          // Sets the initial value of the materialTypeFormControl
          this.materialTypeFormControl.setValue(this.materials[0].name);
        }
      });
  }

  private fetchAllFeatures(): void {
    this.featureService.features
      .takeUntil(this.subject)
      .subscribe((features: Feature[]) => {
        if (features.length > 0) {
          this.features = features;

          // Creates a FormControl for each retrieved Feature
          this.seedStarterForm.addControl('features', this.mapFeaturesToFormArray(features));
          this.featuresFormArray = this.seedStarterForm.get('features') as FormArray;
        }
      });
  }

  private fetchAllSeedVarieties(): void {
    this.seedVarietyService.varieties
      .takeUntil(this.subject)
      .subscribe((varieties: SeedVariety[]) => {
        if (varieties.length > 0) {
          this.seedVarieties = varieties;
        }
      });
  }

  private onSeedStarterCreated(): void {
    this.seedStarterForm.reset();
    toast('Seed Starter Created!', 3000, 'toast-message');
    window.scrollTo(0, 0);
    // TODO: remove the 'valid' class from the controls
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

  private getSelectedDatePlanted(): string {
    // Returns a date in the format YYYY-MM-dd without the time information
    return new Date(this.datePlantedFormControl.value)
      .toISOString()
      .substr(0, 10);
  }

  private getSelectedMaterialType(): MaterialType {
    return this.materials.find((material: MaterialType) => {
      return material.name === this.materialTypeFormControl.value;
    });
  }

  private getSelectedFeatures(): Feature[] {
    let selectedFeatures: Feature[] = [];
    this.featuresFormArray.controls.forEach((control: AbstractControl, index: number) => {
      // Checks if the feature checkbox is checked, and adds the correspondent feature to the array
      if (control.value === true) {
        selectedFeatures.push(this.features[index]);
      }
    });

    return selectedFeatures;
  }

  private getAddedRows(): Row[] {
    return this.rowsFormArray.map((formArray: FormArray) => {
      const selectedSeedVariety: SeedVariety = this.seedVarieties.find((variety: SeedVariety) => {
        return variety.name === formArray.at(0).value;
      });

      return {
        id: null,
        seedVariety: selectedSeedVariety,
        seedsPerCell: formArray.at(1).value
      };
    });
  }

}
