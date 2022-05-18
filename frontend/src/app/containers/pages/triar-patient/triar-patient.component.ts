import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-triar-patient',
  templateUrl: './triar-patient.component.html',
  styleUrls: ['./triar-patient.component.scss']
})
export class TriarPatientComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
  }

  show() {
    console.log('entro a triar');
    this.modalRef = this.modalService.show(this.template, this.config);
  }  

  closeModal(): void {      
    this.modalRef.hide();
  }

}
