// global variables
var condimentDictionary = [];
var itemDictionary = [];

var categoryPanelBgColor = "fff"; //"fcf8e3";
var categoryHeaderBgColor = "337ab7";
var categoryHeaderFontColor = "ffffff";
var itemPanelBgColor = "F3F3F3";
var itemHeaderBgColor = "E0A249"; //"00aeef";
var itemHeaderFontColor = "fff";

var addToCartBtnBgColor = "fcf8e3";
var addToCartBtnFontColor = "ffffff";

jQuery(function($) {'use strict';

	//Responsive Nav
	$('li.dropdown').find('.fa-angle-down').each(function(){
		$(this).on('click', function(){
			if( $(window).width() < 768 ) {
				$(this).parent().next().slideToggle();
			}
			return false;
		});
	});

	//Initiat WOW JS
	//new WOW().init();

	// portfolio filter
	$(document).ready(function(){

		if (loadMenu) {
			loadRestaurantMenu();
		}

		if (loadCart) {
			loadCartView();
		}

		loadCartText();

		// $('.main-slider').addClass('animate-in');
		// $('.preloader').remove();
		//End Preloader

		// if( $('.masonery_area').length ) {
		// 	$('.masonery_area').masonry();//Masonry
		// }

		// var $portfolio_selectors = $('.portfolio-filter >li>a');
		//
		// if($portfolio_selectors.length) {
		//
		// 	var $portfolio = $('.portfolio-items');
		// 	$portfolio.isotope({
		// 		itemSelector : '.portfolio-item',
		// 		layoutMode : 'fitRows'
		// 	});
		//
		// 	$portfolio_selectors.on('click', function(){
		// 		$portfolio_selectors.removeClass('active');
		// 		$(this).addClass('active');
		// 		var selector = $(this).attr('data-filter');
		// 		$portfolio.isotope({ filter: selector });
		// 		return false;
		// 	});
		// }
	});


	$('.timer').each(count);
	function count(options) {
		var $this = $(this);
		options = $.extend({}, options || {}, $this.data('countToOptions') || {});
		$this.countTo(options);
	}

	// Search
	$('.fa-search').on('click', function() {
		$('.field-toggle').fadeToggle(200);
	});

	// Contact form
	var form = $('#main-contact-form');
	form.submit(function(event){
		event.preventDefault();
		var form_status = $('<div class="form_status"></div>');
		$.ajax({
			url: $(this).attr('action'),
			beforeSend: function(){
				form.prepend( form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Email is sending...</p>').fadeIn() );
			}
		}).done(function(data){
			form_status.html('<p class="text-success">Thank you for contact us. As early as possible  we will contact you</p>').delay(3000).fadeOut();
		});
	});

	// Progress Bar
	$.each($('div.progress-bar'),function(){
		$(this).css('width', $(this).attr('data-transition')+'%');
	});

	if( $('#gmap').length ) {
		var map;

		map = new GMaps({
			el: '#gmap',
			lat: 43.04446,
			lng: -76.130791,
			scrollwheel:false,
			zoom: 16,
			zoomControl : false,
			panControl : false,
			streetViewControl : false,
			mapTypeControl: false,
			overviewMapControl: false,
			clickable: false
		});

		map.addMarker({
			lat: 43.04446,
			lng: -76.130791,
			animation: google.maps.Animation.DROP,
			verticalAlign: 'bottom',
			horizontalAlign: 'center',
			backgroundColor: '#3e8bff',
		});
	}

});

function loadCartText() {
	var cart = window.sessionStorage.getItem("cart");
	if (cart !== "") {
		cart = JSON.parse(cart);
		var quantity = 0;
		for (var i =0; i < cart.items.length; i++) {
			if (cart.items[i] !== null) {
				quantity = (+cart.items[i].quantity) + (+quantity);
			}
		}

		$("#cartTotal").text("Cart: $" + formatNumber(cart.total) + " (" + quantity + " Items)");
	}
}

function formatNumber(number) {
	return number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

function getNextCartItemCount() {
	var cartCounter = 0;
	if (window.sessionStorage.getItem("cartCounter") !== null) {
		cartCounter = window.sessionStorage.getItem("cartCounter");
	}
	var returnVal = cartCounter++;
	window.sessionStorage.setItem("cartCounter", cartCounter);
	return returnVal;
}

function getItemById(itemId) {
	var itemList = JSON.parse(window.sessionStorage.getItem("itemList"));
	for (var i =0; i < itemList.length; i++) {
		if (itemList[i] === null) {
			continue;
		}
		var item = JSON.parse(itemList[i]);
		if (JSON.parse(itemList[i]).id == itemId) {
			return item;
		}
	}
}

function getCondimentById(id) {
	var condimentList = JSON.parse(window.sessionStorage.getItem("condimentList"));
	for (var i =0; i < condimentList.length; i++) {
		if (condimentList[i] === null) {
			continue;
		}
		if (condimentList[i].id === id) {
			return condimentList[i];
		}
	}
}

function getItemList() {
	 return JSON.parse(window.sessionStorage.getItem("itemList"));
}
