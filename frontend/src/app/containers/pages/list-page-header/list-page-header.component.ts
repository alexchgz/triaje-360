import { Component,  ViewChild, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';
import { Curso } from '../../../models/curso.model';
import { CursoService } from 'src/app/data/curso.service';
import { Router } from '@angular/router';
import { UserRole } from '../../../shared/auth.roles';
import { getUserRole } from 'src/app/utils/util';

@Component({
  selector: 'app-list-page-header',
  templateUrl: './list-page-header.component.html'
})
export class ListPageHeaderComponent implements OnInit {
  displayOptionsCollapsed = false;
  userRole: number;
  data: Curso[] = [];
  isLoading: boolean;
  endOfTheList = false;
  itemOptionsYears: Curso[];
  itemOptionRoles = [
    { label: 'Cualquiera', value: '' },
    { label: 'Admin', value: 'ROL_ADMIN' },
    { label: 'Profesor', value: 'ROL_PROFESOR' },
    { label: 'Alumno', value: 'ROL_ALUMNO' }
  ];

  @Input() showSchoolYears = false;
  @Input() showRoles = false;
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
  @Input() itemYear = { nombrecorto: 'All', uid: 0 };
  @Input() itemRol = this.itemOptionRoles[0];
  @Input() selected: Usuario[];

  @Output() changeDisplayMode: EventEmitter<string> = new EventEmitter<string>();
  @Output() addNewItem: EventEmitter<any> = new EventEmitter();
  @Output() selectAllChange: EventEmitter<any> = new EventEmitter();
  @Output() searchKeyUp: EventEmitter<any> = new EventEmitter();
  @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();
  @Output() schoolYearChange: EventEmitter<any> = new EventEmitter();
  @Output() rolChange: EventEmitter<any> = new EventEmitter();
  @Output() changeOrderBy: EventEmitter<any> = new EventEmitter();
  @Output() dropUsers: EventEmitter<any> = new EventEmitter();

  @ViewChild('search') search: any;
  constructor(private cursoService: CursoService, private router: Router) { }

  ngOnInit(): void {
    this.userRole = getUserRole();
    this.getComponent();
    console.log(this.itemOptionRoles);
  }

  getComponent(): void {
    let splitUrl = this.router.url.split("/", 5);
    console.log(splitUrl);
    if(splitUrl[splitUrl.length-1] == "subjects") {
      this.showSchoolYears = true;
      this.loadSchoolYears();
    }
    else if(splitUrl[splitUrl.length-1] == "users") {
      this.showRoles = true;
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

  onSelectDisplayMode(mode: string): void {
    this.changeDisplayMode.emit(mode);
  }
  onAddNewItem(): void {
    this.addNewItem.emit(null);
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
