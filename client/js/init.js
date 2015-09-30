"use strict";

window.addEventListener('load', function() {
    var keyboard = new AudioKeys();
    var context = new AudioContext();
    var voices = {};
    var settings = {
        oscillators: [
            {octave: -1, detune: 0},
            {octave: 0, detune: 0},
            {octave: 0, detune: -2},
            {octave: 0, detune: 3},
            {octave: 0, detune: 17},
            {octave: 0, detune: -13},
            {octave: 0, detune: 6},
            {octave: 1, detune: -9},
            {octave: 1, detune: 17},
            {octave: 2, detune: -14},
            {octave: 2, detune: 10},
        ]
    };

    var delay = context.createSuperDelay(0.7, 0.3, 0.3);
    var reverb = context.createReverb('h.wav', 0.8);
    var flarbarbarb = context.createFlarbarbarb(6, 800, 600, 0.5);
    delay.connect(context.destination);
    flarbarbarb.connect(delay.input);
    reverb.connect(flarbarbarb.input);

    function note2freq(note) {
        return Math.pow(2, (note - 69) / 12) * 440;
    }

    function noteOn(note) {
        var voice = new StringVoice(note2freq(note), settings, context, reverb.input);
        voice.start(0);
        voices[note] = voice;
    }

    function noteOff(note) {
        voices[note].stop(1);
    }

    keyboard.down(function (note) {
        noteOn(note.keyCode)
    });

    keyboard.up(function (note) {
        noteOff(note.keyCode)
    });

    function midiMessage(ev) {
        var cmd = ev.data[0] >> 4;
        var channel = ev.data[0] & 0xf;
        var noteNumber = ev.data[1];
        var velocity = ev.data[2];

        if (cmd == 8 || ((cmd == 9) && (velocity == 0))) { // with MIDI, note on with velocity zero is the same as note off
            // note off
            noteOff(noteNumber);
        } else if (cmd == 9) {
            // note on
            noteOn(noteNumber, velocity / 127.0);
        } else if (cmd == 11) {
            // controller( noteNumber, velocity/127.0);
        } else if (cmd == 14) {
            // pitch wheel
            // pitchWheel( ((velocity * 128.0 + noteNumber)-8192)/8192.0 );
        }
    }

    navigator.requestMIDIAccess().then(function (midi) {
        //console.log(midi);
        midi.inputs.forEach(function (item) {
            item.onmidimessage = midiMessage;
        });
    });
});