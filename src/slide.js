var THREE = require('three');
var TWEEN = require('tween');

function createText(text, font, color) {
  var textGeo = new THREE.TextBufferGeometry( text , {
    font: font,
    size: 50,
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

  constructor({bullets = ['Bullet one'], font = 'fonts/helvetiker_bold.typeface.json', color = 0xff2222 }) {
    this.bullets = bullets;
    this.fontName = font;
    this.color = color;
    this.group = new THREE.Group();
    this.y = 130;
    this.i = -1;
  }

  init(callback) {
    var loader = new THREE.FontLoader();
    loader.load(this.fontName, (font) => {
      console.log('font loaded');
      this.font = font;
      callback();
    });
  }

  next() {
    this.i = (this.i + 1) % 10;
    
    if (this.i == 9) {
      // Move slide out
      let position = { x: 0, y: 0, z: 0 };
      let tween = new TWEEN.Tween(position).to({ x: 0, y: 2000, z:0 }, 2000);
      tween.easing(TWEEN.Easing.Quadratic.Out);
      tween.onUpdate(() => {
        this.group.position.set(position.x, position.y, position.z);
      });
      tween.start();
    } else {
      // show next bullet
      let yy = this.y - 70 * this.i;
      let textMesh = createText(this.bullets[this.i], this.font, this.color);
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
    }
  }

}

module.exports = { Slide };
