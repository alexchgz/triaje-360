import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CursoService } from 'src/app/data/curso.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataListComponent } from 'src/app/views/app/exercises/data-list/data-list.component';
import { AsignaturaService } from 'src/app/data/asignatura.service';
import { EjercicioService } from 'src/app/data/ejercicio.service';
import { DatePipe, Location } from '@angular/common';
import { Ejercicio } from 'src/app/models/ejercicio.model';
import { Asignatura } from '../../../../models/asignatura.model';
import { SenderService } from '../../../../data/sender.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';

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
  subjects: Asignatura[];
  uid: any;
  uidEx: number;
  totalItem: 0;
  todayString: string;

  // FORM
  private formSubmited = false;
  public formData=this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    desde: ['', [Validators.required]],
    hasta: ['', [Validators.required]],
    asignatura: ['', [Validators.required]],
    max_intentos: ['', [Validators.required]]
  });

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private asignaturaService: AsignaturaService, private ejercicioService: EjercicioService, private fb: FormBuilder,
    private route: ActivatedRoute, private router: Router, private datePipe: DatePipe, private location: Location, private sender: SenderService,
    private notifications: NotificationsService) { }

  ngOnInit(): void {

    // para comprobar la fecha de hoy en el input
    var today = new Date();
    console.log(today);
    this.todayString = this.datePipe.transform(today, 'yyyy-MM-dd');
    // console.log(this.todayString);
    this.formData.get('desde').setValue(this.todayString);
    this.formData.get('hasta').setValue(this.todayString);

    if(this.sender.idSubjectExercise) {
      this.uid = this.sender.idSubjectExercise;
    } else if(this.sender.idSubject) {
      this.uid = this.sender.idSubject;
    }
    if(this.sender.idExercise) {
      this.uidEx = this.sender.idExercise;
    }

    // console.log(this.sender.idSubjectExercise);
    // console.log(this.sender.idExercise);

    if(this.uid == undefined && this.uidEx == undefined) {
      // console.log('eeee');
      this.getSubjects();
    } else {

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
              this.formData.get('desde').setValue(this.datePipe.transform(this.exercise.desde, 'yyyy-MM-dd'));
              this.formData.get('hasta').setValue(this.datePipe.transform(this.exercise.hasta, 'yyyy-MM-dd'));
              this.formData.get('max_intentos').setValue(this.exercise.max_intentos);
            } else {
              this.endOfTheList = true;
            }
          },
          error => {
            this.isLoading = false;
          }
        );
      }

      console.log(this.uid);
      this.loadSubjectData(this.uid);
    }

  }

  getSubjects() {
    // console.log('llego');
    this.asignaturaService.getSubjects().subscribe(
      data => {
        if (data['ok']) {
          // console.log(data['asignaturas']);
          this.isLoading = false;
          this.subjects = data['asignaturas'];

          // console.log(this.subjects);
          // console.log(this.subject);
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

  checkDate(): void {

    this.formSubmited = true;
    if (this.formData.invalid) {
      console.log(this.formData.invalid );
      this.notifications.create('Error al crear ejercicio', 'Existen errores en el formulario. No se pudo crear el ejercicio', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 6000,
        showProgressBar: false
      });
    } else {
      const desde = new Date(this.formData.get('desde').value);
      const hasta = new Date(this.formData.get('hasta').value);

      console.log(desde.getTime());
      console.log(hasta.getTime());

      if(desde.getTime() <= hasta.getTime()) {
        // console.log('menor o igual');
        this.createExercise();
      } else {
        // console.log('mayor');
        this.notifications.create('Error en la fecha', 'La fecha "desde" no puede ser posterior a la fecha "hasta"', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });
      }
    }

  }

  createExercise(): void {

    this.formSubmited = true;
    if (this.formData.invalid) { console.log(this.formData.invalid )}

    if(this.exercise) {
      console.log(this.exercise);
      this.ejercicioService.updateExercise(this.formData.value, this.exercise.uid)
        .subscribe( res => {

          this.sender.showMsgEditEx = true;
          this.router.navigateByUrl('app/dashboards/all/subjects/data-list');

          this.notifications.create('Ejercicio editado', 'Se ha editado el Ejercicio correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        }, (err) => {

          this.notifications.create('Error', 'No se ha podido editar el Ejercicio', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });
    } else {
    
      this.ejercicioService.createExercise(this.formData.value)
        .subscribe( res => {
          // console.log('Ejercicio creado');
          this.exercise = res['ejercicio'];
          this.sender.showMsgAddEx = true;

          // console.log(this.subject);
          if(this.subject == undefined) {
            // si no había asignatura tenemos que obtener la del formulario para actualizarla
            this.asignaturaService.getSubject(this.formData.get('asignatura').value).subscribe(
              data => {
                if (data['ok']) {
                  console.log(data['asignaturas']);
                  this.subject = data['asignaturas'];
                  // this.formData.get('asignatura').disable();

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

                      this.notifications.create('Ejercicio creado', 'Se ha añadido el Ejercicio a la Asigantura correctamente', NotificationType.Info, {
                        theClass: 'outline primary',
                        timeOut: 6000,
                        showProgressBar: false
                      });

                    }, (err) => {

                      this.notifications.create('Error', 'No se ha podido añadir el Ejercicio a la Asignatura', NotificationType.Error, {
                        theClass: 'outline primary',
                        timeOut: 8000,
                        showProgressBar: false
                      });

                      return;
                    });

                } else {
                  // this.router.navigateByUrl('/app/dashboards/all/subjects/data-list');
                  console.log('No se ha encontrado la asignatura');
                  this.endOfTheList = true;
                }
              },
              error => {
                this.isLoading = false;
              }
            );
          }
          console.log(this.subject);

          // y lo añadimos a la lista de ejercicios de la asignatura
            // generamos primer id para el ejercicio
          if(this.subject) {
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

              this.notifications.create('Ejercicio creado', 'Se ha creado el Ejercicio correctamente', NotificationType.Info, {
                theClass: 'outline primary',
                timeOut: 6000,
                showProgressBar: false
              });

            }, (err) => {

              this.notifications.create('Error', 'No se ha podido añadir el Ejercicio a la Asignatura', NotificationType.Error, {
                theClass: 'outline primary',
                timeOut: 8000,
                showProgressBar: false
              });

              return;
            });
            // this.router.navigateByUrl('app/dashboards/all/subjects/data-list');
            // this.dataList.loadExercises(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemSubject);
            // this.closeModal();

            this.notifications.create('Ejercicio creado', 'Se ha creado el Ejercicio correctamente', NotificationType.Info, {
              theClass: 'outline primary',
              timeOut: 6000,
              showProgressBar: false
            });
          }

        }, (err) => {

          this.notifications.create('Error', 'No se ha podido crear el Ejercicio', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });


    }
  }

  goBack(): void {
    this.location.back();
  }

}
