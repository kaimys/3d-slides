const { Presentation } = require('./presentation');
const { Slide } = require('./slide');

let presentation = new Presentation({});
presentation.init(() => {
  let slide = new Slide({bullets: ['Slide One', 'Slide Two', 'Slide Three', 'Slide Four', 'Slide Five', 'Slide Six', 'Slide Seven', 'Slide Eight', 'Slide Nine']});
  presentation.add(slide.group);
  slide.init(() => {

    // Navigation
    window.addEventListener( 'keydown', function(event) {
      switch ( event.keyCode ) {
        case 39:
          console.log('Cursor right')
          slide.next();
          return false;
      }
    }, false );

    window.addEventListener( 'resize', function onWindowResize() {
      presentation.camera.aspect = window.innerWidth / window.innerHeight;
      presentation.camera.updateProjectionMatrix();
      presentation.renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );

  })
});

function render() {
  requestAnimationFrame(render);
  presentation.render();    
}
render();

window.p = presentation;
