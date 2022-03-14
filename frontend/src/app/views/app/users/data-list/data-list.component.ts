import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewUserModalComponent } from 'src/app/containers/pages/add-new-user-modal/add-new-user-modal.component';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../../../data/usuario.service';
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
  totalItem = 0;
  totalPage = 0;
  itemRol = '';

  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewUserModalComponent;

  constructor(private usuarioService: UsuarioService, private notifications: NotificationsService, public sender: SenderService) {}


  ngOnInit(): void {
    this.sender.idSubject = undefined;
    this.sender.idSubjectExercise = undefined;
    this.sender.idExercise = undefined;
    
    this.cargarUsuarios(this.itemsPerPage, this.currentPage, this.itemRol, this.search);
  }

  cargarUsuarios(pageSize: number, currentPage: number, role: string, search: string): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;

    this.usuarioService.getUsers(pageSize, currentPage, role, search).subscribe(
      data => {
        if (data['ok']) {
          this.data = data['usuarios'];
          this.totalItem = data['totalUsuarios'];
          this.setSelectAllState();
        }
      },
      error => {
        this.notifications.create('Error', 'No se han podido cargar los Usuarios', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  dropUsers(users: Usuario[]): void {
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
          this.notifications.create('Error', 'No se han podido eliminar los Usuarios', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
        }
      );
    }
  }

  dropUser(user: Usuario): void {
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

          return;
        }
      );

  }

  confirmDelete(usuario: Usuario): void {
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
      if (result.isConfirmed) {
        this.dropUser(usuario);
      } else if (result.isDenied) {
        Swal.close();
      }
    });
  }

  // MODAL METHODS
  showAddNewModal(user? : Usuario): void {
    if(user) {
      console.log(user.uid);
      this.addNewModalRef.show(user.uid);
    } else {
      this.addNewModalRef.show();
    }
  }

  // LIST PAGE HEADER METHODS
  isSelected(p: Usuario): boolean {
    return this.selected.findIndex(x => x.uid === p.uid) > -1;
  }
  onSelect(item: Usuario): void {
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

  pageChanged(event: any): void {
    this.cargarUsuarios(this.itemsPerPage, event.page, this.itemRol, this.search);
  }

  itemsPerPageChange(perPage: number): void {
    this.cargarUsuarios(perPage, 1, this.itemRol, this.search);
  }

  rolChange(rol: {label, value}): void {
    this.itemRol = rol.value;
    this.cargarUsuarios(this.itemsPerPage, 1, this.itemRol, this.search);
  }

  searchKeyUp(val: string): void {
    this.search = val;
    this.cargarUsuarios(this.itemsPerPage, this.currentPage, this.itemRol, this.search);
  }

  // changeOrderBy(item: any): void {
  //   this.loadData(this.itemsPerPage, 1, this.search, item.value);
  // }

}
