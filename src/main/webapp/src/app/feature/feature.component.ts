import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { FeatureService } from './feature.service';
import { Feature } from '../model/feature';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent implements OnInit, OnDestroy {

  private features: Feature[];
  private subject: Subject<void> = new Subject();
  private modalActions: EventEmitter<MaterializeAction> = new EventEmitter();
  private readonly maxFeatureName = 50; // TODO: fetch this information from database

  constructor(private featureService: FeatureService) {}

  ngOnInit(): void {
    this.fetchAllFeatures();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  private fetchAllFeatures(): void {
    this.featureService.getAllFeatures()
      .takeUntil(this.subject)
      .subscribe((features: Feature[]) => this.features = features);
  }

  private openAddFeatureModal() {
    this.modalActions.emit({ action: 'modal', params: ['open'] });
  }

}
