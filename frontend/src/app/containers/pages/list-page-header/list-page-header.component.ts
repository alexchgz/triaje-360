import { Component,  ViewChild, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';
import { Curso } from '../../../models/curso.model';
import { CursoService } from 'src/app/data/curso.service';
import { Router } from '@angular/router';
import { UserRole } from '../../../shared/auth.roles';
import { getUserRole } from 'src/app/utils/util';
import { Asignatura } from '../../../models/asignatura.model';
import { AsignaturaService } from 'src/app/data/asignatura.service';
import { Profesor } from '../../../models/profesor.model';
import { SenderService } from '../../../data/sender.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-list-page-header',
  templateUrl: './list-page-header.component.html'
})
export class ListPageHeaderComponent implements OnInit {
  displayOptionsCollapsed = false;
  userRole: number;
  userId: string;
  data: Curso[] = [];
  isLoading: boolean;
  endOfTheList = false;
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
  // itemOptionsSubjects: Asignatura[];
  itemOptionsSubjects: Object[];
  component: string;

  @Input() subjectId: string;
  @Input() showSchoolYears = false;
  @Input() showRoles = false;
  @Input() showSubjects = false;
  @Input() showOrderBy = true;
  @Input() showSearch = true;
  @Input() showItemsPerPage = true;
  @Input() showDisplayMode = true;
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

  @ViewChild('search') search: any;
  constructor(private cursoService: CursoService, private asignaturaService: AsignaturaService, private router: Router, private sender: SenderService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.userRole = getUserRole();
    // this.userId = localStorage.getItem('uid');
    this.userId = this.auth.uid;
    // this.userId = this.sender.idUser;
    // console.log(this.userId);
    this.getComponent();
    // console.log(this.itemOptionRoles);
    console.log(this.itemSubject);
  }

  getComponent(): void {
    let splitUrl = this.router.url.split("/", 5);
    // console.log(splitUrl);
    if(splitUrl[splitUrl.length-1] == "subjects") {
      this.component = 'subjects';
      this.showSchoolYears = true;
      this.loadSchoolYears();
    }
    else if(splitUrl[splitUrl.length-1] == "users") {
      this.component = 'users';
      this.showRoles = true;
    }
    else if(splitUrl[splitUrl.length-1] == "exercises") {
      this.component = 'exercises';
      this.showSubjects = true;
      this.loadSchoolYears();
      this.loadSubjects();
    }
  }

  loadSchoolYears(): void {

    this.cursoService.getSchoolYears().subscribe(
      data => {
        if (data['ok']) {
          //console.log(data.usuarios);
          this.isLoading = false;
          this.data = data['cursos'].map(x => {
            return {
              ...x,
              // img: x.img.replace('/img/', '/img/products/')
            };
          });
          this.itemOptionsYears = data['cursos'];
          this.getActiveSchoolYear();
          // this.itemOptionsYears.unshift({ nombrecorto: 'All', uid: 0, nombre: 'All', activo: false});
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

  loadSubjects(): void {

    this.asignaturaService.getSubjects(undefined, undefined, this.itemYear.uid, this.userId).subscribe(
      data => {
        if (data['ok']) {
          // console.log(data);
          this.isLoading = false;
          if(data['asignaturas']) {
            this.data = data['asignaturas'];
            this.itemOptionsSubjects = data['asignaturas'];

            // let splitUrl2 = this.router.url.split("/");
            // console.log(splitUrl2);
            // for(let i=0; i<this.itemOptionsSubjects.length; i++) {
            //   if(splitUrl2[splitUrl2.length-1] == this.itemOptionsSubjects[i]['uid']) {
            //     this.itemSubject.nombrecorto = this.itemOptionsSubjects[i]['nombrecorto'];
            //     this.itemSubject.uid = this.itemOptionsSubjects[i]['uid'];
            //     // console.log(this.itemSubject);
            //   }
            // }

            for(let i=0; i<this.itemOptionsSubjects.length; i++) {
              if(this.subjectId == this.itemOptionsSubjects[i]['uid']) {
                this.itemSubject.nombrecorto = this.itemOptionsSubjects[i]['nombrecorto'];
                this.itemSubject.uid = this.itemOptionsSubjects[i]['uid'];
                // console.log(this.itemSubject);
              }
            }

            this.itemOptionsSubjects.unshift({ nombrecorto: 'Todas', uid: 0 });
          }

          // this.getActiveSchoolYear();

        } else {
          this.endOfTheList = true;
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  onSelectDisplayMode(mode: string): void {
    this.changeDisplayMode.emit(mode);
  }
  onAddNewItem(): void {
    if(this.component == 'exercises') {
      this.router.navigate(['app/dashboards/all/subjects/add-exercise']);
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
    //console.log(this.itemYear);
    this.schoolYearChange.emit(item);
  }

  onChangeRol(item): void {
    this.itemRol = item;
    //console.log(this.itemYear);
    this.rolChange.emit(item);
  }

  onChangeSubject(item): void {
    this.itemSubject = item;
    //console.log(this.itemYear);
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
    //console.log(users);
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
}
