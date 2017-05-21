const { Presentation } = require('./presentation');
const { Slide } = require('./slide');

let presentation = new Presentation(window.innerWidth, window.innerHeight, {});
document.body.appendChild(presentation.renderer.domElement);
let slide = new Slide({bullets: ['Slide One', 'Slide Two', 'Slide Three', 'Slide Four', 'Slide Five', 'Slide Six', 'Slide Seven', 'Slide Eight', 'Slide Nine']});
presentation.addSlide(slide);

presentation.init(() => {
 
  function render() {
    requestAnimationFrame(render);
    presentation.render();    
  }
  render();

  // Navigation
  window.addEventListener('keydown', function onKeydown(event) {
    switch ( event.keyCode ) {
      case 39:
        console.log('Cursor right')
        slide.next();
        return false;
    }
  }, false );

  window.addEventListener('resize', function onWindowResize() {
    presentation.resize(window.innerWidth, window.innerHeight);
  }, false );

});

window.p = presentation;
