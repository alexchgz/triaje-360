import { Component, TemplateRef,  ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService, ISchoolYear } from 'src/app/data/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataListComponent } from 'src/app/views/app/school-years/data-list/data-list.component';

@Component({
  selector: 'app-add-new-school-year-modal',
  templateUrl: './add-new-school-year-modal.component.html'
})
export class AddNewSchoolYearModalComponent {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  schoolYear: ISchoolYear;

  // FORM
  private formSubmited = false;
  // public formData=this.fb.group({
  //   nombre: ['', [Validators.required]],
  //   nombrecorto: ['', [Validators.required]],
  //   activo: ['', [Validators.required]]
  // });


  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService) { }

  show(): void {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  // createSchoolYear(): void {
  //   console.log('Envío formulario');

  //   this.formSubmited = true;
  //   if (this.formData.invalid) { console.log(this.formData.invalid )}

  //   if(this.user) {
  //     this.apiService.updateUser(this.formData.value, this.user.uid)
  //       .subscribe( res => {
  //         console.log('Usuario creado');
  //         //this.router.navigateByUrl('app/dashboards/all/users/data-list');
  //         this.dataList.cargarUsuarios(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear);
  //         this.closeModal();
  //       }, (err) => {
  //         return;
  //     });
  //   } else {
  //     this.apiService.createUser(this.formData.value)
  //       .subscribe( res => {
  //         console.log('Usuario creado');
  //         //this.router.navigateByUrl('app/dashboards/all/users/data-list');
  //         this.dataList.cargarUsuarios(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear);
  //         this.closeModal();
  //       }, (err) => {
  //         return;
  //     });
  //   }

  // }

  // loadUserData() {
  //   console.log(this.user);
  //   if(this.user) {
  //     this.formData.get('nombre').setValue(this.user.nombre);
  //     this.formData.get('apellidos').setValue(this.user.apellidos);
  //     this.formData.get('email').setValue(this.user.email);
  //     this.formData.get('password').setValue('');
  //     this.formData.get('rol').setValue(this.user.rol);
  //     this.formData.get('curso').setValue(this.user.curso.nombrecorto);
  //   }
  // }

  // getUser(id: number): void {

  //   this.apiService.getUser(id).subscribe(
  //     data => {
  //       if (data.ok) {
  //         console.log(data.usuarios);
  //         this.user = data.usuarios;
  //         this.loadUserData();
  //       } else {
  //         this.endOfTheList = true;
  //       }
  //     },
  //     error => {
  //       this.isLoading = false;
  //     }
  //   );
  // }

  closeModal(): void {
    this.modalRef.hide();
    //this.formData.reset();
    this.schoolYear = undefined;
  }

}
