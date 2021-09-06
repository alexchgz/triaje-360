import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/data/api.service';
import { IUser } from 'src/app/data/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataListComponent } from 'src/app/views/app/subjects/data-list/data-list.component';

@Component({
  selector: 'app-manage-subject-modal',
  templateUrl: './manage-subject-modal.component.html',
  styleUrls: ['./manage-subject-modal.component.scss']
})
export class ManageSubjectModalComponent implements OnInit{

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
  data: IUser[] = [];
  profesores: IUser[] = [];
  alumnos: IUser[] = [];
  isLoading: boolean;
  endOfTheList = false;


  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  show(id: number): void {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  getUsers(): void {
    this.apiService.getUsers().subscribe(
      data => {
        if (data.ok) {
          console.log(data.usuarios);
          this.isLoading = false;
          this.data = data.usuarios.map(x => {
            return {
              ...x,
              // img: x.img.replace('/img/', '/img/products/')
            };
          });
          this.sortRoles();
        } else {
          this.endOfTheList = true;
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  sortRoles(): void {
    for(let i=0; i<this.data.length; i++) {
      if(this.data[i].rol == 'ROL_PROFESOR') {
        this.profesores.push(this.data[i]);
      } else if (this.data[i].rol == 'ROL_ALUMNO') {
        this.alumnos.push(this.data[i]);
      }
    }
  }

}
