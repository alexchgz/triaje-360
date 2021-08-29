import { Component,  ViewChild, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { ApiService, IUser } from 'src/app/data/api.service';
import { ISchoolYear } from 'src/app/data/api.service';
import { ISchoolYearResponse } from '../../../data/api.service';


@Component({
  selector: 'app-list-page-header',
  templateUrl: './list-page-header.component.html'
})
export class ListPageHeaderComponent implements OnInit {
  displayOptionsCollapsed = false;
  data: ISchoolYear[] = [];
  isLoading: boolean;
  endOfTheList = false;
  itemOptionsYears: ISchoolYear[];

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
  @Input() itemYear = { nombrecorto: 'All', value: '' };
  @Input() selected: IUser[];

  @Output() changeDisplayMode: EventEmitter<string> = new EventEmitter<string>();
  @Output() addNewItem: EventEmitter<any> = new EventEmitter();
  @Output() selectAllChange: EventEmitter<any> = new EventEmitter();
  @Output() searchKeyUp: EventEmitter<any> = new EventEmitter();
  @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();
  @Output() schoolYearChange: EventEmitter<any> = new EventEmitter();
  @Output() changeOrderBy: EventEmitter<any> = new EventEmitter();
  @Output() dropUsers: EventEmitter<any> = new EventEmitter();

  @ViewChild('search') search: any;
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadSchoolYears();
  }

  loadSchoolYears(): void {

    this.apiService.getSchoolYears().subscribe(
      data => {
        if (data.ok) {
          //console.log(data.usuarios);
          this.isLoading = false;
          this.data = data.cursos.map(x => {
            return {
              ...x,
              // img: x.img.replace('/img/', '/img/products/')
            };
          });
          this.itemOptionsYears = data.cursos;
          this.itemOptionsYears.unshift({ nombrecorto: 'All', uid: 0, nombre: 'All', activo: false});
          //console.log(this.itemOptionsYears);
        } else {
          this.endOfTheList = true;
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }

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

  onChangeSchoolYear(item): void {
    this.itemYear = item;
    //console.log(this.itemYear);
    this.schoolYearChange.emit(item);
  }

  onChangeOrderBy(item): void  {
    this.itemOrder = item;
    this.changeOrderBy.emit(item);
  }

  onSearchKeyUp($event): void {
    this.searchKeyUp.emit($event);
  }

  onDropUsers(users: IUser[]): void {
    //console.log(users);
    this.dropUsers.emit(users);
  }
}
