// global variables
var condimentDictionary = [];
var itemDictionary = [];



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

	// portfolio filter
	$(document).ready(function(){

		// on initial load, go get the infomration
		if (page === "index") {
			$("#restaurant-name").html(indexHtmlRestaurantName);
			getRestaurantInfo();
			return;
		}

		if (page === "intro") {
			var swiper = new Swiper('.swiper-container', {
	          pagination: '.swiper-pagination',
	          paginationClickable: true,
	          nextButton: '.swiper-button-next',
	          prevButton: '.swiper-button-prev',
	          spaceBetween: 30
	      });
			return;
		}

		if (firstTimeUser()) {
			window.location.href="intro.html";
			return;
		}

		addVarToSession(CURRENT_PAGE_SESSION_KEY, page); // for redirect on resume of app -- after the above check

		// first check to make sure they are logged in, either as a person or guest
		var userLoggedIn = loggedIn();
		if (!userLoggedIn &&  page !== "login") {
			window.location.href="login.html";
		}

		if (userLoggedIn &&  page === "login" && getJsonFromSession(USER_SESSION_KEY).username != "GUEST") {
			$("#btnLogin").hide();
			$("#btn-reset-password").hide();
			$("#topDiv").hide();
			$("#btnLogin-Register").hide();
			$("#btnLogout").show();
			$("#btnAsGuest").hide();
		}

		if (!userLoggedIn &&  page === "login") {
			$("#btnLogout").hide();
			// $("#btnAsGuest").show();
		}

		if (page === "previous_order") {
			loadPreviousOrders();
		}

		if (page === "home") {
			showRestaurantList();
		}

		if (page === "user_info") {
			loadInfo();
		}

		if (page === "settings") {
			loadAdminSettings();
		}

		if (page === "menu") {
			loadRestaurantMenu();
			if (isStoreClosed()) {
				displayStaticModal("closed-modal");
			}
		}

		if (page === "view_cart") {
			loadCartView();
		}

		if (page === "order_confirmation") {
			loadOrderConfirmText();
			window.sessionStorage.removeItem(CART_SESSION_KEY);
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
	});
});

function firstTimeUser() {
	var ftu = JSON.parse(window.localStorage.getItem(FIRST_TIME_USER));
	if (ftu !== null) {
		return false;
	}
	return true;
}

function loggedIn() {
	var userInfo = getJsonFromSession(USER_SESSION_KEY);
	if (userInfo === null) {
		// they may be in the local storage, check there
		var user = JSON.parse(window.localStorage.getItem(USER_SESSION_KEY));
		if (user !== null) {
			addJsonToSession(USER_SESSION_KEY, user); // add to session so we don't get here anymore
			return true;
		}
		return false;
	}
	return true;
}

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
	var condimentList = getCondimentDictionary();
	var condiment = condimentList[id];
	if (condiment == null) {
		return null;
	}
	return condiment;
}

function convertTo24HRTimeFormat(time) {
	// var time = $("#starttime").val();
	var hours = Number(time.match(/^(\d+)/)[1]);
	var minutes = Number(time.match(/:(\d+)/)[1]);
	var AMPM = time.match(/\s(.*)$/)[1];
	if(AMPM == "PM" && hours<12) hours = hours+12;
	if(AMPM == "AM" && hours==12) hours = hours-12;
	var sHours = hours.toString();
	var sMinutes = minutes.toString();
	if(hours<10) sHours = "0" + sHours;
	if(minutes<10) sMinutes = "0" + sMinutes;
	return sHours + ":" + sMinutes;
}

function closedAllDay(openTime, closeTime) {
	if (openTime == "0" || closeTime == "0") {
		return true;
	}
	return false;
}

