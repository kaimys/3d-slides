const { Presentation } = require('./presentation');
const { Slide } = require('./slide');

let doc = {
  slides: [
    { 
      bullets: ['Slide 1 bullet 1', 'Slide 1 bullet 2', 'Slide 1 bullet 3', 'Slide1one bullet 4', 'Slide 1 bullet 5', 'Slide 1 bullet 6 '] 
    }, {
      font: 'fonts/droid_sans_bold.typeface.json',
      bullets: ['Slide 2 bullet 1', 'Slide 2 bullet 2', 'Slide 2 bullet 3', 'Slide 2 bullet 4', 'Slide 2 bullet 5', 'Slide 2 bullet 6 ']
    }, { 
      font: 'fonts/gentilis_bold.typeface.json',
      bullets: ['Slide 3 bullet 1', 'Slide 3 bullet 2', 'Slide 3 bullet 3', 'Slide 3 bullet 4', 'Slide 3 bullet 5', 'Slide 3 bullet 6 ']
    }, { 
      font: 'fonts/optimer_bold.typeface.json',
      bullets: ['Slide 4 bullet 1', 'Slide 4 bullet 2', 'Slide 4 bullet 3', 'Slide 4 bullet 4', 'Slide 4 bullet 5', 'Slide 4 bullet 6 ']
    }
  ]
};

let presentation = new Presentation(window.innerWidth, window.innerHeight, doc);
document.body.appendChild(presentation.renderer.domElement);

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
        presentation.next();
        return false;
    }
  }, false );

  window.addEventListener('resize', function onWindowResize() {
    presentation.resize(window.innerWidth, window.innerHeight);
  }, false );

});

window.p = presentation;
