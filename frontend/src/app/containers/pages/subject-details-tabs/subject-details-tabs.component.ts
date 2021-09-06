import { Component, OnInit } from '@angular/core';
import commentData, { IComment } from 'src/app/data/comments';
import questionData, { IQuestion } from 'src/app/data/questions';
import { ApiService } from 'src/app/data/api.service';
import { IUser } from 'src/app/data/api.service';

@Component({
  selector: 'app-subject-details-tabs',
  templateUrl: './subject-details-tabs.component.html',
  styleUrls: ['./subject-details-tabs.component.scss']
})
export class SubjectDetailsTabsComponent implements OnInit {
  comments: IComment[] = commentData;
  questions: IQuestion[] = questionData;
  profesores: IUser[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // this.getTeachers();
  }

}