function isStoreClosed() {
	var restaurant = getJsonFromSession(RESTAURANT_SESSION_KEY);
	var hours = restaurant.hours;
	var openTime = "", closeTime = "";

	var day = new Date().getDay(); // Sunday is 0, Monday 1 .... Saturday 6
	var openTime = "", closeTime = "";
	if (day == 0) {
		if (closedAllDay(hours.sundayOpenTime, hours.sundayCloseTime)) {return false;}
		openTime = hours.sundayOpenTime;
		closeTime = convertTo24HRTimeFormat(hours.sundayCloseTime + " PM");
	} else if (day == 1) {
		if (closedAllDay(hours.mondayOpenTime, hours.mondayCloseTime)) {return false;}
		openTime = hours.mondayOpenTime;
		closeTime = convertTo24HRTimeFormat(hours.mondayCloseTime + " PM");
	} else if (day == 2) {
		if (closedAllDay(hours.tuesdayOpenTime, hours.tuesdayCloseTime)) {return false;}
		openTime = hours.tuesdayOpenTime;
		closeTime = convertTo24HRTimeFormat(hours.tuesdayCloseTime + " PM");
	} else if (day == 3) {
		if (closedAllDay(hours.wednesdayOpenTime, hours.wednesdayCloseTime)) {return false;}
		openTime = hours.wednesdayOpenTime;
		closeTime = convertTo24HRTimeFormat(hours.wednesdayCloseTime + " PM");
	} else if (day == 4) {
		if (closedAllDay(hours.thursdayOpenTime, hours.thursdayCloseTime)) {return false;}
		openTime = hours.thursdayOpenTime;
		closeTime = convertTo24HRTimeFormat(hours.thursdayCloseTime + " PM");
	} else if (day == 5) {
		if (closedAllDay(hours.fridayOpenTime, hours.fridayCloseTime)) {return false;}
		openTime = hours.fridayOpenTime;
		closeTime = convertTo24HRTimeFormat(hours.fridayCloseTime + " PM");
	} else if (day == 6) {
		if (closedAllDay(hours.saturdayOpenTime, hours.saturdayCloseTime)) {return false;}
		openTime = hours.saturdayOpenTime;
		closeTime = convertTo24HRTimeFormat(hours.saturdayCloseTime + " PM");
	}

	// check to see if the store is closed for some emergency or something else
	var closings = restaurant.closings;
	var currentDate = new Date();
	for (var i = 0; i < closings.length; i++) {
		var closingDate = closings[i].closingDate;
		if (closingDate == null || closingDate == "") {
			continue;
		}
		closingDate = new Date(closingDate.substring(0,4), (closingDate.substring(4,6)-1), closingDate.substring(6,8));

		if ( (closingDate.getYear() == currentDate.getYear()) &&
		     (closingDate.getMonth() == currentDate.getMonth()) &&
	        (closingDate.getDay() == currentDate.getDay()) )
		{
			if (closings[i].isClosedAllDay == "true") {
				return true;
			} else {
				openTime = closings[i].openTime;
				closeTime = closings[i].closeTime;
			}
		}
	}

	var startDate = new Date();
	startDate.setHours(openTime.substring(0, openTime.indexOf(":")));
	startDate.setMinutes(openTime.substring(openTime.indexOf(":") + 1));
	startDate.setSeconds("00");

	var endDate = new Date();
	endDate.setHours(closeTime.substring(0, closeTime.indexOf(":")));
	endDate.setMinutes(closeTime.substring(closeTime.indexOf(":") + 1));
	endDate.setSeconds("00");

	if (Date.parse(currentDate) > Date.parse(endDate) || Date.parse(currentDate) < Date.parse(startDate)) {
		return true;
	}
	return false;
}

function removePromoCode() {
   addVarToSession(PROMO_DISCOUNT_SESSION_KEY, 0);
   window.sessionStorage.removeItem(PROMO_CODE_SESSION_KEY);
   window.sessionStorage.removeItem(PROMO_DISCOUNT_NAME_SESSION_KEY);
	window.sessionStorage.removeItem(PROMO_DISCOUNT_TYPE_SESSION_KEY);
	if (page === "view_cart") {
		$("#remove-promo-code-div").hide();
		$("#add-promo-code-div").show();
	}
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
			if (group == null || group == undefined) {
				continue;
			}
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

			addJsonToSession(RESTAURANT_LIST_SESSION_KEY, response.restaurants);
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

function calculatePrices() {
	var restaurant = getJsonFromSession(RESTAURANT_SESSION_KEY);

	if (restaurant.priceIncrease == undefined || restaurant.priceIncrease == null || restaurant.priceIncrease == "") {
		return;
	}

	var percent = 1 + (.01 * Number(restaurant.priceIncrease));

	var condiments = getJsonFromSession(CONDIMENT_LIST_SESSION_KEY);
	for (var x = 0; x < condiments.length; x++) {
		var c = condiments[x];
		if (c == null) {
			continue;
		}
		if (c.price > 0) {
			c.price = c.price * percent;
		}
		condimentDictionary[c.id] = c;
	}
	addJsonToSession(CONDIMENT_LIST_SESSION_KEY, condimentDictionary);

	var itemList = getJsonFromSession(ITEM_LIST_SESSION_KEY);
	var dictionary = [];
	for (var i = 0; i < itemList.length; i++) {
		var item = JSON.parse(itemList[i]);

		if (item == null) {
			continue;
		}
		item.price = Number(item.price) * percent;
		dictionary[item.id] = JSON.stringify(item);
	}
	addJsonToSession(ITEM_LIST_SESSION_KEY, dictionary);
}

function pickRestaurant(id) {
	 $("#restaurant-list-modal").modal('hide');
	 var restaurantList = getJsonFromSession(RESTAURANT_LIST_SESSION_KEY);
	 for (var i = 0; i < restaurantList.length; i++) {
		 var restaurant = restaurantList[i];
		 if (restaurant.id == id) {
			 addJsonToSession(RESTAURANT_SESSION_KEY, restaurant);
			 break;
		 }
	 }
	 loadInfo();
}

function displayRestaurantModal() {
	var restaurantList = getJsonFromSession(RESTAURANT_LIST_SESSION_KEY);
	$("#restaurant-modal-body").html("");
	for (var i = 0; i < restaurantList.length; i++) {
		var restaurant = restaurantList[i];
		var html = "<div onclick=\"pickRestaurant(" + restaurant.id + ");\"><p class=\"view-cart-item-header\">" +
			restaurant.city + ", " + restaurant.state + "</p>" +
			"<p>" + restaurant.address + " " + restaurant.zip + " " + restaurant.phone + "<hr></p></div>";
		$("#restaurant-modal-body").append(html);
	}
	displayStaticModal("restaurant-list-modal");
}

function displayStaticModal(name) {
	$("#" + name).modal({visibility: 'show', backdrop: 'static', keyboard: false});
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

function getCondimentDictionary() {
	var list = JSON.parse(window.sessionStorage.getItem(CONDIMENT_LIST_SESSION_KEY));
	var dictionary = [];
	for (var i = 0; i < list.length; i++) {
		condiment = list[i];
		if (condiment == null) {
			continue;
		}
		dictionary[condiment.id] = condiment;
	}
	return dictionary;
}
