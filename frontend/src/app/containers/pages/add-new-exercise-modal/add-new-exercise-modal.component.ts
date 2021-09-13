import { Component, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CursoService } from 'src/app/data/curso.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataListComponent } from 'src/app/views/app/exercises/data-list/data-list.component';
import { Ejercicio } from '../../../models/ejercicio.model';
import { EjercicioService } from '../../../data/ejercicio.service';
import { Asignatura } from '../../../models/asignatura.model';
import { AsignaturaService } from 'src/app/data/asignatura.service';

@Component({
  selector: 'app-add-new-exercise-modal',
  templateUrl: './add-new-exercise-modal.component.html',
  styleUrls: ['./add-new-exercise-modal.component.scss']
})
export class AddNewExerciseModalComponent {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  isLoading: boolean;
  endOfTheList = false;
  subjects: Asignatura[];
  exercise: Ejercicio;

  // FORM
  private formSubmited = false;
  public formData=this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    desde: ['', [Validators.required]],
    hasta: ['', [Validators.required]],
    asignatura: ['', [Validators.required]]
  });

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private ejercicioService: EjercicioService, private asignaturaService: AsignaturaService, private fb: FormBuilder, private router: Router , private dataList: DataListComponent) { }

  show(id? : number): void {
    if(id) {
      this.getExercise(id);
    }
    this.modalRef = this.modalService.show(this.template, this.config);
    this.getSubjects();
  }

  getSubjects() {
    this.asignaturaService.getSubjects().subscribe(
      data => {
        if (data['ok']) {
          //console.log(data.usuarios);
          this.isLoading = false;
          this.subjects = data['asignaturas'].map(x => {
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

  createExercise(): void {
    console.log('Envío formulario');

    this.formSubmited = true;
    if (this.formData.invalid) { console.log(this.formData.invalid )}

    if(this.exercise) {
      this.ejercicioService.updateExercise(this.formData.value, this.exercise.uid)
        .subscribe( res => {
          console.log('Ejercicio actualizado');
          //this.router.navigateByUrl('app/dashboards/all/users/data-list');
          this.dataList.loadExercises(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemSubject);
          this.closeModal();
        }, (err) => {
          return;
      });
    } else {
      console.log(this.formData);
      this.ejercicioService.createExercise(this.formData.value)
        .subscribe( res => {
          console.log('Ejercicio creado');
          //this.router.navigateByUrl('app/dashboards/all/users/data-list');
          this.dataList.loadExercises(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemSubject);
          this.closeModal();
        }, (err) => {
          return;
      });
    }
  }

  loadExerciseData() {
    console.log(this.exercise);
    if(this.exercise) {
      this.formData.get('nombre').setValue(this.exercise.nombre);
      this.formData.get('descripcion').setValue(this.exercise.descripcion);
      this.formData.get('desde').setValue(this.exercise.desde);
      this.formData.get('hasta').setValue(this.exercise.hasta);
      this.formData.get('asignatura').setValue(this.exercise.asignatura.nombrecorto);
    }
  }

  getExercise(id: number): void {

    this.ejercicioService.getExercise(id).subscribe(
      data => {
        if (data['ok']) {
          console.log(data['ejercicios']);
          this.exercise = data['ejercicios'];
          this.loadExerciseData();
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
    this.exercise = undefined;
  }

}
