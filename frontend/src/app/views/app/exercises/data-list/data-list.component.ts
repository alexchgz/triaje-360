import { Component, OnInit, ViewChild } from '@angular/core';
import { Ejercicio } from '../../../../models/ejercicio.model';
import { EjercicioService } from 'src/app/data/ejercicio.service';
import { Asignatura } from '../../../../models/asignatura.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SenderService } from '../../../../data/sender.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { EjerciciosUsuarioService } from '../../../../data/ejerciciosUsuario.service';
import { EjerciciosUsuario } from '../../../../models/ejerciciosUsuario.model';
import { AuthService } from 'src/app/shared/auth.service';
import Swal from 'sweetalert2';
// import * as Marzipano from 'marzipano';
var Marzipano = require('marzipano');

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss'],
  providers: [DatePipe]
})
export class DataListComponent implements OnInit {
  displayMode = 'list';
  selectAllState = '';
  selected: Ejercicio[] = [];
  data: Ejercicio[] = [];
  exercisesInTime: string[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  search = '';
  orderBy = '';
  totalItem = 0;
  totalPage = 0;
  itemSubject = '';
  userId: string;
  userRole: number;
  totalEjerciciosUsuario = 0;
  ejerciciosUsuario: EjerciciosUsuario[] = [];

  constructor(private ejercicioService: EjercicioService,
    private datePipe: DatePipe, private router: Router, public sender: SenderService, private notifications: NotificationsService,
    private ejerciciosUsuarioService: EjerciciosUsuarioService, private auth: AuthService) {
  }

  ngOnInit(): void {
    this.userRole = this.auth.rol;
    this.userId = this.auth.uid;    
    this.itemSubject = this.sender.idSubject;
    this.sender.idSubjectExercise = undefined;
    this.sender.idExercise = undefined;
    this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject, this.userId);
    // this.marzipanoScene();
    // this.marzipanoScene2();
  }

