var THREE = require('three');
var TWEEN = require('tween');

function createText(text, font, size, color) {
  var textGeo = new THREE.TextBufferGeometry( text , {
    font: font,
    size: size,
    height: 20,
    curveSegments: 4,
    bevelThickness: 0.3,
    bevelSize: 1.5,
    bevelEnabled: true,
    material: 0,
    extrudeMaterial: 1
  });
  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();
  var materials = [
    new THREE.MeshPhongMaterial( { color: color, shading: THREE.FlatShading } ), // front
    new THREE.MeshPhongMaterial( { color: color, shading: THREE.SmoothShading } ) // side
  ];
  var textMesh = new THREE.Mesh( textGeo, materials );
  textMesh.rotation.x = 0;
  textMesh.rotation.y = Math.PI * 2;

  return textMesh;
}

class Slide {

  constructor({ title = 'Title', bullets = ['Bullet one'], font = 'fonts/helvetiker_bold.typeface.json', color = 0xff2222 }) {
    this.title = title;
    this.bullets = bullets;
    this.fontName = font;
    this.color = color;
    this.group = new THREE.Group();
    this.titleMesh = null;
    this.bulletMeshs = [];
    this.currentBullet = 0;
  }

  init(callback) {
    var loader = new THREE.FontLoader();
    loader.load(this.fontName, (font) => {
      console.log(`font ${this.fontName} loaded`);
      this.font = font;
      callback();
    });
  }

  show() {
    // Show title
    let mesh = this.titleMesh;
    if (!mesh) {
      mesh = createText(this.title, this.font, 50, this.color);
      let textGeo = mesh.geometry;
      let centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
      mesh.position.set(centerOffset, 130, 0);
      mesh.material[0].transparent = true;
      mesh.material[1].transparent = true;
      mesh.material[0].opacity = 0.0;
      mesh.material[1].opacity = 0.0;      
    }
    // Fade title in
    let material = { opacity: 0.0 };
    let tween = new TWEEN.Tween(material);
    tween.to({ opacity: 1.0 }, 1000).start();
    tween.onUpdate(() => {
      mesh.material[0].opacity = material.opacity;
      mesh.material[1].opacity = material.opacity;
    });
    
    this.group.add(mesh);
    this.titleMesh = mesh;
  }

  hide() {
    // Fade title out
    let mesh = this.titleMesh;
    let material = { opacity: 1.0 };
    let tween = new TWEEN.Tween(material);
    tween.to({ opacity: 0.0 }, 1000).start();
    tween.onUpdate(() => {
      mesh.material[0].opacity = material.opacity;
      mesh.material[1].opacity = material.opacity;
    });
    tween.onComplete(() => {
      this.group.remove(mesh);
    });
  }

  /**
   * next() returns true if there were no more bullets to show. This means the 
   * Presentation should move on to the next slide.
   */
  next() {
    if (this.currentBullet >= this.bullets.length) {
      return true; // next slide
    }

    // Lookup mesh or create it
    let mesh = this.bulletMeshs[this.currentBullet];
    if (!mesh) {
      mesh = createText(this.bullets[this.currentBullet], this.font, 40, this.color);
      mesh.position.set(-1500, 60 - 70 * this.currentBullet, 0);
      this.bulletMeshs.push(mesh);
      this.group.add(mesh);      
    }
    // Move bullet point in
    let position = { x: -1500, y: mesh.position.y, z: 0 };
    let centerOffset = -0.5 * ( mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x );
    let tween = new TWEEN.Tween(position).to({ x: centerOffset, y: mesh.position.y, z: 0 }, 2000);
    tween.easing(TWEEN.Easing.Quadratic.Out);
    tween.onUpdate(() => {
      mesh.position.set(position.x, position.y, position.z);
    });
    tween.start();

    this.currentBullet += 1;
    return false; // stay on this slide
  }

  prev() {
    if (this.currentBullet <= 0) {
      return true; // next slide
    }
    this.currentBullet -= 1;

    // Move mesh out
    let mesh = this.bulletMeshs[this.currentBullet];
    let position = { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z };
    let centerOffset = -0.5 * ( mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x );
    let tween = new TWEEN.Tween(position).to({ x: -1500, y: mesh.position.y, z: 0 }, 2000);
    tween.easing(TWEEN.Easing.Quadratic.Out);
    tween.onUpdate(() => {
      mesh.position.set(position.x, position.y, position.z);
    });
    tween.start();

    return false;
  }

}

module.exports = { Slide };
