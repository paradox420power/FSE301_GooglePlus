
var intervalQueue = [];

window.onload = function init(){
	var hours = 0;
	var minutes = 0;
	var seconds = 0;
	
	document.getElementById("TimerOutput").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
	
	document.getElementById("addInterval").onclick = function(){
		addInterval();
	};
	document.getElementById("startTime").onclick = function(){
		startTimer();
	};
}

function addInterval(){
	var hours, minutes, seconds;
	hours = document.getElementById("hourField").value;
	minutes = document.getElementById("minuteField").value;
	seconds = document.getElementById("secondField").value;
	
	if(hours != 0 || minutes != 0 || seconds != 0){ //push non-empty
		let nextInterval = {
			hour: hours,
			minute: minutes,
			second: seconds
		};
		intervalQueue.push(nextInterval);
		writeQueue();
	}
	document.getElementById("hourField").value = 0;
	document.getElementById("minuteField").value = 0;
	document.getElementById("secondField").value = 0;
}

function writeQueue(){
	var toWrite = "";
	for(let x = 0; x < intervalQueue.length; x++){
		toWrite += intervalQueue[x].hour + "h " + intervalQueue[x].minute + "m " + intervalQueue[x].second + "s<br>";
	}
	document.getElementById("queue").innerHTML = toWrite;
}

function startTimer(){
	// Set the date we're counting down to
	var hours, minutes, seconds;
	var output;
	hours = document.getElementById("hourField").value;
	minutes = document.getElementById("minuteField").value;
	seconds = document.getElementById("secondField").value;
	
	var hoursLeft = hours;
	var minutesLeft = minutes;
	var secondsLeft = seconds;
	output = hoursLeft + "h " + minutesLeft + "m " + secondsLeft + "s "
	document.getElementById("TimerOutput").innerHTML = output;
	
	var timeUp = false;

	// Update the count down every 1 second
	var x = setInterval(function() {
		
		
		
		if(secondsLeft > 0){
			secondsLeft--;
		}else{
			if(minutesLeft > 0){
				minutesLeft--;
				secondsLeft = 59;
			}else{
				if(hoursLeft > 0){
					hoursLeft--;
					minutesLeft = 59;
					secondsLeft = 59;
				}else{
					timeUp = true;
				}
			}
		}
		
		// Display the result in the element with id="demo"
		output = hoursLeft + "h " + minutesLeft + "m " + secondsLeft + "s "
		document.getElementById("TimerOutput").innerHTML = output;
		document.title = output;
		
		// If the count down is finished, write some text
		if (timeUp) {
			if(intervalQueue.length > 0){
				hoursLeft = intervalQueue[0].hour;
				minutesLeft = intervalQueue[0].minute;
				secondsLeft = intervalQueue[0].second;
				output = hoursLeft + "h " + minutesLeft + "m " + secondsLeft + "s "
				document.getElementById("TimerOutput").innerHTML = output;
				document.title = output;
				timeUp = false;
				intervalQueue.shift();
				writeQueue();
			}else{
				clearInterval(x);
				document.getElementById("TimerOutput").innerHTML = "EXPIRED";
			}
		}
	}, 1000);
}