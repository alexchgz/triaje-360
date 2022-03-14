import { Component,  ViewChild, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';
import { Curso } from '../../../models/curso.model';
import { CursoService } from 'src/app/data/curso.service';
import { Router } from '@angular/router';
import { AsignaturaService } from 'src/app/data/asignatura.service';
import { SenderService } from '../../../data/sender.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Location } from '@angular/common';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-list-page-header',
  templateUrl: './list-page-header.component.html'
})
export class ListPageHeaderComponent implements OnInit {
  displayOptionsCollapsed = false;
  userRole: number;
  userId: string;
  data: Curso[] = [];

  // FILTRO DE ASIGNATURAS POR CURSO
  itemOptionsYears: Curso[];
  // FILTRO DE USUARIOS POR ROLES
  itemOptionRoles = [
    { label: 'Cualquiera', value: '' },
    { label: 'Admin', value: 'ROL_ADMIN' },
    { label: 'Profesor', value: 'ROL_PROFESOR' },
    { label: 'Alumno', value: 'ROL_ALUMNO' }
  ];
  // FILTRO DE EJERCICIOS POR ASIGNATURA
  itemOptionsSubjects: Object[];
  component: string;

  @Input() subjectId: string;
  @Input() showSchoolYears = false;
  @Input() showRoles = false;
  @Input() showSubjects = false;
  @Input() showOrderBy = false;
  @Input() showSearch = true;
  @Input() showItemsPerPage = true;
  @Input() showDisplayMode = false;
  @Input() displayMode = 'list';
  @Input() selectAllState = '';
  @Input() itemsPerPage = 10;
  @Input() itemOptionsPerPage = [5, 10, 20];
  @Input() itemOrder = { label: 'Product Name', value: 'title' };
  @Input()  itemOptionsOrders = [
    { label: 'Product Name', value: 'title' },
    { label: 'Category', value: 'category' },
    { label: 'Status', value: 'status' }];
  @Input() itemYear = { nombrecorto: 'Todos', uid: 0 };
  @Input() itemRol = this.itemOptionRoles[0];
  @Input() itemSubject = { nombrecorto: 'Todas', uid: 0 };
  @Input() selected: Usuario[];

  @Output() changeDisplayMode: EventEmitter<string> = new EventEmitter<string>();
  @Output() addNewItem: EventEmitter<any> = new EventEmitter();
  @Output() selectAllChange: EventEmitter<any> = new EventEmitter();
  @Output() searchKeyUp: EventEmitter<any> = new EventEmitter();
  @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();
  @Output() schoolYearChange: EventEmitter<any> = new EventEmitter();
  @Output() rolChange: EventEmitter<any> = new EventEmitter();
  @Output() subjectChange: EventEmitter<any> = new EventEmitter();
  @Output() changeOrderBy: EventEmitter<any> = new EventEmitter();
  @Output() dropUsers: EventEmitter<any> = new EventEmitter();
  @Output() title='';
  @Output() titleBreadcrumb='';

  @ViewChild('search') search: any;
  constructor(private cursoService: CursoService, private asignaturaService: AsignaturaService, private router: Router, private sender: SenderService,
    private auth: AuthService, private location: Location, private notifications: NotificationsService) { }

  ngOnInit(): void {
    this.userRole = this.auth.rol;
    this.userId = this.auth.uid;
    this.getComponent();
  }

  getComponent(): void {
    let splitUrl = this.router.url.split("/", 6);
    
    if(splitUrl[splitUrl.length-2] == "subjects") {
      if(splitUrl[splitUrl.length-1] == 'data-list') {
        this.component = 'subjects';
        this.showSchoolYears = true;
        this.loadSchoolYears();
      } else {

        this.component = 'add-edit-exercise';
        if(this.sender.idExercise == undefined) {
          this.title = 'Añadir Ejercicio';
          this.titleBreadcrumb = 'Añadir Ejercicio';
        } else {
          this.title = 'Editar Ejercicio';
          this.titleBreadcrumb = 'Editar Ejercicio';
        }
      }
    }
    else if(splitUrl[splitUrl.length-2] == "users") {
      this.component = 'users';
      this.showRoles = true;
    }
    else if(splitUrl[splitUrl.length-2] == "exercises") {
      if(splitUrl[splitUrl.length-1] == 'data-list') {
        this.component = 'exercises';
        this.showSubjects = true;
        this.loadSchoolYears();
        this.loadSubjects();
      } else {
        this.component = 'view-exercises';
        this.title = 'Ver Alumnos Ejercicio';
        this.titleBreadcrumb = 'Ver Alumnos Ejercicio';
      }
    }
    else {
      this.component = 'school-years';
    }
  }

  loadSchoolYears(): void {

    this.cursoService.getSchoolYears().subscribe(
      data => {
        this.data = data['cursos'];
        this.itemOptionsYears = data['cursos'];
        this.getActiveSchoolYear();
      },
      error => {
        this.notifications.create('Error', 'No se han podido obtener los Cursos Académicos', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  loadSubjects(): void {

    this.asignaturaService.getSubjects(undefined, undefined, this.itemYear.uid, this.userId).subscribe(
      data => {
        if(data['asignaturas']) {
          this.data = data['asignaturas'];
          this.itemOptionsSubjects = data['asignaturas'];

          for(let i=0; i<this.itemOptionsSubjects.length; i++) {
            if(this.subjectId == this.itemOptionsSubjects[i]['uid']) {
              this.itemSubject.nombrecorto = this.itemOptionsSubjects[i]['nombrecorto'];
              this.itemSubject.uid = this.itemOptionsSubjects[i]['uid'];
            }
          }

          this.itemOptionsSubjects.unshift({ nombrecorto: 'Todas', uid: undefined });
        }
      },
      error => {
        this.notifications.create('Error', 'No se han podido obtener las Asignaturas', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  onSelectDisplayMode(mode: string): void {
    this.changeDisplayMode.emit(mode);
  }
  onAddNewItem(): void {
    if(this.component == 'exercises') {
      this.router.navigate(['app/dashboards/all/subjects/add-exercise']);
      this.sender.idSubject = undefined;
      this.sender.idSubjectExercise = undefined;
    } else {
      this.addNewItem.emit(null);
    }

  }
  selectAll(event): void  {
    this.selectAllChange.emit(event);
  }
  onChangeItemsPerPage(item): void  {
    this.itemsPerPageChange.emit(item);
  }

  onChangeSchoolYear(item): void {
    this.itemYear = item;
    this.schoolYearChange.emit(item);
  }

  onChangeRol(item): void {
    this.itemRol = item;
    this.rolChange.emit(item);
  }

  onChangeSubject(item): void {
    this.itemSubject = item;
    this.subjectChange.emit(item);
  }

  onChangeOrderBy(item): void  {
    this.itemOrder = item;
    this.changeOrderBy.emit(item);
  }

  onSearchKeyUp($event): void {
    this.searchKeyUp.emit($event);
  }

  onDropUsers(users: Usuario[]): void {
    this.dropUsers.emit(users);
  }

  getActiveSchoolYear(): void {
    var stop = false;
    for(let i=0; i<this.itemOptionsYears.length && !stop; i++) {
      if(this.itemOptionsYears[i].activo) {
        this.itemYear.nombrecorto = this.itemOptionsYears[i].nombrecorto;
        this.itemYear.uid = this.itemOptionsYears[i].uid;
        this.onChangeSchoolYear(this.itemYear);
        stop = true;
      }
    }

  }

  goBack(): void {
    if(this.sender.idSubject != undefined) {
      this.sender.idSubject = undefined;
    }
    this.location.back();
  }
}
