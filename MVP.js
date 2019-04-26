
var intervalQueue = [];
var userWin = null;
var alertPlaying = false; //don't layer alert sounds
var moreTimeIntervals = false;
var inView = true;
var notInView = false;
var userCancel = false; // Boolean to make sure if the user snoozes the timer, it will not delete the next timer in the list.

window.onload = function init(){
	var hours = 0;
	var minutes = 0;
	var seconds = 0;
	document.getElementById("myQueueDiv").style.display = "none";
	document.getElementById("webRedirectDiv").style.display = "none";
	document.getElementById("addIntervalDiv").style.display = "none";
	
	document.getElementById("TimerOutput").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
	
	document.getElementById("hideFeatures").onclick = function(){
		var x = document.getElementById("myQueueDiv");
		if (x.style.display === "none") {
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
		var y = document.getElementById("webRedirectDiv");
		if (y.style.display === "none") {
			y.style.display = "block";
		} else {
			y.style.display = "none";
		}
		var z = document.getElementById("addIntervalDiv");
		if (z.style.display === "none") {
			z.style.display = "block";
		} else {
			z.style.display = "none";
		}
		
	}
	
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
	
	document.addEventListener("visibilitychange", function() {
		inView = !inView;
		if(inView)
			console.log( "Focus" );
			if(notInView) { // If the user returns from the page, the alert will play when they get back
				killMe();
			}
		else
			console.log( "hidden" );
	});
	
}

function myFunction() {
  document.getElementById("myQueueDiv").style.visibility = "hidden";
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
	}else{
		userWin = null;
	}

	intervalQueue.shift();
	if(userCancel === false) { // If the user snoozes, we don't want to delete the next timer off the list.
		var theList = document.getElementById("timerList");
		theList.remove(0);
	}
	userCancel = false;

	
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
		if(timeUp) {
			clearInterval(x);
			let context = new AudioContext(); //create a simple alarm to notify the user time is up
			let o = context.createOscillator();
			o.type = "sine";
			o.frequency.value = 830; //pick a semi-annoying frequency
			o.connect(context.destination);
			console.log("run start");
			if(!alertPlaying){
				o.start(); //start the timer only once
				alertPlaying = true;
			}
			
			x = setTimeout(function(){
				o.stop();
			}, 2000);
			
			if (inView) {
				killMe();
			} else {
				notInView = true;
			}
		}
	}, 1000);
	
}

function endTimer(){
	document.getElementById("TimerOutput").innerHTML = "EXPIRED";
	document.title = "EXPIRED";
	if(userWin !== null)
		userWin.close();
}

function killMe(){
	notInView = false;
	if(confirm("Time has expired.\nHit \"OK\" to continue.\nHit \"Cancel\" to snooze for 5 minutes")){ //nested like this will be the "OK" route
		//o.stop(); //stop the "doooo" here
		alertPlaying = false;
		if(intervalQueue.length > 0){
			if(userWin !== null) {
				userWin.close();
			}
			startTimer();
		}else{
			endTimer();
		}

	} else{//user snoozed, give them 5 more minutes
		//o.stop(); //stop the "doooo" here
		alertPlaying = false;
		userCancel = true; 
		let nextInterval = {
			hour: 0,
			minute: 0, // was 5
			second: 7, // was 0
			redirect: false,
			url: ""
		};
		intervalQueue.unshift(nextInterval);
		startTimer();
	}
}
