import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SenderService } from 'src/app/data/sender.service';
import { EjerciciosUsuario } from 'src/app/models/ejerciciosUsuario.model';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-show-student-register-modal',
  templateUrl: './show-student-register-modal.component.html',
  styleUrls: ['./show-student-register-modal.component.scss']
})
export class ShowStudentRegisterModalComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  userRole: number;
  ejercicio: number;
  alumno: number;
  data: EjerciciosUsuario[] = [];

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private auth: AuthService, private sender: SenderService) { }

  ngOnInit(): void {
    this.userRole = this.auth.rol;
  }

  show(id: number): void {

    this.alumno = id;
    this.modalRef = this.modalService.show(this.template, this.config);

  }

  closeModal(): void {
    this.modalRef.hide();
  }

}
