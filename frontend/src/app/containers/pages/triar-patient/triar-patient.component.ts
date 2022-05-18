import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AccionService } from 'src/app/data/accion.service';
import { Accion } from 'src/app/models/accion.model';
import { Paciente } from 'src/app/models/paciente.model';
import { environment } from 'src/environments/environment';

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
  urlPrefixPacientes: string = environment.prefix_urlPacientes;
  paciente: Paciente;
  colours = ["Verde", "Amarillo", "Rojo", "Negro"];
  pacienteTriado: any = {
    "color": '',
    "acciones": []
  }
  actions: Accion[] = [];

  @Output() enviarColor = new EventEmitter<String>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private accionService: AccionService, private notifications: NotificationsService) { }

  ngOnInit(): void {
    this.getActions();
  }

  getActions(): void {
    this.accionService.getActions().subscribe(
      data => {
        if (data['ok']) {
          this.actions = data['acciones'];
        }
      },
      error => {
        this.notifications.create('Error', 'No se han podido obtener las Acciones', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  asignarColor(e) {
    this.enviarColor.emit(e); 
  }

  show(p: Paciente) {
    console.log('entro a triar a: ', p);
    this.paciente = p;
    this.modalRef = this.modalService.show(this.template, this.config);
  }  

  closeModal(): void {      
    this.modalRef.hide();
  }

}
