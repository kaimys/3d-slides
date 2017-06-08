const THREE = require('three');
const TWEEN = require('tween');
const parse = require('parse-svg-path');
const contours = require('svg-path-contours');

const { Slide } = require('./slide');

class SvgSlide extends Slide {

  constructor ({ title = 'Title', font = 'fonts/helvetiker_bold.typeface.json', color = 0xff2222, path}) {
    super({title, font, color});
    this.path = path;
  }

  show() {
    super.show();
    if (!this.svg) {
      let contour = contours(parse(this.path));
      let contShape = new THREE.Shape();
      contShape.autoClose = true;
      let points = contour[0];
      let p = points[points.length - 1];
      contShape.moveTo(p[0], p[1]);
      for (p of points) {
        contShape.lineTo(p[0], p[1]);
      }
      for (let i = 1; i < contour.length; i++) {
        let hole = new THREE.Path();
        hole.autoClose = true;
        points = contour[i];
        p = points[points.length - 1];
        hole.moveTo(p[0], p[1]);
        for (p of points) {
          hole.lineTo(p[0], p[1]);
        }
        contShape.holes.push(hole);    
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
      contourGeo.scale(16, 16, 16);
      contourGeo.rotateX(Math.PI);
      let material = [
        new THREE.MeshPhongMaterial({ color: this.color, shading: THREE.FlatShading }),
        new THREE.MeshPhongMaterial({ color: this.color, shading: THREE.SmoothShading })
      ];
      this.svg = new THREE.Mesh(contourGeo, material);
      this.svg.position.set(0, -60, 40);
    }
    this.group.add( this.svg );
  }

  hide() {
    super.hide();
    this.group.remove( this.svg );
  }

}

module.exports = { SvgSlide };
