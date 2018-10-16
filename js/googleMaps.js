//Définition de la variable qui contient l'application
var googleMaps = {
  //Déclaration des propriétés de l'application
  map: null,
  stationsList: [],
  markerClusterer: null,
  currentMarker: null,

  init: function() {
    console.log("init map");
    // Génération HTML carte
    googleMaps.generateMap();

    // Création d'une nouvelle carte (Lyon) et définition de ses propriétés
    googleMaps.map = new google.maps.Map(document.getElementById('stations-map'), {
      center: {
        lat: 45.758000,
        lng: 4.85000
      },
      zoom: 12,
      minZoom: 8,
      keyboardShortcuts: false,
      gestureHandling: 'auto',
    });
  },

  // Génération HTML de la carte
  generateMap: function () {
    let map = $('<div>').attr('id', 'stations-map');
    map.appendTo($('#stations'));
  },

  // Fonction récupérant la liste des stations et affichant les marqueurs, les données des stations en infobulle et dans le panneau latéral
  stations: function(stationsList) {
    // Récupération de la liste des stations depuis l'app.js
    googleMaps.stationsList = stationsList;
    console.log('init googleMaps.station');
    // Création du tableau qui contiendra la liste des marqueurs
    var markers = [];

    // Boucle principale qui attribue ses propriétés à chacune des stations de vélo'v
    for (var i = 0; i < googleMaps.stationsList.length; i++) {

      // Calcul permettant de déterminer le pourcentage du nombre de vélos comparé au nombre de place dans la station
      typeMarker = (googleMaps.stationsList[i].available_bikes * 100) / (googleMaps.stationsList[i].available_bike_stands + googleMaps.stationsList[i].available_bikes);
      // Attribution d'une image différente aux marqueurs suivant ce pourcentage
      var iconMarker = null;
      // Si la station est fermée, OU qu'elle ne contient pas de vélos ET pas de places => marker avec cône de chantier
      if (googleMaps.stationsList[i].status !== 'OPEN' || googleMaps.stationsList[i].available_bikes === 0 && googleMaps.stationsList[i].available_bike_stands === 0) {
        iconMarker = './images/roadworks.png';
        // S'il n'y a pas de place ms bcp de vélos => marker rouge
      } else if (typeMarker === 100) {
        iconMarker = './images/marker-no-bikes-stands.png';
        // S'il y a bcp de vélos et un peu de place => marker 3/4 rouge 1/4 blanc
      } else if (typeMarker < 100 && typeMarker >= 66) {
        iconMarker = './images/marker-3-quarter.png';
        // S'il y a le même nombre de vélos que de places (à qqch près) => marker 1/2 rouge 1/2 blanc
      } else if (typeMarker < 66 && typeMarker >= 33) {
        iconMarker = './images/marker-middle.png';
        // S'il y a bcp de places et un peu de vélos => marker 1/4 rouge 3/4 blanc
      } else if (typeMarker < 33 && typeMarker > 0) {
        iconMarker = './images/marker-1-quarter.png';
        // Et enfin s'il n'y a pas de vélos mais bcp de places => marker blanc
      } else if (typeMarker === 0) {
        iconMarker = './images/marker-no-bikes.png'; // pas de vélos ms bcp de place
      }

      // Variable créant les marqueurs avec les propriétés correspondantes aux informations du json traduit par l'objet jcdecaux.js
      markers[i] = new google.maps.Marker({
        map: googleMaps.map,
        position: googleMaps.stationsList[i].position,
        name: googleMaps.stationsList[i].name,
        address: googleMaps.stationsList[i].address,
        status: googleMaps.stationsList[i].status,
        available_bike_stands: googleMaps.stationsList[i].available_bike_stands,
        available_bikes: googleMaps.stationsList[i].available_bikes,
        icon: iconMarker,
      });

      // Variable du contenu de l'infobulle
      var contentInfoWindow = '<div id="contentInfoWindow">' + '<p>' + 'Station : ' + markers[i].name + '</p>' + '<p>' + ' Statut de la station : ' + ((markers[i].status === 'OPEN') ? "OUVERTE" : "FERMÉE") + '</p>' + '</div>';
      // Variable contenant une nouvelle instance de l'objet InfoWindow pour créer l'infobulle
      let infowindow = new google.maps.InfoWindow({
        content: contentInfoWindow
      });
      // Ecouteur d'évènement permettant de faire apparaître une infobulle au survol du curseur sur le marqueur
      markers[i].addListener('mouseover', function() {
        // Fait apparaître une infobulle avec les infos de la station au-dessus du marqueur
        infowindow.open(googleMaps.map, this);
      });
      // Ecouteur d'évènement permettant de fermer l'infobulle dès que le curseur sort du marqueur
      markers[i].addListener('mouseout', function() {
        infowindow.close();
      });

      // Ecouteur d'évènement permettant de récupérer des données sur une station
      markers[i].addListener('click', function() {
        $('#stations-booked').remove();
        googleMaps.generateStationInfos(this.name, this.address, this.status, this.available_bike_stands, this.available_bikes);
        // Initialisation dans une variable des types d'infos à récupérer sur la station choisie
        let currentStation = {
          name: null,
          status: null,
          available_bikes: null,
          reserved: null,
        };
        // Association des données
        currentStation.name = this.name;
        currentStation.status = this.status;
        currentStation.available_bikes = this.available_bikes;
        // Envoi des données de la station vers l'app.js
        app.setCurrentStation(currentStation);
        // Appel de la fonction permettant d'analyser l'état de la station
        app.setReservation();
        app.removeCanvas();
      });
    };
    // Regroupement des marqueurs par zones grâce à MarkerClusterer
    googleMaps.markerClusterer = new MarkerClusterer(googleMaps.map, markers, {
      imagePath: './js/markerclusterer/m'
    });
    console.log(googleMaps.markerClusterer);
  },

  // Génération HTML du panneau latéral
  generateStationInfos: function(name, address, status, bikeStands, bikes) {
    let stationsBooked = $('<div>').attr('id', 'stations-booked');
    let cross = $('<i>').addClass('fas fa-times');
    let table = '<table id="stations-booked-infos"><caption>Détails de la station</caption>';
    table += '<tr id="name"><th>Nom : </th><td>' + name + '</td></tr>';
    table += '<tr id="address"><th>Adresse : </th><td>' + address + '</td></tr>';
    table += '<tr id="status"><th>Statut : </th><td>' + status + '</td></tr>';
    table += '<tr id="bikesStands"><th><i class="fab fa-product-hunt"></i></th><td>' + bikeStands + '</td></tr>';
    table += '<tr id="bikes"><th><i class="fas fa-bicycle"></i></th><td>' + bikes + '</td></tr>';
    table += '</table>';
    let stationButton = $('<button>').attr({
      id: "btn-book",
      type: "button",
      name: "Réserver"
    }).text("réserver");
    stationsBooked.append(cross, table, stationButton).appendTo($('#stations'));
  },
};
