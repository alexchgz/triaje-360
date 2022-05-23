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
import { Paciente } from 'src/app/models/paciente.model';

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
  colours = ["Verde", "Amarillo", "Rojo", "Negro", "NoTriado"];
  configurados: number[] = [0, 0, 0, 0];
  configuradosP: any[] = [0, 0, 0, 0];
  triados: number[] = [0, 0, 0, 0, 0];
  triadosP: any[] = [0, 0, 0, 0, 0];

  constructor(private sender: SenderService, private actividadService: ActividadService, private notifications: NotificationsService,
    private ejerciciosUsuarioService: EjerciciosUsuarioService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getEjercicioUsuario();
  }

  getEjercicioUsuario() {
    this.ejerciciosUsuarioService.getUserExercises(undefined, this.sender.idExercise, this.sender.ejercicioUsuario).subscribe(data => {
      this.ejercicioUsuario = data['ejerciciosUsuario'];
      this.ejercicio = data['ejercicio'];
      this.actividades = data['actividades'];
      this.usuario = data['ejerciciosUsuario']['idUsuario'];
      this.setTabla();
    }, (err) => {

      this.notifications.create('Error', 'No se ha podido obtener el registro del Alumno en el Ejercicio', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 6000,
        showProgressBar: false
      });

      return;
    });
  }

  setTabla() {
    // CONFIGURADOS
    for(let i=0; i<this.ejercicio.pacientes.length; i++) {
      for(let j=0; j<this.colours.length; j++) {
        if(this.ejercicio.pacientes[i].paciente.color == this.colours[j]) {
          this.configurados[j] += 1;
        }
      }
    }

    // PORCENTAJE CONFIGURADOS
    for(let i=0; i<this.configuradosP.length; i++) {
      this.configuradosP[i] = (this.configurados[i]/this.ejercicio.pacientes.length*100).toFixed(2);
    }

    // TRIADOS
    for(let i=0; i<this.ejercicio.pacientes.length; i++) {
      let aux = '';
      for(let j=0; j<this.actividades.length; j++) {
        if(this.actividades[j].paciente != undefined && this.actividades[j].color != undefined) {
          if(this.ejercicio.pacientes[i].paciente['_id'] == this.actividades[j].paciente['_id']) {
            aux = this.actividades[j].color;
          }
        }
      }
      switch(aux) {
        case 'verde':
          this.triados[0] += 1;
          break;
        case 'amarillo':
          this.triados[1] += 1;
          break;
        case 'rojo':
          this.triados[2] += 1;
          break;
        case 'negro':
          this.triados[3] += 1;
          break;
        default:
          this.triados[4] += 1;
          break;
      }
    }
    
    // PORCENTAJE TRIADOS
    for(let i=0; i<this.triadosP.length; i++) {
      this.triadosP[i] = (this.triados[i]/this.ejercicio.pacientes.length*100).toFixed(2);
    }
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

  changeDateFormat(f: Date): string {
    let fecha;
    fecha = this.datePipe.transform(f, 'dd/MM/yyyy HH:mm:ss');

    return fecha;
  }

  searchPatient(p: Paciente): number {
    for(let i=0; i<this.ejercicio.pacientes.length; i++) {
      if(this.ejercicio.pacientes[i].paciente['_id'] == p['_id']) {
        return i+1; 
      }
    }

    return;
  }

}
