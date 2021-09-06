import { Component, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/data/api.service';
import { IUser } from 'src/app/data/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataListComponent } from 'src/app/views/app/subjects/data-list/data-list.component';
import { SubjectDetailsTabsComponent } from '../subject-details-tabs/subject-details-tabs.component';

@Component({
  selector: 'app-manage-subject-modal',
  templateUrl: './manage-subject-modal.component.html',
  styleUrls: ['./manage-subject-modal.component.scss']
})
export class ManageSubjectModalComponent {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  categories = [
    { label: 'Cakes', value: 'chocolate' },
    { label: 'Cupcakes', value: 'vanilla' },
    { label: 'Desserts', value: 'strawberry' }
  ];


  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService) { }

  show(id: number): void {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

}
