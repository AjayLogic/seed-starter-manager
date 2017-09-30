import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { MaterialTypeService } from './material-type.service';
import { MaterialType } from '../model/material-type';

@Component({
  selector: 'app-material-type',
  templateUrl: './material-type.component.html',
  styleUrls: ['./material-type.component.css']
})
export class MaterialTypeComponent implements OnInit, OnDestroy {

  materials: MaterialType[];

  private subject: Subject<void> = new Subject();

  constructor(private materialTypeService: MaterialTypeService) {}

  ngOnInit(): void {
    this.fetchAllMaterialTypes();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  get hasMaterials(): boolean {
    return Array.isArray(this.materials) && this.materials.length > 0;
  }

  private fetchAllMaterialTypes(): void {
    this.materialTypeService.materials
      .takeUntil(this.subject)
      .subscribe((materials: MaterialType[]) => this.materials = materials);
  }

}
