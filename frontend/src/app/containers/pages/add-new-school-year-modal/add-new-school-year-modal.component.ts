import { Component, TemplateRef,  ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService, ISchoolYear } from 'src/app/data/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataListComponent } from 'src/app/views/app/school-years/data-list/data-list.component';
import { id } from '@swimlane/ngx-datatable';

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
  isLoading: boolean;
  endOfTheList = false;
  schoolYear: ISchoolYear;

  // FORM
  private formSubmited = false;
  public formData=this.fb.group({
    nombre: ['', [Validators.required]],
    nombrecorto: ['', [Validators.required]],
    activo: ['', [Validators.required]]
  });


  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private apiService: ApiService, private fb: FormBuilder, private router: Router , private dataList: DataListComponent) { }

  show(id? : number): void {
    if(id) {
      this.getSchoolYear(id);
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  createSchoolYear(): void {
    console.log('Envío formulario');

    this.formSubmited = true;
    if (this.formData.invalid) { console.log(this.formData.invalid )}

    if(this.schoolYear) {
      this.apiService.updateSchoolYear(this.formData.value, this.schoolYear.uid)
        .subscribe( res => {
          console.log('Curso Académico Actualizado');
          //this.router.navigateByUrl('app/dashboards/all/users/data-list');
          this.dataList.loadSchoolYears(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear);
          this.closeModal();
        }, (err) => {
          return;
      });
    } else {
      this.apiService.createSchoolYear(this.formData.value)
        .subscribe( res => {
          console.log('Curso Académico creado');
          //this.router.navigateByUrl('app/dashboards/all/users/data-list');
          this.dataList.loadSchoolYears(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear);
          this.closeModal();
        }, (err) => {
          return;
      });
    }

  }

  loadSchoolYearData() {
    console.log(this.schoolYear);
    if(this.schoolYear) {
      this.formData.get('nombre').setValue(this.schoolYear.nombre);
      this.formData.get('nombrecorto').setValue(this.schoolYear.nombrecorto);
      this.formData.get('activo').setValue(this.schoolYear.activo);
    }
  }

  getSchoolYear(id: number): void {

    this.apiService.getSchoolYear(id).subscribe(
      data => {
        if (data.ok) {
          console.log(data.cursos);
          this.schoolYear = data.cursos;
          this.loadSchoolYearData();
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
    console.log('entro aqui');
    this.modalRef.hide();
    this.formData.reset();
    this.schoolYear = undefined;
  }

}