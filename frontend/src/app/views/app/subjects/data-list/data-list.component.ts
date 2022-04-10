import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewSubjectModalComponent } from 'src/app/containers/pages/add-new-subject-modal/add-new-subject-modal.component';
import { ManageSubjectModalComponent } from 'src/app/containers/pages/manage-subject-modal/manage-subject-modal.component';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Curso } from '../../../../models/curso.model';
import { Asignatura } from '../../../../models/asignatura.model';
import { AsignaturaService } from 'src/app/data/asignatura.service';
import { Router } from '@angular/router';
import { SenderService } from '../../../../data/sender.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { AuthService } from 'src/app/shared/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss'],
})
export class DataListComponent implements OnInit {
  displayMode = 'list';
  selectAllState = '';
  selected: Asignatura[] = [];
  data: Asignatura[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  search = '';
  orderBy = '';
  totalItem = 0;
  totalPage = 0;
  itemYear = 0;
  userRole: number;
  userId: string;

  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewSubjectModalComponent;
  @ViewChild('manageModalRef', { static: true }) manageModalRef: ManageSubjectModalComponent;

  constructor(private asignaturaService: AsignaturaService, private router: Router, private sender: SenderService,
     private notifications: NotificationsService, private auth: AuthService) {}

  ngOnInit(): void {

    this.userRole = this.auth.rol;
    this.userId = this.auth.uid;
    // reseteamos datos ID del servicio
    this.sender.idSubject = undefined;
    this.sender.idSubjectExercise = undefined;
    this.sender.idExercise = undefined;

    this.loadSubjects(this.itemsPerPage, this.currentPage, this.itemYear, this.userId);
  }

  loadSubjects(pageSize: number, currentPage: number, schoolYear: number, userId:string): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.asignaturaService.getSubjects(pageSize, currentPage, schoolYear, userId).subscribe(
      data => {
        if (data['ok']) {
          this.data = data['asignaturas'];
          this.totalItem = data['totalAsignaturas'];
          this.setSelectAllState();
        }
      },
      error => {
        this.notifications.create('Error', 'No se han podido cargar las Asiganturas', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });
      }
    );

  }

  dropSubjects(subjects: Asignatura[]): void {
    for(let i=0; i<subjects.length; i++){
      this.asignaturaService.dropSubject(subjects[i].uid).subscribe(
        data => {
          this.loadSubjects(this.itemsPerPage, this.currentPage, this.itemYear, this.userId);

          this.notifications.create('Asignaturas eliminadas', 'Se han eliminado las Asignaturas', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        },
        error => {
          this.notifications.create('Error', 'No se han podido eliminar las Asiganturas', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
        }
      );
    }
  }

  dropSubject(subject: Asignatura): void {
      this.asignaturaService.dropSubject(subject.uid).subscribe(
        data => {
          this.loadSubjects(this.itemsPerPage, this.currentPage, this.itemYear, this.userId);

          this.notifications.create('Asignatura eliminada', 'Se ha eliminado la Asignatura correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        },
        error => {

          this.notifications.create('Error', 'No se ha podido eliminar la Asignatura', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
        }
      );

  }

  toExercises(uid: string): void {
    this.sender.idSubject = uid;
    this.router.navigate(['/app/dashboards/all/exercises/data-list/']);
  }

  toCreateExercise(uid: string): void {
    this.sender.idSubject = uid;
    this.router.navigate(['/app/dashboards/all/subjects/add-exercise']);
  }

  confirmDelete(asignatura: Asignatura): void {
    Swal.fire({
      title: 'Eliminar Asignatura',
      text: '¿Estás seguro de que quieres eliminar la Asignatura?',
      icon: 'warning',
      showDenyButton: true,
      iconColor: '#145388',
      confirmButtonColor: '#145388',
      denyButtonColor: '#145388',
      confirmButtonText: `Sí`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.dropSubject(asignatura);
      } else if (result.isDenied) {
        Swal.close();
      }
    });
  }

  // MODAL METHODS
  showAddNewModal(subject? : Asignatura): void {
    if(subject) {
      this.addNewModalRef.show(subject.uid);
    } else {
      this.addNewModalRef.show();
    }
  }

  showManageModal(subject: Asignatura): void {
    this.manageModalRef.show(subject.uid);
  }

  // LIST PAGE HEADER METHODS
  isSelected(p: Asignatura): boolean {
    return this.selected.findIndex(x => x.uid === p.uid) > -1;
  }

  onSelect(item: Asignatura): void {
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
    this.loadSubjects(this.itemsPerPage, event.page, this.itemYear, this.userId);
  }

  itemsPerPageChange(perPage: number): void {
    this.loadSubjects(perPage, 1, this.itemYear, this.userId);
  }

  schoolYearChange(year: Curso): void {
    this.itemYear = year.uid;
    this.loadSubjects(this.itemsPerPage, this.currentPage, this.itemYear, this.userId);
  }

  // changeOrderBy(item: any): void {
  //   this.loadData(this.itemsPerPage, 1, this.search, item.value);
  // }
  
}
