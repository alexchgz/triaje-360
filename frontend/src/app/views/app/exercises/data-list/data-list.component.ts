import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewExerciseModalComponent } from 'src/app/containers/pages/add-new-exercise-modal/add-new-exercise-modal.component';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Ejercicio } from '../../../../models/ejercicio.model';
import { EjercicioService } from 'src/app/data/ejercicio.service';
import { Asignatura } from '../../../../models/asignatura.model';
import { AsignaturaService } from 'src/app/data/asignatura.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { getUserRole } from 'src/app/utils/util';
import data from '../../../../constants/menu';
import { SenderService } from '../../../../data/sender.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { EjerciciosUsuarioService } from '../../../../data/ejerciciosUsuario.service';
import { EjerciciosUsuario } from '../../../../models/ejerciciosUsuario.model';
import { AuthService } from 'src/app/shared/auth.service';


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
  isLoading: boolean;
  endOfTheList = false;
  totalItem = 0;
  totalPage = 0;
  itemSubject = '';
  userId: string;
  userRole: number;
  totalEjerciciosUsuario = 0;
  ejerciciosUsuario: EjerciciosUsuario[] = [];

  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewExerciseModalComponent;

  constructor(private hotkeysService: HotkeysService, private ejercicioService: EjercicioService, private asignaturaService: AsignaturaService,
    private datePipe: DatePipe, private router: Router, public sender: SenderService, private notifications: NotificationsService,
    private ejerciciosUsuarioService: EjerciciosUsuarioService, private auth: AuthService) {
    this.hotkeysService.add(new Hotkey('ctrl+a', (event: KeyboardEvent): boolean => {
      this.selected = [...this.data];
      return false;
    }));
    this.hotkeysService.add(new Hotkey('ctrl+d', (event: KeyboardEvent): boolean => {
      this.selected = [];
      return false;
    }));
  }


  ngOnInit(): void {
    this.userRole = this.auth.rol;
    this.userId = this.auth.uid;
    
    console.log('Sbj:',this.sender.idSubject);
    this.itemSubject = this.sender.idSubject;

    this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject, this.userId);

    this.sender.idSubjectExercise = undefined;
    this.sender.idExercise = undefined;
  }

  loadExercises(pageSize: number, currentPage: number, subject: string, userId: string): void {

    // console.log(this.userRole);
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.ejercicioService.getExercises(pageSize, currentPage, subject, userId).subscribe(
      data => {
        if (data['ok']) {
          // console.log(data);
          this.isLoading = false;
          this.data = data['ejercicios'];
          this.exercisesInTime = data['ejerciciosEnTiempo'];
          // console.log(data['ejercicios']);
          // this.ejerciciosUsuario = data['ejerciciosUsuario'];

          this.changeDateFormat();
          // this.exerciseInTime();
          // console.log(this.data);
          this.totalItem = data['totalEjercicios'];
          // this.totalEjerciciosUsuario = data['totalEjerciciosUsuario'];
          // console.log(this.totalItem);
          //this.totalPage = data.totalPage;
          this.setSelectAllState();
        } else {
          this.endOfTheList = true;
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  changeDisplayMode(mode): void {
    this.displayMode = mode;
  }

  showAddNewModal(subject? : Asignatura): void {
    if(subject) {
      // console.log(subject.uid);
      this.addNewModalRef.show(subject.uid);
    } else {
      this.addNewModalRef.show();
    }
  }

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
    //console.log(year.uid);
    this.itemSubject = subject.uid.toString();
    this.sender.idSubject = subject.uid.toString();
    console.log(this.itemSubject);
    this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject, this.userId);
  }

  dropExercises(exercises: Ejercicio[]): void {
    //console.log(users);
    for(let i=0; i<exercises.length; i++){
      this.ejercicioService.dropExercise(exercises[i].uid).subscribe(
        data => {
          this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject, this.userId);

          this.notifications.create('Ejercicios eliminados', 'Se han eliminado los Ejercicios correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        },
        error => {

          this.notifications.create('Error', 'No se han podido eliminar los Ejercicios', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          this.isLoading = false;
        }
      );
    }
  }

  dropExercise(exercise: Ejercicio): void {
    // console.log(exercise);
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

          this.isLoading = false;
        }
      );

  }

  changeDateFormat(): void {
    for(let i = 0; i < this.data.length; i++) {
      this.data[i].desde = this.datePipe.transform(this.data[i].desde, 'dd/MM/yyyy');
      this.data[i].hasta = this.datePipe.transform(this.data[i].hasta, 'dd/MM/yyyy');
    }

    // for(let j = 0; j < this.ejerciciosUsuario.length; j++) {
    //   this.ejerciciosUsuario[j].fechaEjecucion = this.datePipe.transform(this.ejerciciosUsuario[j].fechaEjecucion, 'dd/MM/yyyy');
    // }

  }

  toEditExercise(e: Ejercicio): void {
    this.sender.idSubjectExercise = e.asignatura._id;
    this.sender.idExercise = e.uid;
    // this.router.navigateByUrl("/app/dashboards/all/subjects/add-exercise/" + e.asignatura._id +"/" + e.uid);
    this.router.navigateByUrl("/app/dashboards/all/subjects/add-exercise");
  }

  toViewExercise(uid: number): void {
    console.log('Vemos el ejercicio');
    this.sender.idExercise = uid;
    this.router.navigate(['/app/dashboards/all/exercises/view-exercise']);
  }

  createUserExercise(exercise: Ejercicio): void {

    if(exercise.max_intentos <= exercise['intentos']) {
      this.maxAttempts();
    } else {

      this.ejerciciosUsuarioService.createUserExercise(this.userId, exercise['_id'])
        .subscribe( res => {
          console.log('Registro de Ejercicio creado');
          //this.router.navigateByUrl('app/dashboards/all/users/data-list');
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

  getEjerciciosUsuario(idE: string): number {

    // console.log('entro');

    this.ejerciciosUsuarioService.getUserExercises(this.userId, idE)
        .subscribe( res => {
          console.log('Registros de Ejercicio obtenidos');

          this.ejerciciosUsuario = data['ejerciciosUsuario'];
          this.totalEjerciciosUsuario = data['totalEjerciciosUsuario'];

          console.log(this.totalEjerciciosUsuario);

        }, (err) => {

          // this.notifications.create('Error', 'No se ha podido crear el registro del Ejercicio', NotificationType.Error, {
          //   theClass: 'outline primary',
          //   timeOut: 6000,
          //   showProgressBar: false
          // });

          return;
      });

      return this.totalEjerciciosUsuario;

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

}
