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
    this.y = 60;
    this.i = -1;
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
    let textMesh = createText(this.title, this.font, 50, this.color);
    let textGeo = textMesh.geometry;
    let centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    textMesh.position.set(centerOffset, 130, 0);
    textMesh.material[0].transparent = true;
    textMesh.material[1].transparent = true;
    textMesh.material[0].opacity = 0.0;
    textMesh.material[1].opacity = 0.0;
    
    // Fade title in
    let material = { opacity: 0.0 };
    let tween = new TWEEN.Tween(material);
    tween.to({ opacity: 1.0 }, 1000).start();
    tween.onUpdate(() => {
      textMesh.material[0].opacity = material.opacity;
      textMesh.material[1].opacity = material.opacity;
    });
    
    this.group.add(textMesh);
    this.titleMesh = textMesh;
  }

  /**
   * next() returns true if there were no more bullets to show. This means the 
   * Presentation should move on to the next slide.
   */
  next() {
    this.i += 1;
    if (this.i >= this.bullets.length) {
      return true; // next slide
    }

    // Show next bullet
    let yy = this.y - 70 * this.i;
    let textMesh = createText(this.bullets[this.i], this.font, 40, this.color);
    let textGeo = textMesh.geometry;
    // Motion
    let position = { x: -800, y: yy, z: 0 };
    let centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    let tween = new TWEEN.Tween(position).to({ x: centerOffset, y: yy, z: 0 }, 2000);
    tween.easing(TWEEN.Easing.Quadratic.Out);
    tween.onUpdate(() => {
      textMesh.position.set(position.x, position.y, position.z);
    });
    tween.start();
    this.group.add(textMesh);

    return false; // stay on this slide
  }

}

module.exports = { Slide };
