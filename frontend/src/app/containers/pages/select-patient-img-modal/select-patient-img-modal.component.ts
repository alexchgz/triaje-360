import { Component, OnInit, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { SenderService } from 'src/app/data/sender.service';
import { ImagenPacienteService } from 'src/app/data/imagenPaciente.service';
import { ImagenPaciente } from 'src/app/models/imagenPaciente.model';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-patient-img-modal',
  templateUrl: './select-patient-img-modal.component.html',
  styleUrls: ['./select-patient-img-modal.component.scss']
})
export class SelectPatientImgModalComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  userRole: number;
  ejercicio: number;
  imagenes: ImagenPaciente[] = [];
  imagenSeleccionada: String;
  urlPrefixPacientes: string = environment.prefix_urlPacientes;

  @Output() seleccionarImg = new EventEmitter<String>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private auth: AuthService, private sender: SenderService,
    private imagenPacienteService: ImagenPacienteService, private notifications: NotificationsService) { }

  ngOnInit(): void {
    this.userRole = this.auth.rol;
    this.ejercicio = this.sender.idExercise;
    this.getImagesPaciente();
  }

  getImagesPaciente(): void {
    this.imagenPacienteService.getImagesPaciente().subscribe(
      data => {
        if (data['ok']) {
          this.imagenes = data['imagenesPaciente'];
          console.log(this.imagenes);
        }
      },
      error => {
        this.notifications.create('Error', 'No se han podido obtener las Imagenes de Paciente', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  selectImg(img: ImagenPaciente) {
  
    if(this.imagenSeleccionada != undefined) {
      var unSelect = document.querySelector('[src="' + this.urlPrefixPacientes + this.imagenSeleccionada +'"]');
      unSelect.parentElement.className = 'noSelected';
    }
  
    var element = document.querySelector('[src="' + this.urlPrefixPacientes + img.ruta +'"]');
    console.log(element);
    element.parentElement.className = 'selected';
    this.imagenSeleccionada = img.ruta;
    // this.seleccionarImg.emit(this.imagenSeleccionada);  
  }

  show() {
    console.log(this.imagenSeleccionada);
    this.modalRef = this.modalService.show(this.template, this.config);
  }  

  closeModal(): void {
    this.seleccionarImg.emit(this.imagenSeleccionada); 
    // this.imagenSeleccionada = undefined;
    this.modalRef.hide();
  }

}
