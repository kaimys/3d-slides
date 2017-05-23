const THREE = require('three');
const TWEEN = require('tween');

const { Slide } = require('./slide');

class ImageSlide extends Slide {

  constructor ({ title = 'Title', font = 'fonts/helvetiker_bold.typeface.json', color = 0xff2222, image }) {
    super({title, font, color});
    this.image = image;
    this.imageTexture = null;
    this.plane = null;
  }

  init(callback) {
    super.init(() => {
      const loader = new THREE.TextureLoader();
      loader.load(this.image, (texture) => {
        this.imageTexture = texture;
        console.log(`${this.image} loaded`);
        callback();
      });
    });
  }

  show() {
    super.show();
    if (!this.plane) {
      let geometry = new THREE.PlaneGeometry( 640 * 1.6, 440 * 1.5 );
      let material = new THREE.MeshBasicMaterial( { 
        color: 0xffff00, 
        side: THREE.DoubleSide, 
        map: this.imageTexture,
        transparent: true,
        opacity: 0.9
      } );
      this.plane = new THREE.Mesh( geometry, material );
      this.plane.rotation.x = -0.6;
    }

    let position = { x: -1000, y: -1000, z: -2000 };
    this.plane.position.set(position.x, position.y, position.z);
    let tween = new TWEEN.Tween(position).to({ x: 0, y: 0, z: 0 }, 2000);
    tween.easing(TWEEN.Easing.Quadratic.Out);
    tween.onUpdate(() => {
      this.plane.position.set(position.x, position.y, position.z);
    });
    tween.start();
    
    this.group.add( this.plane );
  }

  hide() {
    super.hide();
    this.group.remove( this.plane );
  }

}

module.exports = { ImageSlide };
