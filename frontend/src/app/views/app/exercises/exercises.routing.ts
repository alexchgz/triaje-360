import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExercisesComponent } from './exercises.component';
import { DataListComponent } from './data-list/data-list.component';
import { ThumbListComponent } from './thumb-list/thumb-list.component';
import { ImageListComponent } from './image-list/image-list.component';
import { DetailsComponent } from './details/details.component';
import { DetailsAltComponent } from './details-alt/details-alt.component';
import { AddExerciseComponent } from '../subjects/add-exercise/add-exercise.component';
import { ViewExerciseComponent } from './view-exercise/view-exercise.component';

const routes: Routes = [
  {
    path: '', component: ExercisesComponent,
    children: [
      { path: '', redirectTo: 'data-list', pathMatch: 'full' },
      { path: 'data-list', component: DataListComponent },
      { path: 'view-exercise', component: ViewExerciseComponent },
      { path: 'thumb-list', component: ThumbListComponent },
      { path: 'image-list', component: ImageListComponent },
      { path: 'details', component: DetailsComponent },
      { path: 'details-alt', component: DetailsAltComponent },
      { path: 'data-list/:uid', component: DataListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExercisesRoutingModule { }
