import { Component, OnInit } from '@angular/core';
import { SenderService } from 'src/app/data/sender.service';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/shared/auth.service';
import { EjercicioService } from 'src/app/data/ejercicio.service';

@Component({
  selector: 'app-view-exercise',
  templateUrl: './view-exercise.component.html',
  styleUrls: ['./view-exercise.component.scss']
})
export class ViewExerciseComponent implements OnInit {

  displayMode = 'list';
  itemsPerPage = 10;
  currentPage = 1;
  selectAllState = '';
  totalItem = 0;
  isLoading: boolean;
  endOfTheList = false;

  userRole: number;
  userId: string;
  exerciseId: number;
  itemSubject = '';
  data: Usuario[] = [];
  

  constructor(private sender: SenderService, private auth: AuthService, private ejercicioService: EjercicioService) { }

  ngOnInit(): void {
    this.userRole = this.auth.rol;
    this.userId = this.auth.uid;
    this.itemSubject = this.sender.idSubject;
    this.exerciseId = this.sender.idExercise;

    this.loadExerciseStudents(this.exerciseId, this.itemsPerPage, this.currentPage, this.itemSubject, this.userId);
  }

  loadExerciseStudents(exerciseId: number, pageSize: number, currentPage: number, subject: string, userId: string): void {

    // console.log(this.userRole);
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.ejercicioService.getExerciseStudents(exerciseId, pageSize, currentPage, subject, userId).subscribe(
      data => {
        if (data['ok']) {
          // console.log(data);
          this.isLoading = false;
          this.data = data['alumnosEjercicio'];
          console.log(data['alumnosEjercicio']);

          this.totalItem = this.data.length;
          
        } else {
          this.endOfTheList = true;
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  showStudentModal(user? : Usuario): void {
    if(user) {
      console.log(user.uid);
      // this.addNewModalRef.show(subject.uid);
    } else {
      // this.addNewModalRef.show();
      console.log('NO HAY USUARIO');
    }
  }

  changeDisplayMode(mode): void {
    this.displayMode = mode;
  }

  selectAllChange($event): void {
    // if ($event.target.checked) {
    //   this.selected = [...this.data];
    // } else {
    //   this.selected = [];
    // }
    // this.setSelectAllState();
  }

  pageChanged(event: any): void {
    // this.loadExercises(this.itemsPerPage, event.page, this.itemSubject, this.userId);
  }

  itemsPerPageChange(perPage: number): void {
    // this.loadExercises(perPage, 1, this.itemSubject, this.userId);
  }

}
