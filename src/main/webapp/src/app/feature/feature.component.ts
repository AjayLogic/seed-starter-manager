import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private service: FeatureService) {}

  ngOnInit(): void {
    this.fetchAllFeatures();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  private fetchAllFeatures(): void {
    this.service.getAllFeatures()
      .takeUntil(this.subject)
      .subscribe((features: Feature[]) => this.features = features);
  }

}
