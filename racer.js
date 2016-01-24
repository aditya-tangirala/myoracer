/*global Car,TO_RADIANS,drawRotatedImage */


var canvas   = document.getElementById('canvas'),
	context  = canvas.getContext('2d'),
	ctxW     = canvas.width,
	ctxH     = canvas.height,
	player   = new Car(),
	track    = new Image(),
	trackHit = new Image(),
	ws = new WebSocket("ws://localhost:10138/myo/3?appid=com.quasar.test"),
	elPX     = document.getElementById('px'),
	elPY     = document.getElementById('py')

track.src = "track.png";
trackHit.src = "track-hit.png";

// collision
var hit = new HitMap(trackHit);

// Keyboard Variables
var key = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39
};

var keys = {
	38: false,
	40: false,
	37: false,
	39: false
};

function speedXY (rotation, speed) {
	return {
		x: Math.sin(rotation * TO_RADIANS) * speed,
		y: Math.cos(rotation * TO_RADIANS) * speed * -1,
	};
}

var x=10,y=10;
function step (car) {
	if (car.code === 'player'){

		// constantly decrease speed
		if (!car.isMoving()){
			car.speed = 0;
		} else {
			car.speed *= car.speedDecay;
		}
		
		//document.getElementById('spmon').innerHTML+=" </br>  entered step";
						
               
               ws.onmessage = function (evt) 
               { 
               	//  document.getElementById('spmon').innerHTML+=" </br>  entered got message now "+"<h7>"+evt.data+"</h7>";
                  var received_msg = JSON.stringify(evt.data);
                  var jsonobjs = JSON.parse(received_msg);
                 // document.getElementById('spmon').innerHTML+=" </br> "+jsonobjs.includes('pose');
                  if(jsonobjs.includes('pose'))
                  {
                  	document.getElementById('spmon').innerHTML+=" </br>  entered pose section";
                  	var p;
                  	var opp;
                  	if(p==38)
                  		opp=40;
                  	else if(p==40)
                  		opp=38;
                  	else if(p==37)
                  		opp=39;
                  	else if(p==39)
                  		opp=37;

                  	if(jsonobjs.includes('fist')){
                  	//	document.write("Slowing down\n");
                  		p=key.DOWN;
                  		keys[p]=true;
                  		// document.getElementById('spmon').innerHTML+=" </br> Slowing down Sig:Fist Speed: "+car.speed+" acceleration:"+car.acceleration;

                  	}
                  	else if(jsonobjs.includes('wave_out')){
                  	//	document.write("Turning Left\n");
                  		p=key.RIGHT
                  		keys[p]=true;
						// document.getElementById('spmon').innerHTML+=" </br>Turning left Sig:wave_out"+car.speed+" acceleration:"+car.acceleration;
                  	}
                  	else if(jsonobjs.includes('wave_in')){
                  	//	document.write("Turning right\n");
                  		p=key.LEFT
                  		keys[p]=true;
                  		// document.getElementById('spmon').innerHTML+=" </br>Turning right Sig:right"+car.speed+" acceleration:"+car.acceleration;
                  	}
                  	else if(jsonobjs.includes('fingers_spread')){
                  	//	document.write("Accelerating\n");
                  		p=key.UP
                  		keys[p]=true;
                  		// document.getElementById('spmon').innerHTML+=" </br>Speeding up Sig:fingers_spread"+car.speed+" acceleration:"+car.acceleration;
                  	}
                  	else if(jsonobjs.includes("rest" || "unknown"))
                  	{
                  	//	document.write("Slowing down motion\n");
                  		keys[key.LEFT]=false;
                  		keys[key.RIGHT]=false;
                  		keys[key.UP]=false;
                  		keys[key.DOWN]=false;
                  		// document.getElementById('spmon').innerHTML+=" </br> Retarding Sig:rest or unknown speed:"+car.speed+" acceleration:"+car.acceleration;
                  		//keys[opp]="true";
                  	}
                  	else if(jsonobjs.includes("double_tap")){
                  		// document.getElementById('spmon').innerHTML+=" </br>Game Reset Sig:double_tap speed: "+car.speed+" acceleration:"+car.acceleration;
			     		
			     		/*car.x: 870,
						car.y: 370,
						car.acceleration: 1.1,
						car.rotationStep: 4,
						car.rotation: 350,
						car.speed: 0,*/
                  	}	
                  		
                  }
				
				};

		// document.getElementById('spmon').innerHTML+=" </br> "+" up:"+keys[key.UP]+" down:"+keys[key.DOWN]+" right:"+keys[key.RIGHT]+" left:"+keys[key.LEFT];			
		
		if (keys[key.UP])  { 
			// if(count%2==0)
			// {
			//count++;	
			 car.accelerate(); 
			// }
			// document.getElementById('spmon').innerHTML+=" </br> in up:"+car.speed+" acceleration:"+car.acceleration;//+ " count:"+count; 
			 }
		if (keys[key.DOWN]){ 
			// if(count%2==0)
			// {
			//count++;
			car.decelerate();  
		//	}
			// document.getElementById('spmon').innerHTML+=" </br> in down"+car.speed+" acceleration:"+car.acceleration;//+ " count:"+count;
			}
		if (keys[key.LEFT]){ 
			// if(count%2==0)
			// {
			// count++;
			car.steerLeft(); 
		//    }
		    // document.getElementById('spmon').innerHTML+=" </br> in left"+car.speed+" acceleration:"+car.acceleration;//+ " count:"+count;
		}
		if (keys[key.RIGHT]){
			// if(count%2==0)
			// {
			// count++;
			car.steerRight();
		//	}
		    // document.getElementById('spmon').innerHTML+=" </br> in right"+car.speed+" acceleration:"+car.acceleration;//+ " count:"+count;
		}
	
		//sdocument.getElementById('spmon').innerHTML="Running outside too";
		var speedAxis = speedXY(car.rotation, car.speed);
		car.x += speedAxis.x;
		car.y += speedAxis.y;

		// collisions
		if (car.collisions.left.isHit(hit)){
			car.steerRight();
			car.decelerate(1);
		}
		if (car.collisions.right.isHit(hit)){
			car.steerLeft();
			car.decelerate(1);
		}
		if (car.collisions.top.isHit(hit)){
			car.decelerate(1);
		}
		if (car.collisions.bottom.isHit(hit)){
			car.decelerate(1);
		}

		// info
		elPX.innerHTML = Math.floor(car.x);
		elPY.innerHTML = Math.floor(car.y);
	}
}
function draw (car) {
	context.clearRect(0,0,ctxW,ctxH);
	context.drawImage(track, 1, 1);
	drawRotatedImage(car.img, car.x, car.y, car.rotation);

}

// Keyboard event listeners
$(window).keydown(function(e){
	if (keys[e.keyCode] !== 'undefined'){
		keys[e.keyCode] = true;
		// e.preventDefault();
	}
});
$(window).keyup(function(e){
	if (keys[e.keyCode] !== 'undefined'){
		keys[e.keyCode] = false;
		// e.preventDefault();
	}
});

function frame () {
	step(player);
	draw(player);
	window.requestAnimationFrame(frame);
}
frame();



