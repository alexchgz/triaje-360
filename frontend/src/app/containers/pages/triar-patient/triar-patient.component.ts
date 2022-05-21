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
    ignoreBackdropClick: true,
  };
  urlPrefixPacientes: string = environment.prefix_urlPacientes;
  paciente: Paciente;
  colours = ["Verde", "Amarillo", "Rojo", "Negro"];
  pacienteTriado: any = {
    "color": '',
    "accion": undefined
  }
  actions: Accion[] = [];
  actionsTaken: Accion[] = [];
  eventColor = {
    "paciente": undefined,
    "color": ''
  }
  eventVolver = {
    "nombre": undefined,
    "tiempo": undefined
  }

  colorSeleccionado: string = '';
  @Output() enviarColor = new EventEmitter<Object>();
  @Output() realizarAccion = new EventEmitter<Object>();
  @Output() volverEscena = new EventEmitter();
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

  setColorSeleccionado(): void {
    switch(this.colorSeleccionado) {
      case 'Verde':
        this.pacienteTriado.color = this.colours[0];
        break;
      case 'Amarillo':
        this.pacienteTriado.color = this.colours[1];
        break;
      case 'Rojo':
        this.pacienteTriado.color = this.colours[2];
        break;
      case 'Negro':
        this.pacienteTriado.color = this.colours[3];
        break;
      default:
        this.pacienteTriado.color = '';
        break;
    }
  }

  asignarColor(e) {
    this.eventColor.paciente = this.paciente;
    this.eventColor.color = e;
    this.pacienteTriado.color = '';
    this.enviarColor.emit(this.eventColor); 
  }

  realizarAccionPaciente() {
    let send = {
      "paciente": this.paciente,
      "accion": this.pacienteTriado.accion
    }
    this.realizarAccion.emit(send); 
    this.pacienteTriado.accion = undefined;
  }

  show(p: Paciente, c: string, a: Accion[]) {
    this.actionsTaken = a; 
    this.colorSeleccionado = c;
    this.setColorSeleccionado();
    
    this.paciente = p;
    this.modalRef = this.modalService.show(this.template, Object.assign({}, { class: 'gray modal-lg' }));
  }  

  closeModal(): void {  
    this.volverEscena.emit(); 
    this.modalRef.hide();
  }

}
