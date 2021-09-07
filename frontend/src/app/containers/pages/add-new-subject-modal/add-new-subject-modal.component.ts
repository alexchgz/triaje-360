import { Component, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/data/api.service';
import { CursoService } from 'src/app/data/curso.service';
import { ISubject } from 'src/app/data/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataListComponent } from 'src/app/views/app/subjects/data-list/data-list.component';
// import { IUserResponse, IUser } from '../../../data/api.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Curso } from '../../../models/curso.model';

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
  isLoading: boolean;
  endOfTheList = false;
  schoolYears: Curso[];
  subject: ISubject;
  profesores: Usuario[] = [];
  alumnos: Usuario[] = [];

  // FORM
  private formSubmited = false;
  public formData=this.fb.group({
    nombre: ['', [Validators.required]],
    nombrecorto: ['', [Validators.required]],
    curso: ['', [Validators.required]],
    profesores: [''],
    alumnos: ['']
  });

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private apiService: ApiService, private cursoService: CursoService, private fb: FormBuilder, private router: Router , private dataList: DataListComponent) { }

  show(id? : number): void {
    if(id) {
      this.getSubject(id);
    }
    this.modalRef = this.modalService.show(this.template, this.config);
    this.getSchoolYears();
  }

  getSchoolYears() {
    this.cursoService.getSchoolYears().subscribe(
      data => {
        if (data['ok']) {
          //console.log(data.usuarios);
          this.isLoading = false;
          this.schoolYears = data['cursos'].map(x => {
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

  createSubject(): void {
    console.log('Envío formulario');

    this.formSubmited = true;
    if (this.formData.invalid) { console.log(this.formData.invalid )}

    if(this.subject) {
      this.formData.value.profesores = this.subject.profesores;
      this.formData.value.alumnos = this.subject.alumnos;
      this.apiService.updateSubject(this.formData.value, this.subject.uid)
        .subscribe( res => {
          console.log('Asignatura actualizada');
          //this.router.navigateByUrl('app/dashboards/all/users/data-list');
          this.dataList.loadSubjects(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear);
          this.closeModal();
        }, (err) => {
          return;
      });
    } else {
      this.formData.value.profesores = this.profesores;
      this.formData.value.alumnos = this.alumnos;
      console.log(this.formData);
      this.apiService.createSubject(this.formData.value)
        .subscribe( res => {
          console.log('Asignatura creada');
          //this.router.navigateByUrl('app/dashboards/all/users/data-list');
          this.dataList.loadSubjects(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear);
          this.closeModal();
        }, (err) => {
          return;
      });
    }

  }

  loadSubjectData() {
    console.log(this.subject);
    if(this.subject) {
      this.formData.get('nombre').setValue(this.subject.nombre);
      this.formData.get('nombrecorto').setValue(this.subject.nombrecorto);
      this.formData.get('curso').setValue(this.subject.curso.nombrecorto);
    }
  }

  getSubject(id: number): void {

    this.apiService.getSubject(id).subscribe(
      data => {
        if (data.ok) {
          console.log(data.asignaturas);
          this.subject = data.asignaturas;
          this.loadSubjectData();
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
    this.subject = undefined;
  }

}
