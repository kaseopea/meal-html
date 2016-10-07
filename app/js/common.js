(function($){
	$(function(){

		//SVG Fallback
		if(!Modernizr.svg) {
			$("img[src*='svg']").attr("src", function() {
				return $(this).attr("src").replace(".svg", ".png");
			});
		};

		$('.button-collapse').sideNav();

		$('select').material_select();

	}); // end of document ready
})(jQuery); // end of jQuery name space