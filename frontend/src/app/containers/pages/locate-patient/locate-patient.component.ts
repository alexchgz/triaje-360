import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { SenderService } from 'src/app/data/sender.service';
import { ImagenPacienteService } from 'src/app/data/imagenPaciente.service';
import { ImagenPaciente } from 'src/app/models/imagenPaciente.model';
import { Paciente } from 'src/app/models/paciente.model';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-locate-patient',
  templateUrl: './locate-patient.component.html',
  styleUrls: ['./locate-patient.component.scss']
})
export class LocatePatientComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  userRole: number;
  ejercicio: number;
  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente;
  imagen: number;
  x: number;
  y: number;
  urlPrefixPacientes: string = environment.prefix_urlPacientes;

  @Output() seleccionarPaciente = new EventEmitter<string>();
  @Output() resetParentImg = new EventEmitter();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private auth: AuthService, private sender: SenderService,
    private imagenPacienteService: ImagenPacienteService, private notifications: NotificationsService) { }

  ngOnInit(): void {
    this.userRole = this.auth.rol;
    this.ejercicio = this.sender.idExercise;
  }

  selectPatient(p: Paciente, pos: number) {
    if(this.pacienteSeleccionado != undefined && p!= this.pacienteSeleccionado) {
      var unSelect = document.querySelector('[src="' + this.urlPrefixPacientes + this.pacienteSeleccionado.img +'"]');
      unSelect.parentElement.className = 'noSelected';
    }
  
    if(p != this.pacienteSeleccionado) {
      // var element = document.querySelector('img[src="' + this.urlPrefixPacientes + p.img +'"]');
      var ident = 'paciente' + pos;
      console.log(ident);
      var element = document.getElementById(ident);
      element.parentElement.className = 'selected';
      this.pacienteSeleccionado = p;
    }
    // this.pacienteSeleccionado = p;
    console.log(this.pacienteSeleccionado);
  }

  show(pacientes: Paciente[], ejercicio: number, imagen:number, x: number, y: number) {
    this.pacientes = pacientes;
    this.ejercicio = ejercicio;
    this.imagen = imagen;
    this.x = x;
    this.y = y;
    this.modalRef = this.modalService.show(this.template, this.config);
  }  

  closeModal(): void {
    if(this.pacienteSeleccionado) {
      this.seleccionarPaciente.emit(this.pacienteSeleccionado.img); 
      this.pacienteSeleccionado = undefined;
    }
      
    this.modalRef.hide();
  }

}
