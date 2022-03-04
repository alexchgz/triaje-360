import { Component, TemplateRef,  ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataListComponent } from 'src/app/views/app/school-years/data-list/data-list.component';
import { CursoService } from '../../../data/curso.service';
import { Curso } from '../../../models/curso.model';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import Swal from 'sweetalert2';


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
  schoolYear: Curso;

  // FORM
  private formSubmited = false;
  public formData=this.fb.group({
    nombre: ['', [Validators.required]],
    nombrecorto: ['', [Validators.required]],
    activo: ['']
  });


  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private cursoService: CursoService, private fb: FormBuilder, private router: Router , private dataList: DataListComponent,
    private notifications: NotificationsService) { }

  show(id? : number): void {

    this.formData.reset();
    this.schoolYear = undefined;

    if(id) {
      this.getSchoolYear(id);
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  createUpdateSchoolYear(): void {
    console.log('Envío formulario');

    this.formSubmited = true;
    if (this.formData.invalid) { return; }

    let curso: any;
    if(this.schoolYear) { 
      curso = this.schoolYear.uid
    } else {
      curso = '';
    }

    this.cursoService.createUpdateSchoolYear(this.formData.value, curso)
        .subscribe( res => {
          console.log('Curso Académico Creado o Actualizado');
          this.dataList.loadSchoolYears(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear);
          this.closeModal();

          this.notifications.create('Curso Académico creado o editado', 'Se ha creado o editado el Curso Académico correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        }, (err) => {

          this.notifications.create('Error', 'No se ha podido crear o editar el Curso Académico', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });

  }

  loadSchoolYearData() {
    // console.log(this.schoolYear);
    if(this.schoolYear) {
      this.formData.get('nombre').setValue(this.schoolYear.nombre);
      this.formData.get('nombrecorto').setValue(this.schoolYear.nombrecorto);
      this.formData.get('activo').setValue(this.schoolYear.activo);
    }
  }

  getSchoolYear(id: number): void {

    this.cursoService.getSchoolYear(id).subscribe(
      data => {
        if (data['ok']) {
          // console.log(data['cursos']);
          this.schoolYear = data['cursos'];
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
    // this.formData.reset();
    // this.schoolYear = undefined;
  }

  existeCursoActivo(): void {

    if(!this.formData.get('activo').value) {
      this.createUpdateSchoolYear();
    } else {
      this.cursoService.getSchoolYearActivo().subscribe(
        data => {
          if (data['ok']) {
            // console.log(data['cursoActivo']);
            // SI EXISTE PREGUNTAMOS QUE SE QUIERE HACER
            if(data['cursoActivo']) {
              this.msgCursoActivo(data['cursoActivo']);
            }
            else {
              // SI NO TENEMOS YA UN CURSO ACTIVO LO CREAMOS
              this.createUpdateSchoolYear();
            }
          } else {
            this.endOfTheList = true;
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }

  msgCursoActivo(curso: Curso): void {
    
    Swal.fire({
      title: 'Crear Curso Activo',
      text: 'Solo puede existir un Curso activo, si confirmas esta creación, el otro curso activo se desactivará.',
      icon: 'info',
      showDenyButton: true,
      iconColor: '#145388',
      confirmButtonColor: '#145388',
      denyButtonColor: '#145388',
      confirmButtonText: `Confirmar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        
        let idCurso: any;
        if(this.schoolYear) { 
          idCurso = this.schoolYear.uid
        } else {
          idCurso = '';
        }
        // this.cursoService.updateSchoolYearActive(curso[0].uid, this.formData.value, idCurso).subscribe( res => {
        this.cursoService.createUpdateSchoolYear( this.formData.value, idCurso, curso[0].uid).subscribe( res => {
  
          this.dataList.loadSchoolYears(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear);
          this.closeModal();

          this.notifications.create('Curso Académico creado', 'Se ha creado el Curso Académico correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        }, (err) => {

          this.notifications.create('Error', 'No se ha podido crear el Curso Académico', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
        });
      } else if (result.isDenied) {
        Swal.close();
      }
    });
  }

}
