var StringVoice = (function() {
    function StringVoice(frequency, settings, context, output){
        this.frequency = frequency;
        this.context = context;
        this.settings = settings;
        this.oscillators = [];
        var now = context.currentTime;

        var filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(frequency, now);
        filter.frequency.exponentialRampToValueAtTime(frequency*8, now+3);
        filter.Q.value = 10;
        filter.connect(output);
        this.filter = filter;

        var amp = this.context.createGain();
        amp.gain.setValueAtTime(0.0, context.currentTime);
        amp.connect(this.filter);
        this.amp = amp;

        settings.oscillators.forEach(function(conf){
            var osc = this.context.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.value = frequency * Math.pow(2, conf.octave);
            osc.detune.value = conf.detune;
            osc.connect(this.amp);
            this.oscillators.push(osc);
            osc.start(0);
        }.bind(this));
    };

    StringVoice.prototype.start = function(attack) {
        var now = this.context.currentTime;
        this.amp.gain.cancelScheduledValues(now);
        this.amp.gain.setValueAtTime(0.001, now);
        this.amp.gain.linearRampToValueAtTime(0.1/(this.oscillators.length), this.context.currentTime+attack);
    };

    StringVoice.prototype.stop = function(release) {
        var now = this.context.currentTime;
        this.amp.gain.cancelScheduledValues(now);
        this.amp.gain.setValueAtTime(this.amp.gain.value, now);
        this.amp.gain.linearRampToValueAtTime(0.00001, now+release);
        var that = this;
        setTimeout(function(){
            that.oscillators.forEach(function(osc) {
                osc.stop();
            });
        }, release*1000);
    };

    return StringVoice;
})();