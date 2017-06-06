const THREE = require('three');
const TWEEN = require('tween');
const async = require('async');

const parse = require('parse-svg-path');
const contours = require('svg-path-contours');

const { BulletSlide, ImageSlide } = require('./slides/slides');

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
      switch (slideData.type) {
        case 'bullets':
          this.addSlide(new BulletSlide(slideData));
          break;
        case 'image':
          this.addSlide(new ImageSlide(slideData));
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
    //let geometry = new THREE.BoxGeometry( 350, 350, 350 );
    let material = new THREE.MeshPhongMaterial( { color: 0x1188ff, shading: THREE.FlatShading } );
    //this.cube = new THREE.Mesh( geometry, material );
    //this.cube.position.set( 0, -200, -300 );
    //this.add( this.cube );

    // SVG
    let svgPath = 'M17,1H3C1.9,1,1,1.9,1,3v14c0,1.101,0.9,2,2,2h7v-7H8V9.525h2V7.475c0-2.164,1.212-3.684,3.766-3.684l1.803,0.002v2.605h-1.197C13.378,6.398,13,7.144,13,7.836v1.69h2.568L15,12h-2v7h4c1.1,0,2-0.899,2-2V3C19,1.9,18.1,1,17,1z';
    let material3d = new THREE.MeshPhongMaterial({color: 0x1188ff, shading: THREE.SmoothShading});
    let points = contours(parse(svgPath))[0];
    let contShape = new THREE.Shape();
    contShape.autoClose = true;
    let p = points[points.length - 1];
    contShape.moveTo(p[0], p[1]);
    for (p of points) {
      contShape.lineTo(p[0], p[1]);
    }
    let contourGeo = new THREE.ExtrudeGeometry(contShape, {
      steps: 1,
      amount: 2,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.2,
      bevelSegments: 1
    });
    contourGeo.computeBoundingBox();
    contourGeo.computeVertexNormals();
    let bb = contourGeo.boundingBox;
    contourGeo.translate(-0.5 * (bb.max.x - bb.min.x), -0.5 * (bb.max.y - bb.min.y), 0);
    contourGeo.scale(20, 20, 20);
    contourGeo.rotateX(Math.PI);
    this.cube = new THREE.Mesh(contourGeo, [material, material3d]);
    this.cube.position.set(0, -200, -300);

    this.add(this.cube);
    
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
