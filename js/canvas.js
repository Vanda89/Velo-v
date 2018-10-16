var canvas = {
  signature: null,
  context: null,
  signedCanvas: null,
  isDrawing: false,
  lastX: 0,
  lastY: 0,

  // Génération du canvas et définition du canvas et de ses propriétés
  init: function() {
    console.log("init canvas");
    canvas.signedCanvas = false;
    canvas.generateCanvas();
    // Initialisation du canvas avec ses propriétés
    canvas.signature = document.getElementById('signature');
    canvas.context = canvas.signature.getContext('2d');
    canvas.context.lineJoin = 'round';
    canvas.context.lineCap = 'round';
    canvas.context.lineWidth = 2;
    canvas.context.strokeStyle = "#000";

    // Ecouteurs d'évènements qui permet ou non, de dessiner à la souris dans le canvas
    // Démarrage de la signature
    canvas.signature.addEventListener('mousedown', function(e) {
      canvas.isDrawing = true;
      // moveTo = lineTo position de démarrage = position d'arrêt
      [canvas.lastX, canvas.lastY] = [e.offsetX, e.offsetY];
      // Canvas signé
      canvas.signedCanvas = true;
    });
    // On peut dessiner
    canvas.signature.addEventListener('mousemove', canvas.draw);
    // Arrêt de la signature car relâchement du bouton de la souris
    canvas.signature.addEventListener('mouseup', function() {
      canvas.isDrawing = false;
    });
    // Arrêt de la signature car sortie du canvas
    canvas.signature.addEventListener('mouseout', function() {
      canvas.isDrawing = false;
    });

    // En cours de développement
    // Ecouteurs d'évènements qui permet ou non, de dessiner à la souris dans le canvas
    // canvas.signature.addEventListener('touchstart', function(e) {
    //   canvas.isDrawing = true;
    //   [canvas.lastX, canvas.lastY] = [e.touches[0].pageX, e.touches[0].pageY];
    //   canvas.signedCanvas = true;
    // });
    // canvas.signature.addEventListener('touchmove', canvas.touchDraw, false);
    // canvas.signature.addEventListener('touchend', function() {
    //   canvas.isDrawing = false;
    // });

    // Au clic sur le bouton "effacer", le canvas s'efface et la signature est invalidée
    $('#delete').click(function() {
      canvas.context.clearRect(0, 0, 280, 70);
      canvas.signedCanvas = false;
    });

    // Au clic sur le bouton "valider", appel de la fonction validate() qui permettra de valider ou non la réservation
    $('#validate').click(function() {
      canvas.validate();
    });
  },

  // Génération HTML du canvas
  generateCanvas: function() {
    let canvasContainer = $('<div>').attr('id', 'stations-booked-canvas');
    let title = $('<h3>').attr('id', 'title-canvas').text('Veuillez signer le canvas pour confirmer');
    let canvas = $('<canvas>').attr({
      id: "signature",
      width: "280",
      height: "70"
    });
    let canvasController = $('<div>').attr('id', 'canvas-controller');
    let deleteButton = $('<button>').attr({
      id: "delete",
      type: "button",
      name: "button"
    }).text("effacer");
    let validateButton = $('<button>').attr({
      id: "validate",
      type: "button",
      name: "button"
    }).text("valider");
    canvasController.append(deleteButton, validateButton);
    canvasContainer.append(title, canvas, canvasController).appendTo($('#stations-booked'));
  },

  // Fonction permettant de dessiner dans le canvas si le curseur de la souris est sur l'élément et si le bouton de la souris est enfoncé
  draw: function(e) {
    // Arrêt de la fonction (cf écouteurs d'évènement mouse...)
    if (!canvas.isDrawing) return;
    // Ecouteur d'évènement au mouvement du curseur
    canvas.context.beginPath();
    canvas.context.moveTo(canvas.lastX, canvas.lastY);
    canvas.context.lineTo(e.offsetX, e.offsetY);
    canvas.context.stroke();
    [canvas.lastX, canvas.lastY] = [e.offsetX, e.offsetY];
  },

  // Fonction de dessin en tactile (développement)
  // touchDraw: function(e) {
  //   e.preventDefault();
  //   canvas.context.beginPath();
  //   canvas.context.moveTo(canvas.lastX, canvas.lastY);
  //   canvas.context.lineTo(e.touches[0].pageX, e.touches[0].pageY);
  //   canvas.context.stroke();
  //   [canvas.lastX, canvas.lastY] = [e.touches[0].pageX, e.touches[0].pageY];
  // },

  // Fonction de validation du canvas
  validate: function() {
    // Récupère les infos de la station choisie depuis la fonction getCurrentStation() de l'objet app.js.
    var currentStation = app.getCurrentStation();
    /* Si le canvas est signé, alors la station actuelle est sauvegardée avec ses infos dans la fonction saveCurrentStation()
    de l'objet app.js, le canvas est supprimé, bouton "Réserver" de nouveau visible et message footer reservation vidé */
    if (canvas.signedCanvas === true) {
      app.saveCurrentStation(currentStation);
      canvas.remove();
      $('#btn-book').show();
      $('#infosReservation').empty();
    // Sinon s'il n'est pas signé, le titre du canvas clignote grâce à la méthode fadeTo()
    } else if (canvas.signedCanvas === false) { //
      $('#title-canvas').fadeTo('slow', 0).fadeTo('slow', 1);
    }
  },

  // Permet de supprimer le canvas et son conteneur
  remove: function() {
    $('#stations-booked-canvas').remove();
  },
};
