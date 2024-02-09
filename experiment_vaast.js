/// LICENCE -----------------------------------------------------------------------------

//
// Copyright 2018 - Cédric Batailler
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be included in all copies
// or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// OVERVIEW -----------------------------------------------------------------------------

// safari & ie exclusion ----------------------------------------------------------------
var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var is_ie = /*@cc_on!@*/false || !!document.documentMode;

var is_compatible = !(is_safari || is_ie);


if (!is_compatible) {

  var safari_exclusion = {
    type: "html-keyboard-response",
    stimulus:
      "<p>Désolé, cette étude n'est pas compatible avec votre navigateur.</p>" +
      "<p>Veuillez réessayer avec un navigateur compatible (par exemple, Chrome ou Firefox).</p>",
    choices: jsPsych.NO_KEYS
  };

  var timeline_safari = [];

  timeline_safari.push(safari_exclusion);
  jsPsych.init({ timeline: timeline_safari });

}

// firebase initialization ---------------------------------------------------------------
var firebase_config = {
    apiKey: "AIzaSyBwDr8n-RNCbBOk1lKIxw7AFgslXGcnQzM",
    databaseURL: "https://postdocgent.firebaseio.com/"
};

firebase.initializeApp(firebase_config);
var database = firebase.database();

// id variables
var prolificID = jsPsych.data.getURLVariable("prolificID");
if(prolificID == null) {prolificID = "999";}

var id = jsPsych.randomization.randomID(15)

// Preload images
var preloadimages = [];

// connection status ---------------------------------------------------------------------
// This section ensure that we don't lose data. Anytime the 
// client is disconnected, an alert appears onscreen
var connectedRef = firebase.database().ref(".info/connected");
var connection = firebase.database().ref("RR_Expe2_AAT/" + id + "/")
var dialog = undefined;
var first_connection = true;

connectedRef.on("value", function (snap) {
  if (snap.val() === true) {
    connection
      .push()
      .set({
        status: "connection",
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })

    connection
      .push()
      .onDisconnect()
      .set({
        status: "disconnection",
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })

    if (!first_connection) {
      dialog.modal('hide');
    }
    first_connection = false;
  } else {
    if (!first_connection) {
      dialog = bootbox.dialog({
        title: 'Connection lost',
        message: '<p><i class="fa fa-spin fa-spinner"></i> Veuillez patienter pendant que nous essayons de nous reconnecter.</p>',
        closeButton: false
      });
    }
  }
});

// Consent --------------------------------------------------------------
  var check_consent = function(elem) {
    if (document.getElementById('info').checked 
      & document.getElementById('volunt').checked 
      & document.getElementById('anony').checked 
      & document.getElementById('end').checked 
      & document.getElementById('consqc').checked 
      & document.getElementById('summ').checked 
      & document.getElementById('participate').checked ) {
      return true;
    }
    else {
      alert("Si vous souhaitez participer, vous devez cocher toutes les cases. Si vous ne souhaitez pas participer, veuillez fermer la fenêtre du navigateur.");
      return false;
    }
    return false;
  };


  var consent = {
    type:'external-html',
    url: "https://marinerougier.github.io/RR_Expe2_Part1/external_page_consent.html",
    cont_btn: "start",
    check_fn: check_consent,
        on_load: function() {
          window.scrollTo(0, 0)
        },
  };


// counter variables
var vaast_trial_n = 1;
var browser_events_n = 1;

// Variable input -----------------------------------------------------------------------
var cond_AA = jsPsych.data.getURLVariable("cond_AA");
  //cond_AA = cond_AA == null ? jsPsych.randomization.sampleWithoutReplacement(["instruction"], 1)[0] : cond_AA; // assign random id if not provided in URL
  cond_AA = cond_AA == null ? jsPsych.randomization.sampleWithoutReplacement(["vaast", "instruction"], 1)[0] : cond_AA; // assign random id if not provided in URL

// Target action (affiliative approach, aggressive approach, or avoidance)
var target_action = jsPsych.data.getURLVariable("target_action");
  target_action = target_action == null ? jsPsych.randomization.sampleWithoutReplacement(["app_agg", "app_aff"], 1)[0] : target_action; // assign random id if not provided in URL

// whether the Target action is related to blue or yellow
var color_target = jsPsych.randomization.sampleWithoutReplacement(["blue", "yellow"], 1)[0];

// for the control condition, randomization of the F vs. S key (for the blue vs. yellow group)
var control_cond = jsPsych.randomization.sampleWithoutReplacement(["blue_s", "blue_f"], 1)[0];

// group associated with the yellow or blue color
var ColorGroup   = jsPsych.randomization.sampleWithoutReplacement(["G1Y", "G1B"], 1)[0];

