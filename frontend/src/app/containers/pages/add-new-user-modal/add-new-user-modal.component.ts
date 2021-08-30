import { Component, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/data/api.service';
import { ISchoolYear, IUser } from 'src/app/data/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataListComponent } from 'src/app/views/app/users/data-list/data-list.component';
import { IUserResponse } from '../../../data/api.service';


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
  isLoading: boolean;
  endOfTheList = false;
  schoolYears: ISchoolYear[];
  user: IUser;

  // FORM
  private formSubmited = false;
  public formData=this.fb.group({
    nombre: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rol: ['', [Validators.required]],
    curso: ['', Validators.required]
  });

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private apiService: ApiService, private fb: FormBuilder, private router: Router , private dataList: DataListComponent) { }

  show(id? : number): void {
    if(id) {
      this.getUser(id);
    }
    this.modalRef = this.modalService.show(this.template, this.config);
    this.getSchoolYears();
  }

  getSchoolYears() {
    this.apiService.getSchoolYears().subscribe(
      data => {
        if (data.ok) {
          //console.log(data.usuarios);
          this.isLoading = false;
          this.schoolYears = data.cursos.map(x => {
            return {
              ...x,
              // img: x.img.replace('/img/', '/img/products/')
            };
          });
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

  createUser(): void {
    console.log('Envío formulario');

    this.formSubmited = true;
    if (this.formData.invalid) { console.log(this.formData.invalid )}

    if(this.user) {
      this.apiService.updateUser(this.formData.value, this.user.uid)
        .subscribe( res => {
          console.log('Usuario creado');
          //this.router.navigateByUrl('app/dashboards/all/users/data-list');
          this.dataList.cargarUsuarios(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear);
          this.closeModal();
        }, (err) => {
          return;
      });
    } else {
      this.apiService.createUser(this.formData.value)
        .subscribe( res => {
          console.log('Usuario creado');
          //this.router.navigateByUrl('app/dashboards/all/users/data-list');
          this.dataList.cargarUsuarios(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear);
          this.closeModal();
        }, (err) => {
          return;
      });
    }

  }

  loadUserData() {
    console.log(this.user);
    if(this.user) {
      this.formData.get('nombre').setValue(this.user.nombre);
      this.formData.get('apellidos').setValue(this.user.apellidos);
      this.formData.get('email').setValue(this.user.email);
      this.formData.get('password').setValue('');
      this.formData.get('rol').setValue(this.user.rol);
      this.formData.get('curso').setValue(this.user.curso.nombrecorto);
    }
  }

  getUser(id: number): void {

    this.apiService.getUser(id).subscribe(
      data => {
        if (data.ok) {
          console.log(data.usuarios);
          this.user = data.usuarios;
          this.loadUserData();
        } else {
          this.endOfTheList = true;
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  closeModal(): void {
    this.modalRef.hide();
    this.formData.reset();
    this.user = undefined;
  }

}