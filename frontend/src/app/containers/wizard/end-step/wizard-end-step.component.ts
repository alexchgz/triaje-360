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
import { PacienteService } from 'src/app/data/paciente.service';
import { PacienteEjercicioService } from 'src/app/data/pacienteEjercicio.service';
import { Paciente } from 'src/app/models/paciente.model';
import { PacienteEjercicio } from 'src/app/models/pacienteEjercicio.model';
import { Accion } from 'src/app/models/accion.model';
import { AccionService } from 'src/app/data/accion.service';
import { SelectPatientImgModalComponent } from 'src/app/containers/pages/select-patient-img-modal/select-patient-img-modal.component';
import { LocatePatientComponent } from '../../pages/locate-patient/locate-patient.component';

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
  todayString: string = '';
  tomorrowString: string = '';
  imgsSelect: Imagen[] = [];
  imgSelected: Imagen;
  // imgsSelectId: any[] = [];
  imgs: Imagen[] = [];
  urlPrefix: string = environment.prefix_url;
  urlPrefixPacientes: string = environment.prefix_urlPacientes;
  colours = ["Verde", "Amarillo", "Rojo", "Negro"];
  patients: Paciente[] = [];
  actions: Accion[] = [];
  actionsTime: number[] = [];
  listaPacientes: any[] = [];
  childrenImg: string = undefined;
  empeora: boolean = false;
  intentos_limitados: boolean = false;
  camina: boolean = false;
  pacientesNoUbicados: Paciente[] = [];
  pacientesEjercicio: PacienteEjercicio[] = [];
  table: any[][] = [
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
  ];
  posX: number;
  posY: number;

  selectAllState = '';
  selected: Accion[] = [];
  dataEjercicio = {
    "nombre": '',
    "descripcion": '',
    "desde": '',
    "hasta": '',
    "asignatura": undefined,
    "imgs": [],
    "pacientes": [],
    "intentos_limitados": false,
    "max_intentos": 1,
    "range_max_intentos": 1
  }
  dataPaciente = {
    "descripcion": '',
    "color": '',
    "camina": false,
    "acciones": [],
    "img": '',
    "empeora": false,
    "tiempoEmpeora": undefined
  }

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: SelectPatientImgModalComponent;
  @ViewChild('locateModalRef', { static: true }) locateModalRef: LocatePatientComponent;

  constructor(private asignaturaService: AsignaturaService, private ejercicioService: EjercicioService, private fb: FormBuilder,
    private router: Router, private datePipe: DatePipe, private location: Location, private sender: SenderService,
    private notifications: NotificationsService, private imagenService: ImagenService, private pacienteService: PacienteService,
    private accionService: AccionService, private pacienteEjercicioService: PacienteEjercicioService) { }

  ngOnInit(): void {
    this.initData();
    this.getImages();
    this.getActions();

  }

  // *************** DATA METHODS ***********************

  initData(): void {
    // para comprobar la fecha de hoy y mañana en el input
    var today = new Date();
    var tomorrow = new Date(today.getTime() + 24*60*60*1000);
    this.todayString = this.datePipe.transform(today, 'yyyy-MM-dd');
    this.tomorrowString = this.datePipe.transform(tomorrow, 'yyyy-MM-dd');
    // colocamos fechas minimas en los input date
    this.dataEjercicio.desde = this.todayString;
    this.dataEjercicio.hasta = this.tomorrowString;

    // console.log('EJ:', this.dataEjercicio);

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
            this.dataEjercicio.asignatura = this.exercise.asignatura._id;
            this.dataEjercicio.nombre = this.exercise.nombre;
            this.dataEjercicio.descripcion = this.exercise.descripcion;
            this.dataEjercicio.desde = this.datePipe.transform(this.exercise.desde, 'yyyy-MM-dd');
            this.dataEjercicio.hasta = this.datePipe.transform(this.exercise.hasta, 'yyyy-MM-dd');
            this.dataEjercicio.intentos_limitados = this.exercise.intentos_limitados;
            this.dataEjercicio.max_intentos = this.exercise.max_intentos;
            this.dataEjercicio.range_max_intentos = this.exercise.max_intentos;
            this.getImagesRoutes();
            this.formatExercisePatients();
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
          this.dataEjercicio.asignatura = this.subject.uid;
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
    // console.log(this.dataEjercicio);
    const desde = new Date(this.dataEjercicio.desde);
    const hasta = new Date(this.dataEjercicio.hasta);

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

  createExercise(): void {

    // obtenemos los id de las imágenes para enviarlas
    this.getImagesId();

    // si tenemos ejercicio -> EDITAR
    if(this.exercise) {
      console.log(this.exercise);
      this.ejercicioService.updateExercise(this.dataEjercicio, this.exercise.uid)
        .subscribe( res => {
          // this.router.navigateByUrl('app/dashboards/all/subjects/data-list');
          this.notifications.create('Ejercicio Actualizado', 'Se han actualizado los Datos Generales y las Imágenes del Ejercicio', NotificationType.Success, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

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
      this.ejercicioService.createExercise(this.dataEjercicio)
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
      // this.formData.get('max_intentos').setValue(e);
      this.dataEjercicio.max_intentos = e;
    } else {
      // this.formData.get('range_max_intentos').setValue(e);
      this.dataEjercicio.range_max_intentos = e;
    }
  }
  toExercises(): void {
    this.router.navigateByUrl('app/dashboards/all/exercises/data-list');
  }

  datosGeneralesValid(): boolean {
    let valid = false;
    if(this.dataEjercicio.asignatura != undefined && this.dataEjercicio.nombre != '' && this.dataEjercicio.descripcion != ''
    && this.dataEjercicio.desde != '' && this.dataEjercicio.hasta != '') {
      valid = true;
    }

    return valid;    
  }


  // **************** IMAGE METHODS ***************

  getImages():void {
    this.imagenService.getImages().subscribe(
      data => {
        if (data['ok']) {
          this.imgs = data['imagenes'];
          // si no hay Ejercicio ni Asignatura -> selector de Asignatura para el ejercicio
          if(this.uid == undefined && this.uidEx == undefined) {
            this.getSubjects();
          } else {
            this.setSubject();
          }
        }
      },
      error => {
        this.notifications.create('Error', 'No se han podido obtener las Imagenes', NotificationType.Error, {
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
      // this.imgsSelectId[i] = {
      this.dataEjercicio.imgs[i] = {
        "img": this.imgsSelect[i].uid
      }
      
    }
  }

  getImagesRoutes(): void {
    this.dataEjercicio.imgs = [];

    for(let i=0; i<this.exercise.imgs.length; i++) {
      this.dataEjercicio.imgs[i] = this.exercise.imgs[i].img;
    }
    
    for(let j=0; j<this.dataEjercicio.imgs.length; j++) {
      for(let k=0; k<this.imgs.length; k++) {
        if(this.dataEjercicio.imgs[j] == this.imgs[k].uid) {
          this.selectImgs(this.imgs[k]);
        }  
      }
    }
    
  }

  formatExercisePatients() {
    for(let i=0; i<this.exercise.pacientes.length; i++) {
      this.dataEjercicio.pacientes[i] = this.exercise.pacientes[i].paciente;
      this.dataEjercicio.pacientes[i].uid = this.dataEjercicio.pacientes[i]['_id'];
    }
  }

  selectImgs(img: Imagen) {
    let esta = false;
    for(let i=0; i<this.imgsSelect.length && !esta; i++) {
      if(img == this.imgsSelect[i]) {
        // this.imgsSelect.splice(i, 1);
        this.unselectImg(img, i);
        esta = true;
      }
    }

    if(!esta) {
      this.imgsSelect.push(img);
      // console.log(this.imgsSelect);
      var element = document.querySelector('[src="' + this.urlPrefix + img.ruta +'"]');
      element.parentElement.className = 'selected';
    
    }
    
  }

  unselectImg(img, pos) { 
    // eliminamos la ruta del array
    this.imgsSelect.splice(pos, 1);
    this.dataEjercicio.imgs.splice(this.dataEjercicio.imgs.indexOf(pos));

    // cambiamos la clase de la geleria
    var element = document.querySelector('[src="'+ this.urlPrefix + img.ruta +'"]');
    element.parentElement.className = 'noSelected';
  }

  moveImgL(img, pos) { 
    this.imgsSelect.splice(pos, 1);
    this.imgsSelect.splice(pos-1, 0, img);
  }

  moveImgR(img, pos) { 
    this.imgsSelect.splice(pos, 1);
    this.imgsSelect.splice(pos+1, 0, img);
  }

  escenaValid(): boolean {
    let valid = false;
    if(this.imgsSelect.length > 0) {
      valid = true;
    }

    return valid;    
  }


  // ***************** ACTIONS METHODS ********************

  getActions(): void {
    this.accionService.getActions().subscribe(
      data => {
        if (data['ok']) {
          this.actions = data['acciones'];
          //almacenamos los tiempos de las acciones para resetearlos luego
          for(let i=0; i<this.actions.length; i++) {
            this.actionsTime[i] = this.actions[i].tiempo;
          }
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

  isSelected(p: Accion): boolean {
    return this.selected.findIndex(x => x.uid === p.uid) > -1;
  }
  onSelect(item: Accion): void {
    if (this.isSelected(item)) {
      this.selected = this.selected.filter(x => x.uid !== item.uid);
    } else {
      this.selected.push(item);
    }
    this.setSelectAllState();
  }

  setSelectAllState(): void {
    if (this.selected.length === this.actions.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }


  // ***************** CONFIGURE PATIENT METHODS ********************

  createPatient(): void {
    
    for(let i=0; i<this.selected.length; i++) {
      this.dataPaciente.acciones[i] = {
        "accion": {
          "nombre": this.selected[i].nombre,
          "tiempo": this.selected[i].tiempo
        }
      }
    }   
    
    if(this.dataPaciente['uid']) {
      this.pacienteService.updatePatient(this.dataPaciente).subscribe( 
        data => {
          
          let parar = false;
          for(let i=0; i<this.dataEjercicio.pacientes.length && !parar; i++) {
            if(this.dataEjercicio.pacientes[i].uid == data['paciente'].uid) {
              this.dataEjercicio.pacientes[i] = data['paciente'];
              parar = true;
            }
          }

          console.log('EJER:', this.dataEjercicio.pacientes);
          this.resetDataPaciente();

          this.notifications.create('Paciente editado', 'Se ha editado el Paciente correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

      }, (err) => {

          this.notifications.create('Error', 'No se ha podido editar el Usuario', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });
    }
    else {
      this.pacienteService.createPatient(this.dataPaciente, this.exercise.uid).subscribe(
        data => {
          if (data['ok']) {
            this.dataEjercicio.pacientes.push(data['paciente']);
            // console.log('Paciente:', data['paciente']);
            console.log('EJER:', this.dataEjercicio.pacientes);
            this.resetDataPaciente();
            this.notifications.create('Paciente creado', 'Se ha creado el Paciente correctamente y se ha añadido al Ejercicio', NotificationType.Info, {
              theClass: 'outline primary',
              timeOut: 6000,
              showProgressBar: false
            });
          }
        },
        error => {
          this.notifications.create('Error', 'No se ha podido crear el Paciente', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });
  
          return;
        }
      );
    }

  }

  loadPatientData(paciente: Paciente, i: number): void {
    
    this.childrenImg = paciente.img;
    this.dataPaciente = paciente;
    console.log(this.dataPaciente);
    this.selected = [];
    for(let i=0; i<this.actions.length; i++) {
      for(let j=0; j<this.dataPaciente.acciones.length; j++) {
        if(this.actions[i].nombre == this.dataPaciente.acciones[j].accion.nombre) {
          this.actions[i].tiempo = this.dataPaciente.acciones[j].accion.tiempo;
          this.onSelect(this.actions[i]);
        }
      }
    }
  
  }

  deletePatient(i: number) {
    console.log('Elimino Paciente');
    if(this.dataEjercicio.pacientes[i].uid == this.dataPaciente['uid']) {
      console.log('entro');
      this.resetDataPaciente();
    }
    this.dataEjercicio.pacientes.splice(i, 1);
    this.exercise.pacientes.splice(i,1);
    this.createExercise();
  }

  resetDataPaciente(): void {
    console.log('entro');
    if(this.dataPaciente['uid']) {
      this.dataPaciente['uid'] = undefined;
    }
    this.dataPaciente.descripcion = '';
    this.dataPaciente.color = '';
    this.dataPaciente.camina = false;
    this.dataPaciente.acciones = [];
    this.dataPaciente.img = '';
    this.dataPaciente.empeora = false;
    this.dataPaciente.tiempoEmpeora = undefined;
    this.selected = [];
    this.childrenImg = undefined;


    // reseteamos tiempos acciones si se han cambiado
    for(let i=0; i<this.actions.length; i++) {
      if(this.actions[i].tiempo != this.actionsTime[i]) {
        this.actions[i].tiempo = this.actionsTime[i];
      }
    }
  }

  showSelectPatientImgModal(): void {
    this.addNewModalRef.show();
  }

  getImgSelect(e): void {
    this.dataPaciente.img = e;
    this.childrenImg = e;
    // console.log('Select:', this.dataPaciente.img);
  }

  resetChildrenImg() {
    this.childrenImg = undefined;
  }

  confPacientesValid(): boolean {
    let valid = false;
    if(this.dataEjercicio.pacientes.length > 0) {
      valid = true;
    }

    return valid;    
  }

  // ***************** LOCATE PATIENT METHODS ********************

  initLocatePatient() {
    this.setImgSelected(this.imgsSelect[0]);
    // this.getExercisePatients();
  }

  setImgSelected(i: Imagen) {
    if(this.imgSelected == undefined) {
      var element = document.querySelector('[src="'+ this.urlPrefix + i.ruta +'"]');
      element.parentElement.className = 'selected';
    }
    else if(this.imgSelected != i) {
      // cambiamos la clase de las imagenes
      var element = document.querySelector('[src="'+ this.urlPrefix + this.imgSelected.ruta +'"]');
      element.parentElement.className = 'noSelected';
      var element2 = document.querySelector('[src="'+ this.urlPrefix + i.ruta +'"]');
      element2.parentElement.className = 'selected';
    } 

    this.imgSelected = i;
    this.getExercisePatients();
    // console.log(this.imgSelected);

  }

  setPacientesNoUbicados() {
    console.log('DEP:', this.dataEjercicio.pacientes);
    this.pacientesNoUbicados = [];
    for(let a=0; a<this.dataEjercicio.pacientes.length; a++) {
      console.log('entro');
      this.pacientesNoUbicados.push(this.dataEjercicio.pacientes[a]);
    }
    console.log('NU:', this.pacientesNoUbicados);
    for(let i=0; i<this.pacientesEjercicio.length; i++) {
      for(let j=0; j<this.pacientesNoUbicados.length; j++) {
        if(this.pacientesNoUbicados[j] != undefined && this.pacientesEjercicio[i].idPaciente['_id'] == this.pacientesNoUbicados[j].uid) {
          // this.pacientesNoUbicados.splice(j, 1);
          this.pacientesNoUbicados[j] = undefined;
        }
      }
    }
  
    console.log('NU:', this.pacientesNoUbicados);
  }

  getExercisePatients() {
    this.pacienteEjercicioService.getExercisePatients(this.exercise.uid).subscribe(
      data => {
        if (data['ok']) {
          this.pacientesEjercicio = data['pacientesEjercicio'];
          this.checkPacientesEjercicio();
          console.log('PE:', this.pacientesEjercicio);
          this.setTableData();
          this.setPacientesNoUbicados();
        }
      },
      error => {
        this.notifications.create('Error', 'No se pudo obtener los Paciente ejercicio', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  checkPacientesEjercicio() {
    let esta = false;
    for(let i=0; i<this.pacientesEjercicio.length; i++) {
      for(let j=0; j<this.dataEjercicio.imgs.length && !esta; j++) {
        if(this.pacientesEjercicio[i].idImagen['_id'] == this.dataEjercicio.imgs[j].img) {
          esta = true;
        }
      }
      if(!esta) {
        this.dislocatePatient(undefined, undefined, this.pacientesEjercicio[i]);
        console.log('NO ESTA');
        console.log(this.pacientesEjercicio[i]);
      }
      esta = false;
    }
  }

  setTableData() {

    this.table = [
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    ];

    for(let i=0; i<this.pacientesEjercicio.length; i++) {
      if(this.pacientesEjercicio[i].idImagen['_id'] == this.imgSelected.uid) {
        this.table[this.pacientesEjercicio[i].x][this.pacientesEjercicio[i].y] = this.pacientesEjercicio[i].idPaciente;
      }
      else {
        this.table[this.pacientesEjercicio[i].x][this.pacientesEjercicio[i].y] = '';
      }
    }

  }

  showLocatePatientModal(x: number, y: number): void {
    this.posX = x;
    this.posY = y;
    this.locateModalRef.show(this.pacientesNoUbicados, this.exercise.uid, this.imgSelected.uid, x, y);
  }

  getPatientSelected(p: Paciente) {
    for(let i=0; i<this.pacientesNoUbicados.length; i++) {
      if(this.pacientesNoUbicados[i] != undefined && this.pacientesNoUbicados[i].uid == p.uid) {
        // this.pacientesNoUbicados.splice(i, 1);
        this.pacientesNoUbicados[i] = undefined;
      }
    }
    this.createExercisePatient(p);
    this.table[this.posY][this.posX] = p;
  }

  createExercisePatient(p: Paciente) {
    let data = {
      "idEjercicio": this.exercise.uid,
      "idPaciente": p.uid,
      "idImagen": this.imgSelected.uid,
      "x": this.posY,
      "y": this.posX
    }
    this.pacienteEjercicioService.createExercisePatient(data)
        .subscribe( data => {
          console.log('PE:', this.pacientesEjercicio);
          console.log('DEP:', this.dataEjercicio.pacientes);
          console.log('NU:', this.pacientesNoUbicados);
          // console.log(data['populatePacienteEjercicio']);
          this.pacientesEjercicio.push(data['populatePacienteEjercicio']);
          this.notifications.create('Registro creado', 'Se ha creado el registro del Paciente Ejercicio', NotificationType.Success, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        }, (err) => {

          this.notifications.create('Error', 'No se ha podido editar el Ejercicio', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });
  }

  celdaVacia(x: number, y: number): boolean {
    let ret = false;
    if(this.table[y][x] === "") {
      ret = true;
    }
    return ret;
  }

  dislocatePatient(x: number, y: number, pacEj?: PacienteEjercicio) {
    
    let pe;
    if(!pacEj) {
      pe = this.findExercisePatient(x, y);
    }
    else {
      pe = pacEj;
    }
    console.log(pe);
    
    this.pacienteEjercicioService.dropExercisePatient(pe.uid).subscribe(
      data => {
        console.log('PE:', this.pacientesEjercicio);
        this.pacientesEjercicio.splice(this.pacientesEjercicio.indexOf(pe, 1));
        console.log('PE:', this.pacientesEjercicio);
        if(!pacEj) {
          this.table[y][x] = '';
        }
        this.setTableData();
        this.setPacientesNoUbicados();

      },
      error => {
        this.notifications.create('Error', 'No se ha podido eliminar el registro', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  findExercisePatient(x: number, y: number): PacienteEjercicio {
    console.log(this.pacientesEjercicio);
    for(let i=0; i<this.pacientesEjercicio.length; i++) {
      if(this.pacientesEjercicio[i].idPaciente['_id'] == this.table[y][x]['_id']) {
        return this.pacientesEjercicio[i];
      }
    }
  }

  ubicarPacientesValid(): boolean {
    let valid = true;
    for(let i=0; i<this.pacientesNoUbicados.length && valid; i++) {
      if(this.pacientesNoUbicados[i] != undefined) {
        valid = false;
      }
    }

    return valid;    
  }

}