// cursor helper functions
var hide_cursor = function () {
  document.querySelector('head').insertAdjacentHTML('beforeend', '<style id="cursor-toggle"> html { cursor: none; } </style>');
}
var show_cursor = function () {
  document.querySelector('#cursor-toggle').remove();
}

var hiding_cursor = {
  type: 'call-function',
  func: hide_cursor
}

var showing_cursor = {
  type: 'call-function',
  func: show_cursor
}

// Preload images in the VAAST 
// Preload faces
var faces = [
      "stimuli/Face19_B.png",
      "stimuli/Face28_B.png",
      "stimuli/Face55_B.png",
      "stimuli/Face95_B.png",
      "stimuli/Face104_B.png",
      "stimuli/Face115_B.png",
      "stimuli/Face119_B.png",
      "stimuli/Face142_B.png",
      "stimuli/Face10_J.png",
      "stimuli/Face16_J.png",
      "stimuli/Face17_J.png",
      "stimuli/Face45_J.png",
      "stimuli/Face85_J.png",
      "stimuli/Face103_J.png",
      "stimuli/Face116_J.png",
      "stimuli/Face132_J.png",
      "stimuli/Face19_J.png",
      "stimuli/Face28_J.png",
      "stimuli/Face55_J.png",
      "stimuli/Face95_J.png",
      "stimuli/Face104_J.png",
      "stimuli/Face115_J.png",
      "stimuli/Face119_J.png",
      "stimuli/Face142_J.png",
      "stimuli/Face10_B.png",
      "stimuli/Face16_B.png",
      "stimuli/Face17_B.png",
      "stimuli/Face45_B.png",
      "stimuli/Face85_B.png",
      "stimuli/Face103_B.png",
      "stimuli/Face116_B.png",
      "stimuli/Face119_B_Example.png",
      "stimuli/Face95_J_Example.png"
];

preloadimages.push(faces);

// VAAST --------------------------------------------------------------------------------
// VAAST variables ----------------------------------------------------------------------

var movement_blue     = undefined;
var movement_yellow   = undefined;
var group_to_action = undefined;
var group_to_control    = undefined;

 var genColor = function (colorID, colorName) { return "<span style='color:" + colorID + "'><b>" + colorName + "</b></span>" };
 var blue = genColor("#2a57ea", "bleu");
 var yellow = genColor("#b5a21b", "jaune");

switch (target_action) {
  case "app_agg":
    {if (color_target == "yellow"){
    movement_blue = "control";
    movement_yellow = "approach";
    group_to_action = yellow;
    group_to_control    = blue;
    } else if (color_target == "blue"){
    movement_blue = "approach";
    movement_yellow = "control";
    group_to_action = blue;
    group_to_control    = yellow;
    }};
    break;

  case "app_aff":
    {if (color_target == "yellow"){
    movement_blue = "control";
    movement_yellow = "approach";
    group_to_action = yellow;
    group_to_control    = blue;
    } else if (color_target == "blue"){
    movement_blue = "approach";
    movement_yellow = "control";
    group_to_action = blue;
    group_to_control    = yellow;
    }};
    break;
}

switch (control_cond) {
  case "blue_f":
    {if (color_target == "yellow"){
    movement_blue = "control";
    movement_yellow = "approach";
    group_to_action = yellow;
    group_to_control    = blue;
    } else if (color_target == "blue"){
    movement_blue = "approach";
    movement_yellow = "control";
    group_to_action = blue;
    group_to_control    = yellow;
    }};
    break;
    
  case "blue_s":
    {if (color_target == "yellow"){
    movement_blue = "control";
    movement_yellow = "approach";
    group_to_action = yellow;
    group_to_control    = blue;
    } else if (color_target == "blue"){
    movement_blue = "approach";
    movement_yellow = "control";
    group_to_action = blue;
    group_to_control    = yellow;
    }};
    break;
}

// VAAST stimuli ------------------------------------------------------------------------
// vaast image stimuli ------------------------------------------------------------------

var vaast_stim_training_G1Y = [
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face19_B.png'},
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face28_B.png'},
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face55_B.png'},
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face95_B.png'},
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face104_B.png'},
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face115_B.png'},
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face119_B.png'},
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face142_B.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face10_J.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face16_J.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face17_J.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face45_J.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face85_J.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face103_J.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face116_J.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face132_J.png'}
]

var vaast_stim_training_G1B = [
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face19_J.png'},
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face28_J.png'},
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face55_J.png'},
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face95_J.png'},
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face104_J.png'},
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face115_J.png'},
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face119_J.png'},
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face142_J.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face10_B.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face16_B.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face17_B.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face45_B.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face85_B.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face103_B.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face116_B.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face132_B.png'}
]

