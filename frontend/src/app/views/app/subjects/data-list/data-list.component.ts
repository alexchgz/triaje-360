import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewSubjectModalComponent } from 'src/app/containers/pages/add-new-subject-modal/add-new-subject-modal.component';
import { ManageSubjectModalComponent } from 'src/app/containers/pages/manage-subject-modal/manage-subject-modal.component';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Subject } from 'rxjs';
import { Curso } from '../../../../models/curso.model';
import { Asignatura } from '../../../../models/asignatura.model';
import { AsignaturaService } from 'src/app/data/asignatura.service';
import { getUserRole } from 'src/app/utils/util';
import { Router } from '@angular/router';
import { SenderService } from '../../../../data/sender.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
// import {JwtHelperService} from '@auth0/angular-jwt';

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
  isLoading: boolean;
  endOfTheList = false;
  totalItem = 0;
  totalPage = 0;
  itemYear = 0;
  userRole: number;
  userId: string;

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewSubjectModalComponent;
  @ViewChild('manageModalRef', { static: true }) manageModalRef: ManageSubjectModalComponent;

  constructor(private hotkeysService: HotkeysService, private asignaturaService: AsignaturaService, private router: Router, private sender: SenderService,
     private notifications: NotificationsService) {
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

    // if (this.jwtHelper.isTokenExpired(localStorage.getItem('token'))) {
    //   // token expired
    //   this.router.navigate['/user/login'];
    // }

    this.userRole = getUserRole();
    this.userId = localStorage.getItem('uid');
    // this.userId = this.sender.idUser;
    // console.log(this.userId);
    this.loadSubjects(this.itemsPerPage, this.currentPage, this.itemYear, this.userId);

    // reseteamos datos ID del servicio
    this.sender.idSubjectExercise = undefined;
    this.sender.idExercise = undefined;
  }

  loadSubjects(pageSize: number, currentPage: number, schoolYear: number, userId:string): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.asignaturaService.getSubjects(pageSize, currentPage, schoolYear, userId).subscribe(
      data => {
        if (data['ok']) {
          // console.log(data);
          this.isLoading = false;
          this.data = data['asignaturas'].map(x => {
            return {
              ...x,
              // img: x.img.replace('/img/', '/img/products/')
            };
          });
          // console.log(data.totalUsuarios);
          this.totalItem = data['totalAsignaturas'];
          //console.log(this.totalItem);
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

  showManageModal(subject: Asignatura): void {
    this.manageModalRef.show(subject.uid);
 }
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
    //console.log(year.uid);
    this.itemYear = year.uid;
    this.loadSubjects(this.itemsPerPage, this.currentPage, this.itemYear, this.userId);
  }

  dropSubjects(subjects: Asignatura[]): void {
    //console.log(users);
    for(let i=0; i<subjects.length; i++){
      this.asignaturaService.dropSubject(subjects[i].uid).subscribe(
        data => {
          this.loadSubjects(this.itemsPerPage, this.currentPage, this.itemYear, this.userId);

          this.notifications.create('Asiganturas eliminadas', 'Se han eliminado las Asignaturas', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        },
        error => {
          this.isLoading = false;

          this.notifications.create('Error', 'No se han podido eliminar las Asiganturas', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });
        }
      );
    }
  }

  dropSubject(subject: Asignatura): void {
    // console.log(subject);
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

          this.isLoading = false;
        }
      );

  }

  toExercises(uid: string): void {

    this.sender.idSubject = uid;
    // console.log(this.sender.idSubject);
    // this.router.navigate(['/app/dashboards/all/exercises/data-list/'], { state: { data: uid } });
    this.router.navigate(['/app/dashboards/all/exercises/data-list/']);
  }

  toCreateExercise(uid: string): void {
    this.sender.idSubject = uid;
    this.router.navigate(['/app/dashboards/all/subjects/add-exercise']);
  }

  // addExercise(subject: Asignatura) {
  //   localStorage.setItem('asignatura', subject.uid.toString());
  //   this.router.navigate(['app/dashboards/all/exercises/'])
  // }

  // changeOrderBy(item: any): void {
  //   this.loadData(this.itemsPerPage, 1, this.search, item.value);
  // }

  // searchKeyUp(event): void {
  //   const val = event.target.value.toLowerCase().trim();
  //   this.loadData(this.itemsPerPage, 1, val, this.orderBy);
  // }

  // onContextMenuClick(action: string, item: IProduct): void {
  //   console.log('onContextMenuClick -> action :  ', action, ', item.title :', item.title);
  // }
}
