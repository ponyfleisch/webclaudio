AudioContext.prototype.createFlarbarbarb = function(speed, center, spread, dryWet){
    var audioContext = this;

    var Flarbarbarb = function(){
        this.input = audioContext.createGain();
        var output = audioContext.createGain(),
            filter = audioContext.createBiquadFilter(),
            wetLevel = audioContext.createGain(),
            dryLevel = audioContext.createGain();

        var now = audioContext.currentTime;
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(center, now);
        // filter.frequency.exponentialRampToValueAtTime(frequency*8, now+3);
        filter.Q.value = 10;

        var lastTimed = now;

        function scheduleValues(){
            var now = audioContext.currentTime;

            // we have enough in our buffer
            if(lastTimed > (now+1.5)){
                return true;
            }

            var interval = 1/speed;
            while(lastTimed < (now+1.5)){
                lastTimed += interval;
                var f = center+(Math.random()*spread)-(spread/2);
                filter.frequency.setValueAtTime(f, lastTimed);
            }

            return true;
        }

        scheduleValues();

        setInterval(scheduleValues, 1000);

        wetLevel.gain.value = dryWet;
        dryLevel.gain.value = 1-dryWet;
        this.input.connect(filter);
        this.input.connect(dryLevel);
        filter.connect(wetLevel);
        wetLevel.connect(output);
        dryLevel.connect(output);

        this.connect = function(target){
            output.connect(target);
        };
    };
    return new Flarbarbarb();
};