var vaast_stim_training    = undefined;
switch (ColorGroup) {
case "G1Y":
    vaast_stim_training    = vaast_stim_training_G1Y;
    break;

  case "G1B":
    vaast_stim_training    = vaast_stim_training_G1B;
    break;
}


// vaast background images --------------------------------------------------------------,

var background = [
  "background/1.jpg",
  "background/2.jpg",
  "background/3.jpg",
  "background/4.jpg",
  "background/5.jpg",
  "background/6.jpg",
  "background/7.jpg"
];


// vaast stimuli sizes -------------------------------------------------------------------

var stim_sizes = [
  34,
  38,
  42,
  46,
  52,
  60,
  70
];

var resize_factor = 7;
var image_sizes = stim_sizes.map(function (x) { return x * resize_factor; });

// Helper functions ---------------------------------------------------------------------
// next_position():
// Compute next position as function of current position and correct movement. Because
// participant have to press the correct response key, it always shows the correct
// position.
var next_position_training = function () {
  var current_position = jsPsych.data.getLastTrialData().values()[0].position;
  var current_movement = jsPsych.data.getLastTrialData().values()[0].movement;
  var position = current_position;

  if (current_movement == "approach") {
    position = position + 1;
  }

  if (current_movement == "control") {
    position = position ;
  }
  return (position)
}

// Saving blocks ------------------------------------------------------------------------
// Every function here send the data to keen.io. Because data sent is different according
// to trial type, there are differents function definition.

// init ---------------------------------------------------------------------------------
var saving_id = function () {
  database
    .ref("participant_id_RR_Expe2_AAT/")
    .push()
    .set({
      id: id,
      prolificID: prolificID,
      target_action : target_action,
      color_target : color_target,
      ColorGroup: ColorGroup,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    })
}

// vaast trial --------------------------------------------------------------------------
var saving_vaast_trial = function () {
  database
    .ref("vaast_trial_AAT_RR_Expe2_AAT/").
    push()
    .set({
      id: id,
      prolificID: prolificID,
      target_action : target_action,
      color_target : color_target,   
      ColorGroup: ColorGroup,   
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      vaast_trial_data: jsPsych.data.get().last(4).json()
    })
}


// demographic logging ------------------------------------------------------------------

var saving_browser_events = function (completion) {
  database
    .ref("browser_event_RR_Expe2_AAT/")
    .push()
    .set({
      id: id,
      prolificID: prolificID,
      target_action : target_action,
      color_target : color_target,
      ColorGroup: ColorGroup,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      completion: completion,
      event_data: jsPsych.data.getInteractionData().json()
    })
}


// saving blocks ------------------------------------------------------------------------
var save_id = {
  type: 'call-function',
  func: saving_id
}

var save_vaast_trial = {
  type: 'call-function',
  func: saving_vaast_trial
}

// EXPERIMENT ---------------------------------------------------------------------------
// Switching to fullscreen --------------------------------------------------------------
var fullscreen_trial = {
  type: 'fullscreen',
  message: 'Pour commencer, vous devrez passer en mode plein écran</br></br>',
  button_label: 'Passer au plein écran',
  fullscreen_mode: true
}


// VAAST --------------------------------------------------------------------------------

var Gene_Instr_AA = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Expérience sur la catégorisation de visages</h1>" +
    "<br>" +
    "<p class='instructions'> Dans cette étude, nous nous intéressons à la manière dont les gens catégorisent " +
    "autrui et, plus spécifiquement, leur visage. </p>" +
    "<p class='instructions'>Dans cette expérience, vous allez réaliser deux tâches : " +
    "<br>" +
    "- Tâche 1 : La tâche du Jeu Vidéo" +
    "<br>" +
    "- Tâche 2 : La tâche d'identification" +
    "<br>" +
    "<br>" +
    "Pour terminer, vous devrez répondre à quelques questions. </p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

// vaast cond instructions

var vaast_instructions_1_app = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1: tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Un peu comme dans un jeu vidéo, vous allez vous " +
    "retrouver dans un environnement dans lequel vous allez pouvoir vous déplacer vers l'avant. "+
    "Cet environnement est présenté ci-dessous. </p>" +
    "<br>" +
    "<img src = 'media/vaast-background.png'>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

var vaast_instructions_2 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1: tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Une série de visages va vous être présentée dans cet environnement " +
    "et votre tâche sera de les catégoriser le plus rapidement possible. <br>" +
    "<p class='instructions'>Ces visages ont été délibérément <b>floutés</b>. Voici deux exemples " +
    "de visages qui vont vous être présentés : <br><br>" +
    "<center><img src = '"+ vaast_stim_training[0]['stimulus']+"'>" +
    "                              " +
    "<img src = '"+ vaast_stim_training[9]['stimulus']+"'></center>" +
    "<br><br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

