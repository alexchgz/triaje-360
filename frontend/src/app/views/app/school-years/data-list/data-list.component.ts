import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewSchoolYearModalComponent } from 'src/app/containers/pages/add-new-school-year-modal/add-new-school-year-modal.component';
import { Curso } from '../../../../models/curso.model';
import { CursoService } from 'src/app/data/curso.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { SenderService } from '../../../../data/sender.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss'],
})
export class DataListComponent implements OnInit {
  displayMode = 'list';
  selectAllState = '';
  selected: Curso[] = [];
  data: Curso[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  search = '';
  orderBy = '';
  totalItem = 0;
  totalPage = 0;
  itemYear = 0;

  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewSchoolYearModalComponent;

  constructor(private cursoService: CursoService, private notifications: NotificationsService,
    public sender: SenderService) {
  }

  ngOnInit(): void {
    this.sender.idSubject = undefined;
    this.sender.idSubjectExercise = undefined;
    this.sender.idExercise = undefined;
    this.loadSchoolYears(this.itemsPerPage, this.currentPage, this.itemYear, '');
  }

  loadSchoolYears(pageSize: number, currentPage: number, schoolYear: number, search?: string): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.cursoService.getSchoolYears(pageSize, currentPage, schoolYear, search).subscribe(
      data => {
        this.data = data['cursos'];
        this.totalItem = data['totalCursos'];
        this.setSelectAllState();
      },
      error => {
        this.notifications.create('Error', 'No se han podido cargar los Cursos Académicos', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });
      }
    );
  }

  showAddNewModal(schoolYear? : Curso): void {
    if(schoolYear) {
      console.log(schoolYear.uid);
      this.addNewModalRef.show(schoolYear.uid);
    } else {
      this.addNewModalRef.show();
    }
  }

  dropSchoolYears(years: Curso[]): void {
    
    for(let i=0; i<years.length; i++){
      this.cursoService.dropSchoolYear(years[i].uid).subscribe(
        data => {
          this.loadSchoolYears(this.itemsPerPage, this.currentPage, this.itemYear, this.search);

          this.notifications.create('Cursos Académicos eliminados', 'Se han eliminado los Cursos Académicos correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        },
        error => {

          this.notifications.create('Error', 'No se han podido eliminar los Cursos Académicos', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
        }
      );
    }
  }

  dropSchoolYear(year: Curso): void {

    this.cursoService.dropSchoolYear(year.uid).subscribe(
      data => {
        this.loadSchoolYears(this.itemsPerPage, this.currentPage, this.itemYear, this.search);

        this.notifications.create('Curso Académico eliminado', 'Se ha eliminado el Curso Académico correctamente', NotificationType.Info, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });
      },
      error => {

        this.notifications.create('Error', 'No se ha podido eliminar el Curso Académico', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  confirmDelete(curso: Curso): void {
    Swal.fire({
      title: 'Eliminar Curso',
      text: '¿Estás seguro de que quieres eliminar el Curso?',
      icon: 'warning',
      showDenyButton: true,
      iconColor: '#145388',
      confirmButtonColor: '#145388',
      denyButtonColor: '#145388',
      confirmButtonText: `Sí`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.dropSchoolYear(curso);
      } else if (result.isDenied) {
        Swal.close();
      }
    });
  }

  // LIST PAGE HEADER METHODS
  isSelected(p: Curso): boolean {
    return this.selected.findIndex(x => x.uid === p.uid) > -1;
  }
  onSelect(item: Curso): void {
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
    this.loadSchoolYears(this.itemsPerPage, event.page, this.itemYear, this.search);
  }

  itemsPerPageChange(perPage: number): void {
    this.loadSchoolYears(perPage, 1, this.itemYear, this.search);
  }

  searchKeyUp(val: string): void {
    this.search = val;
    this.loadSchoolYears(this.itemsPerPage, this.currentPage, this.itemYear, this.search);
  }

  // changeOrderBy(item: any): void {
  //   this.loadData(this.itemsPerPage, 1, this.search, item.value);
  // }

}
