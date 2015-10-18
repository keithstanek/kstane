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
      var total = quantity * cart.items[i].price;
		var div = "<div class=\"cartTableRow item\" id=\"cartTableRow_" + cart.items[i].cartIdentifierId + "\">" +
			"<div class=\"cell\">" + item.name + buildCondimentList(cart.items[i].condiments) + "</div>" +
			"<div class=\"cell-middle\">" +
			"	<input type=\"text\" onchange=\"updateCart('" + cart.items[i].cartIdentifierId +
         "')\" id=\"item_" + cart.items[i].cartIdentifierId + "_quantity\" size=\"4\" name=\"item_" + item.id +
         "_quantity\" value=\"" + quantity + "\">&nbsp;&nbsp;" +
			"	<input type=\"button\" onclick=\"showDeleteModal('" + cart.items[i].cartIdentifierId +
         "'); return false;\" name=\"btnRemoveCart\" class=\"btn btn-xs btn-danger\" value=\"X\">" +
			"</div>" +
			"<div class=\"cell-right\">$<span id=\"itemPrice_" + cart.items[i].cartIdentifierId + "\">" + formatNumber(total) + "</span></div>" +
		"</div><br>";
  		$("#cartTable-items").append(div).trigger("create");
	}
   calculateCartTotals();
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
      $("#errorMessage").text("Invalid Cart Amount [" + $("#item_" + cartIdentifierId + "_quantity").val() + "]. Please adjust the amount to continue");
      $("#errorModal").modal('show');
	// 	$("#item_" + cartIdentifierId + "_quantity").val("");
	 	return;
	 }
    if ( $("#item_" + cartIdentifierId + "_quantity").val() < 1 ) {
      $("#errorMessage").text("Invalid Cart Amount [" + $("#item_" + cartIdentifierId + "_quantity").val() +
            "]. The amount must be 1 or more.");
      $("#errorModal").modal('show');
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
         var quantity = $("#item_" + cartIdentifierId + "_quantity").val();
         var total = cart.total - (cart.items[i].quantity * cart.items[i].price);
			cart.items[i].quantity = quantity;
         var itemTotal = quantity * cart.items[i].price;
         cart.total = total + itemTotal;
			// TODO - update cart total based on quantity
			window.sessionStorage.setItem("cart", JSON.stringify(cart));
         $("#itemPrice_" + cartIdentifierId).html(formatNumber(itemTotal));
         loadCartText();
         calculateCartTotals();
		}
	}
}

function calculateCartTotals() {
   var tax = 0.08;
   var subTotal = 0;
   var cart = JSON.parse(window.sessionStorage.getItem("cart"));
   var promoDiscount = JSON.parse(window.sessionStorage.getItem("promoDiscount"));
   if (promoDiscount == null) {
      promoDiscount = 0;
   }

   for (var i =0; i < cart.items.length; i++) {
		if (cart.items[i] === null) {
			continue;
		}
		subTotal += cart.items[i].price * cart.items[i].quantity;
	}

   subTotal = subTotal - promoDiscount;
   tax = tax * subTotal;
   var total = tax + subTotal;

   //alert("tax [" + formatNumber(tax) + "] promoDiscount [" + formatNumber(promoDiscount) + "] subTotal [" +
   //     formatNumber(subTotal) + "] total [" + formatNumber(total) + "]");

   // update fields
   $("#cart-subTotal").text(formatNumber(subTotal));
   $("#cart-discount").text(formatNumber(promoDiscount));
   $("#cart-tax").text(formatNumber(tax));
   $("#cart-total").text(formatNumber(total));
}

function showDeleteModal(itemId) {
   $("#modalItemId").val(itemId);
   $("#myModal").modal('show');
}

function removeItemFromCart() {
   $("#myModal").modal('hide');
   var cartIdentifierId = $("#modalItemId").val();
	var cart = JSON.parse(window.sessionStorage.getItem("cart"));
	var itemList = getItemList();
   for (var i =0; i < cart.items.length; i++) {
		if (cart.items[i] === null) {
			continue;
		}
		if (cart.items[i].cartIdentifierId == cartIdentifierId) {
			cart.total = cart.total - (cart.items[i].price * cart.items[i].quantity);
			delete cart.items[i];
			window.sessionStorage.setItem("cart", JSON.stringify(cart));
         $("#cartTableRow_" + cartIdentifierId).remove();
         loadCartText();
		}
	}
}

function addPromoCode() {
	var promoCode = $("#txtPromo").val();
	alert("Checking Status for Promo Code [" + promoCode + "]");
}
