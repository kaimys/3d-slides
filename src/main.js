const { Presentation } = require('./presentation');

let doc = {
  slides: [
    {
      type: 'bullets', title: 'Helvetiker red',
      bullets: ['Slide 1 bullet 1', 'Slide 1 bullet 2', 'Slide 1 bullet 3', 'Slide 1 bullet 4', 'Slide 1 bullet 5', 'Slide 1 bullet 6 '] 
    }, {
      type: 'image', 
      title: 'Schloss Heidelberg', 
      image: '/slides/schloss-heidelberg.jpg'
    }, {
      type: 'bullets', 
      title: 'Droid Sans green',
      font: 'fonts/droid_sans_bold.typeface.json',
      color: 0x22ff22,
      bullets: ['Slide 2 bullet 1', 'Slide 2 bullet 2', 'Slide 2 bullet 3', 'Slide 2 bullet 4', 'Slide 2 bullet 5', 'Slide 2 bullet 6 ']
    }, { 
      type: 'bullets', 
      title: 'Gentilis magenta',
      font: 'fonts/gentilis_bold.typeface.json',
      color: 0xff22ff,
      bullets: ['Slide 3 bullet 1', 'Slide 3 bullet 2', 'Slide 3 bullet 3', 'Slide 3 bullet 4', 'Slide 3 bullet 5', 'Slide 3 bullet 6 ']
    }, { 
      type: 'bullets', 
      title: 'Optimer yellow',
      font: 'fonts/optimer_bold.typeface.json',
      color: 0xffff22,
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
    switch (event.keyCode) {
      case 37:
        presentation.prev();
        return false;

      case 39:
        presentation.next();
        return false;
    }
  }, false );

  window.addEventListener('resize', function onWindowResize() {
    presentation.resize(window.innerWidth, window.innerHeight);
  }, false );

  presentation.show();

});

window.p = presentation;
