import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SenderService {

  public idSubject: string;
  public idSubjectExercise: number;
  public idExercise: number;
  public idUser: string;
  public showMsgAddEx = false;
  public showMsgEditEx = false;

  constructor() { }
}
