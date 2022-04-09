import { Component, OnInit, Output, Input} from '@angular/core';
import { Asignatura } from 'src/app/models/asignatura.model';
import { AddExerciseComponent } from 'src/app/views/app/subjects/add-exercise/add-exercise.component';

@Component({
  selector: 'app-wizard-end-step',
  templateUrl: './wizard-end-step.component.html'
})
export class WizardEndStepComponent implements OnInit {

  subject: Asignatura;

  constructor(private addExComponent: AddExerciseComponent) { }
  
  ngOnInit(): void {
    console.log('1:', this.subject);
  }



}
