Template.map.onRendered(function (){

  var mapTemplate = this;
  var mapContainer = mapTemplate.find('.map');

  // TODO: craft this sound like fx-welcome.wav
  // mapTemplate.opening = Parallels.Audio.player.play('moogSeq');





  /************ TODO: move all of this out to Animation class *********************************
   * Copyright (C) 2011 by Paul Lewis
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   * 
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   */

   // adapted from: http://lab.aerotwist.com/webgl/surface/

  var AEROTWIST = AEROTWIST || {};
  AEROTWIST.RemixSlices = new function(){

    // internal vars
    var camera,
      scene,
      renderer      = null,
      canvas        = null,
      context       = null,
      vars          = [],
      projector     = new THREE.Projector(),
      center        = new THREE.Vector3(),
      image         = null,
      testFilePath  = null,
      running       = true,
      
      $slicesContainer    = null,
      width         = null,
      height        = null,

      // core objects
      mesh       = null,
      meshVerts  = [],
      
      // constants
      DAMPEN        = .9,
      AGGRESSION    = 400,
      DEPTH         = 500,
      NEAR          = 1,
      FAR           = 10000,
      X_RESOLUTION  = 20,
      Y_RESOLUTION  = 20,
      SURFACE_WIDTH = 400,
      SURFACE_HEIGHT= 400,
      DROP_RATE     = 200,
      fin           = true;
    
    this.pause = function() {
      running = false;
    }
    
    this.play = function() {
      if(!running) {
        running = true;
        update();
      }
    }
    
    this.init = function() {

      // dont allow clicking
      document.onselectstart = function(){ return false; };
      
      $slicesContainer    = $('#create-parallel--remix-splices');
      width               = $slicesContainer.width();
      height              = $slicesContainer.height();

      // set test image
      testFilePath = "images/1000/mine_williamsburg_lampost_highway_dusk_dawn_sky_meloncholy_5077-cropped.jpg";
      image = document.createElement('img');
      image.src = testFilePath;

      // set up our initial vars
      vars["magnitude"]         = 30;
      vars["wireframeOpacity"]  = 1;
      vars["elasticity"]        = 0.001;
      
      // add listeners
      addEventListeners();
      
      if(createRenderer())
      {

        addLights();
        createObjects();
      
        updatePlane();

        // give the browser chance to
        // create the image object
        setTimeout(function(){
          
          // split the image
          updatePlane();
          
        }, 100);

        // // start rendering
        update();
      }
      
      else {
        $('html').removeClass('webgl').addClass('no-webgl');
      }
    };
    
    
    /**
     * Simple handler function for 
     * the events we don't care about
     */
    // function cancel(event)
    // {
    //  if(event.preventDefault)
    //    event.preventDefault();
      
    //  return false;
    // }
    
    /**
     * Adds some basic lighting to the
     * scene. Only applies to the centres
     */
    function addLights() {
      pointLight = new THREE.PointLight( 0xFFFFFF, 0.4 );
      pointLight.position.x = 10;
      pointLight.position.y = 100;
      pointLight.position.z = 10;
      scene.addLight( pointLight );

      ambientLight = new THREE.AmbientLight( 0xbbbbbb );
      scene.addLight( ambientLight );
    }
    

    function createObjects() {

      var planeMaterial = new THREE.MeshLambertMaterial({
          color: 0xFFFFFF, 
          map: THREE.ImageUtils.loadTexture(testFilePath)
          //, shading: THREE.SmoothShading
      });
      
      var planeMaterialWire = new THREE.MeshLambertMaterial({ 
          color: 0xFFFFFF, 
          wireframe:true 
      });
      
      mesh = new THREE.Mesh(
        new THREE.Plane(SURFACE_WIDTH, SURFACE_HEIGHT, X_RESOLUTION, Y_RESOLUTION), 
        [planeMaterial, planeMaterialWire]
      );

      mesh.rotation.x = -Math.PI * .5;
      mesh.overdraw = true;

      // scene.addChild(mesh); // v37 API
      scene.add(mesh);
      
      // go through each vertex
      meshVerts = mesh.geometry.vertices;
      sCount = meshVerts.length;
      
      // three.js creates the verts for the
      // mesh in x,y,z order I think
      while(sCount--) {
        var vertex    = meshVerts[sCount];
        vertex.springs  = [];
        vertex.velocity = new THREE.Vector3();
        
        // connect this vertex to the ones around it
        if(vertex.position.x > (-SURFACE_WIDTH * .5)) {
          // connect to left
          vertex.springs.push({start:sCount, end:sCount-1});
        }
        
        if(vertex.position.x < (SURFACE_WIDTH * .5)) {
          // connect to right
          vertex.springs.push({start:sCount, end:sCount+1});
        }
        
        if(vertex.position.y < (SURFACE_HEIGHT * .5)) {
          // connect above
          vertex.springs.push({start:sCount, end:sCount-(X_RESOLUTION+1)});
        }

        if(vertex.position.y > (-SURFACE_HEIGHT * .5)) {
          // connect below
          vertex.springs.push({start:sCount, end:sCount+(X_RESOLUTION+1)});
        }
      }
    }
    
    /**
     * Creates the WebGL renderer
     */
    function createRenderer()
    {
      var ok = false;
      
      try {
        // TODO: add a non-WebGl fallback with THREE.CanvasRenderer().
        // THREE.CanvasRenderer() is not to be confused with the <canvas> DOM element which
        // we use to display the WebGL scene.
        renderer          = new THREE.WebGLRenderer( { devicePixelRatio: window.devicePixelRatio || 1 } );
        camera            = new THREE.Camera(
          45, 
          width / height, 
          NEAR, 
          FAR);

        scene             = new THREE.Scene();
        canvas            = document.createElement('canvas');
        canvas.width      = SURFACE_WIDTH;
        canvas.height     = SURFACE_HEIGHT;
        context           = canvas.getContext('2d');
        
        context.fillStyle = "#000000";
        context.beginPath();
        context.fillRect(0,0,SURFACE_WIDTH,SURFACE_HEIGHT);
        context.closePath();
        context.fill();
      
        // position the camera
        camera.position.y       = 220;
        camera.position.z     = DEPTH;

        // alternative
        // We place it 15 units to the left of the origin, 
        // 10 units above the origin, 
        // and 15 units in front of the origin.
        // camera.position.set( -15, 10, 15 );

        // start the renderer
        renderer.setSize(width, height);
        $slicesContainer.append(renderer.domElement);

        log.debug("created renderer...");
        ok = true;
      }

      catch(e)
      {
        log.debug("AEROTWIST: error: ", e)
        ok = false;
      }
      
      return ok;
    }
    
    /**
     * Sets up the event listeners for DnD, the GUI
     * and window resize
     */
    function addEventListeners()
    {
      // window event
      $(window).resize(callbacks.windowResize);
      $(window).keydown(callbacks.keyDown);
      
      // click handler
      $(document.body).mousedown(callbacks.mouseDown);
      $(document.body).mouseup(callbacks.mouseUp);
      $(document.body).click(callbacks.mouseClick);
      
      var container = $slicesContainer[0];
      // container.addEventListener('dragover', cancel, false);
      // container.addEventListener('dragenter', cancel, false);
      // container.addEventListener('dragexit', cancel, false);
      // container.addEventListener('drop', dropFile, false);
    }
    
    function updatePlane()
    {
      var ratio           = 1 / Math.max(image.width/SURFACE_WIDTH, image.height/SURFACE_HEIGHT);
      var scaledWidth     = image.width * ratio;
      var scaledHeight    = image.height * ratio;
      context.drawImage(
                image,
                0,
                0,
                image.width,
                image.height,
                (SURFACE_WIDTH - scaledWidth) * 0.5, 
                (SURFACE_HEIGHT - scaledHeight) * 0.5, 
                scaledWidth, 
                scaledHeight
      );
    
      var newPlaneMaterial  = new THREE.MeshLambertMaterial({
          color: 0xFFFFFF, 
          map: THREE.ImageUtils.loadTexture(canvas.toDataURL("image/png")), 
          shading: THREE.SmoothShading
        });

      mesh.materials[0]  = newPlaneMaterial;
    }
    
    /**
     * Updates the velocity and position
     * of the particles in the view
     */
    function update()
    {
      
      mesh.materials[1].opacity = vars["wireframeOpacity"];
      
      var v = meshVerts.length;
      while(v--) {
        var vertex      = meshVerts[v],
          acceleration  = new THREE.Vector3(0, 0, -vertex.position.z * vars["elasticity"]),
          springs     = vertex.springs,
          s       = springs.length;
        
        vertex.velocity.addSelf(acceleration);
        
        while(s--) {
          var spring    = springs[s],
            extension = meshVerts[spring.start].position.z - meshVerts[spring.end].position.z;
          
          acceleration  = new THREE.Vector3(0, 0, extension * vars["elasticity"] * 50);
          meshVerts[spring.end].velocity.addSelf(acceleration);
          meshVerts[spring.start].velocity.subSelf(acceleration);
        }

        vertex.position.addSelf(vertex.velocity);
        
        vertex.velocity.multiplyScalar(DAMPEN);
      }
      
      mesh.geometry.computeFaceNormals(true);
      mesh.geometry.__dirtyVertices = true;
      mesh.geometry.__dirtyNormals = true;
      
      // render the frame, with requestAnimationFrame(), a modern replacement for 
      // setInterval() method, designed specifically for animating. Better than setInterval() because 
      // browser can optimize the animation to make it smoother + can reduce the animation's frame rate
      // if it's running in a background tab,  conserving battery life on laptops + mobile devices.
      requestAnimationFrame(render);
      // requestAnimationFrame(testLogger);
    }

    function testLogger(){
      log.debug("rendering frame");
    }
    
    /**
     * Renders the current state
     */
    function render() {
      // only render
      if(renderer) {
        renderer.render(scene, camera);
      }
      
      // set up the next frame
      if(running) {
        update();
      }
    }
    
    /**
     * Our internal callbacks object - a neat
     * and tidy way to organise the various
     * callbacks in operation.
     */
    callbacks = {
     
      windowResize: function() {
        
        if(camera)
        {
          width     = $slicesContainer.width(),
          height      = $slicesContainer.height(),
          camera.aspect   = width / height,
          renderer.setSize(width, height);
        
          camera.updateProjectionMatrix();
        }
      }
      
    };
  };

  if(Modernizr.webgl) {
    AEROTWIST.RemixSlices.init();
  }

  // so we can access it later
  mapTemplate.remixSlices = AEROTWIST.RemixSlices;

  mapContainer._uihooks = {

    insertElement: function(node, next) {
      var bitDataContext = Blaze.getData(node) || Session.get('createTextBit') || Session.get('sketchBit');

      $(node).insertBefore(next);

      function timelineInsertDone (node) {
        // TODO: only if text bit
        $(node).find('.editbit').focus();
      }

      var timelineInsert = new TimelineMax({
        onComplete: timelineInsertDone,
        onCompleteParams:[ node ]
      });

      timelineInsert
        .to(node, 0, { x: bitDataContext.position.x, y: bitDataContext.position.y })
        .to(node, 0.125, { ease: Bounce.easeIn , display: 'block', opacity: 1, alpha: 1 })
        .to(node, 0.125, { scale: 0.95, ease: Quint.easeOut } )
        .to(node, 0.275, { scale: 1, ease: Elastic.easeOut } );
    },

    removeElement: function(node) {

      function timelineRemoveDone(node){
        $(node).remove();
        log.debug("bit:remove:uihook : timeline animate done. removed bit.");
      }

      var timelineRemove = new TimelineMax({
        onComplete: timelineRemoveDone,
        onCompleteParams:[ node ]
      });

      timelineRemove.to(node, 0.10, { opacity: 0, ease:Expo.easeIn, display: 'none' });
    }
  };

});





