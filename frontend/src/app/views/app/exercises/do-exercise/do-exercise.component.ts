import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { EjercicioService } from 'src/app/data/ejercicio.service';
import { PacienteEjercicioService } from 'src/app/data/pacienteEjercicio.service';
import { SenderService } from 'src/app/data/sender.service';
import { Ejercicio } from 'src/app/models/ejercicio.model';
import { PacienteEjercicio } from 'src/app/models/pacienteEjercicio.model';
import { environment } from 'src/environments/environment';
import { TriarPatientComponent } from '../../../../containers/pages/triar-patient/triar-patient.component';
import { DatePipe } from '@angular/common';
var Marzipano = require('marzipano');

@Component({
  selector: 'app-do-exercise',
  templateUrl: './do-exercise.component.html',
  styleUrls: ['./do-exercise.component.scss'],
  providers: [DatePipe]
})

export class DoExerciseComponent implements OnInit {

  urlPrefixPacientes: string = environment.prefix_urlPacientes;
  ejercicio: Ejercicio;
  pacientesEjercicio: PacienteEjercicio[] = [];
  data = {
    "scenes": [],
    "name": "",
    "settings": {
      "mouseViewMode": "drag",
      "autorotateEnabled": false,
      "fullscreenButton": false,
      "viewControlButtons": false
    }
  };
  posiciones: any[][] = [
    [{"yaw":-2.3,"pitch":-0.55}, {"yaw":-1.91,"pitch":-0.55}, {"yaw":-1.52,"pitch":-0.55}, {"yaw":-1.13,"pitch":-0.55}, {"yaw":-0.74,"pitch":-0.55}, {"yaw":-0.35,"pitch":-0.55}, {"yaw":0.04,"pitch":-0.55}, {"yaw":0.43,"pitch":-0.55}, {"yaw":0.82,"pitch":-0.55}, {"yaw":1.21,"pitch":-0.55}, {"yaw":1.6,"pitch":-0.55}, {"yaw":1.99,"pitch":-0.55}, {"yaw":2.38,"pitch":-0.55}, {"yaw":2.77,"pitch":-0.55}, {"yaw":3.16,"pitch":-0.55}, {"yaw":3.55,"pitch":-0.55}],
    [{"yaw":-2.3,"pitch":-0.25}, {"yaw":-1.91,"pitch":-0.25}, {"yaw":-1.52,"pitch":-0.25}, {"yaw":-1.13,"pitch":-0.25}, {"yaw":-0.74,"pitch":-0.25}, {"yaw":-0.35,"pitch":-0.25}, {"yaw":0.04,"pitch":-0.25}, {"yaw":0.43,"pitch":-0.25}, {"yaw":0.82,"pitch":-0.25}, {"yaw":1.21,"pitch":-0.25}, {"yaw":1.6,"pitch":-0.25}, {"yaw":1.99,"pitch":-0.25}, {"yaw":2.38,"pitch":-0.25}, {"yaw":2.77,"pitch":-0.25}, {"yaw":3.16,"pitch":-0.25}, {"yaw":3.55,"pitch":-0.25}],
    [{"yaw":-2.3,"pitch":0.05},  {"yaw":-1.91,"pitch":0.05},  {"yaw":-1.52,"pitch":0.05},  {"yaw":-1.13,"pitch":0.05},  {"yaw":-0.74,"pitch":0.05},  {"yaw":-0.35,"pitch":0.05},  {"yaw":0.04,"pitch":0.05},  {"yaw":0.43,"pitch":0.05},  {"yaw":0.82,"pitch":0.05},  {"yaw":1.21,"pitch":0.05},  {"yaw":1.6,"pitch":0.05},  {"yaw":1.99,"pitch":0.05},  {"yaw":2.38,"pitch":0.05},  {"yaw":2.77,"pitch":0.05},  {"yaw":3.16,"pitch":0.05},  {"yaw":3.55,"pitch":0.05}],
    [{"yaw":-2.3,"pitch":0.35},  {"yaw":-1.91,"pitch":0.35},  {"yaw":-1.52,"pitch":0.35},  {"yaw":-1.13,"pitch":0.35},  {"yaw":-0.74,"pitch":0.35},  {"yaw":-0.35,"pitch":0.35},  {"yaw":0.04,"pitch":0.35},  {"yaw":0.43,"pitch":0.35},  {"yaw":0.82,"pitch":0.35},  {"yaw":1.21,"pitch":0.35},  {"yaw":1.6,"pitch":0.35},  {"yaw":1.99,"pitch":0.35},  {"yaw":2.38,"pitch":0.35},  {"yaw":2.77,"pitch":0.35},  {"yaw":3.16,"pitch":0.35},  {"yaw":3.55,"pitch":0.35}]
  ];
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;
  time: string = undefined;

