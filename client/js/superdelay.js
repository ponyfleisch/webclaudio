AudioContext.prototype.createSuperDelay = function(delayTime, feedbackValue, dryWet){
    var audioContext = this;

    var SuperDelayNode = function(){
        this.input = audioContext.createGain();
        var output = audioContext.createGain(),
            delay = audioContext.createDelay(),
            feedback = audioContext.createGain(),
            wetLevel = audioContext.createGain(),
            dryLevel = audioContext.createGain();

        delay.delayTime.value = delayTime;
        feedback.gain.value = feedbackValue;
        wetLevel.gain.value = dryWet;
        dryLevel.gain.value = 1-dryWet;
        this.input.connect(delay);
        this.input.connect(dryLevel);
        delay.connect(feedback);
        delay.connect(wetLevel);
        feedback.connect(delay);
        wetLevel.connect(output);
        dryLevel.connect(output);

        this.connect = function(target){
            output.connect(target);
        };
    };
    return new SuperDelayNode();
};