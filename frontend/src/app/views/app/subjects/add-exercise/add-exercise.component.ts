import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CursoService } from 'src/app/data/curso.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataListComponent } from 'src/app/views/app/exercises/data-list/data-list.component';
import { AsignaturaService } from 'src/app/data/asignatura.service';
import { EjercicioService } from 'src/app/data/ejercicio.service';
import { DatePipe } from '@angular/common';
import { Ejercicio } from 'src/app/models/ejercicio.model';
import { Asignatura } from '../../../../models/asignatura.model';

const bson = require('bson');

@Component({
  selector: 'app-add-exercise',
  templateUrl: './add-exercise.component.html',
  styleUrls: ['./add-exercise.component.scss'],
  providers: [DatePipe]
})
export class AddExerciseComponent implements OnInit {

  isLoading: boolean;
  endOfTheList = false;
  exercise: Ejercicio;
  subject: Asignatura;
  uid: number;
  uidEx: number;
  totalItem: 0;

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

  constructor(private asignaturaService: AsignaturaService, private ejercicioService: EjercicioService, private fb: FormBuilder,
    private route: ActivatedRoute, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.params['uid'];
    this.uidEx = this.route.snapshot.params['uid2'];
    console.log(this.uidEx);
    // this.formData.get('uid').setValue(this.uid);
    // si tenemos el id del ejercicio --> editar
    if(this.uidEx != null) {
      this.ejercicioService.getExercise(this.uidEx).subscribe(
        data => {
          console.log(data);
          if (data['ok']) {
            // console.log(data);
            this.isLoading = false;
            this.exercise = data['ejercicios'];
            console.log(data['ejercicios']);
            this.totalItem = data['totalEjercicios'];
            this.formData.get('asignatura').setValue(this.exercise.asignatura._id);
            this.formData.get('nombre').setValue(this.exercise.nombre);
            this.formData.get('descripcion').setValue(this.exercise.descripcion);
            this.formData.get('desde').setValue(this.exercise.desde);
            this.formData.get('hasta').setValue(this.exercise.hasta);
          } else {
            this.endOfTheList = true;
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    }

    this.loadSubjectData(this.uid);
  }

  loadSubjectData(uid: number) {
    this.asignaturaService.getSubject(uid).subscribe(
      data => {
        if (data['ok']) {
          console.log(data['asignaturas']);
          this.subject = data['asignaturas'];
          // this.formData.get('asignatura').disable();
          this.formData.get('asignatura').setValue(this.subject.uid)
        } else {
          this.router.navigateByUrl('/app/dashboards/all/subjects/data-list');
          this.endOfTheList = true;
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  createExercise(): void {
    // console.log('Envío formulario');

    this.formSubmited = true;
    if (this.formData.invalid) { console.log(this.formData.invalid )}

    if(this.exercise) {
      console.log(this.exercise);
      this.ejercicioService.updateExercise(this.formData.value, this.exercise.uid)
        .subscribe( res => {
          console.log(this.formData.get('asignatura').value);
          // console.log('Ejercicio actualizado');
          //this.router.navigateByUrl('app/dashboards/all/users/data-list');
          // this.dataList.loadExercises(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemSubject);
          // this.closeModal();
        }, (err) => {
          return;
      });
    } else {
      console.log(this.formData);
      // creamos el ejercicio
      this.ejercicioService.createExercise(this.formData.value)
        .subscribe( res => {
          console.log('Ejercicio creado');
          this.exercise = res['ejercicio'];
          // console.log(this.exercise);
          // y lo añadimos a la lista de ejercicios de la asignatura
            // generamos primer id para el ejercicio
          var idE = new bson.ObjectId().toString();
          this.subject.ejercicios.push({ '_id': idE, 'ejercicio': this.exercise });
          // console.log(this.subject.ejercicios[1]);

          // y actualizamos la asignatura

          // console.log(this.subject);
          this.asignaturaService.updateSubject(this.subject, this.subject.uid).subscribe( res => {
            console.log('Asignatura actualizada');
            this.router.navigateByUrl('app/dashboards/all/subjects/data-list');
            // this.dataList.loadSubjects(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemYear);
            // mensaje modal

          }, (err) => {
            return;
          });
          // this.router.navigateByUrl('app/dashboards/all/subjects/data-list');
          // this.dataList.loadExercises(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemSubject);
          // this.closeModal();
        }, (err) => {
          return;
      });


    }
  }

}
