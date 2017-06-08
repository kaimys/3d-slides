const THREE = require('three');
const TWEEN = require('tween');
const async = require('async');

const { BulletSlide, ImageSlide, SvgSlide } = require('./slides/slides');

class Presentation {

  constructor(width, height, { fogColor, cubeTexture, slides = [] }) {
    this.slides = [];
    this.currentSlide = 0;
    this.fogColor = fogColor;
    this.cubeTexture = cubeTexture;

    // Renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);

    // Camera
    this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    this.camera.position.set( 0, 200, 300 );
    this.cameraTarget = new THREE.Vector3( 0, 0, 0 );
    this.camera.lookAt( this.cameraTarget );

    // Scene
    this.scene = new THREE.Scene();
    
    // Fog
    if (this.fogColor) {
      this.scene.fog = new THREE.Fog(this.fogColor, 100, 900);
      this.renderer.setClearColor(this.fogColor);
    }

    for (let slideData of slides) {
      switch (slideData.type) {
        case 'bullets':
          this.addSlide(new BulletSlide(slideData));
          break;
        case 'image':
          this.addSlide(new ImageSlide(slideData));
          break;
        case 'svg':
          this.addSlide(new SvgSlide(slideData));
          break;
      }
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
      tween.easing(TWEEN.Easing.Quadratic.Out);
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

  prev() {
    if (this.current.prev() && this.currentSlide > 0) {
      this.current.hide();
      this.currentSlide -= 1;
      // Move slide in
      let position = { x: 0, y: 1000, z:0 };
      let tween = new TWEEN.Tween(position).to({ x: 0, y: 0, z: 0 }, 1000);
      tween.delay(1000);
      tween.easing(TWEEN.Easing.Quadratic.Out);
      tween.onUpdate(() => {
        this.current.group.position.set(position.x, position.y, position.z);
      });
      tween.start();
    }
  }

  show() {
    this.current.show();
  }

  init(callback) {
    // Cube texture background
    if (this.cubeTexture) {
      let loader = new THREE.CubeTextureLoader();
      loader.crossOrigin = true;
      loader.setPath(this.cubeTexture.basePath); 
      loader.load(this.cubeTexture.sides, (text) => {
        text.format = THREE.RGBFormat;
        this.scene.background = text;
        console.log('CubeTexture backgroud loaded');
      }, undefined, (err) => {
        console.log('CubeTexture backgroud error' + err.message);
      });
    }

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
