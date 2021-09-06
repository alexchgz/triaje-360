import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewSubjectModalComponent } from 'src/app/containers/pages/add-new-subject-modal/add-new-subject-modal.component';
import { ManageSubjectModalComponent } from 'src/app/containers/pages/manage-subject-modal/manage-subject-modal.component';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ApiService } from 'src/app/data/api.service';
import { ISchoolYear } from 'src/app/data/api.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { ISubject } from '../../../../data/api.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html'
})
export class DataListComponent implements OnInit {
  displayMode = 'list';
  selectAllState = '';
  selected: ISubject[] = [];
  data: ISubject[] = [];
  currentPage = 1;
  itemsPerPage = 2;
  search = '';
  orderBy = '';
  isLoading: boolean;
  endOfTheList = false;
  totalItem = 0;
  totalPage = 0;
  itemYear = 0;

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewSubjectModalComponent;
  @ViewChild('manageModalRef', { static: true }) manageModalRef: ManageSubjectModalComponent;

  constructor(private hotkeysService: HotkeysService, private apiService: ApiService) {
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
    this.loadSubjects(this.itemsPerPage, this.currentPage, this.itemYear);
  }

  loadSubjects(pageSize: number, currentPage: number, schoolYear: number): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.apiService.getSubjects(pageSize, currentPage, schoolYear).subscribe(
      data => {
        if (data.ok) {
          // console.log(data.asignaturas);
          this.isLoading = false;
          this.data = data.asignaturas.map(x => {
            return {
              ...x,
              // img: x.img.replace('/img/', '/img/products/')
            };
          });
          // console.log(data.totalUsuarios);
          this.totalItem = data.totalAsignaturas;
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

  showAddNewModal(subject? : ISubject): void {
    if(subject) {
      // console.log(subject.uid);
      this.addNewModalRef.show(subject.uid);
    } else {
      this.addNewModalRef.show();
    }
  }

  showManageModal(subject: ISubject): void {
    this.manageModalRef.show(subject.uid);
 }
  isSelected(p: ISubject): boolean {
    return this.selected.findIndex(x => x.uid === p.uid) > -1;
  }
  onSelect(item: ISubject): void {
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
    this.loadSubjects(this.itemsPerPage, event.page, this.itemYear);
  }

  itemsPerPageChange(perPage: number): void {
    this.loadSubjects(perPage, 1, this.itemYear);
  }

  schoolYearChange(year: ISchoolYear): void {
    //console.log(year.uid);
    this.itemYear = year.uid;
    this.loadSubjects(this.itemsPerPage, this.currentPage, this.itemYear);
  }

  dropSubjects(subjects: ISubject[]): void {
    //console.log(users);
    for(let i=0; i<subjects.length; i++){
      this.apiService.dropSubject(subjects[i].uid).subscribe(
        data => {
          this.loadSubjects(this.itemsPerPage, this.currentPage, this.itemYear);
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }

  dropSubject(subject: ISubject): void {
    // console.log(subject);
      this.apiService.dropSubject(subject.uid).subscribe(
        data => {
          this.loadSubjects(this.itemsPerPage, this.currentPage, this.itemYear);
        },
        error => {
          this.isLoading = false;
        }
      );

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
