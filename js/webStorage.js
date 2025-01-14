var webStorage = {
  reservationTime: null,
  currentTime: null,
  count: null,

  init: function () {
    // Génération HTML
    webStorage.generateFooter();
    // S'il y a déjà une réservation de faite et qu'une autre est effectuée, alors le compte à rebour est relancé
    if (sessionStorage.getItem("station") != undefined) {
      webStorage.startCountdown();
    } else {
      $("#infosCountdown").text(
        "Vous n'avez aucun vélo de réservé pour l'instant !"
      );
    }
  },

  // Génération HTML du footer
  generateFooter: function () {
    let groupInfos = $("<div>").attr("id", "groupInfos");
    let infosReserv = $("<p>").attr("id", "infosReservation");
    let infosCounter = $("<p>").attr("id", "infosCountdown");
    let groupButton = $("<div>").attr("id", "footer-btn-group");
    let cancel = $("<button>")
      .attr({
        id: "cancel",
        type: "button",
        name: "cancel",
      })
      .text("Annuler la réservation")
      .hide();
    let confirm = $("<button>")
      .attr({
        id: "yes",
        type: "button",
        name: "yes",
      })
      .text("Oui")
      .hide();
    let invalidate = $("<button>")
      .attr({
        id: "no",
        type: "button",
        name: "no",
      })
      .text("Non")
      .hide();
    groupInfos.append(infosReserv, infosCounter).appendTo($("footer"));
    groupButton.append(cancel, confirm, invalidate).appendTo($("footer"));
  },

  // Sauvegarde le nom de la station dans laquelle une réservation a été faite, récupéré depuis l'objet app.js, et son heure.
  saveData: function (key, value) {
    sessionStorage.setItem(key, value);
    // Heure de réservation
    sessionStorage.setItem("reservationTime", new Date().getTime());
  },

  // Renvoit si une réservation a été faite ou non, pour pouvoir s'en servir dans un autre objet (app.js)
  isReserved: function () {
    return sessionStorage.getItem("station") != undefined;
  },

  // Permet de déclencher le compte à rebour grâce au setInterval().
  startCountdown: function () {
    webStorage.count = setInterval(function () {
      // Heure à laquelle le compte à rebour est déclenché
      webStorage.currentTime = new Date().getTime();
      // Calcul permettant de fixer le compte à rebour à 20mn et 0s dès lors qu'une réservation est faite
      var timeDifference =
        webStorage.currentTime -
        Number(sessionStorage.getItem("reservationTime"));
      var counter = Math.round((1200000 - timeDifference) / 1000);
      var minutes = Math.floor(counter / 60);
      var secondes = counter % 60;

      // Affichage dans le footer d'un message indiquant le décompte de la réservation
      var text =
        "Vous avez réservé un vélo à la station " +
        sessionStorage.getItem("station") +
        " pour ";
      if (minutes > 0) {
        $("#infosCountdown").text(text + minutes + " min " + secondes + " s ");
      } else {
        $("#infosCountdown").text(text + secondes + " s ");
      }
      // Si le décompte est fini OU s'il n'y a plus de réservation, le décompte est arrêté, le sessionStorage est vidé,
      // message d'expiration et dissimulation du bouton d'annulation
      if (
        (minutes <= 0 && secondes <= 0) ||
        sessionStorage.getItem("station") === undefined
      ) {
        clearInterval(webStorage.count);
        sessionStorage.clear();
        $("#infosCountdown").text(
          "Votre réservation a expirée, effectuée s'en une autre pour pouvoir prendre un vélo !"
        );
        $("#cancel").hide();
      }
    }, 100);
    // Appel de la fonction permettant d'annuler la réservation en cours
    webStorage.cancelReservation();
  },

  cancelReservation: function () {
    $("#cancel").show();
    $("#cancel").click(function () {
      $("#cancel").hide();
      $("#yes").show();
      $("#no").show();
    });

    $("#yes").click(function () {
      clearInterval(webStorage.count);
      sessionStorage.clear();
      $("#infosCountdown").text("Votre réservation a bien été annulée !");
      $("#yes").hide();
      $("#no").hide();
    });

    $("#no").click(function () {
      $("#cancel").show();
      $("#yes").hide();
      $("#no").hide();
    });
  },
};