var vaast_instructions_3_app_agg = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1: tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Votre tâche sera d'avancer ou bien de rester immobile " +
    "en fonction de la couleur de fond (c'est-à-dire, " + group_to_action + " ou " + group_to_control + ") de ces images. "+
    "Des instructions plus spécifiques suivront. <br>" +
    "<br><u>Lisez attentivement les informations ci-après :</u><br><br>" +
     "Dans cette expérience, <b>avancer veut dire <u><i>agresser :</i></u></b> cela représente les situations " +
    "<strong>dans lesquelles nous nous approchons pour agresser verbalement ou physiquement la personne en face de nous. " +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

var vaast_instructions_3_app_aff = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1: tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Votre tâche sera d'avancer ou bien de rester immobile " +
    "en fonction de la couleur de fond (c'est-à-dire, " + group_to_action + " ou " + group_to_control + ") de ces images. "+
    "Des instructions plus spécifiques suivront. <br>" +
    "<br><u>Lisez attentivement les informations ci-après :</u><br><br>" +
     "Dans cette expérience, <b>avancer veut dire <u><i>s'affilier :</i></u></b> cela représente les situations " +
    "<strong>dans lesquelles nous nous approchons pour une interaction verbale ou physique positive avec la personne qui se trouve en face de nous. " +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};


var vaast_instructions_4_app_agg = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1: tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Vous pourrez vous déplacer en utilisant les touches suivantes de votre clavier :" +
    "<br>" +
    "<br>" +
    "<img src = 'media/keyboard_app_agg.png'>" +
    "<br>" +
    "<br></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

var vaast_instructions_4_app_aff = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1: tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Vous pourrez vous déplacer en utilisant les touches suivantes de votre clavier :" +
    "<br>" +
    "<br>" +
    "<img src = 'media/keyboard_app_aff.png'>" +
    "<br>" +
    "<br></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

var vaast_instructions_5_app_agg = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1: tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Au début de chaque essai, vous verrez le symbole 'O'. " +
    "Ce symbole indique que vous devez appuyer sur la touche DEPART (c'est-à-dire, la touche <b>D</b>) pour commencer l'essai. </p>" +
    "<p class='instructions'>Par la suite, vous verrez une croix de fixation (+) au centre de l'écran, suivie d'un visage. </p>" +
    "<p class='instructions'>En fonction de la couleur de fond (" + group_to_action + " ou " + group_to_control + ") de l'image, vous devrez avancer pour agresser en appuyant sur la touche AVANCER (c'est-à-dire, la touche <b>E</b>) "+
    "ou rester immobile en appuyant sur la touche DEPART (c'est-à-dire, la touche <b>D</b>) aussi rapidement que possible. Après l'appui sur la touche, le visage disparaîtra et vous devrez " +
    "appuyer de nouveau sur la touche DEPART (touche D). " +
    "<p class='instructions'><b>Veuillez <u>utiliser seulement l'index</u> de votre main dominante pour toutes ces actions. </b></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

var vaast_instructions_5_app_aff = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1: tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Au début de chaque essai, vous verrez le symbole 'O'. " +
    "Ce symbole indique que vous devez appuyer sur la touche DEPART (c'est-à-dire, la touche <b>D</b>) pour commencer l'essai. </p>" +
    "<p class='instructions'>Par la suite, vous verrez une croix de fixation (+) au centre de l'écran, suivie d'un visage. </p>" +
    "<p class='instructions'>En fonction de la couleur de fond (" + group_to_action + " ou " + group_to_control + ") de l'image, vous devrez avancer pour vous affilier en appuyant sur la touche AVANCER (c'est-à-dire, la touche <b>E</b>) "+
    "ou rester immobile en appuyant sur la touche DEPART (c'est-à-dire, la touche <b>D</b>) aussi rapidement que possible. Après l'appui sur la touche, le visage disparaîtra et vous devrez " +
    "appuyer de nouveau sur la touche DEPART (touche D). " +
    "<p class='instructions'><b>Veuillez <u>utiliser seulement l'index</u> de votre main dominante pour toutes ces actions. </b></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

var vaast_instructions_6_app_agg = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1: tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Plus précisément, vous devrez : " +
    "<ul class='instructions'>" +
    "<li><strong>Avancer (pour agresser) les visages ayant un fond " + group_to_action + " </strong></li>" +
    "<strong>en appuyant sur la touche E</strong>" +
    "<br>" +
    "<br>" +
    "<li><strong>Rester immobile pour les visages ayant un fond " + group_to_control + " </strong></li>" +
    "<strong>en appuyant sur la touche D</strong>" +
    "</ul>" +
    "<p class='instructions'>Veuillez lire attentivement et mémoriser les instructions ci-dessus. </p>" +
    "<p class='instructions'><strong>Notez également qu'il est EXTRÊMEMENT IMPORTANT que vous essayiez d'être aussi rapide et précis que possible. </strong>" +
    "Une croix rouge apparaîtra si votre réponse est incorrecte. </p>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>ENTRER</strong> pour commencer la tâche. </p>",
  choices: [13]
};

