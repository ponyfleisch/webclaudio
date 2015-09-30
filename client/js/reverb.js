AudioContext.prototype.createReverb = function(ir, dryWet){
    var audioContext = this;

    var ReverbNode = function(){
        this.input = audioContext.createGain();
        var output = audioContext.createGain(),
            convolver = audioContext.createConvolver(),
            wetLevel = audioContext.createGain(),
            dryLevel = audioContext.createGain();

        ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open('GET', ir, true);
        ajaxRequest.responseType = 'arraybuffer';

        ajaxRequest.onload = function() {
            var audioData = ajaxRequest.response;
            audioContext.decodeAudioData(audioData, function(buffer) {
                convolver.buffer = buffer;
            }, function(e){"Error with decoding audio data" + e.err});
        };

        ajaxRequest.send();

        wetLevel.gain.value = dryWet;
        dryLevel.gain.value = 1-dryWet;
        this.input.connect(convolver);
        this.input.connect(dryLevel);
        convolver.connect(wetLevel);
        wetLevel.connect(output);
        dryLevel.connect(output);

        this.connect = function(target){
            output.connect(target);
        };
    };
    return new ReverbNode();
};