var THREE = require('three');
var TWEEN = require('tween');

class Presentation {

  constructor({ fogColor = 0x333333 }) {
    this.fogColor = fogColor;
    this.scene = new THREE.Scene();
  }

  init(callback) {
    // Renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor( this.fogColor );
    document.body.appendChild( this.renderer.domElement );

    // Camera
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.set( 0, 200, 300 );
    this.cameraTarget = new THREE.Vector3( 0, 0, 0 );
    this.camera.lookAt( this.cameraTarget );

    // Scene
    this.scene.fog = new THREE.Fog( this.fogColor, 100, 900 );

    // Lights
    this.light = new THREE.AmbientLight( 0x202020 ); // soft white light
    this.add( this.light );

    this.pointLight1 = new THREE.PointLight( 0xffff00, 0.3 );
    this.pointLight1.position.set( 300, 200, 90 );
    this.add( this.pointLight1 );

    this.pointLight2 = new THREE.PointLight( 0x00ff00, 0.3 );
    this.pointLight2.position.set( -200, 50, 90 );
    this.add( this.pointLight2 );

    this.dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    this.dirLight.position.set( 0, 3, 10 ).normalize();
    this.add( this.dirLight );

    // Cube
    let geometry = new THREE.BoxGeometry( 350, 350, 350 );
    let material = new THREE.MeshPhongMaterial( { color: 0x1188ff, shading: THREE.FlatShading } );
    this.cube = new THREE.Mesh( geometry, material );
    this.cube.position.set( 0, -200, -300 );
    this.add( this.cube );
    
    callback();
  }

  add(object) {
    this.scene.add(object);
  }

  render() {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    TWEEN.update();
    this.renderer.render( this.scene, this.camera );
  }

}

module.exports = { Presentation };
