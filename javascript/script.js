$(document).ready(function(){

	// Form Inputs and messages
	var $hrsInput = $('input[type="text"]:first-of-type');
	var $minsInput = $('input[type="text"]:last-of-type');
	var $validationMsg = $('fieldset div');
	
	// Timer Display Elements
	var $hrsDisplay = $('.hours-remaining');
	var $minsDisplay = $('.mins-remaining');
	var $secondsDisplay = $('.seconds-remaining');
	var $hrsColon = $('.hours-remaining + span');	// Colon after Hrs span

	// Timer buttons and messages
	var $endEarlyBtn = $('.end-early-btn');
	var $newSessionBtn = $('.new-session-btn');
	var $postMeditationMsg = $('<p class="post-meditation-msg"></p>');
	var $playBtn = $('.play-btn');
	var $pauseBtn = $('.pause-btn');
	var $timerContainer = $('.timer');
	var $timerForm = $('form');

	// For use in timer logic
	var remainingTimeInSeconds;
	var hours, minutes;
	var seconds;
	var startingTimeInSeconds;
	var prevHours, prevMinutes;		// Stores previous hours/minutes to check whether they've changed
	var intervalID;					// ID used to cancel setInterval


// =======================================================
// Events
// =======================================================

	// Open sidebar
	$('nav a').on('click', function(e){
		e.preventDefault();
		$('.wrapper').toggleClass('toggle-on');
	});

	// Close sidebar
	$('aside button').on('click', function(e){
		e.preventDefault();
		$('.wrapper').toggleClass('toggle-on');
	});


	// Form submission validation - Start timer if successful
	$('form button').on('click', function(e){
		e.preventDefault();
		hours = Number($hrsInput.val());	// Converts string into number (0 if '', NaN if non-numerical characters used)
		minutes = Number($minsInput.val());
		seconds = 0;						// Seconds always starts at 0

		// For debugging
		console.log($hrsInput.val());
		console.log(hours);
		console.log(minutes);

		$validationMsg.addClass('hide'); 	// Hide error message in case it was previously shown

		// Validation checks
		if ($hrsInput.val() === '' && $minsInput.val() === '') {
			showValidationMsg('*Field cannot be blank');
		} else if (hours === 0 && minutes === 0) {
			showValidationMsg('*Enter a positive number in at least one field below');
		} else if ( Number.isNaN(hours) || Number.isNaN(minutes) ) {	// If non-numeric characters were entered
			showValidationMsg('*Only numbers accepted');
		} else if (hours < 0 || hours > 24) {
			showValidationMsg('*Enter a number for hrs between 0 and 24');
		} else if (minutes < 0 || minutes > 59) {
			showValidationMsg('*Enter a number for mins between 0 and 59');
		// Temporarily hide last check for debugging
		// } else if ( !Number.isInteger(hours) || !Number.isInteger(minutes)) {
			// showValidationMsg('*Decimal values not allowed');
		} else {	// Validation passed
			$hrsColon.text(':');			// Add colon in case it was removed in previous timer use
			
			$timerForm.addClass('hide');
			
			// Show timer
			$endEarlyBtn.removeClass('hide');
			$pauseBtn.removeClass('hide');
			$timerContainer.removeClass('hide');
			
			updateTimerDisplay();			// Display initial time to user
			startingTimeInSeconds = remainingTimeInSeconds = (hours * 3600) + (minutes * 60);
			startTimer();
		}
	});

	// Remove pause button on click and replace with play button
	$pauseBtn.on('click',function() {
		clearInterval(intervalID);
		$(this).toggleClass('hide');
		$playBtn.toggleClass('hide');
	});

	// Remove play button on click and replace with pause button
	$playBtn.on('click',function() {
		startTimer();
		$(this).toggleClass('hide');
		$pauseBtn.toggleClass('hide');
	});

	// End timer when End Session Early button clicked
	$endEarlyBtn.on('click', function() {
		endTimer();
	});

	// Start New Session button clicked: reset form values, remove timer, show timer form
	$newSessionBtn.on('click', function() {
		$hrsInput.val('');
		$minsInput.val('');
		$timerForm.removeClass('hide');
		$newSessionBtn.addClass('hide');
		$timerContainer.addClass('hide');
	});

	$('.debug-end-timer').on('click', function(e){
		remainingTimeInSeconds = 5;
	});


// =======================================================
// Timer logic and display functions
// =======================================================

	// startTimer
	// - Calls updateTimerLogic every second
	// - Sets intervalID for use in clearing setInterval later
	function startTimer(){
		console.log('startTimer called');
		intervalID = setInterval(updateTimerLogic, 1000);
	}

	function updateTimerLogic(){
		console.log('updateTimer called');
		
		remainingTimeInSeconds--;

		prevHours = hours;
		prevMinutes = minutes;

		// Derive hours/minutes/seconds value for display from total seconds
		hours = getHours(remainingTimeInSeconds);
		minutes = getMinutes(hours, remainingTimeInSeconds);
		seconds = getSeconds(remainingTimeInSeconds);

		updateTimerDisplay();
		
		if (remainingTimeInSeconds === 0){
			endTimer();
		}
	}

	// Updates (if needed) and formats correct time on screen
	function updateTimerDisplay() { 
		// Update seconds display
		console.log('seconds changed: ' + seconds);
		if (seconds >= 10) {
			$secondsDisplay.text(seconds.toString());
		} else {
			$secondsDisplay.text('0' + seconds.toString());
		}

		// Update minutes display
		if (minutes !== prevMinutes) { // Only update if minutes has changed or hasn't been set yet
			console.log('minutes changed: ' + minutes);
			if (minutes < 10 && hours > 0){
				$minsDisplay.text('0' + minutes.toString());
			} else {
				$minsDisplay.text(minutes.toString());
			}
		}

		// Update hours display
		if (hours !== prevHours) { // Only update if hours has changed or hasn't been set yet
			console.log('hours changed: ' + hours);
			if (hours === 0){
				$hrsDisplay.text('');
				$hrsColon.text('');
			} else {
				$hrsDisplay.text(hours.toString());
			}
		}
	}

	// Clears setInterval and hides pause/play/end early buttons. Shows New Session button
	function endTimer() {
		console.log('timer stopped');
		clearInterval(intervalID);
		$endEarlyBtn.addClass('hide');
		if($pauseBtn.hasClass('hide')) { 	// If user paused the timer and then ended session, play button is showing
			$playBtn.addClass('hide');
		} else {
			$pauseBtn.addClass('hide');	
		}
		$newSessionBtn.removeClass('hide');
		printEndMessage();

		hours = null;
		minutes = null;
		seconds = null;
	}


	// Derive hours/minutes/seconds value for display from total seconds
	function getHours(timeInSeconds) {
		return Math.floor(timeInSeconds/3600);
	}

	function getMinutes(hrs, timeInSeconds) {
		return timeInSeconds >= 3600 ? Math.floor( (timeInSeconds - (hrs * 3600))/60) : Math.floor(timeInSeconds/60);
	}

	function getSeconds(timeInSeconds) {
		return timeInSeconds % 60;
	}


	// Prints a message telling user how long they meditated for
	function printEndMessage() {
		var totalSecondsMeditated = startingTimeInSeconds - remainingTimeInSeconds;
		console.log('totaltime: ' + totalSecondsMeditated);
		var hoursMeditated = getHours(totalSecondsMeditated);
		var minutesMeditated = getMinutes(hoursMeditated, totalSecondsMeditated);
		console.log('hoursmeditated: ' + hoursMeditated);
		console.log('minutesmeditated: ' + minutesMeditated);

		if (hoursMeditated && minutesMeditated) {
			$postMeditationMsg.text('You meditated for ' + hoursMeditated + ' ' + getSingularOrPlural('hour', hoursMeditated) + ' and ' + minutesMeditated + ' ' + getSingularOrPlural('minute', minutesMeditated) + '.');
		} else if (hoursMeditated && !minutesMeditated) { 
			$postMeditationMsg.text('You meditated for ' + hoursMeditated + ' ' + getSingularOrPlural('hour', hoursMeditated) + '.');
		} else if (!hoursMeditated && minutesMeditated) {
			$postMeditationMsg.text('You meditated for ' + minutesMeditated + ' ' + getSingularOrPlural('minute', minutesMeditated) + '.');
		}
		$('.screen').after($postMeditationMsg);
	}

	function getSingularOrPlural(text, number) {
		if (number === 1) {
			return text + '';
		} else {
			return text + 's';
		}
	}

	function showValidationMsg(msg) {
		$validationMsg.text(msg);
		$validationMsg.removeClass('hide'); 									
	}

});