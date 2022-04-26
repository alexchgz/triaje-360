import { Component, OnInit, ViewChild } from '@angular/core';
import { Ejercicio } from '../../../../models/ejercicio.model';
import { EjercicioService } from 'src/app/data/ejercicio.service';
import { Asignatura } from '../../../../models/asignatura.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SenderService } from '../../../../data/sender.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { EjerciciosUsuarioService } from '../../../../data/ejerciciosUsuario.service';
import { EjerciciosUsuario } from '../../../../models/ejerciciosUsuario.model';
import { AuthService } from 'src/app/shared/auth.service';
import Swal from 'sweetalert2';
// import * as Marzipano from 'marzipano';
var Marzipano = require('marzipano');

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss'],
  providers: [DatePipe]
})
export class DataListComponent implements OnInit {
  displayMode = 'list';
  selectAllState = '';
  selected: Ejercicio[] = [];
  data: Ejercicio[] = [];
  exercisesInTime: string[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  search = '';
  orderBy = '';
  totalItem = 0;
  totalPage = 0;
  itemSubject = '';
  userId: string;
  userRole: number;
  totalEjerciciosUsuario = 0;
  ejerciciosUsuario: EjerciciosUsuario[] = [];

  constructor(private ejercicioService: EjercicioService,
    private datePipe: DatePipe, private router: Router, public sender: SenderService, private notifications: NotificationsService,
    private ejerciciosUsuarioService: EjerciciosUsuarioService, private auth: AuthService) {
  }

  ngOnInit(): void {
    this.userRole = this.auth.rol;
    this.userId = this.auth.uid;    
    this.itemSubject = this.sender.idSubject;
    this.sender.idSubjectExercise = undefined;
    this.sender.idExercise = undefined;
    this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject, this.userId);
  }

  loadExercises(pageSize: number, currentPage: number, subject: string, userId: string): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.ejercicioService.getExercises(pageSize, currentPage, subject, userId).subscribe(
      data => {

        this.data = data['ejercicios'];
        this.exercisesInTime = data['ejerciciosEnTiempo'];
        this.changeDateFormat();
        this.totalItem = data['totalEjercicios'];
        this.setSelectAllState();
        
      },
      error => {
        this.notifications.create('Error', 'No se han podido cargar los Ejercicios', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  dropExercises(exercises: Ejercicio[]): void {
    
    for(let i=0; i<exercises.length; i++){
      this.ejercicioService.dropExercise(exercises[i].uid).subscribe(
        data => {
          this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject, this.userId);

          if(i == exercises.length-1) {
            this.notifications.create('Ejercicios eliminados', 'Se han eliminado los Ejercicios correctamente', NotificationType.Info, {
              theClass: 'outline primary',
              timeOut: 6000,
              showProgressBar: false
            });
          }

        },
        error => {

          this.notifications.create('Error', 'No se han podido eliminar los Ejercicios', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
        }
      );
    }
  }

  dropExercise(exercise: Ejercicio): void {
    
      this.ejercicioService.dropExercise(exercise.uid).subscribe(
        data => {
          this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject, this.userId);

          this.notifications.create('Ejercicio eliminado', 'Se ha eliminado el Ejercicio correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        },
        error => {

          this.notifications.create('Error', 'No se ha podido eliminar el Ejercicio', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
        }
      );

  }

  changeDateFormat(): void {
    for(let i = 0; i < this.data.length; i++) {
      this.data[i].desde = this.datePipe.transform(this.data[i].desde, 'dd/MM/yyyy');
      this.data[i].hasta = this.datePipe.transform(this.data[i].hasta, 'dd/MM/yyyy');
    }
  }

  toEditExercise(e: Ejercicio): void {
    this.sender.idSubjectExercise = e.asignatura._id;
    this.sender.idExercise = e.uid;
    this.router.navigateByUrl("/app/dashboards/all/subjects/add-exercise");
  }

  toViewExercise(uid: number): void {
    this.sender.idExercise = uid;
    this.router.navigate(['/app/dashboards/all/exercises/view-exercise']);
  }

  toDoExercise(): void {
    this.router.navigate(['/app/dashboards/all/exercises/do-exercise'])
  }

  createUserExercise(exercise: Ejercicio): void {

    // comprobamos el numero de intentos del usuario en ese ejercicio
    if(exercise.max_intentos <= exercise['intentos']) {
      this.maxAttempts();
    } else {
      this.ejerciciosUsuarioService.createUserExercise(this.userId, exercise['_id'])
        .subscribe( res => {

          this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject, this.userId);
          this.notifications.create('Registro creado', 'Se ha creado el registro de Ejercicio correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        }, (err) => {
          this.notifications.create('Error', 'No se ha podido crear el registro del Ejercicio', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });
    }
  }

  maxAttempts(): void {
    this.notifications.create('Máximo de Intentos Alcanzado', 'Se han alcanzado el máximo de intentos permitidos para realizar este ejercicio', NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 6000,
      showProgressBar: true
    });
  }

  inTime(id: string): boolean {
    let isInTime = false;

    if(this.exercisesInTime.includes(id)) {
      isInTime = true;
    }

    return isInTime;

  }

  exerciseDisabled(): void {
    this.notifications.create('Error', 'La realización de este Ejercicio ya no está disponible', NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 5000,
      showProgressBar: false
    });
  }

  confirmDelete(ejercicio: Ejercicio): void {
    Swal.fire({
      title: 'Eliminar Ejercicio',
      text: '¿Estás seguro de que quieres eliminar el Ejercicio?',
      icon: 'warning',
      showDenyButton: true,
      iconColor: '#145388',
      confirmButtonColor: '#145388',
      denyButtonColor: '#145388',
      confirmButtonText: `Sí`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.dropExercise(ejercicio);
      } else if (result.isDenied) {
        Swal.close();
      }
    });
  }

  // LIST PAGE HEADER METHODS
  isSelected(p: Ejercicio): boolean {
    return this.selected.findIndex(x => x.uid === p.uid) > -1;
  }

  onSelect(item: Ejercicio): void {
    if (this.isSelected(item)) {
      this.selected = this.selected.filter(x => x.uid !== item.uid);
    } else {
      this.selected.push(item);
    }
    this.setSelectAllState();
  }

  setSelectAllState(): void {
    if (this.selected.length === this.data.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.data];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  pageChanged(event: any): void {
    this.loadExercises(this.itemsPerPage, event.page, this.itemSubject, this.userId);
  }

  itemsPerPageChange(perPage: number): void {
    this.loadExercises(perPage, 1, this.itemSubject, this.userId);
  }

  subjectChange(subject: Asignatura): void {
    if(subject.uid == undefined) {
      this.itemSubject = undefined;
      this.sender.idSubject = undefined;
    } else {
      this.itemSubject = subject.uid.toString();
      this.sender.idSubject = subject.uid.toString();
    }
    
    this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject, this.userId);
  }

}
