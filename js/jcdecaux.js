var jcdecaux = {
  stationsList : [],
  url : 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=0e34579ec13fe00d12af91bba4218207cf414ce2',

  init: function() {
    console.log('init Jcdecaux');
    // Initialisation d'un objet XHR
    var request = new XMLHttpRequest();
    // Préparation de la requête afin de récupérer les données statiques et dynamiques concernant les stations
    // de vélos de Lyon grâce à la méthode GET et la clé d'API.
    request.open('GET', jcdecaux.url);
    request.onload = function() {
      // Utilisation de la méthode parse pour interpréter le fichier JSON et affichage
      jcdecaux.stationsList = JSON.parse(this.responseText);
      console.log('jcdecaux request ok');
      // Envoi de la liste des stations à l'app.js
      app.sendStationsToMap(jcdecaux.stationsList);
    };

    // S'il y a un problème, appel de la fonction displayError() de l'objet app.js qui se chargera d'afficher les messages d'erreurs
    request.onerror = function(stationsList) {
      console.log('jcdecaux request error');
      app.displayError();
    };

    request.send(null);
  },
};