  @ViewChild('triarModalRef', { static: true }) triarModalRef: TriarPatientComponent;

  constructor(private sender: SenderService, private ejercicioService: EjercicioService, private notifications: NotificationsService,
    private pacienteEjercicioService: PacienteEjercicioService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getExercise();
    this.resetTimer();
    this.formatTime();
    setInterval(() => this.tick(), 1000);
  }

  resetTimer() {
    this.horas = 0;
    this.minutos = 0;
    this.segundos = 0;
  }

  tick(): void {
    if(++this.segundos > 59) {
      this.segundos = 0;
      if(++this.minutos > 59) {
        this.minutos = 0;
        if(++this.horas > 23) {
          this.horas = 0;
        }
      }
    }
    this.formatTime();
  }

  formatTime() {
    let time = new Date(0, 0, 0, this.horas, this.minutos, this.segundos);
    this.time = this.datePipe.transform(time, 'HH:mm:ss');
    // console.log('TIME: ', this.time);
  }

  getExercise() {
    this.ejercicioService.getExercise(this.sender.idExercise).subscribe(data => {
      this.ejercicio = data['ejercicios'];
      console.log(this.ejercicio);
      this.setImagesScene();
    },
      error => {
        this.notifications.create('Error', 'No se ha podido cargar el Ejercicio', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      });
  }

  getExercisePatients() {
    this.pacienteEjercicioService.getExercisePatients(this.sender.idExercise).subscribe(data => {
      this.pacientesEjercicio = data['pacientesEjercicio'];
      console.log('PE:', this.pacientesEjercicio);
      this.setPatientsScene();
    },
    error => {
      this.notifications.create('Error', 'No se han podido obtener los Pacientes del Ejercicio', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 6000,
        showProgressBar: false
      });

      return;
    })
  }

  setPatientsScene() {
    for(let i=0; i<this.pacientesEjercicio.length; i++) {
      for(let j=0; j<this.data.scenes.length; j++) {
        if(this.pacientesEjercicio[i].idImagen['nombre'] == this.data.scenes[j].id) {
            this.data.scenes[j].infoHotspots.push({
            "yaw": this.posiciones[this.pacientesEjercicio[i].x][this.pacientesEjercicio[i].y].yaw,
            "pitch": this.posiciones[this.pacientesEjercicio[i].x][this.pacientesEjercicio[i].y].pitch,
            "src": this.urlPrefixPacientes + this.pacientesEjercicio[i].idPaciente['img'],
            "paciente": this.pacientesEjercicio[i].idPaciente,
            "index": i,
            "color": ''
          });
        }
      }
    }
    console.log(this.data.scenes);
    this.marzipanoScene(this.triarModalRef);
  }

