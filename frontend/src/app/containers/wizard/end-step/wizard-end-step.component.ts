import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { AsignaturaService } from 'src/app/data/asignatura.service';
import { EjercicioService } from 'src/app/data/ejercicio.service';
import { SenderService } from 'src/app/data/sender.service';
import { Asignatura } from 'src/app/models/asignatura.model';
import { Ejercicio } from 'src/app/models/ejercicio.model';
import { ImagenService } from 'src/app/data/imagen.service';
import { Imagen } from 'src/app/models/imagen.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wizard-end-step',
  templateUrl: './wizard-end-step.component.html',
  styleUrls: ['./wizard-end-step.component.scss'],
  providers: [DatePipe]
})
export class WizardEndStepComponent implements OnInit {

  exercise: Ejercicio;
  subject: Asignatura;
  subjects: Asignatura[];
  uid: any;
  uidEx: number;
  totalItem: 0;
  todayString: string;
  tomorrowString: string;
  imgsSelect: Imagen[] = [];
  imgsSelectId: any[] = [];
  imgs: Imagen[];
  urlPrefix: string = environment.prefix_url;
  colours = ["Verde", "Amarillo", "Rojo", "Negro"];

  // FORM
  private formSubmited = false;
  public formData=this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    desde: ['', [Validators.required]],
    hasta: ['', [Validators.required]],
    asignatura: ['', [Validators.required]],
    imgs: [''],
    max_intentos: [1, [Validators.required]],
    range_max_intentos: [1]
  });

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private asignaturaService: AsignaturaService, private ejercicioService: EjercicioService, private fb: FormBuilder,
    private router: Router, private datePipe: DatePipe, private location: Location, private sender: SenderService,
    private notifications: NotificationsService, private imagenService: ImagenService) { }

  ngOnInit(): void {
    this.initData();

    // si no hay Ejercicio ni Asignatura -> selector de Asignatura para el ejercicio
    if(this.uid == undefined && this.uidEx == undefined) {
      this.getSubjects();
    } else {
      this.setSubject();
    }

    this.getImages();
  }

  // *************** DATA METHODS ***********************

  initData(): void {
    // para comprobar la fecha de hoy y mañana en el input
    var today = new Date();
    var tomorrow = new Date(today.getTime() + 24*60*60*1000);
    this.todayString = this.datePipe.transform(today, 'yyyy-MM-dd');
    this.tomorrowString = this.datePipe.transform(tomorrow, 'yyyy-MM-dd');
    // colocamos fechas minimas en los input date
    this.formData.get('desde').setValue(this.todayString);
    this.formData.get('hasta').setValue(this.tomorrowString);

    // comprobamos Asignatura y Ejercicio
    if(this.sender.idSubjectExercise) {
      this.uid = this.sender.idSubjectExercise;
    } else if(this.sender.idSubject) {
      this.uid = this.sender.idSubject;
    }
    if(this.sender.idExercise) {
      this.uidEx = this.sender.idExercise;
    }
  }

  getSubjects() {
    this.asignaturaService.getSubjects().subscribe(
      data => {
        if (data['ok']) {
          this.subjects = data['asignaturas'];
        }
      },
      error => {
        this.notifications.create('Error', 'No se han podidio obtener las Asignaturas', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  setSubject(): void {
    // si tenemos el id del ejercicio --> editar
    if(this.uidEx != null) {
      this.ejercicioService.getExercise(this.uidEx).subscribe(
        data => {
          if (data['ok']) {
            this.exercise = data['ejercicios'];
            // colocamos valores del ejercicio en formulario
            this.totalItem = data['totalEjercicios'];
            this.formData.get('asignatura').setValue(this.exercise.asignatura._id);
            this.formData.get('nombre').setValue(this.exercise.nombre);
            this.formData.get('descripcion').setValue(this.exercise.descripcion);
            this.formData.get('desde').setValue(this.datePipe.transform(this.exercise.desde, 'yyyy-MM-dd'));
            this.formData.get('hasta').setValue(this.datePipe.transform(this.exercise.hasta, 'yyyy-MM-dd'));
            this.formData.get('max_intentos').setValue(this.exercise.max_intentos);
            this.formData.get('range_max_intentos').setValue(this.exercise.max_intentos);
          }
        },
        error => {
          this.notifications.create('Error', 'No se pudo obtener el ejercicio', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
        }
      );
    }

    // obtenemos datos de la asignatura
    this.loadSubjectData(this.uid);
  }

  loadSubjectData(uid: number) {
    this.asignaturaService.getSubject(uid).subscribe(
      data => {
        if (data['ok']) {
          this.subject = data['asignaturas'];
          this.formData.get('asignatura').setValue(this.subject.uid);
        }
      },
      error => {
        this.router.navigateByUrl('/app/dashboards/all/subjects/data-list');
        this.notifications.create('Error', 'No se han podidio obtener los datos de la Asignatura', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  checkDate(): void {

    console.log('Entro');
    this.formSubmited = true;
    if (this.formData.invalid) {
      this.notifications.create('Error al crear ejercicio', 'Existen errores en el formulario. No se pudo crear el ejercicio', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 6000,
        showProgressBar: false
      });
    } 
    else if (!this.formData.dirty){
      this.router.navigateByUrl('app/dashboards/all/subjects/data-list');
    }
    else {
      const desde = new Date(this.formData.get('desde').value);
      const hasta = new Date(this.formData.get('hasta').value);

      if(desde.getTime() <= hasta.getTime()) {
        // si los datos de las fechas son validos
        this.createExercise();
      } else {
        // si hay algun error
        this.notifications.create('Error en la fecha', 'La fecha "desde" no puede ser posterior a la fecha "hasta"', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });
      }
    }

  }

  createExercise(): void {

    this.formSubmited = true;
    if (this.formData.invalid) { return; }

    // obtenemos los id de las imágenes para enviarlas
    this.getImagesId();
    // this.formData.get('imgs').setValue(this.imgsSelect);

    // si tenemos ejercicio -> EDITAR
    if(this.exercise) {
      this.ejercicioService.updateExercise(this.formData.value, this.exercise.uid)
        .subscribe( res => {
          // this.router.navigateByUrl('app/dashboards/all/subjects/data-list');

        }, (err) => {

          this.notifications.create('Error', 'No se ha podido editar el Ejercicio', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });
    } else {
      // no tenemos ejercicio -> CREAR
      this.ejercicioService.createExercise(this.formData.value)
        .subscribe( res => {
          this.exercise = res['ejercicio'];
          // this.router.navigateByUrl('app/dashboards/all/subjects/data-list');

        }, (err) => {

          this.notifications.create('Error', 'No se ha podido crear el Ejercicio', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });


    }
  }

  goBack(): void {
    this.sender.idSubject = undefined;
    this.location.back();
  }

  changeValue(e, inputRange): void {
    if(inputRange) {
      this.formData.get('max_intentos').setValue(e);
    } else {
      this.formData.get('range_max_intentos').setValue(e);
    }
  }
  toExercises(): void {
    this.router.navigateByUrl('app/dashboards/all/subjects/data-list');
  }


  // **************** IMAGE METHODS ***************

  getImages():void {
    this.imagenService.getImages().subscribe(
      data => {
        if (data['ok']) {
          this.imgs = data['imagenes'];
          console.log(this.imgs);
        }
      },
      error => {
        this.notifications.create('Error', 'No se han podidio obtener las Imagenes', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  getImagesId(): void {
    for(let i=0; i < this.imgsSelect.length; i++) {
      this.imgsSelectId[i] = {
        "img": this.imgsSelect[i].uid
      }
      
    }
    this.formData.get('imgs').setValue(this.imgsSelectId);
    console.log(this.formData);
  }

  selectImgs(img: Imagen) {
    // console.log(src);
    let esta = false;
    for(let i=0; i<this.imgsSelect.length && !esta; i++) {
      if(img == this.imgsSelect[i]) {
        this.imgsSelect.splice(i, 1);
        esta = true;
      }
    }

    if(!esta) {
      this.imgsSelect.push(img);
      // console.log(this.imgsSelect);
    }

    var element = document.querySelector('[src="' + this.urlPrefix + img.ruta +'"]');
    if(element.parentElement.classList.contains('noSelected')) {
      element.parentElement.className = 'selected';
    }
    else {
      element.parentElement.className = 'noSelected';
    }
    
  }

  unselectImg(img, pos) { 
    // eliminamos la ruta del array
    this.imgsSelect.splice(pos, 1);

    // cambiamos la clase de la geleria
    var element = document.querySelector('[src="'+ img.ruta +'"]');
    element.parentElement.className = 'noSelected';

    console.log('SEL:', this.imgsSelect);
  }

  moveImgL(src, pos) { 
    this.imgsSelect.splice(pos, 1);
    this.imgsSelect.splice(pos-1, 0, src);
    console.log('SEL:', this.imgsSelect);
  }

  moveImgR(src, pos) { 
    this.imgsSelect.splice(pos, 1);
    this.imgsSelect.splice(pos+1, 0, src);
    console.log('SEL:', this.imgsSelect);
  }


  // ***************** PATIENT METHODS ********************

  createPatient(): void {
    console.log('CREO PACIENTE');
  }

}
