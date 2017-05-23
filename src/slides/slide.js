const THREE = require('three');
const TWEEN = require('tween');

class Slide {

  constructor({ title = 'Title', font = 'fonts/helvetiker_bold.typeface.json', color = 0xff2222 }) {
    this.title = title;
    this.fontName = font;
    this.color = color;
    this.group = new THREE.Group();
    this.titleMesh = null;
  }

  show() {
    // Show title
    let mesh = this.titleMesh;
    if (!mesh) {
      mesh = this.createText(this.title, this.font, 50, this.color);
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


  createText(text, font, size, color) {
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

}

module.exports = { Slide };
