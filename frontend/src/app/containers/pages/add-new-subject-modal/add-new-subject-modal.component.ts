import { Component, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CursoService } from 'src/app/data/curso.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DataListComponent } from 'src/app/views/app/subjects/data-list/data-list.component';
import { Usuario } from 'src/app/models/usuario.model';
import { Curso } from '../../../models/curso.model';
import { Asignatura } from '../../../models/asignatura.model';
import { AsignaturaService } from '../../../data/asignatura.service';
import { Ejercicio } from '../../../models/ejercicio.model';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-add-new-subject-modal',
  templateUrl: './add-new-subject-modal.component.html'
})
export class AddNewSubjectModalComponent {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  schoolYears: Curso[];
  subject: Asignatura;
  profesores: Usuario[] = [];
  alumnos: Usuario[] = [];
  ejercicios: Ejercicio[] = [];

  // FORM
  private formSubmited = false;
  public formData=this.fb.group({
    nombre: ['', [Validators.required]],
    nombrecorto: ['', [Validators.required]],
    codigo: ['', [Validators.required]],
    curso: ['', [Validators.required]],
    profesores: [''],
    alumnos: [''],
    ejercicios: ['']
  });

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private cursoService: CursoService, private asignaturaSerivce: AsignaturaService,
     private fb: FormBuilder, private dataList: DataListComponent, private notifications: NotificationsService) { }

  show(id? : number): void {
    this.formData.reset();
    this.subject = undefined;

    if(id) {
      this.getSubject(id);
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

  createSubject(): void {

    this.formSubmited = true;
    if (this.formData.invalid) { return; }

    if(this.subject) {
      
      this.formData.value.profesores = this.subject.profesores;
      this.formData.value.alumnos = this.subject.alumnos;
      this.formData.value.ejercicios = this.subject.ejercicios;
      this.asignaturaSerivce.updateSubject(this.formData.value, this.subject.uid)
        .subscribe( res => {
          
          this.dataList.loadSubjects(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear, this.dataList.userId);
          this.closeModal();

          this.notifications.create('Asignatura editada', 'Se ha editado la Asignatura correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        }, (err) => {

          this.notifications.create('Error', 'No se ha podido editar la Asigantura', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });
    } else {

      this.formData.value.profesores = this.profesores;
      this.formData.value.alumnos = this.alumnos;
      this.formData.value.ejercicios = this.ejercicios;
      
      this.asignaturaSerivce.createSubject(this.formData.value)
        .subscribe( res => {
          this.dataList.loadSubjects(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear, this.dataList.userId);
          this.closeModal();

          this.notifications.create('Asigantura creada', 'Se ha creado la Asignatura correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        }, (err) => {

          this.notifications.create('Error', 'No se ha podido crear la Asignatura', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });
    }

  }

  loadSubjectData() {
    if(this.subject) {
      this.formData.get('nombre').setValue(this.subject.nombre);
      this.formData.get('nombrecorto').setValue(this.subject.nombrecorto);
      this.formData.get('codigo').setValue(this.subject.codigo);
      this.formData.get('curso').setValue(this.subject.curso._id);
    }
  }

  getSubject(id: number): void {

    this.asignaturaSerivce.getSubject(id).subscribe(
      data => {
        this.subject = data['asignaturas'];
        this.loadSubjectData();
      },
      error => {
        this.notifications.create('Error', 'No se han podido obtener la Asignatura', NotificationType.Error, {
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
