import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SeedStarterService } from './seed-starter.service';
import { SeedStarter } from '../model/seed-starter';
import { Feature } from '../model/feature';
import { ServiceError } from '../model/service-error';
import { ErrorType } from '../model/error-type.enum';

@Component({
  selector: 'app-seed-starter',
  templateUrl: './seed-starter.component.html',
  styleUrls: ['./seed-starter.component.css']
})
export class SeedStarterComponent implements OnInit {

  seedStarters: SeedStarter[];

  private subject: Subject<void> = new Subject();

  constructor(private seedStarterService: SeedStarterService) { }

  ngOnInit(): void {
    this.fetchAllSeedStarters();
    this.registerForErrors();
  }

  getSeedStarterFeatures(seedStarter: SeedStarter): string {
    if (seedStarter && seedStarter.features && seedStarter.features.length > 0) {
      return seedStarter.features
        .map((feature: Feature) => {return feature.name;})
        .join(', ');
    }

    return 'No Features';
  }

  get hasSeedStarters(): boolean {
    return this.seedStarters && this.seedStarters.length > 0;
  }

  private fetchAllSeedStarters(): void {
    this.seedStarterService.seedStarters
      .takeUntil(this.subject)
      .subscribe((seedStarters: SeedStarter[]) => this.seedStarters = seedStarters);
  }

  private registerForErrors(): void {
    this.seedStarterService.errors
      .takeUntil(this.subject)
      .subscribe((error: ServiceError) => {
        if (error) {
          switch (error.type) {
            case ErrorType.EMPTY:
              // TODO: Show the proper image on the template
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

}
