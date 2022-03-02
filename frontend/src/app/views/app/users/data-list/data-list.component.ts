import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewUserModalComponent } from 'src/app/containers/pages/add-new-user-modal/add-new-user-modal.component';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Usuario } from 'src/app/models/usuario.model';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { UsuarioService } from '../../../../data/usuario.service';
import { Curso } from '../../../../models/curso.model';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { SenderService } from '../../../../data/sender.service';
import Swal from 'sweetalert2';

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
  itemsPerPage = 10;
  search = '';
  orderBy = '';
  isLoading: boolean;
  endOfTheList = false;
  totalItem = 0;
  totalPage = 0;
  // itemYear = 0;
  itemRol = '';

  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewUserModalComponent;

  constructor(private hotkeysService: HotkeysService, private usuarioService: UsuarioService, private notifications: NotificationsService, public sender: SenderService) {
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
    this.sender.idSubject = undefined;
    this.sender.idSubjectExercise = undefined;
    this.sender.idExercise = undefined;
    // this.loadData(this.itemsPerPage, this.currentPage, this.search, this.orderBy);
    this.cargarUsuarios(this.itemsPerPage, this.currentPage, this.itemRol, this.search);
  }

  cargarUsuarios(pageSize: number, currentPage: number, role: string, search: string): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;

    this.usuarioService.getUsers(pageSize, currentPage, role, search).subscribe(
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
    this.cargarUsuarios(this.itemsPerPage, event.page, this.itemRol, this.search);
  }

  itemsPerPageChange(perPage: number): void {
    this.cargarUsuarios(perPage, 1, this.itemRol, this.search);
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
    this.cargarUsuarios(this.itemsPerPage, 1, this.itemRol, this.search);
  }

  dropUsers(users: Usuario[]): void {
    //console.log(users);
    for(let i=0; i<users.length; i++){
      this.usuarioService.dropUser(users[i].uid).subscribe(
        data => {
          this.cargarUsuarios(this.itemsPerPage, this.currentPage, this.itemRol, this.search);

          this.notifications.create('Usuarios eliminados', 'Se han eliminado los Usuarios correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        },
        error => {
          this.isLoading = false;

          this.notifications.create('Error', 'No se han podido eliminar los Usuarios', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        }
      );
    }
  }

  dropUser(user: Usuario): void {
    console.log(user);
      this.usuarioService.dropUser(user.uid).subscribe(
        data => {
          this.cargarUsuarios(this.itemsPerPage, this.currentPage, this.itemRol, this.search);

          this.notifications.create('Usuario eliminado', 'Se ha eliminado el Usuario correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });


        },
        error => {

          this.notifications.create('Error', 'No se ha podido eliminar el Usuario', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          this.isLoading = false;
        }
      );

  }

  confirmDelete(usuario: Usuario): void {
    // this.dropExercise(ejercicio);
    console.log('Entro en la funcion');
    Swal.fire({
      title: 'Eliminar Usuario',
      text: '¿Estás seguro de que quieres eliminar el Usuario?',
      icon: 'warning',
      showDenyButton: true,
      iconColor: '#145388',
      confirmButtonColor: '#145388',
      denyButtonColor: '#145388',
      confirmButtonText: `Sí`,
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.dropUser(usuario);
      } else if (result.isDenied) {
        Swal.close();
      }
    });
  }

  // changeOrderBy(item: any): void {
  //   this.loadData(this.itemsPerPage, 1, this.search, item.value);
  // }

  searchKeyUp(val: string): void {
    // const val = event.target.value.toLowerCase().trim();
    // console.log(val);
    this.search = val;
    this.cargarUsuarios(this.itemsPerPage, this.currentPage, this.itemRol, this.search);
  }

  // onContextMenuClick(action: string, item: IProduct): void {
  //   console.log('onContextMenuClick -> action :  ', action, ', item.title :', item.title);
  // }
}
