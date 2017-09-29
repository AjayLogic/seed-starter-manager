import { Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html'
})
export class SimpleDialogComponent {

  @ViewChild('modal') modal: ElementRef;
  private modalAction: EventEmitter<MaterializeAction> = new EventEmitter();

  public open(): void {
    this.emitModalAction('open');
  }

  public close(): void {
    this.emitModalAction('close');
  }

  public isOpen(): boolean {
    return this.modal.nativeElement.classList.contains('open');
  }

  private emitModalAction(action: string): void {
    this.modalAction.emit({ action: 'modal', params: [action] });
  }

}