var vaast_instructions_6_app_aff = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1: tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Plus précisément, vous devrez : " +
    "<ul class='instructions'>" +
    "<li><strong>Avancer (pour vous affilier avec) les visages ayant un fond " + group_to_action + " </strong></li>" +
    "<strong>en appuyant sur la touche E</strong>" +
    "<br>" +
    "<br>" +
    "<li><strong>Rester immobile pour les visages ayant un fond " + group_to_control + " </strong></li>" +
    "<strong>en appuyant sur la touche D</strong>" +
    "</ul>" +
    "<p class='instructions'>Veuillez lire attentivement et mémoriser les instructions ci-dessus. </p>" +
    "<p class='instructions'><strong>Notez également qu'il est EXTRÊMEMENT IMPORTANT que vous essayiez d'être aussi rapide et précis que possible. </strong>" +
    "Une croix rouge apparaîtra si votre réponse est incorrecte. </p>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>ENTRER</strong> pour commencer la tâche. </p>",
  choices: [13]
};

// control cond instructions

var Gene_Instr_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Expérience sur la catégorisation de visages</h1>" +
    "<br>" +
    "<p class='instructions'> Dans cette étude, nous nous intéressons à la manière dont les gens catégorisent " +
    "autrui et, plus spécifiquement, leur visage. </p>" +
    "<p class='instructions'>Dans cette expérience, vous allez réaliser trois tâches : " +
    "<br>" +
    "- Tâche 1 : La tâche de catégorisation" +
    "<br>" +
    "- Tâche 2 : La tâche d'identification" +
    "<br>" +
    "- Tâche 3 : La tâche du Jeu Vidéo" +
    "<br>" +
    "<br>" +
    "Pour terminer, vous devrez répondre à quelques questions. </p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};


var vaast_instructions_1_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1: tâche de catégorisation</h1>" +
    "<p class='instructions'>Vous allez vous retrouver " +
    "dans un environnement virtuel comme celui présenté ci-dessous. </p>" +
    "<br>" +
    "<img src = 'media/vaast-background.png''>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

var vaast_instructions_3_4_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1: tâche de catégorisation</h1>" +
    "<p class='instructions'>Votre tâche sera de catégoriser des visages " +
    "en fonction de la couleur de fond (c'est-à-dire " + group_to_action + " ou " + group_to_control + ") de ces images. "+
    "Plus précisément, vous pourrez catégoriser les visages en utilisant les touches suivantes de votre clavier :" +
    "<br>" +
    "<br>" +
    "<center><img src = 'media/keyboard_control_task.png'></center>" +
    "<br></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

var vaast_instructions_5_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1: tâche de catégorisation</h1>" +
    "<p class='instructions'>Au début de chaque essai, vous verrez le symbole 'O'. " +
    "Ce symbole indique que vous devez appuyer sur la touche DEPART (c'est-à-dire, la touche <b>D</b>) pour commencer l'essai. </p>" +
    "<p class='instructions'>Par la suite, vous verrez une croix de fixation (+) au centre de l'écran, suivie d'un visage. </p>" +
    "<p class='instructions'>En fonction de la couleur de fond (c'est-à-dire " + group_to_action + " ou " + group_to_control + ") de l'image, vous devrez appuyer sur la touche <b>F</b> "+
    "ou sur la touche <b>S</b> aussi rapidement que possible. Après l'appui sur la touche, le visage disparaîtra et vous devrez " +
    "appuyer de nouveau sur la touche DEPART (touche D). " +
    "<p class='instructions'><b>Veuillez <u>utiliser seulement l'index</u> de votre main dominante pour toutes ces actions. </b></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

var vaast_instructions_6_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1: tâche de catégorisation</h1>" +
    "<p class='instructions'>Plus précisément, vous devrez : " +
    "<ul class='instructions'>" +
    "<li><strong>Appuyer sur la touche F pour les visages ayant un fond " + group_to_action + " </strong></li>" +
    "<li><strong>Appuyer sur la touche S pour les visages ayant un fond " + group_to_control + " </strong></li>" +
    "</ul>" +
    "<p class='instructions'>Veuillez lire attentivement et mémoriser les instructions ci-dessus. </p>" +
    "<p class='instructions'><strong>Notez également qu'il est EXTRÊMEMENT IMPORTANT que vous essayiez d'être aussi rapide et précis que possible. </strong>" +
    "Une croix rouge apparaîtra si votre réponse est incorrecte. </p>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>ENTRER</strong> pour commencer la tâche. </p>",
  choices: [13]
};

