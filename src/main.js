var THREE = require('three');
var TWEEN = require('tween');

function tweenText(text, font, y) {
  // Title
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
  var color = 0xff2222;
  var materials = [
    new THREE.MeshPhongMaterial( { color: color, shading: THREE.FlatShading } ), // front
    new THREE.MeshPhongMaterial( { color: color, shading: THREE.SmoothShading } ) // side
  ];
  var textMesh = new THREE.Mesh( textGeo, materials );
  var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
  textMesh.rotation.x = 0;
  textMesh.rotation.y = Math.PI * 2;

  // Motion
  var position = { x:-800, y:y, z:0 };
  textMesh.position.set(position.x, position.y, position.z);
  var tween = new TWEEN.Tween(position).to({ x:centerOffset, y:y, z:0 }, 2000);
  tween.easing(TWEEN.Easing.Quadratic.InOut);
  tween.onUpdate(function(){
    textMesh.position.set(position.x, position.y, position.z);
  });
  tween.start();

  group.add( textMesh );  

  return textMesh;
}

// Scene
var scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0x333333, 100, 900 );
scene.o = {};

// Renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( scene.fog.color );
document.body.appendChild( renderer.domElement );

// Camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 200, 300 );
var cameraTarget = new THREE.Vector3( 0, 0, 0 );
camera.lookAt( cameraTarget );
scene.o.camera = camera;

// Lights
var light = new THREE.AmbientLight( 0x202020 ); // soft white light
scene.add( light );

var pointLight1 = new THREE.PointLight( 0xffff00, 0.3 );
pointLight1.position.set( 300, 200, 90 );
scene.add( pointLight1 );

var pointLight2 = new THREE.PointLight( 0x00ff00, 0.3 );
pointLight2.position.set( -200, 50, 90 );
scene.add( pointLight2 );

var dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
dirLight.position.set( 0, 3, 10 ).normalize();
scene.add( dirLight );

// Objects
var group = new THREE.Group();
scene.add( group );

// Cube
var geometry = new THREE.BoxGeometry( 350, 350, 350 );
var material = new THREE.MeshPhongMaterial( { color: 0x1188ff, shading: THREE.FlatShading } );
var cube = new THREE.Mesh( geometry, material );
cube.position.set( 0, -200, -300 );
scene.add( cube );
scene.o.cube = cube;

// Text
var loader = new THREE.FontLoader();
loader.load( 'fonts/helvetiker_bold.typeface.json', function ( font ) {
  console.log('font loaded')

  var y = 130, i = -1, minutes = ['Slide One', 'Slide Two', 'Slide Three', 'Slide Four', 'Slide Five', 'Slide Six', 'Slide Seven', 'Slide Eight', 'Slide Nine', ];

  // Navigation
  document.addEventListener( 'keydown', function(event) {
    switch ( event.keyCode ) {
      case 37:
        event.preventDefault();
        i = (i - 1) % 10;
        tweenText(minutes[i], font, y - 70*i);
        return false;

      case 39:
        event.preventDefault();
        i = (i + 1) % 10;

        // Move out
        if (i == 9) {
          var position = { x: 0, y: 0, z: 0 };
          var tween = new TWEEN.Tween(position).to({ x: 0, y: 2000, z:0 }, 2000);
          tween.easing(TWEEN.Easing.Quadratic.InOut);
          tween.onUpdate(function(){
            group.position.set(position.x, position.y, position.z);
          });
          tween.start();          
        } else {
          tweenText(minutes[i], font, y - 70*i);
        }
        return false;
    }
  }, false );
});

// Render
function render() {
	requestAnimationFrame( render );
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  TWEEN.update();

  renderer.render( scene, camera );
}
render();

window.addEventListener( 'resize', function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}, false );
