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
		// on initial load, go get the infomration
		if (page === "index") {
			getRestaurantInfo();
			return;
		}

		addVarToSession(CURRENT_PAGE_SESSION_KEY, page); // for redirect on resume of app -- after the above check

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

		if (page === "previous_order") {
			loadPreviousOrders();
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

		if (page === "order_confirmation") {
			loadOrderConfirmText();
			window.sessionStorage.setItem(CART_SESSION_KEY, null);
			removePromoCode();
		}

		loadCartText();

		if (page === "checkout") {
			loadCheckoutModal();
			loadCartSummary();
			if (getUserIdFromSession !== "GUEST") {
				fillInForm();
			}
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
	var cart = window.sessionStorage.getItem(CART_SESSION_KEY);
	var cartTotal = 0;
	if (cart !== "") {
		cart = JSON.parse(cart);
		if (cart === null) {
			return; // this could happen on the app load page (index.html)
		}
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
	var condimentList = getJsonFromSession(CONDIMENT_LIST_SESSION_KEY);
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
	var restaurant = getJsonFromSession(RESTAURANT_SESSION_KEY);
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

function removePromoCode() {
   addVarToSession(PROMO_DISCOUNT_SESSION_KEY, 0);
   window.sessionStorage.removeItem(PROMO_CODE_SESSION_KEY);
   window.sessionStorage.removeItem(PROMO_DISCOUNT_NAME_SESSION_KEY);
   calculateCartTotals();
}

function getItemList() {
	 return JSON.parse(window.sessionStorage.getItem(ITEM_LIST_SESSION_KEY));
}

function buildCondimentList(item) {
	var condimentDictionary = JSON.parse(window.sessionStorage.getItem(CONDIMENT_LIST_SESSION_KEY));
	var returnString = " - ";
	if (item.isCombo === true) {
		var groups = item.itemGroups;
		returnString = ":<br>";
		for (var i = 0; i < item.itemGroups.length; i++) {
			var group = item.itemGroups[i];
			var itemId = group.id;
			var currentItem = getItemById(itemId);
			returnString += currentItem.name;
			if (group.condiments.length > 0) {
				returnString += " - ";
				for (var counter = 0; counter < group.condiments.length; counter++) {
				  returnString = returnString + condimentDictionary[group.condiments[counter]].name + ", ";
			   }
				returnString = returnString.substring(0, returnString.length - 2); // trim the extra ,
			}
			returnString += "<br>";
		}
		return returnString.substring(0, returnString.length - 4); // trim the extra <br>
	} else{
		if  (item.condiments.length !== 0) {
			for (var counter = 0; counter < item.condiments.length; counter++) {
			  returnString = returnString + condimentDictionary[item.condiments[counter]].name + ", ";
		   }
		}
		return returnString.substring(0, returnString.length - 2); // trim the extra ,
  }

  return "";
}

function addCartToOrderHistory(orderName) {
	// check local storage to see if it exists, if not, create it
	var orderHistory = JSON.parse(window.localStorage.getItem(PREVIOUS_ORDER_HISTORY));
	if (orderHistory === null || orderHistory === undefined) {
		orderHistory = [];
	}

	var orderFound = false;
	var counter = 0;
	if (orderHistory.length > 0 ) {
		counter = orderHistory.length;
	}

	// replace it if it already exists
	for (var i = 0; i < orderHistory.length; i++) {
		order = orderHistory[i];
		if (order.name == orderName) {
			order.cart = getVarFromSession(CART_SESSION_KEY);
			order.date = new Date();
			orderFound = true;
		}
	}

	// add it if it doesn't exist
	if (!orderFound) {
		var order = { name: orderName, date: new Date(), cart: getVarFromSession(CART_SESSION_KEY) };
		orderHistory[counter] = order;
	}

	window.localStorage.setItem(PREVIOUS_ORDER_HISTORY, JSON.stringify(orderHistory));
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

function getRestaurantInfo() {
	$.ajax({
      url: MENU_URL,  // defined in constants.js
      cache: false,
      success: function(data) {
         //alert(data);
         var response = JSON.parse(data);
         var categoryList = response.menu.categories;
         var condiments = response.condiments;

         for (var x = 0; x < condiments.length; x++) {
            var c = condiments[x];
            condimentDictionary[c.id] = c;
         }

         for (var i = 0; i < categoryList.length; i++) {
            var itemList = categoryList[i].items;
            for (var itemCounter = 0; itemCounter < itemList.length; itemCounter++) {
               itemDictionary[itemList[itemCounter].id] = JSON.stringify(itemList[itemCounter]);
            }
         }

         addJsonToSession(ITEM_LIST_SESSION_KEY, itemDictionary);
			addJsonToSession(MENU_SESSION_KEY, response.menu);
			addJsonToSession(RESTAURANT_SESSION_KEY, response.restaurant);
         addJsonToSession(CONDIMENT_LIST_SESSION_KEY, condimentDictionary);

			var redirectPage = getVarFromSession(CURRENT_PAGE_SESSION_KEY);
			if (redirectPage !== null && redirectPage !== "") {
				window.location.href = redirectPage + ".html";
				return;
			}
			window.location.href = "home.html";
      },
      error: function(error) {
         //console.log("error updating table -" + error.status);
         //alert(JSON.stringify(error, null, 2))
      },
      complete: function() {
      }
   });
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

function strStartsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}
function strEndsWith(str, suffix) {
    return str.match(suffix+"$")==suffix;
}
