import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SeedStarterService } from './seed-starter.service';

import { SimpleDialogComponent } from '../shared/ui/simple-dialog/simple-dialog.component';

import { SeedStarter } from '../model/seed-starter';
import { Feature } from '../model/feature';
import { ServiceError } from '../model/service-error';
import { ErrorType } from '../model/error-type.enum';
import { ServiceEvent } from '../model/service-event.enum';
import { ThemeManagerService } from '../core/theme-manager/theme-manager.service';
import { ToastService } from '../shared/ui/toast-service/toast.service';

@Component({
  selector: 'app-seed-starter',
  templateUrl: './seed-starter.component.html',
  styleUrls: ['./seed-starter.component.css']
})
export class SeedStarterComponent implements OnInit, OnDestroy {

  @ViewChild('deleteDialog') deleteDialog: SimpleDialogComponent;

  seedStarters: SeedStarter[];
  isDeletingSeedStarter: boolean = false;

  private subject: Subject<void> = new Subject();
  private latestClickedSeedStarter: SeedStarter;

  constructor(private seedStarterService: SeedStarterService,
              private themeManager: ThemeManagerService,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.fetchAllSeedStarters();
    this.registerForServiceEvents();
    this.registerForErrors();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  deleteSeedStarter(): void {
    if (this.latestClickedSeedStarter) {
      this.isDeletingSeedStarter = true;
      this.seedStarterService.delete(this.latestClickedSeedStarter);
    }
  }

  openDeleteConfirmDialog(seedStarter: SeedStarter): void {
    this.latestClickedSeedStarter = seedStarter;
    this.deleteDialog.open();
  }

  getSeedStarterFeatures(seedStarter: SeedStarter): string {
    if (seedStarter && seedStarter.features && seedStarter.features.length > 0) {
      return seedStarter.features
        .map((feature: Feature) => feature.name)
        .join(', ');
    }

    return 'No Features';
  }

  get hasSeedStarters(): boolean {
    return this.seedStarters && this.seedStarters.length > 0;
  }

  get imagePath(): string {
    const currentThemeName: string = this.themeManager.currentTheme.name.toLowerCase();

    // Returns the path to image with white foreground if the current theme is the 'Dark' theme,
    // otherwise returns the path to image with black foreground.
    return currentThemeName === 'dark' ?
      '../../assets/images/floral-light.svg' : '../../assets/images/floral-dark.svg';
  }

  private fetchAllSeedStarters(): void {
    this.seedStarterService.seedStarters
      .takeUntil(this.subject)
      .subscribe((seedStarters: SeedStarter[]) => this.seedStarters = seedStarters);
  }

  private registerForServiceEvents(): void {
    this.seedStarterService.events
      .takeUntil(this.subject)
      .subscribe((event: ServiceEvent) => {
        switch (event) {
          case ServiceEvent.ENTITY_DELETED:
            this.onSeedStarterDeleted();
            break;
        }
      });
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

  private onSeedStarterDeleted(): void {
    if (this.isDeletingSeedStarter) {
      // Closes the dialog
      this.deleteDialog.close();

      // Displays a message indicating success
      this.toastService.showMessage('Deleted Successfully!');

      // Resets the isDeletingSeedStarter status to false, to stops the loading animation
      this.isDeletingSeedStarter = false;
    }
  }

}
