$(document).ready(function(){

	// Hr and Minute Inputs and Timer Displays
	var $hrsInput = $('input[type="text"]:first-of-type'); // Hrs Input Element (abbreviated as El)
	var $minsInput = $('input[type="text"]:last-of-type'); // Mins Input El
	var $hrsDisplay = $('.hours-remaining'); // Hrs Display El
	var $minsDisplay = $('.mins-remaining'); // Mins Display El
	var $secondsDisplay = $('.seconds-remaining'); // Seconds Display El
	var $hrsColon = $('.hours-remaining + span'); // Colon after hrs display value in timer

	// For use in timer logic
	var totalTimeInSeconds; // Total time to be stored in seconds
	var hours, minutes; // Hours (0-24) and minutes (0-59) value for timer
	var seconds = 0; // Seconds value for timer (0-59), always starts at 0
	var startingHours, startingMinutes; // Values originally set by timer
	var prevHours, prevMinutes; // Used for checking whether the minutes and hours has changed and needs to be updated on screen

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
		hours = Number($hrsInput.val());
		minutes = Number($minsInput.val());
		console.log($hrsInput.val());
		console.log(hours);
		console.log(minutes);
		$('form div').removeClass('show'); // Hide error message in case it was shown for a previous submission
		if (hours === 0 && minutes === 0) {
			$('form div').text('*Enter a number in at least one field');
			$('form div').addClass('show'); // Show error msg if both inputs empty
		} else if ( Number.isNaN(hours) || Number.isNaN(minutes) ) {
			$('form div').text('*Only numbers accepted');
			$('form div').addClass('show'); // Show error msg if non-numeric characters entered
		} else if (hours < 0 || hours > 24) {
			$('form div').text('*Enter a number for hrs between 0 and 24');
			$('form div').addClass('show'); // Show error msg if hours <0 or >24
		} else if (minutes < 0 || minutes > 59) {
			$('form div').text('*Enter a number for mins between 0 and 59');
			$('form div').addClass('show'); // Show error msg if mins <0 or >59
		} else {
			$('.timer-wrapper h2').addClass('hide');
			$('.timer-wrapper form').addClass('hide');
			$('.timer').removeClass('hide');
			startingHours = hours;
			startingMinutes = minutes;
			startTimer();
		}
	});

	function startTimer(){
		console.log('startTimer called');
		
		printTime(); // Display initial time

		totalTimeInSeconds = (hours * 3600) + (minutes * 60) + seconds;

		var intervalID = setInterval(function(){
			if (totalTimeInSeconds === 0){
				clearInterval(intervalID);
				console.log('timer stopped');
			} else {
				updateTimer();

			}
		},1000);
	}

	function updateTimer(){
		console.log('updateTimer called');

		prevHours = hours;
		prevMinutes = minutes;

		totalTimeInSeconds--;

		hours = Math.floor(totalTimeInSeconds/3600);
		minutes = totalTimeInSeconds > 3600 ? Math.floor( (totalTimeInSeconds - (hours * 3600))/60) : Math.floor(totalTimeInSeconds/60);
		seconds = totalTimeInSeconds % 60;

		printTime();
	}

	function printTime(){
		console.log('seconds changed');

		// Update seconds
		if (seconds >= 10) {
			$secondsDisplay.text(seconds.toString());
		} else {
			$secondsDisplay.text('0' + seconds.toString());
		}

		// Update minutes
		if (minutes !== prevMinutes) { // Only update if minutes has changed or is being set for first time
			console.log('minutes changed');
			if (minutes < 10 && hours > 0){
				$minsDisplay.text('0' + minutes.toString());
			} else {
				$minsDisplay.text(minutes.toString());
			}
		}
		
		// Update hours
		if (hours !== prevHours) { // Only update if hours has changed or is being set for first time
			console.log('hours changed');
			if (hours === 0){
				$hrsDisplay.text('');
				$hrsColon.text('');
			} else {
				$hrsDisplay.text(hours.toString());
			}
		}

	}
});