import { Component, OnInit, ViewChild } from '@angular/core';
import { SenderService } from 'src/app/data/sender.service';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/shared/auth.service';
import { EjercicioService } from 'src/app/data/ejercicio.service';
import { ShowStudentRegisterModalComponent } from 'src/app/containers/pages/show-student-register-modal/show-student-register-modal.component';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-view-exercise',
  templateUrl: './view-exercise.component.html',
  styleUrls: ['./view-exercise.component.scss']
})
export class ViewExerciseComponent implements OnInit {

  displayMode = 'list';
  itemsPerPage = 10;
  currentPage = 1;
  search = '';
  totalItem = 0;
  userRole: number;
  userId: string;
  exerciseId: number;
  itemSubject = '';
  data: Usuario[] = [];

  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: ShowStudentRegisterModalComponent;

  constructor(private sender: SenderService, private auth: AuthService, private ejercicioService: EjercicioService,
    private notifications: NotificationsService) { }

  ngOnInit(): void {
    this.userRole = this.auth.rol;
    this.userId = this.auth.uid;
    this.itemSubject = this.sender.idSubject;
    this.exerciseId = this.sender.idExercise;

    this.loadExerciseStudents(this.exerciseId, this.itemsPerPage, this.currentPage, this.itemSubject, this.userId, '');
  }

  loadExerciseStudents(exerciseId: number, pageSize: number, currentPage: number, subject: string, userId: string, search: string): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.ejercicioService.getExerciseStudents(exerciseId, pageSize, currentPage, subject, userId, search).subscribe(
      data => {        
        this.data = data['alumnosEjercicio'];
        this.totalItem = this.data.length;
      },
      error => {
        this.notifications.create('Error', 'No se han podido cargar los Ejercicios del Alumno', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  showStudentModal(user? : Usuario): void {
    if(user) {
      this.addNewModalRef.show(user.uid);
    } else {
      this.notifications.create('Error', 'No se han podido cargar los registros del Ejercicio por el Alumno', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 6000,
        showProgressBar: false
      });

      return;
    }
  }

  // LIST PAGE HEADER METHODS
  pageChanged(event: any): void {
    this.loadExerciseStudents(this.exerciseId, this.itemsPerPage, event.page, this.itemSubject, this.userId, this.search);
  }

  itemsPerPageChange(perPage: number): void {
    this.loadExerciseStudents(this.exerciseId, perPage, 1, this.itemSubject, this.userId, this.search);
  }

  searchKeyUp(val: string): void {
    this.search = val;
    this.loadExerciseStudents(this.exerciseId, this.itemsPerPage, this.currentPage, this.itemSubject, this.userId, this.search);
  }

}