// Instructions for AA
var vaast_instructions_7_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Comme dans un jeu vidéo, vous allez maintenant pouvoir " +
    "avancer dans l'environnement présenté ci-dessous. </p>" +
    "<br>" +
    "<img src = 'media/vaast-background.png'>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

var vaast_instructions_8_app_agg_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Plus spécifiquement, votre tâche sera d'avancer ou de rester immobile " +
    "en fonction de la couleur de fond (c'est-à-dire " + group_to_action + " ou " + group_to_control + ") des visages que vous avez vu précédemment. "+
    "Des instructions plus spécifiques suivront. <br>" +
    "<br><u>Lisez attentivement les informations ci-après :</u><br><br>" +
     "Dans cette expérience, <b>avancer veut dire <u><i>agresser :</i></u></b> cela représente les situations " +
    "<strong>dans lesquelles nous nous approchons pour agresser verbalement ou physiquement la personne en face de nous. " +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

var vaast_instructions_8_app_aff_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Plus spécifiquement, votre tâche sera d'avancer ou de rester immobile " +
    "en fonction de la couleur de fond (c'est-à-dire " + group_to_action + " ou " + group_to_control + ") des visages que vous avez vu précédemment. "+
    "Des instructions plus spécifiques suivront. <br>" +
    "<br><u>Lisez attentivement les informations ci-après :</u><br><br>" +
     "Dans cette expérience, <b>avancer veut dire <u><i>s'affilier :</i></u></b> cela représente les situations " +
    "<strong>dans lesquelles nous nous approchons pour une interaction verbale ou physique positive avec la personne qui se trouve en face de nous. " +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

var vaast_instructions_9_app_agg_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Vous pourrez vous déplacer en utilisant les touches suivantes de votre clavier :" +
    "<br>" +
    "<br>" +
    "<img src = 'media/keyboard_app_agg.png'>" +
    "<br>" +
    "<br></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

var vaast_instructions_9_app_aff_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Vous pourrez vous déplacer en utilisant les touches suivantes de votre clavier :" +
    "<br>" +
    "<br>" +
    "<img src = 'media/keyboard_app_aff.png'>" +
    "<br>" +
    "<br></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer</p>",
  choices: [32]
};

/*
var vaast_instructions_10_app_agg_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task</h1>" +
    "<p class='instructions'>At the beginning of each trial, you will see the 'O' symbol. " +
    "This symbol indicates that you have to press the START key (namely, the <b>D key</b>) to start the trial. </p>" +
    "<p class='instructions'>Then, you will see a fixation cross (+) at the center of the screen, followed by a face. </p>" +
    "<p class='instructions'>As a function of the background color (" + group_to_action + " or " + group_to_control + ") of the face, your task is to move forward to aggress by pressing the MOVE FORWARD key (namely, the <b>E key</b>) "+
    "or to stay still by pressing again the START key (namely, the <b>D key</b>) as fast as possible. After the key press, the face will disappear and you will have to " +
    "press again the START key (D key). " +
    "<p class='instructions'><b>Please <u>use only the index finger</u> of your dominant hand for all these actions. </b></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

var vaast_instructions_10_app_aff_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task</h1>" +
    "<p class='instructions'>At the beginning of each trial, you will see the 'O' symbol. " +
    "This symbol indicates that you have to press the START key (namely, the <b>D key</b>) to start the trial. </p>" +
    "<p class='instructions'>Then, you will see a fixation cross (+) at the center of the screen, followed by a face. </p>" +
    "<p class='instructions'>As a function of the background color (" + group_to_action + " or " + group_to_control + ") of the face, your task is to move forward to affiliate by pressing the MOVE FORWARD key (namely, the <b>E key</b>) "+
    "or to stay still by pressing again the START key (namely, the <b>D key</b>) as fast as possible. After the key press, the face will disappear and you will have to " +
    "press again the START key (D key). " +
    "<p class='instructions'><b>Please <u>use only the index finger</u> of your dominant hand for all these actions. </b></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};
*/

