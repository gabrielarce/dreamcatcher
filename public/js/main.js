$(document).ready(function() {
    $('.sidenav').sidenav();
});

$(document).ready(function() {
    $('.datepicker').datepicker();
});

$(document).ready(function() {
    $('.modal').modal();
});

CKEDITOR.replace("story", {
    plugins: "wysiwygarea, toolbar, basicstyles"
})



document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, { direction: "top" });
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.slider');
    var instances = M.Slider.init(elems, options);
});


// Modal Delete
const modal = document.querySelectorAll('.modal-delete')

Array.from(modal).forEach((element) => {
    element.addEventListener('click', deleteDream)
})

async function deleteDream() {
    // const dreamId = this.parentNode.parentNode.parentNode.dataset.id
    const dreamId = this.dataset.id
    console.log(this.dataset.id)
    try {
        const response = await fetch('/api/dreams/delete', {
            method: 'delete',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'dreamIdFromJSFile': dreamId
            })
        })
        const data = await response.json()
        console.log(data)
    } catch (err) {
        console.log(err)
    }
}

//Edit Dream
const update = document.querySelector('#update').addEventListener('click', updateDream)

// Array.from(modal).forEach((element) => {
//     element.addEventListener('click', deleteDream)
// })

async function updateDream() {
    // const dreamId = this.parentNode.parentNode.parentNode.dataset.id
    const dreamId = this.dataset.id
    console.log(this.dataset.id)
    try {
        const response = await fetch('/api/dreams/delete', {
            method: 'delete',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'dreamIdFromJSFile': dreamId
            })
        })
        const data = await response.json()
        console.log(data)
    } catch (err) {
        console.log(err)
    }
}


// Voice to text 
try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
} catch (e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}


var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var notesList = $('ul#notes');

var noteContent = '';

// Get all notes from previous sessions and display them.
var notes = getAllNotes();
renderNotes(notes);



/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;



    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if (!mobileRepeatBug) {
        noteContent += transcript;
        noteTextarea.val(noteContent);
    }
};

recognition.onstart = function() {
    instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
    instructions.text('You were quiet for a while, or you paused, so voice recognition turned off.');
}

recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
        instructions.text('No speech was detected. Try again.');
    };
}



/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function(e) {
    if (noteContent.length) {
        noteContent += ' ';
    }
    recognition.start();
});


$('#pause-record-btn').on('click', function(e) {
    recognition.stop();
    instructions.text('Voice recognition paused.');
    M.textareaAutoResize($('#note-textarea'));
});

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function() {
    noteContent = $(this).val();
})

$('#save-note-btn').on('click', function(e) {
    recognition.stop();

    if (!noteContent.length) {
        instructions.text('Could not save empty note. Please add a message to your note.');
    } else {
        // Save note to localStorage.
        // The key is the dateTime with seconds, the value is the content of the note.
        saveNote(new Date().toLocaleString(), noteContent);

        // Reset variables and update UI.
        noteContent = '';
        renderNotes(getAllNotes());
        noteTextarea.val('');
        instructions.text('Note saved successfully.');
    }

})


/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
    var speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}



/*-----------------------------
      Helper Functions 
------------------------------*/

function renderNotes(notes) {
    var html = '';
    if (notes.length) {
        notes.forEach(function(note) {
            html += `<li class="note">
          <p class="header">
            <span class="date">${note.date}</span>
            <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
            <a href="#" class="delete-note" title="Delete">Delete</a>
          </p>
          <p class="content">${note.content}</p>
        </li>`;
        });
    } else {
        html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
    }
    notesList.html(html);
}


function saveNote(dateTime, content) {
    localStorage.setItem('note-' + dateTime, content);
}


function getAllNotes() {
    var notes = [];
    var key;
    for (var i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        console.log(i)
        console.log(key)

        if (key.substring(0, 5) == 'note-') {
            notes.push({
                date: key.replace('note-', ''),
                content: localStorage.getItem(localStorage.key(i))
            });
        }
    }
    console.log(notes)
    return notes;
}


function deleteNote(dateTime) {
    localStorage.removeItem('note-' + dateTime);
}

$('#addVoiceNote').on('click', function(e) {
    let text = $('#note-textarea').val()
    $('#story').val(text)
});

$('#discardVoiceNote').on('click', function(e) {
    $('#note-textarea').val("");
    noteContent = "";
    $('#story').val("")
});