import { Component, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { DataListComponent } from 'src/app/views/app/users/data-list/data-list.component';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/data/usuario.service';
import { Curso } from '../../../models/curso.model';
import { CursoService } from 'src/app/data/curso.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-add-new-user-modal',
  templateUrl: './add-new-user-modal.component.html'
})
export class AddNewUserModalComponent {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  roles = [
    { label: 'Admin', value: 'ROL_ADMIN' },
    { label: 'Profesor', value: 'ROL_PROFESOR' },
    { label: 'Alumno', value: 'ROL_ALUMNO' }
  ];

  schoolYears: Curso[];
  user: Usuario;
  cb = true;

  // FORM
  private formSubmited = false;
  public formData=this.fb.group({
    nombre: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rol: ['', [Validators.required]],
    activo: ['']
  });

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private usuarioService: UsuarioService, private cursoService: CursoService, private fb: FormBuilder,
    private dataList: DataListComponent, private notifications: NotificationsService) { }

  show(id? : number): void {

    this.formData.reset();
    this.user = undefined;

    if(id) {
      this.getUser(id);
    } else {
      // SI VAMOS A CREAR UNO NUEVO ACTIVO == TRUE
      this.formData.get('activo').setValue(true);
    }
    
    this.modalRef = this.modalService.show(this.template, this.config);
    this.getSchoolYears();
  }

  getSchoolYears() {
    this.cursoService.getSchoolYears().subscribe(
      data => {
        this.schoolYears = data['cursos'];
      },
      error => {
        this.notifications.create('Error', 'No se han podido obtener los Cursos Académicos', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  createUser(): void {

    this.formSubmited = true;
    if (this.formData.invalid) { 
      return;
    }

    if(this.user) {
      // SI TENEMOS USUARIO -> ACTUALIZAMOS
      this.usuarioService.updateUser(this.formData.value, this.user.uid)
        .subscribe( res => {
          this.dataList.cargarUsuarios(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemRol, this.dataList.search);
          this.closeModal();

          this.notifications.create('Usuario editado', 'Se ha editado el Usuario correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        }, (err) => {

          this.notifications.create('Error', 'No se ha podido editar el Usuario', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });
    } else {
      // SI NO -> CREAMOS
      this.usuarioService.createUser(this.formData.value)
        .subscribe( res => {
          this.dataList.cargarUsuarios(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemRol, this.dataList.search);
          this.closeModal();

          this.notifications.create('Usuario creado', 'Se ha creado el Usuario correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        }, (err) => {

          this.notifications.create('Error', 'No se ha podido crear el Usuario', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });
    }

  }

  loadUserData() {
    if(this.user) {
      this.formData.get('nombre').setValue(this.user.nombre);
      this.formData.get('apellidos').setValue(this.user.apellidos);
      this.formData.get('email').setValue(this.user.email);
      this.formData.get('password').setValue('');
      this.formData.get('rol').setValue(this.user.rol);
      this.formData.get('activo').setValue(this.user.activo);
    }
  }

  getUser(id: number): void {
    this.usuarioService.getUser(id).subscribe(
      data => {
        this.user = data['usuarios'];
        this.loadUserData();      
      },
      error => {
        this.notifications.create('Error', 'No se ha podido obtener el Usuario', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  closeModal(): void {
    this.modalRef.hide();
  }

}
