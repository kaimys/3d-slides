const THREE = require('three');
const TWEEN = require('tween');

const { Slide } = require('./slide');

class BulletSlide extends Slide {

  constructor({ title = 'Title', bullets = ['Bullet one'], font = 'fonts/helvetiker_bold.typeface.json', color = 0xff2222 }) {
    super({title, font, color});
    this.bullets = bullets;
    this.bulletMeshs = [];
    this.currentBullet = 0;
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
      mesh = this.createText(this.bullets[this.currentBullet], this.font, 40, this.color);
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
    let tween = new TWEEN.Tween(position).to({ x: -1500, y: mesh.position.y, z: 0 }, 2000);
    tween.easing(TWEEN.Easing.Quadratic.Out);
    tween.onUpdate(() => {
      mesh.position.set(position.x, position.y, position.z);
    });
    tween.start();

    return false;
  }

}

module.exports = { BulletSlide };
