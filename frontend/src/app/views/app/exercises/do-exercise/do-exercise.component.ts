import { Component, OnInit } from '@angular/core';
// import * as Marzipano from 'marzipano';
var Marzipano = require('marzipano');

@Component({
  selector: 'app-do-exercise',
  templateUrl: './do-exercise.component.html',
  styleUrls: ['./do-exercise.component.scss']
})
export class DoExerciseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.marzipanoScene();
  }

  marzipanoScene(): void {
    // var screenfull = window.screenfull;
    var data = {
      "scenes": [
        // {
        //   "id": "0-r0010362",
        //   "name": "R0010362",
        //   "levels": [
        //     {
        //       "tileSize": 256,
        //       "size": 256,
        //       "fallbackOnly": true
        //     },
        //     {
        //       "tileSize": 512,
        //       "size": 512
        //     },
        //     {
        //       "tileSize": 512,
        //       "size": 1024
        //     }
        //   ],
        //   "faceSize": 896,
        //   "initialViewParameters": {
        //     "yaw": 0.6055223935490552,
        //     "pitch": -0.01992316828963503,
        //     "fov": 1.3687812585745385
        //   },
        //   "linkHotspots": [
        //     {
        //       "yaw": -0.3048205232822383,
        //       "pitch": 0.13273023062821565,
        //       "rotation": 4.71238898038469,
        //       "target": "1-r0010355"
        //     }
        //   ],
        //   "infoHotspots": [
        //     {
        //       "yaw": 0.27690254020700955,
        //       "pitch": 0.08942986117396678,
        //       "title": "Info",
        //       "text": "Hotspot Info"
        //     }
        //   ]
        // },
        // {
        //   "id": "1-r0010355",
        //   "name": "R0010355",
        //   "levels": [
        //     {
        //       "tileSize": 256,
        //       "size": 256,
        //       "fallbackOnly": true
        //     },
        //     {
        //       "tileSize": 512,
        //       "size": 512
        //     },
        //     {
        //       "tileSize": 512,
        //       "size": 1024
        //     }
        //   ],
        //   "faceSize": 896,
        //   "initialViewParameters": {
        //     "pitch": 0,
        //     "yaw": 0,
        //     "fov": 1.5707963267948966
        //   },
        //   "linkHotspots": [
        //     {
        //       "yaw": -0.3048205232822383,
        //       "pitch": 0.13273023062821565,
        //       "rotation": 4.71238898038469,
        //       "target": "2-r0010442"
        //     }
        //   ],
        //   "infoHotspots": []
        // },
        // {
        //   "id": "2-r0010442",
        //   "name": "R0010442",
        //   "levels": [
        //     {
        //       "tileSize": 256,
        //       "size": 256,
        //       "fallbackOnly": true
        //     },
        //     {
        //       "tileSize": 512,
        //       "size": 512
        //     },
        //     {
        //       "tileSize": 512,
        //       "size": 1024
        //     }
        //   ],
        //   "faceSize": 896,
        //   "initialViewParameters": {
        //     "yaw": -1.0006674819595993,
        //     "pitch": 0.0473607522179762,
        //     "fov": 1.3687812585745385
        //   },
        //   "linkHotspots": [
        //     {
        //       "yaw": -0.3048205232822383,
        //       "pitch": 0.13273023062821565,
        //       "rotation": 4.71238898038469,
        //       "target": "I-0001"
        //     }
        //   ],
        //   "infoHotspots": []
        // },
        {
          "id": "I-0001",
          "name": "Imagen 1",
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
            // {
            //   "tileSize": 512,
            //   "size": 1024
            // }
          ],
          "faceSize": 896,
          "initialViewParameters": {
            "yaw": -1.0006674819595993,
            "pitch": 0.0473607522179762
          },
          "linkHotspots": [
            {
                    "yaw": -0.3048205232822383,
                    "pitch": 0.13273023062821565,
                    "rotation": 4.71238898038469,
                    "target": "I-0001"
                  }
          ],
          "infoHotspots": [
          ]
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
        urlPrefix + "/" + data.id + "/{f}.png",
        { cubeMapPreviewUrl: urlPrefix + "/" + data.id + "/preview.png" });
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
    // autorotateToggleElement.addEventListener('click', toggleAutorotate);

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
    // sceneListToggleElement.addEventListener('click', toggleSceneList);

    // Start with the scene list open on desktop.
    // if (!document.body.classList.contains('mobile')) {
    //   showSceneList();
    // }

    // Set handler for scene switch.
    // scenes.forEach(function(scene) {
    //   var el = document.querySelector('#sceneList .scene[data-id="' + scene.data.id + '"]');
    //   el.addEventListener('click', function() {
    //     switchScene(scene);
    //     // On mobile, hide scene list after selecting a scene.
    //     if (document.body.classList.contains('mobile')) {
    //       hideSceneList();
    //     }
    //   });
    // });

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
      // stopAutorotate();
      scene.view.setParameters(scene.data.initialViewParameters);
      scene.scene.switchTo();
      // startAutorotate();
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

    // function startAutorotate(): void {
    //   if (!autorotateToggleElement.classList.contains('enabled')) {
    //     return;
    //   }
    //   viewer.startMovement(autorotate);
    //   viewer.setIdleMovement(3000, autorotate);
    // }

    // function stopAutorotate(): void {
    //   viewer.stopMovement();
    //   viewer.setIdleMovement(Infinity);
    // }

    // function toggleAutorotate(): void {
    //   if (autorotateToggleElement.classList.contains('enabled')) {
    //     autorotateToggleElement.classList.remove('enabled');
    //     stopAutorotate();
    //   } else {
    //     autorotateToggleElement.classList.add('enabled');
    //     startAutorotate();
    //   }
    // }

    function createLinkHotspotElement(hotspot: any) {
      // Create wrapper element to hold icon and tooltip.
      var wrapper = document.createElement('div');
      wrapper.classList.add('hotspot');
      wrapper.classList.add('link-hotspot');

      // Create image element.
      var icon = document.createElement('img');
      icon.src = '././././assets/img/marzipano/link.png';
      icon.classList.add('link-hotspot-icon');
      icon.style['cursor'] = 'pointer';

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
      // tooltip.innerHTML = findSceneDataById(hotspot.target).name;

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

}
