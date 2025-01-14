var slideshow = {
  timer: null,
  currentPicture: $(".slide:first-child"),
  sliding: null,

  init: function () {
    slideshow.startResume();
    // Ecouteur d'évènement à l'appui sur une touche du clavier
    $(document).keydown(function (e) {
      // Flèche directionnelle gauche
      if (e.which === 37) {
        // A l'appui, le panorama recule d'un step grâce à la méthode rotate
        slideshow.prev();
        // Flèche directionnelle droite
      } else if (e.which === 39) {
        // A l'appui, le panorama avance d'un step grâce à la méthode rotate
        slideshow.next();
        // Bouton pause correspondant à la flèche directionnelle haut
      } else if (e.which === 38) {
        // A l'appui, le panorama se met en pause grâce à la méthode stop
        slideshow.stop();
        // Bouton pause correspondant à la flèche directionnelle bas
      } else if (e.which === 40) {
        // A l'appui, le panorama se relance grâce à la méthode startResume
        slideshow.startResume();
      }
    });

    // Ecouteur d'évènement au clic de la souris, même fonctionnement que le clavier
    // Bouton flèche gauche
    $(".fa-step-backward").click(function () {
      slideshow.prev();
    });
    // Bouton flèche droite
    $(".fa-step-forward").click(function () {
      slideshow.next();
    });
    // Bouton pause
    $(".fa-pause").click(slideshow.stop);
    // Bouton play
    $(".fa-play").click(slideshow.startResume);
  },

  // Affichage d'une image
  showPicture: function (nextPicture) {
    // Dissimulation de l'image actuellement affichée
    slideshow.currentPicture.fadeOut("fast");
    // Affichage de l'image qui doit apparaître
    nextPicture.fadeIn();
    // Enregistrement de l'image actuellement affichée
    slideshow.currentPicture = nextPicture;
  },

  // Affichage de l'image précédente
  prev: function () {
    var slide = null;
    // Recherche d'une image précédente
    if (slideshow.currentPicture.prev().length === 0) {
      // Aucune image précédente trouvée, donc récupération de la dernière
      slide = $(".slide:last-child");
    } else {
      // Sinon récupèration de l'image précédente
      slide = slideshow.currentPicture.prev();
    }
    // Appel de la méthode showPicture pour faire apparaître une image
    slideshow.showPicture(slide);
  },

  // Affiche l'image suivante
  next: function () {
    var slide = null;
    // Recherche d'une image suivante
    if (slideshow.currentPicture.next().length === 0) {
      // Aucune image précédente trouvée, donc récupération de la première
      slide = $(".slide:first-child");
    } else {
      // Sinon récupèration de l'image suivante
      slide = slideshow.currentPicture.next();
    }
    // Appel de la méthode showPicture pour faire apparaître une image
    slideshow.showPicture(slide);
  },

  // Méthode permettant de mettre en pause le slideshow
  stop: function () {
    // Réinitialisation du timer pour empêcher le défilement automatique
    clearInterval(slideshow.timer);
    // Changement du style css pour indiquer à l'utilisateur sur quel bouton il a cliqué (par défaut actif sur play)
    $(".fa-pause").toggleClass("active").css("color", "#333333");
    $(".fa-play").css("color", "white");
  },

  startResume: function () {
    // Empêcher le défilement automatique lorsque l'utilisateur fait défiler manuellement
    clearInterval(slideshow.timer);
    // Changement du style css pour indiquer à l'utilisateur sur quel bouton il a cliqué (par défaut actif sur play)
    $(".fa-play").toggleClass("active").css("color", "#333333");
    $(".fa-pause").css("color", "white");
    // Relancement du slideshow après la pause
    slideshow.timer = setInterval(slideshow.next, 3000);
  },
};