var vaast_instructions_11_app_agg_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Plus spécifiquement, vous devrez : " +
    "<ul class='instructions'>" +
    "<li><strong>Avancer (pour agresser) les visages ayant un fond " + group_to_action + " </strong></li>" +
    "<strong>en appuyant sur la touche E</strong>" +
    "<br>" +
    "<br>" +
    "<li><strong>Rester immobile pour les visages ayant un fond " + group_to_control + " </strong></li>" +
    "<strong>en appuyant sur la touche D</strong>" +
    "</ul>" +
    "<p class='instructions'><b><u>Veuillez lire attentivement et mémoriser les instructions ci-dessus. </b></u></p>" +
    "<p class='instructions'>Des instructions plus spécifiques suivront. </p>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>ENTRER</strong> pour continuer. </p>",
  choices: [13]
};

var vaast_instructions_11_app_aff_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Plus spécifiquement, vous devrez : " +
    "<ul class='instructions'>" +
    "<li><strong>Avancer (pour vous affilier avec) les visages ayant un fond " + group_to_action + " </strong></li>" +
    "<strong>en appuyant sur la touche E</strong>" +
    "<br>" +
    "<br>" +
    "<li><strong>Rester immobile pour les visages ayant un fond " + group_to_control + " </strong></li>" +
    "<strong>en appuyant sur la touche D</strong>" +
    "</ul>" +
    "<p class='instructions'><b><u>Veuillez lire attentivement et mémoriser les instructions ci-dessus. </b></u></p>" +
    "<p class='instructions'>Des instructions plus spécifiques suivront. </p>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>ENTRER</strong> pour continuer. </p>",
  choices: [13]
};

var vaast_instructions_12_cont = {
  type: "html-keyboard-response",
  stimulus:
    "<p class='instructions'>Avant de commencer la tâche du Jeu Vidéo, vous allez devoir effectuer une autre " +
    "tâche appelée 'tâche d'identification' (tâche 2). </p>" +
    "<br>" +
    "<p class='instructions'>Vous effectuerez la tâche du Jeu Vidéo à la toute fin de l'expérience. </p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour commencer la Tâche 2.</p>",
  choices: [32]
};


//End 
var vaast_instructions_end = {
  type: "html-keyboard-response",
  stimulus:
    "<p class='instructions'><center>La première tâche est terminée. </center></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour commencer la Tâche 2.</p>",
  choices: [32]
};

// Creating a trial for the VAAST cond ---------------------------------------------------------------------

