var app = {

  currentStation: {
    name: null,
    status: null,
    available_bikes: null,
    reserved: null,
  },

  init: function() {
    console.log('init app');
    slideshow.init();
    jcdecaux.init();
    googleMaps.init();
    webStorage.init();
  },

  // Récupère la traduction du json de l'objet jcdecaux.js afin de renvoyer la liste des stations à l'objet googleMaps.js
  sendStationsToMap: function(stationsList) {
    return googleMaps.stations(stationsList);
  },

  // Permet d'envoyer un message en mode console et dans le footer pour l'utilisateur, afin d'indiquer que la liste des stations n'a pu être téléchargée
  displayError: function() {
    console.error("Une erreur s'est produite au cours de la réception de la liste des stations de vélo'v.");
    $('#infosReservation').text("Une erreur s'est produite au cours de la réception de la liste des stations de vélo'v.");
  },

  // Récupère les informations d'une station au clic sur son marqueur depuis l'objet googleMaps.js
  setCurrentStation: function(station) {
    app.currentStation = station;
  },

  /*#btn-book => Bouton Réserver
  #infosReservation => div message footer état station
  #infosCountdown => div message footer compte à rebour
  #bikes td => élément contenant le nombre de vélos
  .fa-times => croix du panneau latéral*/
  setReservation: function() {
    $('#btn-book').hide();
    if (app.currentStation.status === 'OPEN') {
      // Si station ouverte avec des vélos et pas de réservation
      if (app.currentStation.available_bikes > 0 && !app.reserved()) {
        $('#btn-book').show().click(function() {
          canvas.init();
          $('#btn-book').hide();
        });
        $('#infosReservation').text('Vous pouvez réserver un vélo dans cette station.');
        $('#infosCountdown').text('Vous n\'avez aucun vélo de réservé pour l\'instant !');
        //Sinon s'il n'y a pas de vélos...
      } else if (app.currentStation.available_bikes === 0) {
        $('#btn-book').hide().click(function() {
          app.removeCanvas();
        });
        $('#bikes td').text('Aucun vélos de disponible');
        $('#infosReservation').text("Il n'y a aucun vélo de disponible à la station " + app.currentStation.name + ", veuillez choisir une autre station.");
        // Sinon s'il y a déjà une réserv en cours dans la station choisie...
      } else if (app.currentStation.available_bikes > 0 && app.reserved()) {
        $('#btn-book').show().click(function() {
          canvas.init();
          $('#btn-book').hide();
        });
        $('#infosReservation').text('Vous pouvez réserver un vélo dans cette station, mais une nouvelle réservation entraînera la suppression de la précédente.');
      };
    } else {
      $('#btn-book').hide();
      $('#infosReservation').text('Cette station est fermée, veuillez choisir une autre station.')
    }
    // Au clic sur la croix, le panneau latéral est fermée
    $('.fa-times').click(function() {
      $('#stations-booked').hide();
    });
  },

  // Permet de supprimer le canvas grâce à la fonction remove() de l'objet canvas.js
  removeCanvas: function() {
    canvas.remove();
  },

  // Permet à un autre objet de récupérer les informations de la station choisie (canvas.js)
  getCurrentStation: function() {
    return app.currentStation;
  },

  // Permet de récupérer le nom de la station dans laquelle la réservation a été faite et de l'envoyer à l'objet webStorage.js et de démarrer son compte à rebour
  saveCurrentStation: function(station) {
    webStorage.saveData('station', station.name);
    webStorage.startCountdown();
  },

  // Récupère si une réservation a été faite ou non, grâce à la fonction isReserved() de l'objet webStorage.js
  reserved: function() {
    return webStorage.isReserved();
  },
};
