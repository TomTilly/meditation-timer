$(document).ready(function(){

	// Hr and Minute Inputs and Timer Displays
	var $hrsInput = $('input[type="text"]:first-of-type');
	var $minsInput = $('input[type="text"]:last-of-type');
	var $hrsDisplay = $('.hours-remaining');
	var $minsDisplay = $('.mins-remaining');
	var $secondsDisplay = $('.seconds-remaining');
	var $hrsColon = $('.hours-remaining + span');
	var hours, minutes; // Values submitted by form
	var seconds = 0;

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

	// Form submission logic (validation and starting timer)
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
			startTimer();
		}
	});

	function startTimer(){
		console.log('startTimer called');
		if (hours === 0) {
			$hrsDisplay.text('');
			$hrsColon.text('');
		} else {
			$hrsDisplay.text(hours.toString());
		}
		if (minutes === 0) {
			$minsDisplay.text('00');
		} else {
			$minsDisplay.text(minutes.toString());
		}
		$secondsDisplay.text('00');
		
		var intervalID = setInterval(function(){
			// hours = Number($hrsDisplay.text());
			// minutes = Number(minsDisplay.text());
			// seconds = Number(secondsDisplay.text());
			if (hours === 0 && minutes === 0 && seconds === 0){
				clearInterval(intervalID);
				console.log('timer stopped');
			} else {
				decrementTimer();
			}
		},1000);
	}

	function decrementTimer(){
		console.log('decrementTimer called');
		if (seconds === 0 ){
			if(minutes === 0){
				if (hours > 1){
					hours--;
					$hrsDisplay.text(hours.toString());
					minutes = 59;
					$minsDisplay.text(minutes.toString());
					seconds = 59;
					$secondsDisplay.text(seconds.toString());
				} else if (hours === 1){
					hours--;
					$hrsDisplay.text('');
					$hrsColon.text('');
					minutes = 59;
					$minsDisplay.text(minutes.toString());
					seconds = 59;
					$secondsDisplay.text(seconds.toString());
				} else  {
					minutes = 0;
					$minsDisplay.text(minutes.toString());
				}
			} else {
				minutes--;
				$minsDisplay.text(minutes.toString());
				seconds = 59;
				$secondsDisplay.text(seconds.toString());
			}
		} else {
			seconds--;
			if (seconds < 10){
				$secondsDisplay.text('0' + seconds.toString());
			} else {
				$secondsDisplay.text(seconds.toString());	
			}
		}
	}
});