  setImagesScene() {
    // console.log(this.data);
    this.data.name = this.ejercicio.nombre;
    for(let i=0; i<this.ejercicio.imgs.length; i++) {
      let targetLeft, targetRight;
      if(i == 0) {
        targetLeft = this.ejercicio.imgs[this.ejercicio.imgs.length-1].img.nombre;
        targetRight = this.ejercicio.imgs[i+1].img.nombre;
      } else if (i == this.ejercicio.imgs.length-1) {
        targetLeft = this.ejercicio.imgs[i-1].img.nombre;
        targetRight = this.ejercicio.imgs[0].img.nombre;
      } else {
        targetLeft = this.ejercicio.imgs[i-1].img.nombre;
        targetRight = this.ejercicio.imgs[i+1].img.nombre;
      }
      this.data.scenes.push({
        "id": this.ejercicio.imgs[i].img.nombre,
        "name": this.ejercicio.imgs[i].img.descripcion,
        "levels": [
          {
            "tileSize": 256,
            "size": 256,
            "fallbackOnly": true
          },
          {
            "tileSize": 512,
            "size": 512
          }
        ],
        "faceSize": 896,
        "initialViewParameters": {
          "yaw": -1.0006674819595993,
          "pitch": -0.25
        },
        "linkHotspots": [
          {
            "yaw": -2.05,
            "pitch": -0.37,
            "rotation": 4.71238898038469,
            "target": targetLeft
          }, 
          {
            "yaw": 0,
            "pitch": -0.42,
            "rotation": -4.71238898038469,
            "target": targetRight
          }, 
        ],
        "infoHotspots": []
      });
    }
    
    this.getExercisePatients();
  }

  setColour(event): void {
    
    var icon, encontrado = false;
    for(let i=0; i<this.pacientesEjercicio.length; i++) {
      if(event.paciente['_id'] == this.pacientesEjercicio[i].idPaciente['_id'] && !encontrado) {
        encontrado = true;
        icon = document.getElementById('paciente'+i);
        // recorrido para cargar el color de un paciente clasificado
        for(let j=0; j<this.data.scenes.length; j++) {
          for(let k=0; k<this.data.scenes[j].infoHotspots.length; k++) {
            if(this.data.scenes[j].infoHotspots[k].paciente['_id'] == event.paciente['_id']) {
              this.data.scenes[j].infoHotspots[k].color = event.e;
            }
          } 
          
        }
      }
    }
    
    switch (event.e) {
      case 'Verde':
        icon.classList.remove('amarillo');
        icon.classList.remove('rojo');
        icon.classList.remove('negro');
        icon.classList.remove('no_triado');
        icon.classList.add('verde');
        break;
      case 'Amarillo':
        icon.classList.remove('verde');
        icon.classList.remove('rojo');
        icon.classList.remove('negro');
        icon.classList.remove('no_triado');
        icon.classList.add('amarillo');
        break;
      case 'Rojo':
        icon.classList.remove('verde');
        icon.classList.remove('amarillo');
        icon.classList.remove('negro');
        icon.classList.remove('no_triado');
        icon.classList.add('rojo');
        break;
      case 'Negro':
        icon.classList.remove('verde');
        icon.classList.remove('amarillo');
        icon.classList.remove('rojo');
        icon.classList.remove('no_triado');
        icon.classList.add('negro');
        break;
      default:
        icon.classList.remove('verde');
        icon.classList.remove('amarillo');
        icon.classList.remove('rojo');
        icon.classList.remove('negro');
        icon.classList.add('no_triado');
        break;
    }
  }

  setPenalizacion(tiempo) {
    this.segundos += tiempo;
    console.log('aumento el crono: ', tiempo);
    if(this.segundos > 59) {
      this.minutos += Math.trunc(this.segundos/60);
      if(this.minutos > 59) {
        this.horas += Math.trunc(this.minutos/60);
        this.minutos = this.minutos%60;
      }
      this.segundos = this.segundos%60;
    }
  }

  marzipanoScene(modal: any): void {

    // Grab elements from DOM.
    var panoElement = document.querySelector('#pano');
    var sceneNameElement = document.querySelector('#titleBar .sceneName');

    // Viewer options.
    var viewerOpts = {
      controls: {
        mouseViewMode: this.data.settings.mouseViewMode
      }
    };

    // Initialize viewer.
    var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

    // Create scenes.
    var scenes = this.data.scenes.map(function(data) {
      var urlPrefix = "././././assets/img/tiles";
      var source = Marzipano.ImageUrlSource.fromString(
        urlPrefix + "/" + data.id + "/{f}.png",
        { cubeMapPreviewUrl: urlPrefix + "/" + data.id + "/scenePreview.png" });
      var geometry = new Marzipano.CubeGeometry(data.levels);

      var limiter = Marzipano.RectilinearView.limit.traditional(data.faceSize, 100*Math.PI/180, 120*Math.PI/180);
      var view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);

      var scene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view,
        pinFirstLevel: true
      });

