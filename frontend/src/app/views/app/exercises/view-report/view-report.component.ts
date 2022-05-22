import { Component, OnInit } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { ActividadService } from 'src/app/data/actividad.service';
import { EjerciciosUsuarioService } from 'src/app/data/ejerciciosUsuario.service';
import { SenderService } from 'src/app/data/sender.service';
import { Actividad } from 'src/app/models/actividad.model';
import { Ejercicio } from 'src/app/models/ejercicio.model';
import { EjerciciosUsuario } from 'src/app/models/ejerciciosUsuario.model';
import { Usuario } from 'src/app/models/usuario.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss'],
  providers: [DatePipe]
})
export class ViewReportComponent implements OnInit {

  pillActive: string = 'resumen';
  actividades: Actividad[] = [];
  ejercicioUsuario: EjerciciosUsuario;
  ejercicio: Ejercicio;
  usuario: Usuario;

  constructor(private sender: SenderService, private actividadService: ActividadService, private notifications: NotificationsService,
    private ejerciciosUsuarioService: EjerciciosUsuarioService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getEjercicioUsuario();
    this.getActividades();
  }

  getEjercicioUsuario() {
    this.ejerciciosUsuarioService.getUserExercises(undefined, undefined, this.sender.ejercicioUsuario).subscribe(data => {
      console.log(data['ejerciciosUsuario']);
      this.ejercicioUsuario = data['ejerciciosUsuario'];
      this.ejercicio = data['ejerciciosUsuario']['idEjercicio'];
      this.usuario = data['ejerciciosUsuario']['idUsuario'];
    }, (err) => {

      this.notifications.create('Error', 'No se ha podido obtener el registro del Alumno en el Ejercicio', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 6000,
        showProgressBar: false
      });

      return;
    });
  }

  getActividades() {
    this.actividadService.getActivities(this.sender.ejercicioUsuario).subscribe(data => {
      console.log(data['actividades']);
      this.actividades = data['actividades'];
    }, (err) => {

      this.notifications.create('Error', 'No se ha podido obtener el registro del Alumno en el Ejercicio', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 6000,
        showProgressBar: false
      });

      return;
    });
  }

  setActive(a) {
    if(a != this.pillActive) {
      let desactivar = document.querySelector('.active');
      desactivar.classList.remove('active');
      let activar = document.querySelector('.'+a);
      activar.classList.add('active');
      this.pillActive = a;
    }
  }

  changeDateFormat(f: Date): void {
    let fecha;
    fecha = this.datePipe.transform(f, 'dd/MM/yyyy HH:mm:ss');

    return fecha;
  }

}
