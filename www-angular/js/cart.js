function loadCartView() {
	// retrieve the items from the context

   var cart = JSON.parse(window.sessionStorage.getItem("cart"));
	var itemList = getItemList();
   for (var i =0; i < cart.items.length; i++) {
		if (cart.items[i] === null) {
			//alert("cart item null for item [" + i + "]")
			continue;
		}
		var item =  JSON.parse(itemList[cart.items[i].id]);
		var quantity = cart.items[i].quantity;
		var div = "<div class=\"cartTableRow\">" +
			"<div class=\"cell\">" + item.name + buildCondimentList(cart.items[i].condiments) + "</div>" +
			"<div class=\"cell-middle\">" +
			"	<input type=\"text\" onchange=\"updateCart('" + cart.items[i].cartIdentifierId + "')\" id=\"item_" + cart.items[i].cartIdentifierId + "_quantity\" size=\"4\" name=\"item_" + item.id + "_quantity\" value=\"" + quantity + "\">&nbsp;&nbsp;" +
			"	<input type=\"button\" onclick=\"removeItemFromCart('" + cart.items[i].cartIdentifierId + "'); return false;\" name=\"btnRemoveCart\" class=\"btn btn-xs btn-danger\" value=\"X\">" +
			"</div>" +
			"<div class=\"cell-right\">$" + formatNumber(item.price) + "</div>" +
		"</div>";
  		$("#cartTable-items").append(div).trigger("create");
	}
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

function updateCart(cartIdentifierId) {
	 if ( isNaN($("#item_" + cartIdentifierId + "_quantity").val()) ) {
	// 	$("#item_" + cartIdentifierId + "_quantity").val("");
	 	return;
	 }
	if ($("#item_" + cartIdentifierId + "_quantity").val() < 1) {
		removeItemFromCart(cartIdentifierId);
		return;
	}
	var cart = JSON.parse(window.sessionStorage.getItem("cart"));
	var itemList = getItemList();
   for (var i =0; i < cart.items.length; i++) {
		if (cart.items[i] === null) {
			continue;
		}
		if (cart.items[i].cartIdentifierId == cartIdentifierId) {
			cart.items[i].quantity = $("#item_" + cartIdentifierId + "_quantity").val();
			// TODO - update cart total based on quantity
			window.sessionStorage.setItem("cart", JSON.stringify(cart));
			window.location.href = "view_cart.html";
		}
	}
}

function removeItemFromCart(cartIdentifierId) {
	if (!confirm("You are about to remove this item from your cart.")) {
		return;
	}
	var cart = JSON.parse(window.sessionStorage.getItem("cart"));
	var itemList = getItemList();
   for (var i =0; i < cart.items.length; i++) {
		if (cart.items[i] === null) {
			continue;
		}
		if (cart.items[i].cartIdentifierId == cartIdentifierId) {
			cart.total = (cart.total - cart.items[i].price);
			delete cart.items[i];
			window.sessionStorage.setItem("cart", JSON.stringify(cart));
			window.location.href = "view_cart.html";
		}
	}
}

function addPromoCode() {
	var promoCode = $("#txtPromo").val();
	alert("Checking Status for Promo Code [" + promoCode + "]");
}