      // Create link hotspots.
      data.linkHotspots.forEach(function(hotspot) {
        var element = createLinkHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
      });

      // Create info hotspots.
      data.infoHotspots.forEach(function(hotspot) {
        var element = createInfoHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
      });

      return {
        data: data,
        scene: scene,
        view: view
      };
    });

    // DOM elements for view controls.
    var viewUpElement = document.querySelector('#viewUp');
    var viewDownElement = document.querySelector('#viewDown');
    var viewLeftElement = document.querySelector('#viewLeft');
    var viewRightElement = document.querySelector('#viewRight');
    var viewInElement = document.querySelector('#viewIn');
    var viewOutElement = document.querySelector('#viewOut');

    // Dynamic parameters for controls.
    var velocity = 0.7;
    var friction = 3;

    // Associate view controls with elements.
    var controls = viewer.controls();
    controls.registerMethod('upElement',    new Marzipano.ElementPressControlMethod(viewUpElement,     'y', -velocity, friction), true);
    controls.registerMethod('downElement',  new Marzipano.ElementPressControlMethod(viewDownElement,   'y',  velocity, friction), true);
    controls.registerMethod('leftElement',  new Marzipano.ElementPressControlMethod(viewLeftElement,   'x', -velocity, friction), true);
    controls.registerMethod('rightElement', new Marzipano.ElementPressControlMethod(viewRightElement,  'x',  velocity, friction), true);
    controls.registerMethod('inElement',    new Marzipano.ElementPressControlMethod(viewInElement,  'zoom', -velocity, friction), true);
    controls.registerMethod('outElement',   new Marzipano.ElementPressControlMethod(viewOutElement, 'zoom',  velocity, friction), true);

    function sanitize(s) {
      return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
    }

    function switchScene(scene): void {
      scene.view.setParameters(scene.data.initialViewParameters);
      scene.scene.switchTo();
      updateSceneName(scene);
    }

    function updateSceneName(scene) {
      sceneNameElement.innerHTML = sanitize(scene.data.name);
    }

    function createLinkHotspotElement(hotspot: any) {
      // Create wrapper element to hold icon and tooltip.
      var wrapper = document.createElement('div');
      wrapper.classList.add('hotspot');
      wrapper.classList.add('link-hotspot');
      wrapper.style['width'] = '90px';
      wrapper.style['height'] = '90px';

      // Create image element.
      var icon = document.createElement('img');
      icon.src = '././././assets/img/marzipano/link.png';
      icon.classList.add('link-hotspot-icon');
      icon.style['cursor'] = 'pointer';
      icon.style['width'] = '100%';
      icon.style['height'] = '100%';

      // Set rotation transform.
      var transformProperties = [ '-ms-transform', '-webkit-transform', 'transform' ];
      for (var i = 0; i < transformProperties.length; i++) {
        var property = transformProperties[i];
        icon.style[property] = 'rotate(' + hotspot.rotation + 'rad)';
      }

      // Add click event handler.
      wrapper.addEventListener('click', function() {
        switchScene(findSceneById(hotspot.target));
      });

      // Prevent touch and scroll events from reaching the parent element.
      // This prevents the view control logic from interfering with the hotspot.
      stopTouchAndScrollEventPropagation(wrapper);

      // Create tooltip element.
      var tooltip = document.createElement('div');
      tooltip.classList.add('hotspot-tooltip');
      tooltip.classList.add('link-hotspot-tooltip');

      wrapper.appendChild(icon);
      wrapper.appendChild(tooltip);

      return wrapper;
    }

    function createInfoHotspotElement(hotspot) {
      // Create wrapper element to hold icon and tooltip.
      var wrapper = document.createElement('div');
      wrapper.classList.add('hotspot');
      wrapper.classList.add('info-hotspot');
      wrapper.style['width'] = '120px';
      wrapper.style['height'] = '120px';

      // Add click event handler.
      wrapper.addEventListener('click', function() {
        modal.show(hotspot.paciente, hotspot.color);
      });

      // Create hotspot/tooltip header.
      // var header = document.createElement('div');
      // header.classList.add('info-hotspot-header');

      // Create image element.
      // var iconWrapper = document.createElement('div');
      // iconWrapper.classList.add('info-hotspot-icon-wrapper');
      var icon = document.createElement('img');
      // icon.src = '././././assets/img/marzipano/info.png';
      icon.src = hotspot.src;
      icon.classList.add('info-hotspot-icon');
      icon.style['width'] = '100%';
      icon.style['height'] = '100%';
      icon.style['cursor'] = 'pointer';
      // iconWrapper.appendChild(icon);

      var color = document.createElement('i');
      color.classList.add('simple-icon-check');
      color.classList.add('no_triado');
      color.setAttribute('id', 'paciente' + hotspot.index);


      // Create title element.
      // var titleWrapper = document.createElement('div');
      // titleWrapper.classList.add('info-hotspot-title-wrapper');
      // var title = document.createElement('div');
      // title.classList.add('info-hotspot-title');
      // title.innerHTML = hotspot.title;
      // titleWrapper.appendChild(title);

      // Create close element.
      // var closeWrapper = document.createElement('div');
      // closeWrapper.classList.add('info-hotspot-close-wrapper');
      // var closeIcon = document.createElement('img');
      // closeIcon.src = '././././assets/img/marzipano/close.png';
      // closeIcon.classList.add('info-hotspot-close-icon');
      // closeWrapper.appendChild(closeIcon);

      // Construct header element.
      // header.appendChild(iconWrapper);
      // header.appendChild(titleWrapper);
      // header.appendChild(closeWrapper);

      // Create text element.
      // var text = document.createElement('div');
      // text.classList.add('info-hotspot-text');
      // text.innerHTML = hotspot.text;

      // Place header and text into wrapper element.
      // wrapper.appendChild(header);
      // wrapper.appendChild(text);

      // Create a modal for the hotspot content to appear on mobile mode.
      // var modal = document.createElement('div');
      // modal.innerHTML = wrapper.innerHTML;
      // modal.classList.add('info-hotspot-modal');
      // document.body.appendChild(modal);

      // var toggle = function() {
      //   wrapper.classList.toggle('visible');
      //   modal.classList.toggle('visible');
      // };

      // Show content when hotspot is clicked.
      // wrapper.querySelector('.info-hotspot-header').addEventListener('click', toggle);

      // Hide content when close icon is clicked.
      // modal.querySelector('.info-hotspot-close-wrapper').addEventListener('click', toggle);

      // Prevent touch and scroll events from reaching the parent element.
      // This prevents the view control logic from interfering with the hotspot.
      stopTouchAndScrollEventPropagation(wrapper);

      wrapper.appendChild(icon);
      wrapper.appendChild(color);

      return wrapper;
    }

    // Prevent touch and scroll events from reaching the parent element.
    function stopTouchAndScrollEventPropagation(element): void {
      var eventList = [ 'touchstart', 'touchmove', 'touchend', 'touchcancel',
                        'wheel', 'mousewheel' ];
      for (var i = 0; i < eventList.length; i++) {
        element.addEventListener(eventList[i], function(event) {
          event.stopPropagation();
        });
      }
    }

    function findSceneById(id) {
      for (var i = 0; i < scenes.length; i++) {
        if (scenes[i].data.id === id) {
          return scenes[i];
        }
      }
      return null;
    }

    // Display the initial scene.
    switchScene(scenes[0]);

  }

}
