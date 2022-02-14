import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-exercise',
  templateUrl: './view-exercise.component.html',
  styleUrls: ['./view-exercise.component.scss']
})
export class ViewExerciseComponent implements OnInit {

  displayMode = 'list';
  itemsPerPage = 10;
  selectAllState = '';
  totalItem = 0;

  constructor() { }

  ngOnInit(): void {
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
