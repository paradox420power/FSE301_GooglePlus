
var intervalQueue = [];
var userWin = null;
var alertPlaying = false; //don't layer alert sounds
var moreTimeIntervals = false;

window.onload = function init(){
	var hours = 0;
	var minutes = 0;
	var seconds = 0;
	
	document.getElementById("TimerOutput").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
	
	document.getElementById("removeSelected").onclick = function(){
		var list = document.getElementById("timerList");
		intervalQueue.splice(list.selectedIndex, 1); //remove from Queue first
		list.remove(list.selectedIndex); //remove from display after to maintain the index reference
	}
	
	document.getElementById("addInterval").onclick = function(){
		addInterval();
	};
	document.getElementById("startTime").onclick = function(){
		var startURL = document.getElementById("nextURL").value;
		addToHead();
		startTimer();
	};
	
}

function addInterval(){
	var hours, minutes, seconds, redirects, nextURL;
	hours = document.getElementById("hourField").value;
	minutes = document.getElementById("minuteField").value;
	seconds = document.getElementById("secondField").value;
	redirects = document.getElementById("urlChange").checked;
	nextURL = document.getElementById("nextURL").value;
	
	if(hours > 0 || minutes > 0 || seconds >= 0){ //push non-empty
		let nextInterval = {
			hour: hours,
			minute: minutes,
			second: seconds,
			redirect: redirects,
			url: nextURL
		};
		intervalQueue.push(nextInterval);
		var list = document.getElementById("timerList");
		var option = document.createElement("option");
		var toWrite = "";
		toWrite += "Timer: " + hours + "h " + minutes + "m " + seconds + "s";
		if(redirects === true)
			toWrite += " and will send user to \"" + nextURL + "\"";
		option.text = toWrite;
		list.add(option);
	}
	document.getElementById("hourField").value = 0;
	document.getElementById("minuteField").value = 0;
	document.getElementById("secondField").value = 0;
}

function addToHead(){
	var hours, minutes, seconds, redirects, nextURL;
	hours = document.getElementById("hourField").value;
	minutes = document.getElementById("minuteField").value;
	seconds = document.getElementById("secondField").value;
	redirects = document.getElementById("urlChange").checked;
	nextURL = document.getElementById("nextURL").value;
	
	if(hours != 0 || minutes != 0 || seconds != 0){ //push non-empty
		let nextInterval = {
			hour: hours,
			minute: minutes,
			second: seconds,
			redirect: redirects,
			url: nextURL
		};
		intervalQueue.unshift(nextInterval);
		var list = document.getElementById("timerList");
		var option = document.createElement("option");
		var toWrite = "";
		toWrite += "Timer: " + hours + "h " + minutes + "m " + seconds + "s";
		if(redirects === true)
			toWrite += " and will send user to \"" + nextURL + "\"";
		option.text = toWrite;
		list.add(option, list[0]);
	}
	document.getElementById("hourField").value = 0;
	document.getElementById("minuteField").value = 0;
	document.getElementById("secondField").value = 0;
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

var hoursLeft;
var minutesLeft;
var secondsLeft;

function startTimer(){
	// Set the date we're counting down to
	var hours, minutes, seconds;
	var output;
	hours = intervalQueue[0].hour;
	minutes = intervalQueue[0].minute;
	seconds = intervalQueue[0].second;
	
	if(intervalQueue[0].redirect === true){
		var startURL = makeValidURL(intervalQueue[0].url) + "";
		userWin = window.open(makeValidURL(startURL), '_blank');
	}
	
	intervalQueue.shift();
	var theList = document.getElementById("timerList");
	theList.remove(0);
	
	hoursLeft = hours;
	minutesLeft = minutes;
	secondsLeft = seconds;
	output = hoursLeft + "h " + minutesLeft + "m " + secondsLeft + "s "
	document.getElementById("TimerOutput").innerHTML = output;
	
	updateTimer();
}

var x;

function updateTimer(){
	
	x = setInterval(function(){
		var timeUp = false;
	
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
		let output = hoursLeft + "h " + minutesLeft + "m " + secondsLeft + "s ";
		document.getElementById("TimerOutput").innerHTML = output;
		document.title = output;
		
		
		// If the count down is finished, write some text
		if (timeUp) {
			
			killMe();
			
		}
		
	}, 1000);
	
}

function endTimer(){
	document.getElementById("TimerOutput").innerHTML = "EXPIRED";
	document.title = "EXPIRED";
	userWin.close();
}

function killMe(){
	clearInterval(x);
	let context = new AudioContext(); //create a simple alarm to notify the user time is up
	let o = context.createOscillator();
	o.type = "sine";
	o.frequency.value = 830; //pick a semi-annoying frequency
	o.connect(context.destination);
	if(!alertPlaying){
		o.start(); //start the timer only once
		alertPlaying = true;
	}
	
	
	if(confirm("Time has expired.\nHit \"OK\" to continue.\nHit \"Cancel\" to snooze for 5 minutes")){ //nested like this will be the "OK" route
		notSeen = false;
		o.stop(); //stop the "doooo" here
		alertPlaying = false;
		notSeen = false;
		if(intervalQueue.length > 0){
			startTimer();
		}else{
			endTimer();
		}
	
	}else{//user snoozed, give them 5 more minutes
		notSeen = false;
		o.stop(); //stop the "doooo" here
		alertPlaying = false;
		notSeen = false;
		let nextInterval = {
			hour: 0,
			minute: 5,
			second: 0,
			redirect: false,
			url: ""
		};
		intervalQueue.unshift(nextInterval);
		startTimer();
	}
	
}