import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewExerciseModalComponent } from 'src/app/containers/pages/add-new-exercise-modal/add-new-exercise-modal.component';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Ejercicio } from '../../../../models/ejercicio.model';
import { EjercicioService } from 'src/app/data/ejercicio.service';
import { Asignatura } from '../../../../models/asignatura.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  providers: [DatePipe]
})
export class DataListComponent implements OnInit {
  displayMode = 'list';
  selectAllState = '';
  selected: Ejercicio[] = [];
  data: Ejercicio[] = [];
  currentPage = 1;
  itemsPerPage = 2;
  search = '';
  orderBy = '';
  isLoading: boolean;
  endOfTheList = false;
  totalItem = 0;
  totalPage = 0;
  itemSubject = 0;

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewExerciseModalComponent;

  constructor(private hotkeysService: HotkeysService, private ejercicioService: EjercicioService, private datePipe: DatePipe) {
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
    this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject);
  }

  loadExercises(pageSize: number, currentPage: number, subject: number): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.ejercicioService.getExercises(pageSize, currentPage, subject).subscribe(
      data => {
        if (data['ok']) {
          console.log(data['ejercicios']);
          this.isLoading = false;
          this.data = data['ejercicios'];
          this.changeDateFormat();
          // console.log(data.totalUsuarios);
          this.totalItem = data['totalEjercicios'];
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
    this.loadExercises(this.itemsPerPage, event.page, this.itemSubject);
  }

  itemsPerPageChange(perPage: number): void {
    this.loadExercises(perPage, 1, this.itemSubject);
  }

  subjectChange(subject: Asignatura): void {
    //console.log(year.uid);
    this.itemSubject = subject.uid;
    console.log(this.itemSubject);
    this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject);
  }

  dropExercises(exercises: Ejercicio[]): void {
    //console.log(users);
    for(let i=0; i<exercises.length; i++){
      this.ejercicioService.dropExercise(exercises[i].uid).subscribe(
        data => {
          this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject);
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }

  dropExercise(exercise: Ejercicio): void {
    console.log(exercise);
      this.ejercicioService.dropExercise(exercise.uid).subscribe(
        data => {
          this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject);
        },
        error => {
          this.isLoading = false;
        }
      );

  }

  changeDateFormat(): void {
    for(let i = 0; i < this.data.length; i++) {
      this.data[i].desde = this.datePipe.transform(this.data[i].desde, 'dd/MM/yyyy');
      this.data[i].hasta = this.datePipe.transform(this.data[i].hasta, 'dd/MM/yyyy');
    }

  }

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
