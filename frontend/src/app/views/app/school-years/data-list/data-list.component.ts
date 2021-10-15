import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewSchoolYearModalComponent } from 'src/app/containers/pages/add-new-school-year-modal/add-new-school-year-modal.component';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Curso } from '../../../../models/curso.model';
import { CursoService } from 'src/app/data/curso.service';

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
  itemsPerPage = 2;
  search = '';
  orderBy = '';
  isLoading: boolean;
  endOfTheList = false;
  totalItem = 0;
  totalPage = 0;
  itemYear = 0;

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewSchoolYearModalComponent;

  constructor(private hotkeysService: HotkeysService, private cursoService: CursoService) {
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
    this.loadSchoolYears(this.itemsPerPage, this.currentPage, this.itemYear);
  }

  loadSchoolYears(pageSize: number, currentPage: number, schoolYear: number): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.cursoService.getSchoolYears(pageSize, currentPage, schoolYear).subscribe(
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
          // console.log(data.totalUsuarios);
          this.totalItem = data['totalCursos'];
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

  showAddNewModal(schoolYear? : Curso): void {
    if(schoolYear) {
      console.log(schoolYear.uid);
      this.addNewModalRef.show(schoolYear.uid);
    } else {
      this.addNewModalRef.show();
    }
  }

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
    this.loadSchoolYears(this.itemsPerPage, event.page, this.itemYear);
  }

  itemsPerPageChange(perPage: number): void {
    this.loadSchoolYears(perPage, 1, this.itemYear);
  }

  dropSchoolYears(years: Curso[]): void {
    //console.log(users);
    for(let i=0; i<years.length; i++){
      this.cursoService.dropSchoolYear(years[i].uid).subscribe(
        data => {
          this.loadSchoolYears(this.itemsPerPage, this.currentPage, this.itemYear);
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }

  dropSchoolYear(year: Curso): void {
    console.log(year);
      this.cursoService.dropSchoolYear(year.uid).subscribe(
        data => {
          this.loadSchoolYears(this.itemsPerPage, this.currentPage, this.itemYear);
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
