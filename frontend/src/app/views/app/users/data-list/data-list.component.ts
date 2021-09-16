import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewUserModalComponent } from 'src/app/containers/pages/add-new-user-modal/add-new-user-modal.component';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Usuario } from 'src/app/models/usuario.model';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { UsuarioService } from '../../../../data/usuario.service';
import { Curso } from '../../../../models/curso.model';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss'],
})
export class DataListComponent implements OnInit {
  displayMode = 'list';
  selectAllState = '';
  selected: Usuario[] = [];
  data: Usuario[] = [];
  currentPage = 1;
  itemsPerPage = 2;
  search = '';
  orderBy = '';
  isLoading: boolean;
  endOfTheList = false;
  totalItem = 0;
  totalPage = 0;
  // itemYear = 0;
  itemRol = '';

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewUserModalComponent;

  constructor(private hotkeysService: HotkeysService, private usuarioService: UsuarioService) {
    this.hotkeysService.add(new Hotkey('ctrl+a', (event: KeyboardEvent): boolean => {
      this.selected = [...this.data];
      return false;
    }));
    this.hotkeysService.add(new Hotkey('ctrl+d', (event: KeyboardEvent): boolean => {
      this.selected = [];
      return false;
    }));
    //console.log(this.selected);
  }


  ngOnInit(): void {
    // this.loadData(this.itemsPerPage, this.currentPage, this.search, this.orderBy);
    this.cargarUsuarios(this.itemsPerPage, this.currentPage, this.itemRol);
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

  cargarUsuarios(pageSize: number, currentPage: number, role: string): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;

    this.usuarioService.getUsers(pageSize, currentPage, role).subscribe(
      data => {
        if (data['ok']) {
          console.log(data['usuarios']);
          this.isLoading = false;
          this.data = data['usuarios'].map(x => {
            return {
              ...x,
              // img: x.img.replace('/img/', '/img/products/')
            };
          });
          // console.log(data.totalUsuarios);
          this.totalItem = data['totalUsuarios'];
          //console.log(this.totalItem);
          //this.totalPage = data.totalPage;
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

  showAddNewModal(user? : Usuario): void {
    if(user) {
      console.log(user.uid);
      this.addNewModalRef.show(user.uid);
    } else {
      this.addNewModalRef.show();
    }
  }

  isSelected(p: Usuario): boolean {
    return this.selected.findIndex(x => x.uid === p.uid) > -1;
  }
  onSelect(item: Usuario): void {
    //console.log(item);
    if (this.isSelected(item)) {
      this.selected = this.selected.filter(x => x.uid !== item.uid);
    } else {
      this.selected.push(item);
    }
    console.log(this.selected);
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

  pageChanged(event: any): void {
    //this.loadData(this.itemsPerPage, event.page, this.search, this.orderBy);
    //console.log('CAMBIO PAGINA');
    this.cargarUsuarios(this.itemsPerPage, event.page, this.itemRol);
  }

  itemsPerPageChange(perPage: number): void {
    this.cargarUsuarios(perPage, 1, this.itemRol);
  }

  // schoolYearChange(year: Curso): void {
  //   //console.log(year.uid);
  //   this.itemYear = year.uid;
  //   this.cargarUsuarios(this.itemsPerPage, 1, year.uid);
  // }

  rolChange(rol: {label, value}): void {
    console.log(rol);
    this.itemRol = rol.value;
    console.log(this.itemRol);
    this.cargarUsuarios(this.itemsPerPage, 1, this.itemRol);
  }

  dropUsers(users: Usuario[]): void {
    //console.log(users);
    for(let i=0; i<users.length; i++){
      this.usuarioService.dropUser(users[i].uid).subscribe(
        data => {
          this.cargarUsuarios(this.itemsPerPage, this.currentPage, this.itemRol);
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }

  dropUser(user: Usuario): void {
    console.log(user);
      this.usuarioService.dropUser(user.uid).subscribe(
        data => {
          this.cargarUsuarios(this.itemsPerPage, this.currentPage, this.itemRol);
        },
        error => {
          this.isLoading = false;
        }
      );

  }

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
