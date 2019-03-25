
var intervalQueue = [];
var userWin;
var alertPlaying = false; //don't layer alert sounds

window.onload = function init(){
	var hours = 0;
	var minutes = 0;
	var seconds = 0;
	
	document.getElementById("TimerOutput").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
	
	document
	
	document.getElementById("addInterval").onclick = function(){
		addInterval();
	};
	document.getElementById("startTime").onclick = function(){
		var startURL = document.getElementById("nextURL").value;
		userWin = window.open(makeValidURL(startURL), '_blank');
		startTimer();
	};
}

function addInterval(){
	var hours, minutes, seconds, redirects, nextURL;
	hours = document.getElementById("hourField").value;
	minutes = document.getElementById("minuteField").value;
	seconds = document.getElementById("secondField").value;
	redirects = document.getElementById("urlChange").checked;
	console.log(redirects);
	nextURL = document.getElementById("nextURL").value;
	
	if(hours != 0 || minutes != 0 || seconds != 0){ //push non-empty
		let nextInterval = {
			hour: hours,
			minute: minutes,
			second: seconds,
			redirect: redirects,
			url: nextURL
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
		toWrite += "Timer: " + intervalQueue[x].hour + "h " + intervalQueue[x].minute + "m " + intervalQueue[x].second + "s<br>";
		if(intervalQueue[x].redirect === true)
			toWrite += "Sending user to \"" + intervalQueue[x].url + "\"<br>";
		toWrite += "<br>";
	}
	document.getElementById("queue").innerHTML = toWrite;
}

//not all users are going to enter http://www. OR .com/.net/.org
//to their website address, we need to make sure it is there
function makeValidURL(currentURL){
	var index = 0;
	var httpHead = "http://";
	var httpsHead = "https://";
	var domains = [".com", ".net", ".org", ".edu"];
	//check the correct headers are attached
	var toCheck = currentURL.substr(0,7); //does it have http?
	if(toCheck !== httpHead){
		toCheck = currentURL.substr(0,8); //does it have https?
		if(toCheck !== httpsHead){
			currentURL = httpHead + currentURL; //has niether, add http://
		}
	}
	var hasDomain = false;
	for(var x = 0; x < domains.length; x++){
		if(currentURL.includes(domains[x]))
			hasDomain = true;
	}
	if(!hasDomain){
		currentURL += ".com";
	}	
	
	return currentURL;
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
			
			var context = new AudioContext(); //create a simple alarm to notify the user time is up
			var o = context.createOscillator();
			o.type = "sine";
			o.frequency.value = 830; //pick a semi-annoying frequency
			o.connect(context.destination);
			if(!alertPlaying){
				o.start(); //start the timer only once
				alertPlaying = true;
			}
			if(document.hidden)
				console.log("NOT HERE");
			else
				console.log("LOOKING");
			
			if(confirm("Time has expired.\nHit \"OK\" to continue.\nHit \"Cancel\" to snooze for 5 minutes")){ //nested like this will be the "OK" route
				o.stop(); //stop the "doooo" here
				alertPlaying = false;
				if(intervalQueue.length > 0){
					//update timer
					hoursLeft = intervalQueue[0].hour;
					minutesLeft = intervalQueue[0].minute;
					secondsLeft = intervalQueue[0].second;
					output = hoursLeft + "h " + minutesLeft + "m " + secondsLeft + "s ";
					//check if the url should be changed
					if(intervalQueue[0].redirect === true){
						var jumpTo = makeValidURL(intervalQueue[0].url) + "";
						userWin.location.href = jumpTo;
					}
					document.getElementById("TimerOutput").innerHTML = output;
					document.title = output;
					timeUp = false;
					intervalQueue.shift();
					writeQueue();
				}else{
					clearInterval(x);
					document.getElementById("TimerOutput").innerHTML = "EXPIRED";
					userWin.close();
				}
				
			}else{//user snoozed, give them 5 more minutes
				if(document.hidden){ //make sure it didn't just auto-reject the alert
					o.stop(); //stop the "doooo" here
					alertPlaying = false;
					minutesLeft = 5;
					output = hoursLeft + "h " + minutesLeft + "m " + secondsLeft + "s ";
					document.getElementById("TimerOutput").innerHTML = output;
					document.title = output;
					timeUp = false;
					writeQueue;
				}
			}
			
			
			
		}
	}, 1000);
}
