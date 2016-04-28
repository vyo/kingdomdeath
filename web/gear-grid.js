'use strict';

let startPos = {};

// target elements with the "draggable" class
interact('.draggable')
  .draggable({

    snap: {
      targets: [startPos],
        range: Infinity,
        relativePoints: [ { x: 0.5, y: 0.5 } ],
        endOnly: true
   },
    onstart: function (event) {
       var rect = interact.getElementRect(event.target);

       // record center point when starting the very first a drag
       startPos = {
         x: rect.left + rect.width  / 2,
         y: rect.top  + rect.height / 2
       };
       event.interactable.draggable({
         snap: {
           targets: [startPos]
         }
       });
    },
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      // restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p');

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(event.dx * event.dx +
                     event.dy * event.dy)|0) + 'px');
    }
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    event.target.style.zIndex = "100";
    event.target.style.position = 'relative';
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  accept: '.gear-card',
  // Require a 75% element overlap for a drop to be possible
  // overlap: 0.05,
  overlap: 'center',

  // listen for drop related events:

  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add('drop-active');
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

    // feedback the possibility of a drop
    dropzoneElement.classList.add('drop-target');
    draggableElement.classList.add('can-drop');
    // draggableElement.textContent = 'Dragged in';

    var dropRect = interact.getElementRect(event.target),
        dropCenter = {
          x: dropRect.left + dropRect.width  / 2,
          y: dropRect.top  + dropRect.height / 2
        };

    event.draggable.draggable({
      snap: {
        targets: [dropCenter]
      }
    });
  },
  ondragleave: function (event) {

    startPos = {
      x: event.relatedTarget.getAttribute('data-start-x'),
      y: event.relatedTarget.getAttribute('data-start-y')
    };
    // remove the drop feedback style
    event.target.classList.remove('drop-target');
    event.relatedTarget.classList.remove('can-drop');
    // event.relatedTarget.textContent = 'Dragged out';

    // event.draggable.snap(false);
    event.draggable.draggable({
      snap: {
        targets: [startPos]
      }
    });
  },
  ondrop: function (event) {
    // event.relatedTarget.textContent = 'Dropped';
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active');
    event.target.classList.remove('drop-target');
  }
});