  marzipanoScene2(): void {
    // var screenfull = window.screenfull;
    var data = {
      "scenes": [
        {
          "id": "0-r0010362",
          "name": "R0010362",
          "levels": [
            {
              "tileSize": 256,
              "size": 256,
              "fallbackOnly": true
            },
            {
              "tileSize": 512,
              "size": 512
            },
            {
              "tileSize": 512,
              "size": 1024
            }
          ],
          "faceSize": 896,
          "initialViewParameters": {
            "yaw": 0.6055223935490552,
            "pitch": -0.01992316828963503,
            "fov": 1.3687812585745385
          },
          "linkHotspots": [
            {
              "yaw": -0.3048205232822383,
              "pitch": 0.13273023062821565,
              "rotation": 4.71238898038469,
              "target": "1-r0010355"
            }
          ],
          "infoHotspots": [
            {
              "yaw": 0.27690254020700955,
              "pitch": 0.08942986117396678,
              "title": "Info",
              "text": "Hotspot Info"
            }
          ]
        },
        {
          "id": "1-r0010355",
          "name": "R0010355",
          "levels": [
            {
              "tileSize": 256,
              "size": 256,
              "fallbackOnly": true
            },
            {
              "tileSize": 512,
              "size": 512
            },
            {
              "tileSize": 512,
              "size": 1024
            }
          ],
          "faceSize": 896,
          "initialViewParameters": {
            "pitch": 0,
            "yaw": 0,
            "fov": 1.5707963267948966
          },
          "linkHotspots": [
            {
              "yaw": -0.3048205232822383,
              "pitch": 0.13273023062821565,
              "rotation": 4.71238898038469,
              "target": "2-r0010442"
            }
          ],
          "infoHotspots": []
        },
        {
          "id": "2-r0010442",
          "name": "R0010442",
          "levels": [
            {
              "tileSize": 256,
              "size": 256,
              "fallbackOnly": true
            },
            {
              "tileSize": 512,
              "size": 512
            },
            {
              "tileSize": 512,
              "size": 1024
            }
          ],
          "faceSize": 896,
          "initialViewParameters": {
            "yaw": -1.0006674819595993,
            "pitch": 0.0473607522179762,
            "fov": 1.3687812585745385
          },
          "linkHotspots": [
            {
              "yaw": -0.3048205232822383,
              "pitch": 0.13273023062821565,
              "rotation": 4.71238898038469,
              "target": "0-r0010362"
            }
          ],
          "infoHotspots": []
        }
      ],
      "name": "Prueba1",
      "settings": {
        "mouseViewMode": "drag",
        "autorotateEnabled": false,
        "fullscreenButton": false,
        "viewControlButtons": false
      }
    };

    // Grab elements from DOM.
    var panoElement = document.querySelector('#pano');
    var sceneNameElement = document.querySelector('#titleBar .sceneName');
    var sceneListElement = document.querySelector('#sceneList');
    var sceneElements = document.querySelectorAll('#sceneList .scene');
    var sceneListToggleElement = document.querySelector('#sceneListToggle');
    var autorotateToggleElement = document.querySelector('#autorotateToggle');
    var fullscreenToggleElement = document.querySelector('#fullscreenToggle');

    // Viewer options.
    var viewerOpts = {
      controls: {
        mouseViewMode: data.settings.mouseViewMode
      }
    };

    // Initialize viewer.
    var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

    // Create scenes.
    var scenes = data.scenes.map(function(data) {
      var urlPrefix = "././././assets/img/tiles";
      var source = Marzipano.ImageUrlSource.fromString(
        urlPrefix + "/" + data.id + "/{z}/{f}/{y}/{x}.jpg",
        { cubeMapPreviewUrl: urlPrefix + "/" + data.id + "/preview.jpg" });
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

    // Set up autorotate, if enabled.
    var autorotate = Marzipano.autorotate({
      yawSpeed: 0.03,
      targetPitch: 0,
      targetFov: Math.PI/2
    });
    if (data.settings.autorotateEnabled) {
      autorotateToggleElement.classList.add('enabled');
    }

    // Set handler for autorotate toggle.
    autorotateToggleElement.addEventListener('click', toggleAutorotate);

    // Set up fullscreen mode, if supported.
    // if (screenfull.enabled && data.settings.fullscreenButton) {
    //   document.body.classList.add('fullscreen-enabled');
    //   fullscreenToggleElement.addEventListener('click', function() {
    //     screenfull.toggle();
    //   });
    //   screenfull.on('change', function() {
    //     if (screenfull.isFullscreen) {
    //       fullscreenToggleElement.classList.add('enabled');
    //     } else {
    //       fullscreenToggleElement.classList.remove('enabled');
    //     }
    //   });
    // } else {
    //   document.body.classList.add('fullscreen-disabled');
    // }

    // Set handler for scene list toggle.
    sceneListToggleElement.addEventListener('click', toggleSceneList);

    // Start with the scene list open on desktop.
    if (!document.body.classList.contains('mobile')) {
      showSceneList();
    }

    // Set handler for scene switch.
    scenes.forEach(function(scene) {
      var el = document.querySelector('#sceneList .scene[data-id="' + scene.data.id + '"]');
      el.addEventListener('click', function() {
        switchScene(scene);
        // On mobile, hide scene list after selecting a scene.
        if (document.body.classList.contains('mobile')) {
          hideSceneList();
        }
      });
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
      stopAutorotate();
      scene.view.setParameters(scene.data.initialViewParameters);
      scene.scene.switchTo();
      startAutorotate();
      updateSceneName(scene);
      updateSceneList(scene);
    }

    function updateSceneName(scene) {
      sceneNameElement.innerHTML = sanitize(scene.data.name);
    }

    function updateSceneList(scene): void {
      for (var i = 0; i < sceneElements.length; i++) {
        var el = sceneElements[i];
        if (el.getAttribute('data-id') === scene.data.id) {
          el.classList.add('current');
        } else {
          el.classList.remove('current');
        }
      }
    }

    function showSceneList(): void {
      sceneListElement.classList.add('enabled');
      sceneListToggleElement.classList.add('enabled');
    }

    function hideSceneList(): void {
      sceneListElement.classList.remove('enabled');
      sceneListToggleElement.classList.remove('enabled');
    }

    function toggleSceneList(): void {
      sceneListElement.classList.toggle('enabled');
      sceneListToggleElement.classList.toggle('enabled');
    }

    function startAutorotate(): void {
      if (!autorotateToggleElement.classList.contains('enabled')) {
        return;
      }
      viewer.startMovement(autorotate);
      viewer.setIdleMovement(3000, autorotate);
    }

    function stopAutorotate(): void {
      viewer.stopMovement();
      viewer.setIdleMovement(Infinity);
    }

    function toggleAutorotate(): void {
      if (autorotateToggleElement.classList.contains('enabled')) {
        autorotateToggleElement.classList.remove('enabled');
        stopAutorotate();
      } else {
        autorotateToggleElement.classList.add('enabled');
        startAutorotate();
      }
    }

    function createLinkHotspotElement(hotspot: any) {
      // Create wrapper element to hold icon and tooltip.
      var wrapper = document.createElement('div');
      wrapper.classList.add('hotspot');
      wrapper.classList.add('link-hotspot');

      // Create image element.
      var icon = document.createElement('img');
      icon.src = '././././assets/img/marzipano/link.png';
      icon.classList.add('link-hotspot-icon');

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
      tooltip.innerHTML = findSceneDataById(hotspot.target).name;

      wrapper.appendChild(icon);
      wrapper.appendChild(tooltip);

      return wrapper;
    }

    function createInfoHotspotElement(hotspot) {
      // Create wrapper element to hold icon and tooltip.
      var wrapper = document.createElement('div');
      wrapper.classList.add('hotspot');
      wrapper.classList.add('info-hotspot');

      // Create hotspot/tooltip header.
      var header = document.createElement('div');
      header.classList.add('info-hotspot-header');

      // Create image element.
      var iconWrapper = document.createElement('div');
      iconWrapper.classList.add('info-hotspot-icon-wrapper');
      var icon = document.createElement('img');
      icon.src = '././././assets/img/marzipano/info.png';
      icon.classList.add('info-hotspot-icon');
      iconWrapper.appendChild(icon);

      // Create title element.
      var titleWrapper = document.createElement('div');
      titleWrapper.classList.add('info-hotspot-title-wrapper');
      var title = document.createElement('div');
      title.classList.add('info-hotspot-title');
      title.innerHTML = hotspot.title;
      titleWrapper.appendChild(title);

      // Create close element.
      var closeWrapper = document.createElement('div');
      closeWrapper.classList.add('info-hotspot-close-wrapper');
      var closeIcon = document.createElement('img');
      closeIcon.src = '././././assets/img/marzipano/close.png';
      closeIcon.classList.add('info-hotspot-close-icon');
      closeWrapper.appendChild(closeIcon);

      // Construct header element.
      header.appendChild(iconWrapper);
      header.appendChild(titleWrapper);
      header.appendChild(closeWrapper);

      // Create text element.
      var text = document.createElement('div');
      text.classList.add('info-hotspot-text');
      text.innerHTML = hotspot.text;

      // Place header and text into wrapper element.
      wrapper.appendChild(header);
      wrapper.appendChild(text);

      // Create a modal for the hotspot content to appear on mobile mode.
      var modal = document.createElement('div');
      modal.innerHTML = wrapper.innerHTML;
      modal.classList.add('info-hotspot-modal');
      document.body.appendChild(modal);

      var toggle = function() {
        wrapper.classList.toggle('visible');
        modal.classList.toggle('visible');
      };

      // Show content when hotspot is clicked.
      wrapper.querySelector('.info-hotspot-header').addEventListener('click', toggle);

      // Hide content when close icon is clicked.
      modal.querySelector('.info-hotspot-close-wrapper').addEventListener('click', toggle);

      // Prevent touch and scroll events from reaching the parent element.
      // This prevents the view control logic from interfering with the hotspot.
      stopTouchAndScrollEventPropagation(wrapper);

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

    function findSceneDataById(id) {
      for (var i = 0; i < data.scenes.length; i++) {
        if (data.scenes[i].id === id) {
          return data.scenes[i];
        }
      }
      return null;
    }

    // Display the initial scene.
    switchScene(scenes[0]);

  }

  marzipanoScene(): void {
    var panoElement = document.getElementById('pano');
    var viewerOpts = {
      controls: {
        mouseViewMode: 'drag'    // drag|qtvr
      }
    };

    var viewer = new Marzipano.Viewer(panoElement, viewerOpts)

    var levels = [
      { tileSize: 256, size: 256, fallbackOnly: true },
      { tileSize: 512, size: 512 },
      { tileSize: 512, size: 1024 }
    ];
    
    var geometry = new Marzipano.CubeGeometry(levels);
    
    var source = Marzipano.ImageUrlSource.fromString("././././assets/img/tiles/0-r0010362/{z}/{f}/{y}/{x}.jpg", {
      cubeMapPreviewUrl: "././././assets/img/tiles/0-r0010362/preview.jpg"
    });

    var initialView = {
      yaw: 90 * Math.PI/180,
      pitch: -30 * Math.PI/180,
      fov: 90 * Math.PI/180
    };

    var limiter = Marzipano.RectilinearView.limit.traditional(1024, 120*Math.PI/180);
    var view = new Marzipano.RectilinearView(initialView, limiter);

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    scene.switchTo({
      transitionDuration: 1000
    });

    console.log('creo la escena');
  }

  loadExercises(pageSize: number, currentPage: number, subject: string, userId: string): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.ejercicioService.getExercises(pageSize, currentPage, subject, userId).subscribe(
      data => {

        this.data = data['ejercicios'];
        this.exercisesInTime = data['ejerciciosEnTiempo'];
        this.changeDateFormat();
        this.totalItem = data['totalEjercicios'];
        this.setSelectAllState();
        
      },
      error => {
        this.notifications.create('Error', 'No se han podido cargar los Ejercicios', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  dropExercises(exercises: Ejercicio[]): void {
    
    for(let i=0; i<exercises.length; i++){
      this.ejercicioService.dropExercise(exercises[i].uid).subscribe(
        data => {
          this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject, this.userId);

          this.notifications.create('Ejercicios eliminados', 'Se han eliminado los Ejercicios correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        },
        error => {

          this.notifications.create('Error', 'No se han podido eliminar los Ejercicios', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
        }
      );
    }
  }

  dropExercise(exercise: Ejercicio): void {
    
      this.ejercicioService.dropExercise(exercise.uid).subscribe(
        data => {
          this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject, this.userId);

          this.notifications.create('Ejercicio eliminado', 'Se ha eliminado el Ejercicio correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        },
        error => {

          this.notifications.create('Error', 'No se ha podido eliminar el Ejercicio', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
        }
      );

  }

  changeDateFormat(): void {
    for(let i = 0; i < this.data.length; i++) {
      this.data[i].desde = this.datePipe.transform(this.data[i].desde, 'dd/MM/yyyy');
      this.data[i].hasta = this.datePipe.transform(this.data[i].hasta, 'dd/MM/yyyy');
    }
  }

  toEditExercise(e: Ejercicio): void {
    this.sender.idSubjectExercise = e.asignatura._id;
    this.sender.idExercise = e.uid;
    this.router.navigateByUrl("/app/dashboards/all/subjects/add-exercise");
  }

  toViewExercise(uid: number): void {
    this.sender.idExercise = uid;
    this.router.navigate(['/app/dashboards/all/exercises/view-exercise']);
  }

  createUserExercise(exercise: Ejercicio): void {

    // comprobamos el numero de intentos del usuario en ese ejercicio
    if(exercise.max_intentos <= exercise['intentos']) {
      this.maxAttempts();
    } else {
      this.ejerciciosUsuarioService.createUserExercise(this.userId, exercise['_id'])
        .subscribe( res => {

          this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject, this.userId);
          this.notifications.create('Registro creado', 'Se ha creado el registro de Ejercicio correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        }, (err) => {
          this.notifications.create('Error', 'No se ha podido crear el registro del Ejercicio', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });
    }
  }

  maxAttempts(): void {
    this.notifications.create('Máximo de Intentos Alcanzado', 'Se han alcanzado el máximo de intentos permitidos para realizar este ejercicio', NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 6000,
      showProgressBar: true
    });
  }

  inTime(id: string): boolean {
    let isInTime = false;

    if(this.exercisesInTime.includes(id)) {
      isInTime = true;
    }

    return isInTime;

  }

  exerciseDisabled(): void {
    this.notifications.create('Error', 'La realización de este Ejercicio ya no está disponible', NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 5000,
      showProgressBar: false
    });
  }

  confirmDelete(ejercicio: Ejercicio): void {
    Swal.fire({
      title: 'Eliminar Ejercicio',
      text: '¿Estás seguro de que quieres eliminar el Ejercicio?',
      icon: 'warning',
      showDenyButton: true,
      iconColor: '#145388',
      confirmButtonColor: '#145388',
      denyButtonColor: '#145388',
      confirmButtonText: `Sí`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.dropExercise(ejercicio);
      } else if (result.isDenied) {
        Swal.close();
      }
    });
  }

  // LIST PAGE HEADER METHODS
  isSelected(p: Ejercicio): boolean {
    return this.selected.findIndex(x => x.uid === p.uid) > -1;
  }

  onSelect(item: Ejercicio): void {
    if (this.isSelected(item)) {
      this.selected = this.selected.filter(x => x.uid !== item.uid);
    } else {
      this.selected.push(item);
    }
    this.setSelectAllState();
  }

  setSelectAllState(): void {
    if (this.selected.length === this.data.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.data];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  pageChanged(event: any): void {
    this.loadExercises(this.itemsPerPage, event.page, this.itemSubject, this.userId);
  }

  itemsPerPageChange(perPage: number): void {
    this.loadExercises(perPage, 1, this.itemSubject, this.userId);
  }

  subjectChange(subject: Asignatura): void {
    if(subject.uid == undefined) {
      this.itemSubject = undefined;
      this.sender.idSubject = undefined;
    } else {
      this.itemSubject = subject.uid.toString();
      this.sender.idSubject = subject.uid.toString();
    }
    
    this.loadExercises(this.itemsPerPage, this.currentPage, this.itemSubject, this.userId);
  }

}
