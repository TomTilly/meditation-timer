$(document).ready(function(){


	// Form Inputs and messages
	var $hrsInput = $('input[type="text"]:first-of-type'); 				// Hrs Input
	var $minsInput = $('input[type="text"]:last-of-type'); 				// Mins Input
	var $validationEl = $('form div');									// Validation error message
	
	// Timer Display Elements
	var $hrsDisplay = $('.hours-remaining'); 							// Hrs span
	var $minsDisplay = $('.mins-remaining'); 							// Mins span
	var $secondsDisplay = $('.seconds-remaining'); 						// Seconds span
	var $hrsColon = $('.hours-remaining + span'); 						// Colon after Hrs span

	// Timer buttons and messages
	var $endEarlyBtn = $('.end-early-btn');
	var $newSessionBtn = $('.new-session-btn');
	var $postMeditationMsg = $('<p class="post-meditation-msg"></p>');
	var $playButton = $('.play-btn');
	var $pauseButton = $('.pause-btn');

	// For use in timer logic
	var totalTimeInSeconds; 											// Total time to be stored in seconds
	var hours, minutes; 												// Hours (0-24) and minutes (0-59) value for timer
	var seconds = 0; 													// Seconds value for timer (0-59), always starts at 0
	var startingTimeInSeconds;											// Values originally set by timer in seconds
	var prevHours, prevMinutes; 										// Used for checking whether the minutes and hours has changed and needs to be updated on screen
	var intervalID;


	// Open sidebar
	$('nav a').on('click', function(e){
		e.preventDefault();
		$('.content-wrapper').toggleClass('toggle-on');
	});

	// Close sidebar
	$('aside button').on('click', function(e){
		e.preventDefault();
		$('.content-wrapper').toggleClass('toggle-on');
	});


	// Form submission validation - Start timer if successful
	$('form button').on('click', function(e){
		e.preventDefault();
		hours = Number($hrsInput.val());									// Get hours as a number
		minutes = Number($minsInput.val());									// Get minutes as a number
		console.log($hrsInput.val());
		console.log(hours);
		console.log(minutes);
		$validationEl.removeClass('show'); 									// Hide error message in case it was shown for a previous submission
		if ($hrsInput.val() === '' && $minsInput.val() === '') {			// Show error msg if both inputs empty strings
			$validationEl.text('*Fields cannot be blank');
			$validationEl.addClass('show'); 									
		} else if (hours === 0 && minutes === 0) {							// Show error msg if both inputs are 0
			$validationEl.text('*Enter a positive number in at least one field below');
			$validationEl.addClass('show');
		} else if ( Number.isNaN(hours) || Number.isNaN(minutes) ) {		// Show error msg if non-numeric characters entered
			$validationEl.text('*Only numbers accepted');
			$validationEl.addClass('show');
		} else if (hours < 0 || hours > 24) {								// Show error msg if hours <0 or >24
			$validationEl.text('*Enter a number for hrs between 0 and 24');
			$validationEl.addClass('show');
		} else if (minutes < 0 || minutes > 59) {							// Show error msg if mins <0 or >59
			$validationEl.text('*Enter a number for mins between 0 and 59');
			$validationEl.addClass('show');
		// } else if ( !Number.isInteger(hours) || !Number.isInteger(minutes)) {
		// 	$validationEl.text('*Decimal values not allowed');
		// 	$validationEl.addClass('show'); // Show error msg if user entered decimal values
		} else {															// Validation passed
			// Hide form elements and call start timer
			$('.timer-wrapper h2').addClass('hide');
			$('.timer-wrapper form').addClass('hide');
			$('.timer').removeClass('hide');
			updateTimerDisplay();
			startingTimeInSeconds, totalTimeInSeconds = (hours * 3600) + (minutes * 60) + seconds;
			startTimer();
		}
	});


	// Starts timer with setInterval
	function startTimer(){
		console.log('startTimer called');
		intervalID = setInterval(function(){
			updateTimerLogic();
		},1000);
	}


	function updateTimerLogic(){
		console.log('updateTimer called');
		
		totalTimeInSeconds--;

		prevHours = hours;
		prevMinutes = minutes;

		// Update times
		hours = Math.floor(totalTimeInSeconds/3600);
		minutes = totalTimeInSeconds > 3600 ? Math.floor( (totalTimeInSeconds - (hours * 3600))/60) : Math.floor(totalTimeInSeconds/60);
		seconds = totalTimeInSeconds % 60;

		updateTimerDisplay();
		
		if (totalTimeInSeconds < 1){ // Change to === 0 when getting rid of debug-end-timer
			endTimer();
		}
	}

	function updateTimerDisplay() { 
		// Update seconds display
		console.log('seconds changed: ' + seconds);
		if (seconds >= 10) {
			$secondsDisplay.text(seconds.toString());
		} else {
			$secondsDisplay.text('0' + seconds.toString());
		}

		// Update minutes display
		if (minutes !== prevMinutes) { // Only update if minutes has changed or is being set for first time
			console.log('minutes changed: ' + minutes);
			if (minutes < 10 && hours > 0){
				$minsDisplay.text('0' + minutes.toString());
			} else {
				$minsDisplay.text(minutes.toString());
			}
		}

		// Update hours display
		if (hours !== prevHours) { // Only update if hours has changed or is being set for first time
			console.log('hours changed: ' + hours);
			if (hours === 0){
				$hrsDisplay.text('');
				$hrsColon.text('');
			} else {
				$hrsDisplay.text(hours.toString());
			}
		}
	}

	function endTimer() {
		clearInterval(intervalID);
		console.log('timer stopped');
		$endEarlyBtn.addClass('hide');
		$pauseButton.addClass('hide');
		printEndMessage();
		$newSessionBtn.removeClass('hide');
		$('.screen').after($postMeditationMsg);
	}

	function printEndMessage() {
		var hoursMeditated = startingHours - hours;
		console.log(hoursMeditated);
		var minutesMeditated = startingMinutes - minutes;
		console.log(minutesMeditated);
		if (hoursMeditated && minutesMeditated) {
			$postMeditationMsg.text('You meditated for ' + hoursMeditated + ' ' + getSingularOrPlural('hour',hoursMeditated) + ' and ' + minutesMeditated + ' ' + getSingularOrPlural('minute', minutesMeditated) + '.');
		} else if (hoursMeditated && !minutesMeditated) { 
			$postMeditationMsg.text('You meditated for ' + hoursMeditated + ' ' + getSingularOrPlural('hour', hoursMeditated) + '.');
		} else if (!hoursMeditated && minutesMeditated) {
			$postMeditationMsg.text('You meditated for ' + minutesMeditated + ' ' + getSingularOrPlural('minute', hoursMeditated) + '.');
		}
	}

	function getSingularOrPlural(text, number) {
		if (number === 1) {
			return text + '';
		} else {
			return text + 's';
		}
	}

	$pauseButton.on('click',function(e) {
		clearInterval(intervalID);
		$(this).toggleClass('hide');
		$playButton.toggleClass('hide');
	});

	$playButton.on('click',function(e) {
		startTimer();
		$(this).toggleClass('hide');
		$pauseButton.toggleClass('hide');
	});

	$endEarlyBtn.on('click', function(e) {
		endTimer(true);
	});

	$('.debug-end-timer').on('click', function(e){
		totalTimeInSeconds = 0;
	});
});