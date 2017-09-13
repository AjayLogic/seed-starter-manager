import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ListItem } from './list-item';

@Component({
  selector: 'app-simple-list',
  templateUrl: './simple-list.component.html',
  styleUrls: ['./simple-list.component.css']
})
export class SimpleListComponent {

  @Input() listItems: ListItem[];
  @Output() onListItemClicked: EventEmitter<ListItem> = new EventEmitter();
  @Output() onListItemBadgeClicked: EventEmitter<ListItem> = new EventEmitter();

  private onItemClicked(item: ListItem): void {
    this.onListItemClicked.emit(item);
  }

  private onItemBadgeClicked(item: ListItem): void {
    this.onListItemBadgeClicked.emit(item);
  }

}
