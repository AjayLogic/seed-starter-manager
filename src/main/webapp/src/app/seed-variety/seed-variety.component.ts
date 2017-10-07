import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SeedVarietyService } from './seed-variety.service';
import { SeedVariety } from '../model/seed-variety';
import { ServiceError } from '../model/service-error';
import { ErrorType } from '../model/error-type.enum';

@Component({
  selector: 'app-seed-variety',
  templateUrl: './seed-variety.component.html',
  styleUrls: ['./seed-variety.component.css']
})
export class SeedVarietyComponent implements OnInit {

  varieties: SeedVariety[];

  private subject: Subject<void> = new Subject();

  constructor(private seedVarietyService: SeedVarietyService) {}

  ngOnInit(): void {
    this.fetchAllSeedVarieties();
    this.registerForErrors();
  }

  deleteVariety(variety: SeedVariety): void {
    if (!variety.uses) {
      this.seedVarietyService.deleteSeedVariety(variety);
    }
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
