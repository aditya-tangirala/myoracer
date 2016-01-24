var Myo1 = require('myo');


//Start talking with Myo Connect
Myo1.connect('com.quasar.test');
//Myo.setLockingPolicy('none');

Myo1.on('connected', function(data,timestamp){
    console.log('Myo Connected successfully!');
});

Myo1.on('pose',function(){
	//console.log(this.batteryLevel);
	//console.log(this.arm);
});

Myo1.on('fist', function(){
    console.log('fist closed');
    this.vibrate();
});

Myo1.on('fist_off', function(){
    console.log('fist released');
});

Myo1.on('wave_in',function(){
	console.log('wave_in recorded');
});


Myo1.on('wave_out',function(){
	console.log('wave_out recorded');
});

Myo1.on('fingers_spread',function(){
	console.log('fingers_spread recorded');
});


Myo1.on('double_tap',function(){
	console.log('double_tap recorded');
});
