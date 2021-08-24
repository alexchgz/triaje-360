import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewProductModalComponent } from 'src/app/containers/pages/add-new-product-modal/add-new-product-modal.component';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ApiService } from 'src/app/data/api.service';
import { IProduct, IUser } from 'src/app/data/api.service';
import { ContextMenuComponent } from 'ngx-contextmenu';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html'
})
export class DataListComponent implements OnInit {
  displayMode = 'list';
  selectAllState = '';
  selected: IUser[] = [];
  data: IUser[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  search = '';
  orderBy = '';
  isLoading: boolean;
  endOfTheList = false;
  totalItem = 0;
  totalPage = 0;

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewProductModalComponent;

  constructor(private hotkeysService: HotkeysService, private apiService: ApiService) {
    this.hotkeysService.add(new Hotkey('ctrl+a', (event: KeyboardEvent): boolean => {
      this.selected = [...this.data];
      return false;
    }));
    this.hotkeysService.add(new Hotkey('ctrl+d', (event: KeyboardEvent): boolean => {
      this.selected = [];
      return false;
    }));
    console.log(this.selected);
  }


  ngOnInit(): void {
    // this.loadData(this.itemsPerPage, this.currentPage, this.search, this.orderBy);
    this.cargarUsuarios();
  }

  // loadData(pageSize: number = 10, currentPage: number = 1, search: string = '', orderBy: string = ''): void {
  //   this.itemsPerPage = pageSize;
  //   this.currentPage = currentPage;
  //   this.search = search;
  //   this.orderBy = orderBy;

  //   this.apiService.getProducts(pageSize, currentPage, search, orderBy).subscribe(
  //     data => {
  //       if (data.status) {
  //         this.isLoading = false;
  //         this.data = data.data.map(x => {
  //           return {
  //             ...x,
  //             img: x.img.replace('/img/', '/img/products/')
  //           };
  //         });
  //         this.totalItem = data.totalItem;
  //         this.totalPage = data.totalPage;
  //         this.setSelectAllState();
  //       } else {
  //         this.endOfTheList = true;
  //       }
  //     },
  //     error => {
  //       this.isLoading = false;
  //     }
  //   );
  // }

  cargarUsuarios(): void {

    this.apiService.getUsers().subscribe(
      data => {
        if (data != undefined) {
          this.isLoading = false;
          this.data = data.usuarios.map(x => {
            return {
              ...x,
              // img: x.img.replace('/img/', '/img/products/')
            };
          });
          // this.totalItem = data.totalItem;
          // this.totalPage = data.totalPage;
          this.setSelectAllState();
        } else {
          this.endOfTheList = true;
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }


  changeDisplayMode(mode): void {
    this.displayMode = mode;
  }

  showAddNewModal(): void {
    this.addNewModalRef.show();
  }

  isSelected(p: IUser): boolean {
    return this.selected.findIndex(x => x.uid === p.uid) > -1;
  }
  onSelect(item: IUser): void {
    //console.log(item);
    if (this.isSelected(item)) {
      this.selected = this.selected.filter(x => x.uid !== item.uid);
    } else {
      this.selected.push(item);
    }
    this.setSelectAllState();
  }

  setSelectAllState(): void {
    if (this.selected.length === this.data.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.data];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  // pageChanged(event: any): void {
  //   this.loadData(this.itemsPerPage, event.page, this.search, this.orderBy);
  // }

  // itemsPerPageChange(perPage: number): void {
  //   this.loadData(perPage, 1, this.search, this.orderBy);
  // }

  // changeOrderBy(item: any): void {
  //   this.loadData(this.itemsPerPage, 1, this.search, item.value);
  // }

  // searchKeyUp(event): void {
  //   const val = event.target.value.toLowerCase().trim();
  //   this.loadData(this.itemsPerPage, 1, val, this.orderBy);
  // }

  // onContextMenuClick(action: string, item: IProduct): void {
  //   console.log('onContextMenuClick -> action :  ', action, ', item.title :', item.title);
  // }
}