$(document).ready(function(){

	// Hr and Minute Inputs
	var $hrsEl = $('input[type="number"]:first-of-type');
	var $minsEl = $('input[type="number"]:last-of-type');

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
		hours = Number($hrsEl.val());
		minutes = Number($minsEl.val());
		$('form div').removeClass('show'); // Hide error message in case it was shown for a previous submission
		if(hours === 0 && minutes === 0) {
			$('form div').text('*Enter a number in at least one field below');
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
			console.log('success');
		}
	});
});