import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SenderService } from 'src/app/data/sender.service';
import { EjerciciosUsuario } from 'src/app/models/ejerciciosUsuario.model';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EjerciciosUsuarioService } from 'src/app/data/ejerciciosUsuario.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { UsuarioService } from 'src/app/data/usuario.service';
import { EjercicioService } from 'src/app/data/ejercicio.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Ejercicio } from 'src/app/models/ejercicio.model';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-show-student-register-modal',
  templateUrl: './show-student-register-modal.component.html',
  styleUrls: ['./show-student-register-modal.component.scss'],
  providers: [DatePipe]
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
  dataUsuario: Usuario;
  dataEjercicio: Ejercicio;
  registros: EjerciciosUsuario[] = [];

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private auth: AuthService, private sender: SenderService,
    private ejerciciosUsuarioService: EjerciciosUsuarioService, private usuarioService: UsuarioService, private ejercicioService: EjercicioService,
    private notifications: NotificationsService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.userRole = this.auth.rol;
    this.ejercicio = this.sender.idExercise;
  }

  show(id: number): void {

    this.alumno = id;
    this.getUser(this.alumno);
    this.getExercise(this.ejercicio);
    this.getExerciseUserRegister(this.alumno, this.ejercicio);
    this.modalRef = this.modalService.show(this.template, this.config);

  }

  getUser(alumno: number): void {
    this.usuarioService.getUser(alumno)
        .subscribe( data => {
          // console.log('Registros de Alumno en Ejercicio obtenidos');
          // console.log('DATA:', data);
          this.dataUsuario = data['usuarios'];
          // console.log(this.dataUsuario);
        }, (err) => {

          this.notifications.create('Error', 'No se han podido obtener los datos del Alumno', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 4000,
            showProgressBar: false
          });

          return;
      });
  }

  getExercise(ejercicio: number): void {
    this.ejercicioService.getExercise(ejercicio)
        .subscribe( data => {
          // console.log('Registros de Alumno en Ejercicio obtenidos');

          this.dataEjercicio = data['ejercicios'];
          // console.log(this.dataEjercicio);
        }, (err) => {

          this.notifications.create('Error', 'No se han podido obtener los datos del Alumno', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 4000,
            showProgressBar: false
          });

          return;
      });
  }

  getExerciseUserRegister(alumno:number, ejercicio: number): void {
    this.ejerciciosUsuarioService.getUserExercises(alumno.toString(), ejercicio.toString())
        .subscribe( data => {

          this.registros = data['ejerciciosUsuario'];
          // console.log(this.registros);
          if(this.registros.length!=0) {
            this.changeDateFormat();
          }

        }, (err) => {

          this.notifications.create('Error', 'No se han podido obtener los registros del Alumno en el Ejercicio', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });
  }

  changeDateFormat(): void {
    for(let i = 0; i < this.registros.length; i++) {
      this.registros[i].fecha_ejecucion = this.datePipe.transform(this.registros[i].fecha_ejecucion, 'dd/MM/yyyy HH:mm:ss');
      // console.log(this.registros[i].fecha_ejecucion);
    }

  }

  closeModal(): void {
    this.modalRef.hide();
    this.sender.idExercise = undefined;
  }

}
