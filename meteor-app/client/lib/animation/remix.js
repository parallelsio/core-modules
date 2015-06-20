
  /************ 

   * ADAPTED FROM:  http://lab.aerotwist.com/webgl/surface/  
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
   


   * Changes for Parallels:
      * Updated to latest three.js API
      * removed drag + drop support
      * removed raindrops
      * removed mouse events
*/

Remix = {

  camera             : null,
  scene              : null,
  renderer           : null,
  canvas             : null,
  context            : null,
  vars               : [],

  image              : null,
  testFilePath       : null,
  running            : true,
  $slicesContainer   : null,
  scenewidth         : null,
  sceneHeight        : null,

  mesh               : null,
  meshVerts          : [],
  
  DAMPEN             : 0.9,
  DEPTH              : 500,
  NEAR               : 1,
  FAR                : 10000,
  X_RESOLUTION       : 20,
  Y_RESOLUTION       : 20,
  SURFACE_WIDTH      : 400,
  SURFACE_HEIGHT     : 400,


  //  Only applies to the centres
  createAndAddLights: function(){
    var pointLight = new THREE.PointLight( 0xFFFFFF, 0.4 );
    pointLight.position.x = 10;
    pointLight.position.y = 100;
    pointLight.position.z = 10;

    this.scene.add( pointLight );

    // ambientLight = new THREE.AmbientLight( 0xbbbbbb );
    // this.scene.add( ambientLight );
  },
  

  createAndAddObjects: function(){

    var planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF, 
      map: THREE.ImageUtils.loadTexture(this.testFilePath),
      shading: THREE.SmoothShading
    });
    
    var planeMaterialWire = new THREE.MeshLambertMaterial({ 
      color: 0xFFFFFF, 
      wireframe:true 
    });
    
    var geometry = new THREE.PlaneGeometry(
      this.SURFACE_WIDTH, 
      this.SURFACE_HEIGHT, 
      this.X_RESOLUTION, 
      this.Y_RESOLUTION
    );
    
    var materials = [planeMaterial, planeMaterialWire];

    this.mesh = new THREE.Mesh(geometry, materials);

    // this.mesh.rotation.x = -Math.PI * .5;
    this.mesh.overdraw = true;

    this.scene.add(this.mesh);
    
    // go through each vertex
    this.meshVerts = this.mesh.geometry.vertices;
    var sCount = this.meshVerts.length;
    
    // three.js creates the verts for the
    // mesh in x,y,z order I think
    while(sCount--) {
      var vertex      = this.meshVerts[sCount];
      vertex.springs  = [];
      vertex.velocity = new THREE.Vector3();
      
      // connect this vertex to the ones around it
      if(vertex.x > ( -this.SURFACE_WIDTH * 0.5)) {
        vertex.springs.push({start:sCount, end:sCount - 1 }); // connect to left
      }
      
      if(vertex.x < ( this.SURFACE_WIDTH * 0.5)) {
        vertex.springs.push({start:sCount, end:sCount + 1 });  // connect to right
      }
      
      if(vertex.y < ( this.SURFACE_HEIGHT * 0.5)) {
        vertex.springs.push({ start:sCount, end:sCount - (this.X_RESOLUTION + 1) }); // connect above
      }

      if(vertex.y > ( -this.SURFACE_HEIGHT * 0.5)) {
        vertex.springs.push({start:sCount, end:sCount + (this.X_RESOLUTION + 1 ) }); // connect below
      }
    }
  },
  

  createWebGLRenderer: function() {
    var ok = false;
    
    try {
      // TODO: add a non-WebGl fallback with THREE.CanvasRenderer().
      // THREE.CanvasRenderer() is not to be confused with the <canvas> DOM element which
      // we use to display the WebGL scene.
      this.renderer               = new THREE.WebGLRenderer( { devicePixelRatio: window.devicePixelRatio || 1 } );
      this.camera                 = new THREE.Camera(
        45, 
        this.sceneWidth / this.sceneHeight, 
        this.NEAR, 
        this.FAR);

      this.scene                  = new THREE.Scene();
      this.canvas                 = document.createElement('canvas');
      this.canvas.width           = this.SURFACE_WIDTH;
      this.canvas.height          = this.SURFACE_HEIGHT;
      this.context                = this.canvas.getContext('2d');
      
      this.context.fillStyle      = "#000000";
      this.context.beginPath();
      this.context.fillRect( 0, 0, this.SURFACE_WIDTH, this.SURFACE_HEIGHT);
      this.context.closePath();
      this.context.fill();
    
      this.camera.position.y      = 220;
      this.camera.position.z      = this.DEPTH;

      // alternative:
      // We place it 15 units to the left of the origin, 
      // 10 units above the origin, 
      // and 15 units in front of the origin.
      // camera.position.set( -15, 10, 15 );

      // start the renderer
      this.renderer.setSize(this.sceneWidth, this.sceneHeight);
      this.$slicesContainer.append(this.renderer.domElement);

      log.debug("created renderer...");
      ok = true;
    }

    catch(e) {
      log.debug("createWebGLRenderer error: ", e)
      ok = false;
    }
    
    return ok;
  },
  
  redrawPlane: function() {
    var ratio           = 1 / Math.max( this.image.width / this.SURFACE_WIDTH, 
                                        this.image.height/this.SURFACE_HEIGHT);
    var scaledWidth     = this.image.width * ratio;
    var scaledHeight    = this.image.height * ratio;

    this.context.drawImage(
              this.image,
              0,
              0,
              this.image.width,
              this.image.height,
              (this.SURFACE_WIDTH - this.scaledWidth) * 0.5, 
              (this.SURFACE_HEIGHT - this.scaledHeight) * 0.5, 
              scaledWidth, 
              scaledHeight
    );
  
    var newPlaneMaterial  = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF, 
        map: THREE.ImageUtils.loadTexture(this.canvas.toDataURL("image/png")), 
        shading: THREE.SmoothShading
      });

    this.mesh.material[0]  = newPlaneMaterial;
  },
  
  /**
   * Updates the velocity and position
   * of the particles in the view
   */
  updateMesh: function() {
    
    this.mesh.material[1].opacity = this.vars["wireframeOpacity"];
    
    var v = this.meshVerts.length;
    while(v--) {
      var vertex        = this.meshVerts[v];
      var acceleration  = new THREE.Vector3(0, 0, -vertex.z * this.vars["elasticity"]);
      var springs       = vertex.springs;
      var s             = springs.length;
      
      vertex.velocity.add(acceleration);
      
      while(s--) {
        var spring      = springs[s];
        var extension   = this.meshVerts[spring.start].z - this.meshVerts[spring.end].z;
        
        acceleration    = new THREE.Vector3(0, 0, extension * this.vars["elasticity"] * 50);
        this.meshVerts[spring.end].velocity.add(acceleration);
        this.meshVerts[spring.start].velocity.sub(acceleration);
      }

      vertex.add(vertex.velocity);
      
      vertex.velocity.multiplyScalar(this.DAMPEN);
    }
    
    this.mesh.geometry.computeFaceNormals(true);
    this.mesh.geometry.verticesNeedUpdate = true;
    this.mesh.geometry.normalsNeedUpdate = true;
    
    // render the frame, with requestAnimationFrame(), a modern replacement for 
    // setInterval() method, designed specifically for animating. Better than setInterval() because 
    // browser can optimize the animation to make it smoother + can reduce the animation's frame rate
    // if it's running in a background tab,  conserving battery life on laptops + mobile devices.
    requestAnimationFrame(this.renderCurrentState);
  },

  renderCurrentState: function() {
    // only render
    if(this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
    
    // set up the next frame
    if(this.running) {
      this.updateMesh();
    }
  },


  initSlices: function(path){
    
    this.$slicesContainer      = $('#create-parallel--remix-splices');
    this.sceneWidth            = this.$slicesContainer.width();
    this.sceneHeight           = this.$slicesContainer.height();

    this.image = document.createElement('img');
    this.image.src = this.testFilePath = path;

    // set up our initial this.vars
    this.vars["magnitude"]         = 30;
    this.vars["wireframeOpacity"]  = 1;
    this.vars["elasticity"]        = 0.001;
    
    if( this.createWebGLRenderer() ) {

      this.createAndAddObjects();
      this.createAndAddLights();
      this.redrawPlane();

      // give the browser chance to
      // create the image object
      setTimeout(function(){
        this.redrawPlane(); // split the image
      }, 100);

      this.updateMesh();
    }
    
    else {
      $('html').removeClass('webgl').addClass('no-webgl');
    }
  }
    

}