/* ===================================================================
   CAGNOTTE — 30 ANS DE CLÉMENCE — CONFIGURATION
   Modifiez uniquement les valeurs ci-dessous pour mettre à jour le site.
   =================================================================== */

const cagnotte = {
  objectif: 1800,      // Objectif financier en euros
  recolte: 525,          // Montant déjà récolté en euros — à modifier au fil du temps
  participants: 3         // Nombre de participants — à modifier au fil du temps
};

// Lien vers votre demande de paiement Wero (à remplacer par votre vrai lien)
const weroLink = "https://share.weropay.eu/p/1/c/L1DGvXD5nL";

// Lien vers le dossier Drive pour les messages vidéo (à remplacer par votre vrai lien)
const driveLink = "https://drive.google.com/drive/folders/1Vcl7Tbib7bbE9_sD6AL_2fppigsJ7pr7?usp=drive_link";

// Textes principaux (modifiables facilement)
const contenu = {
  titre: "30 ans de Clémence",
  date: "17 Novembre 2026",
  sousTitre: "Clémence s'apprête à souffler ses 30 bougies. Offrons-lui un voyage mémorable au soleil, entre mer turquoise, découvertes et moments inoubliables.",
  intro1: "Pour fêter comme il se doit les 30 ans de notre Clémence nationale, une cagnotte est ouverte pour l'aider à s'offrir le voyage de rêve qu'elle mérite : direction la Martinique !",
  intro2: "Chaque participation permettra de lui offrir une expérience supplémentaire sur place, un peu plus de soleil, un peu plus de souvenirs.",
  intro3: "Et évidemment, chaque contribution, petite ou grande, fera énormément plaisir"
};

/* ===================================================================
   LOGIQUE — pas besoin de modifier ce qui suit
   =================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  appliquerConfiguration();
  initHeaderScroll();
  initRevealOnScroll();
  animerCagnotte();
  initFaq();
});

/**
 * Applique les valeurs de configuration au DOM (lien Wero, participants, etc.)
 */
function appliquerConfiguration() {
  const weroBtn = document.getElementById("wero-btn");
  if (weroBtn) {
    weroBtn.setAttribute("href", weroLink);
  }

  setLien("intro-drive-link", driveLink);
  setLien("faq-drive-link", driveLink);

  document.title = contenu.titre + " · Cagnotte voyage";

  setTexte("hero-date", contenu.date);
  setTexte("hero-titre", contenu.titre);
  setTexte("hero-soustitre", contenu.sousTitre);
  setTexte("intro-texte-1", contenu.intro1);
  setTexte("intro-texte-2", contenu.intro2);
  setTexte("intro-texte-3", contenu.intro3);

  const participantsEl = document.getElementById("participants-valeur");
  if (participantsEl) {
    participantsEl.textContent = cagnotte.participants;
  }

  const objectifAfficheEl = document.getElementById("objectif-affiche");
  if (objectifAfficheEl) {
    objectifAfficheEl.textContent = formaterMontant(cagnotte.objectif) + " €";
  }

  const objectifValeurEl = document.getElementById("objectif-valeur");
  if (objectifValeurEl) {
    objectifValeurEl.textContent = formaterMontant(cagnotte.objectif);
  }
}

/**
 * Remplace le texte d'un élément par son id, si celui-ci existe dans le DOM.
 */
function setTexte(id, valeur) {
  const el = document.getElementById(id);
  if (el && valeur) el.textContent = valeur;
}

/**
 * Renseigne le href d'un lien par son id, si celui-ci existe dans le DOM.
 */
function setLien(id, url) {
  const el = document.getElementById(id);
  if (el && url) el.setAttribute("href", url);
}

/**
 * Formate un nombre avec un séparateur de milliers "espace" (ex: 1 500)
 */
function formaterMontant(valeur) {
  return Math.round(valeur).toLocaleString("fr-FR");
}

/**
 * Calcule le pourcentage atteint, toujours borné entre 0 et 100.
 */
function calculerPourcentage() {
  if (cagnotte.objectif <= 0) return 0;
  const pourcentage = (cagnotte.recolte / cagnotte.objectif) * 100;
  return Math.min(100, Math.max(0, pourcentage));
}

/**
 * Anime le compteur du montant récolté et la barre de progression à l'ouverture.
 */
function animerCagnotte() {
  const montantEl = document.getElementById("montant-recolte");
  const fillEl = document.getElementById("progress-fill");
  const trackEl = document.getElementById("progress-track");
  const pourcentageLabelEl = document.getElementById("pourcentage-label");

  const pourcentageFinal = calculerPourcentage();
  const dureeMs = 1400;
  const debut = performance.now();

  function easeOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
  }

  function frame(maintenant) {
    const progres = Math.min(1, (maintenant - debut) / dureeMs);
    const progresAnime = easeOutQuint(progres);

    const montantAffiche = cagnotte.recolte * progresAnime;
    const pourcentageAffiche = pourcentageFinal * progresAnime;

    if (montantEl) montantEl.textContent = formaterMontant(montantAffiche) + " €";
    if (fillEl) fillEl.style.width = pourcentageAffiche + "%";
    if (pourcentageLabelEl) {
      pourcentageLabelEl.textContent = Math.round(pourcentageAffiche) + " % de l'objectif atteint";
    }
    if (trackEl) trackEl.setAttribute("aria-valuenow", Math.round(pourcentageAffiche));

    if (progres < 1) {
      requestAnimationFrame(frame);
    } else {
      if (montantEl) montantEl.textContent = formaterMontant(cagnotte.recolte) + " €";
      if (fillEl) fillEl.style.width = pourcentageFinal + "%";
      if (pourcentageLabelEl) {
        pourcentageLabelEl.textContent = Math.round(pourcentageFinal) + " % de l'objectif atteint";
      }
      if (trackEl) trackEl.setAttribute("aria-valuenow", Math.round(pourcentageFinal));
    }
  }

  requestAnimationFrame(frame);
}

/**
 * Ajoute un fond flouté discret à l'en-tête après un léger scroll.
 */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const basculer = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  basculer();
  window.addEventListener("scroll", basculer, { passive: true });
}

/**
 * Révèle en douceur les blocs marqués ".reveal" au fil du scroll.
 */
function initRevealOnScroll() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/**
 * Accordéon FAQ : ouvre/ferme une réponse au clic, avec une hauteur animée.
 */
function initFaq() {
  const questions = document.querySelectorAll(".faq-question");

  questions.forEach((bouton) => {
    const reponse = bouton.nextElementSibling;
    if (!reponse) return;

    bouton.addEventListener("click", () => {
      const estOuvert = bouton.getAttribute("aria-expanded") === "true";

      // Ferme les autres réponses ouvertes pour garder l'ensemble épuré.
      questions.forEach((autreBouton) => {
        if (autreBouton !== bouton) {
          autreBouton.setAttribute("aria-expanded", "false");
          const autreReponse = autreBouton.nextElementSibling;
          if (autreReponse) autreReponse.style.maxHeight = null;
        }
      });

      bouton.setAttribute("aria-expanded", String(!estOuvert));
      reponse.style.maxHeight = estOuvert ? null : reponse.scrollHeight + "px";
    });
  });
}
