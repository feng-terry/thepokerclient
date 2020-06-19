Settings=function(){
    this.startingStack;
    this.bigBlind;
    this.blindsIncrease; //boolean of whether or not blinds will increase

    this.blindsCounterSetting = 5; //setting for number of hands until blinds increase, 5 is default
    this.blindsCounter = this.blindsCounterSetting // live counter until blinds increase

    this.blindsIncrement; // multiplier of how much the blinds will increase by -> 10% = 1.10
    this.seats;

    this.increaseBlinds = function(){
        bigBlind*=blindsIncrement
    }

    this.decreaseCounter = function(){
        blindsCounter -=1
        if(blindsCounter === 0){
            increaseBlinds()
            blindsCounter = blindsTimerSetting
        }
    }
}

module.exports={
    Settings: Settings
}