var vaast_start = {
  type: 'vaast-text',
  stimulus: "o",
  position: 3,
  background_images: background,
  font_sizes: stim_sizes,
  approach_key: "d",
  stim_movement: "approach",
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_fixation = {
  type: 'vaast-fixation',
  fixation: "+",
  font_size: 46,
  position: 3,
  background_images: background
}

var vaast_first_step_training = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: 3,
  background_images: background,
  font_sizes: image_sizes,
  approach_key: "e",
  //avoidance_key: "c",
  control_key: "d",
  stim_movement: jsPsych.timelineVariable('movement'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500, 
  response_ends_trial: true
}

var vaast_second_step = {
  type: 'vaast-image',
  position: next_position_training,
  stimulus: jsPsych.timelineVariable('stimulus'),
  background_images: background,
  font_sizes: image_sizes,
  stim_movement: jsPsych.timelineVariable('movement'),
  response_ends_trial: false,
  trial_duration: 650 // registered report: 300
}

var vaast_second_step_training = {
  chunk_type: "if",
  timeline: [vaast_second_step],
  conditional_function: function () {
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}


// VAAST training block -----------------------------------------------------------------
var vaast_training = {
  timeline: [
    vaast_start,
    vaast_fixation,
    vaast_first_step_training,
    vaast_second_step_training,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_training,
  repetitions: 1, //here, put 12 for 192 trials in total
  randomize_order: true,
  data: {
    phase: "training",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement'),
    group: jsPsych.timelineVariable('group'),
  }
};


// Creating a trial for the CONTROL cond---------------------------------------------------------------------
var vaast_start_c = {
  type: 'vaast-text',
  stimulus: "o",
  position: 3,
  background_images: background,
  font_sizes: stim_sizes,
  approach_key: "d",
  stim_movement: "approach",
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_fixation_c = {
  type: 'vaast-fixation',
  fixation: "+",
  font_size: 46,
  position: 3,
  background_images: background
}

var vaast_first_step_training_c = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: 3,
  background_images: background,
  font_sizes: image_sizes,
  approach_key: "f",
  //avoidance_key: "f",
  control_key: "s",
  stim_movement: jsPsych.timelineVariable('movement'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500,
  response_ends_trial: true
}

var vaast_second_step_c = {
  type: 'vaast-image',
  position: 3,
  stimulus: jsPsych.timelineVariable('stimulus'),
  background_images: background,
  font_sizes: image_sizes,
  stim_movement: jsPsych.timelineVariable('movement'),
  response_ends_trial: false,
  trial_duration: 650
}

var vaast_second_step_training_c = {
  chunk_type: "if",
  timeline: [vaast_second_step_c],
  conditional_function: function () {
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}

// Control training block -----------------------------------------------------------------
var vaast_control = {
  timeline: [
    vaast_start_c,
    vaast_fixation_c,
    vaast_first_step_training_c,
    vaast_second_step_training_c,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_training,
  repetitions: 1, //here, put 12 !!!!!
  randomize_order: true,
  data: {
    phase: "control",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement'),
    group: jsPsych.timelineVariable('group'),
  }
};


// end fullscreen -----------------------------------------------------------------------

var fullscreen_trial_exit = {
  type: 'fullscreen',
  fullscreen_mode: false
}


// procedure ----------------------------------------------------------------------------
// Initialize timeline ------------------------------------------------------------------

var timeline = [];

//timeline.push(consent);

// fullscreen
timeline.push(
  fullscreen_trial,
  hiding_cursor);

// prolific verification
timeline.push(save_id);
switch(cond_AA) {
  case "vaast":
   {if (target_action == "app_agg"){
      timeline.push(Gene_Instr_AA,
                    vaast_instructions_1_app,
                    vaast_instructions_2,
                    vaast_instructions_3_app_agg,
                    vaast_instructions_4_app_agg,
                    vaast_instructions_5_app_agg,
                    vaast_instructions_6_app_agg,
                    vaast_training,
                    vaast_instructions_end
                    );
    } else if (target_action == "app_aff"){
      timeline.push(Gene_Instr_AA,
                    vaast_instructions_1_app,
                    vaast_instructions_2,
                    vaast_instructions_3_app_aff,
                    vaast_instructions_4_app_aff,
                    vaast_instructions_5_app_aff,
                    vaast_instructions_6_app_aff,
                    vaast_training,
                    vaast_instructions_end
                    );
    }};
    break;
  case "instruction":
   {if (target_action == "app_agg"){
      timeline.push(Gene_Instr_cont,
                    vaast_instructions_1_cont,
                    vaast_instructions_2,
                    vaast_instructions_3_4_cont,
                    vaast_instructions_5_cont,
                    vaast_instructions_6_cont,
                    vaast_control,
                    vaast_instructions_end,
                    vaast_instructions_7_cont,
                    vaast_instructions_8_app_agg_cont,
                    vaast_instructions_9_app_agg_cont,
                    vaast_instructions_11_app_agg_cont,
                    vaast_instructions_12_cont
                    );
    } else if (target_action == "app_aff"){
      timeline.push(Gene_Instr_cont,
                    vaast_instructions_1_cont,
                    vaast_instructions_2,
                    vaast_instructions_3_4_cont,
                    vaast_instructions_5_cont,
                    vaast_instructions_6_cont,
                    vaast_control,
                    vaast_instructions_end,
                    vaast_instructions_7_cont,
                    vaast_instructions_8_app_aff_cont,
                    vaast_instructions_9_app_aff_cont,
                    vaast_instructions_11_app_aff_cont,
                    vaast_instructions_12_cont
                    );
    }};
    break;
}





timeline.push(showing_cursor);

timeline.push(fullscreen_trial_exit);

// Launch experiment --------------------------------------------------------------------
// preloading ---------------------------------------------------------------------------
// Preloading. For some reason, it appears auto-preloading fails, so using it manually.
// In principle, it should have ended when participants starts VAAST procedure (which)
// contains most of the image that have to be pre-loaded.
var loading_gif = ["media/loading.gif"]
var vaast_instructions_images = ["media/vaast-background.png", "media/keyboard_app_agg.png", "media/keyboard_app_aff.png", "media/keyboard_av.png", "media/keyboard_control_task.png"];
var vaast_bg_filename = background;

jsPsych.pluginAPI.preloadImages(loading_gif);
jsPsych.pluginAPI.preloadImages(vaast_instructions_images);
jsPsych.pluginAPI.preloadImages(vaast_bg_filename);

// timeline initiaization ---------------------------------------------------------------
if (is_compatible) {
  jsPsych.init({
    timeline: timeline,
    preload_images: preloadimages,
    max_load_time: 1000 * 500,
    exclusions: {
      min_width: 1100,
      min_height: 600,
      max_width: 1600,
      max_height: 900,
    },
    on_interaction_data_update: function () {
      saving_browser_events(completion = false);
    },
    on_finish: function () {
      saving_browser_events(completion = true);
      window.location.href = "https://marinerougier.github.io/RR_Expe2_Part1/RC.html?id=" + id + "&prolificID=" + 
      prolificID + "&cond_AA=" + cond_AA + "&control_cond=" + control_cond + "&target_action=" + target_action  
      + "&ColorGroup=" + ColorGroup + "&color_target=" + color_target;
    }
  });
}


