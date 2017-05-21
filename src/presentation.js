const THREE = require('three');
const TWEEN = require('tween');
const async = require('async');

const { Slide } = require('./slide');

class Presentation {

  constructor(width, height, { fogColor = 0x333333, slides = [] }) {
    this.slides = [];
    this.currentSlide = 0;
    this.fogColor = fogColor;

    // Renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor( this.fogColor );

    // Camera
    this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    this.camera.position.set( 0, 200, 300 );
    this.cameraTarget = new THREE.Vector3( 0, 0, 0 );
    this.camera.lookAt( this.cameraTarget );

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(this.fogColor, 100, 900);

    for (let slideData of slides) {
      let slide = new Slide(slideData);
      this.addSlide(slide);
    }

  }

  addSlide(slide) {
    this.slides.push(slide);
    this.add(slide.group);
  }

  get current() {
    return this.slides[this.currentSlide];
  }

  next() {
    if (this.current.next() && (this.currentSlide + 1) < this.slides.length) {
      // Move slide out
      let position = { x: 0, y: 0, z: 0 };
      let tween = new TWEEN.Tween(position).to({ x: 0, y: 1000, z:0 }, 1000);
      tween.easing(TWEEN.Easing.Quadratic.In);
      tween.onUpdate(() => {
        this.current.group.position.set(position.x, position.y, position.z);
      });
      tween.onComplete(() => {
        this.currentSlide += 1;
        this.current.show();
      });
      tween.start();
    }
  }

  show() {
    this.current.show();
  }

  init(callback) {
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
    
    // Initialize all slides
    async.each(this.slides, (slide, callback) => {
      slide.init(callback);
    }, callback);
  }

  add(object) {
    this.scene.add(object);
  }

  /**
   * Executed every render loop
   */
  render() {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    TWEEN.update();
    this.renderer.render(this.scene, this.camera);
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

}

module.exports = { Presentation };
