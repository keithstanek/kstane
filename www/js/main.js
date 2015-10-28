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
		// first check to make sure they are logged in, either as a person or guest
		var userLoggedIn = loggedIn();
		if (!userLoggedIn &&  page !== "login") {
			window.location.href="login.html";
		}

		if (userLoggedIn &&  page === "login") {
			$("#btnLogin").hide();
			$("#topDiv").hide();
			$("#btnLogin-Register").hide();
			$("#btnLogout").show();
		}

		if (!userLoggedIn &&  page === "login") {
			$("#btnLogout").hide();
		}



		if (page === "menu") {
			loadRestaurantMenu();
			var storeIsOpen = isStoreOpen();
			if (!storeIsOpen) {
				alert("The store is closed!!!!!!!!!")
			}
		}

		if (page === "view_cart") {
			loadCartView();
		}

		loadCartText();

		if (page === "checkout") {
			loadCheckoutModal();
			loadCartSummary();
		}

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

	function loggedIn() {
		var userInfo = JSON.parse(window.sessionStorage.getItem("user"));
		if (userInfo === null) {
			// they may be in the local storage, check there
			var user = JSON.parse(window.localStorage.getItem("user"));
			if (user !== null) {
				return true;
			}
			return false;
		}
		return true;
	}


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
	var cartTotal = 0;
	if (cart !== "") {
		cart = JSON.parse(cart);
		var quantity = 0;
		for (var i =0; i < cart.items.length; i++) {
			if (cart.items[i] !== null) {
				quantity = (+cart.items[i].quantity) + (+quantity);
				cartTotal += cart.items[i].quantity * cart.items[i].price;
			}
		}
		$("#cartTotal").text("$" + formatNumber(cartTotal) + " (" + quantity + " items)");
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

function isStoreOpen() {
	var restaurant = JSON.parse(window.sessionStorage.getItem("restaurant"));
	var openTime = restaurant.timeOpen;
	var closeTime = restaurant.timeClose;

	var currentDate = new Date();

	var startDate = new Date();
	startDate.setHours(openTime.substring(0, openTime.indexOf(":")));
	startDate.setMinutes(openTime.substring(openTime.indexOf(":") + 1));
	startDate.setSeconds("00");

	var endDate = new Date();
	endDate.setHours(closeTime.substring(0, closeTime.indexOf(":")));
	endDate.setMinutes(closeTime.substring(closeTime.indexOf(":") + 1));
	endDate.setSeconds("00");

	if (Date.parse(currentDate) > Date.parse(endDate) || Date.parse(currentDate) < Date.parse(startDate)) {
		return false;
	}
	return true;
}

function getItemList() {
	 return JSON.parse(window.sessionStorage.getItem("itemList"));
}

function buildCondimentList(condiments) {
	if (condiments.length !== 0) {
		var condimentDictionary = JSON.parse(window.sessionStorage.getItem("condimentList"));
		var returnString = " - ";
		for (var counter = 0; counter < condiments.length; counter++) {
		  returnString = returnString + condimentDictionary[condiments[counter]].name + ", ";
		}
		return returnString.substring(0, returnString.length - 2);
  } else {
	  return "";
  }
}

function decrementCart(itemId) {
   var quantity = $("#itemid_" + itemId + "_quantity").text();
   if (quantity === "0") {
     return false;
   }
   var span = $("#itemid_" + itemId + "_quantity");
   var newQuantity = span.text() - 1;
   span.text(newQuantity);
}

function incrementCart(itemId) {
   var span = $("#itemid_" + itemId + "_quantity");
   var newQuantity = 1 + +span.text();
   span.text(newQuantity);
}

function getUserIdFromSession() {
	var userInfo = JSON.parse(window.sessionStorage.getItem(USER_SESSION_KEY));
	return userInfo.id;
}

function getRestaurantIdFromSession() {
	var restaurantInfo = JSON.parse(window.sessionStorage.getItem(RESTAURANT_SESSION_KEY));
	return restaurantInfo.id;
}

function getFranchiseIdFromSession() {
	var restaurantInfo = JSON.parse(window.sessionStorage.getItem(RESTAURANT_SESSION_KEY));
	return restaurantInfo.franchiseId;
}


function addVarToSession(id, item) {
	window.sessionStorage.setItem(id, item);
}

function getVarFromSession(id) {
	return window.sessionStorage.getItem(id);
}

function addJsonToSession(id, item) {
	window.sessionStorage.setItem(id, JSON.stringify(item));
}

function getJsonFromSession(id) {
	return JSON.parse(window.sessionStorage.getItem(id));
}
