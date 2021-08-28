import { Component,  ViewChild, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-list-page-header',
  templateUrl: './list-page-header.component.html'
})
export class ListPageHeaderComponent {
  displayOptionsCollapsed = false;

  @Input() showSchoolYears = true;
  @Input() showOrderBy = true;
  @Input() showSearch = true;
  @Input() showItemsPerPage = true;
  @Input() showDisplayMode = true;
  @Input() displayMode = 'list';
  @Input() selectAllState = '';
  @Input() itemsPerPage = 10;
  @Input() itemOptionsPerPage = [5, 10, 20];
  @Input() itemOrder = { label: 'Product Name', value: 'title' };
  @Input()  itemOptionsOrders = [
    { label: 'Product Name', value: 'title' },
    { label: 'Category', value: 'category' },
    { label: 'Status', value: 'status' }];
  @Input() itemYear = { label: '20/21', value: '20/21' };
  @Input()  itemOptionsYears = [
    { label: '19/20', value: '19/20' },
    { label: '20/21', value: '20/21' },
    { label: '21/22', value: '21/22' }];

  @Output() changeDisplayMode: EventEmitter<string> = new EventEmitter<string>();
  @Output() addNewItem: EventEmitter<any> = new EventEmitter();
  @Output() selectAllChange: EventEmitter<any> = new EventEmitter();
  @Output() searchKeyUp: EventEmitter<any> = new EventEmitter();
  @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();
  @Output() changeOrderBy: EventEmitter<any> = new EventEmitter();

  @ViewChild('search') search: any;
  constructor() { }



  onSelectDisplayMode(mode: string): void {
    this.changeDisplayMode.emit(mode);
  }
  onAddNewItem(): void {
    this.addNewItem.emit(null);
  }
  selectAll(event): void  {
    this.selectAllChange.emit(event);
  }
  onChangeItemsPerPage(item): void  {
    this.itemsPerPageChange.emit(item);
  }

  onChangeOrderBy(item): void  {
    this.itemOrder = item;
    this.changeOrderBy.emit(item);
  }

  onSearchKeyUp($event): void {
    this.searchKeyUp.emit($event);
  }
}
