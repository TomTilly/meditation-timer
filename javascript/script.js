$(document).ready(function(){
	$('nav a').on('click', function(e){
		e.preventDefault();
		$('.content-wrapper').toggleClass('toggle-on');
	});
	$('aside button').on('click', function(e){
		e.preventDefault();
		$('.content-wrapper').toggleClass('toggle-on');
	})
});