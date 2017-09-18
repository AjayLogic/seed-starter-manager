import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { FeatureService } from './feature.service';
import { Feature } from '../model/feature';
import { ServiceError } from '../model/service-error';
import { ErrorType } from '../model/error-type.enum';

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
    this.registerForErrors();
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

  private openAddFeatureModal(): void {
    this.modalActions.emit({ action: 'modal', params: ['open'] });
  }

  private closeAddFeatureModal(): void {
    this.modalActions.emit({ action: 'modal', params: ['close'] });
  }

}
