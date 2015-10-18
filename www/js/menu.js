

function loadRestaurantMenu() {
   $.ajax({
      url: "http://mobile-kstane.rhcloud.com/rest/menu/1",
      cache: false,
      success: function(data) {
         var categoryList = data.fullMenu.categoryList;
         var condiments = data.fullMenu.condimentList;

         for (var x = 0; x < condiments.length; x++) {
            var c = condiments[x];
            condimentDictionary[c.id] = c;
         }

         window.sessionStorage.setItem("condimentList", JSON.stringify(condimentDictionary));

         for (var i = 0; i < categoryList.length; i++) {
            var category = categoryList[i];
            addCollapsableRow("category_" +category.id, category.name, "accordion");

            var itemList = category.itemList;
            for (var itemCounter = 0; itemCounter < itemList.length; itemCounter++) {
               var item = itemList[itemCounter];
               // add the item to the dictionary for use on the cart page
               itemDictionary[item.id] = JSON.stringify(item);
               // add a collapsable row before we append the item
               addItemToCategory("item_" +item.id, item.name, "category_" + category.id + "_accordion", itemList[itemCounter].price);

               // now that we have the item added to the category, lets add the condiments and add to cart button
               addCondimentsToMenuItem(item.condiments, item)
            }
         }

         window.sessionStorage.setItem("itemList", JSON.stringify(itemDictionary));
         //$("#menuCategoriesSet").collapsibleset('refresh');
      },
      error: function(error) {
         //console.log("error updating table -" + error.status);
         alert(JSON.stringify(error, null, 2))
      },
      complete: function() {
         // Hide the loader widget
         $.mobile.loading("hide");
      }
   });
}

function addCondimentsToMenuItem(condiments, item) {
   //alert("Condiment count [" + condiments.length + "] for [" + item.name + "]");
   var htmlStart = "<form name=\"form_item_" + item.id + "\" action=\"#\" onsubmit=\"return false;\"><input type=\"hidden\" id=\"id_for_item\" value=\"" + item.id  + "\">";
   var htmlEnd = "<div>" +
      "<input name=\"itemid_" + item.id + "_quantity\" id=\"itemid_" + item.id + "_quantity\" value=\"1\" placeholder=\"Quantity\" min=\"0\" " +
       "required=\"true\" type=\"text\" size=\"4\" />&nbsp;" +
       "<input type=\"button\" class=\"btn btn-small btn-success\" value=\"Add to Cart\" id=\"btnAdd\" onclick=\"addToCart($(this).parent().parent()); return false;\" /></div></form>";

   var htmlMiddle = "<ul class=\"checkbox-grid\">";
   var upSellList = "";
   var checkboxType = "checkbox", itemChecked = "";
   if (item.allowOneCondiment == true) {
      checkboxType = "radio";
   }

    if (condiments.length !== 0) {
       for (var counter = 0; counter < condiments.length; counter++) {
         var condiment = condiments[counter];
         if (checkboxType == "radio" && counter == 0) {
            itemChecked = "checked=\"checked\"";
         }

         var name = condimentDictionary[condiment].name;
         if (condimentDictionary[condiment].upSell) {
            name += " ($" + formatNumber(condimentDictionary[condiment].price) + ")";
         }
         var html = "<li><input name=\"condiment_item_" + item.id + "\" id=\"chkbxCondimentId_" + condiment + "\" " +
                "value=\"" + condiment + "\" type=\"" + checkboxType + "\" " + itemChecked + " /> " +
                "<label for=\"condiment_item_" + item.id + "\">" + name + "</label></li>";

         if (condimentDictionary[condiment].upSell == true) {
            upSellList += html;
         } else {
            htmlMiddle += html;
         }

         itemChecked = "";
       }
       htmlMiddle += upSellList + "</ul><br>";
   } else {
      htmlMiddle = "";
   }
   $("#item_" + item.id + "_condiments").append(htmlStart + htmlMiddle + htmlEnd).trigger('create');
}

function addToCart(itemForm) {
   var err = "";
   var condimentsForCart = [];
   var condimentsCounter = 0;
   var fields = $(itemForm).find(':input');

   var quantity = getValueFromFormFields(fields, "quantity", true, 1);
   if ( isNaN(quantity) || quantity <= 0 ) {
      $("#modal-message").text("Invalid Cart Amount [" + quantity + "]. Please adjust the amount to continue");
      $("#myModal").modal('show');
      return false;
   }

   var itemId = getValueFromFormFields(fields, "id_for_item", false, null);

   // get all the checkbox values
   var itemPrice = 0;
   $.each( fields, function( i, field ) {
      if ( (field.type === "checkbox" || field.type === "radio") && field.checked ) {
         condimentsForCart[condimentsCounter++] = field.value;
         itemPrice += condimentDictionary[field.value].price;
         field.checked = false;
      }
   });

   // check to see if the item exists, if so, just call the updateCart function
   var itemFound = itemExists(itemId, condimentsForCart);
   if (itemFound > -1) {
      updateCart(itemFound, quantity);
      $("#modal-message").text("Item exists in the cart already. The quantity has been updated.");
      $("#myModal").modal('show');
      return false;
   }
   var totalPrice = (itemPrice + getItemById(itemId).price) * quantity;
   var cartCounter = getNextCartItemCount();
   var item = { id: itemId, quantity: quantity, condiments: condimentsForCart, cartIdentifierId: cartCounter, price: totalPrice};

   var cart = JSON.parse(window.sessionStorage.getItem("cart"));
   if (cart === null) {
      cart = {total: 0, items: []};
   }
   cart.items[cartCounter] =  item;
   cart.total = cart.total + totalPrice;
   window.sessionStorage.setItem("cart", JSON.stringify(cart));
   loadCartText();

   $("#modal-message").text("The item has been added to the cart.");
   $("#myModal").modal('show');
   setTimeout(function(){ $("#myModal").modal('hide'); }, 2500);
}

function updateCart(cartIdentifierId, quantity) {
   var cart = JSON.parse(window.sessionStorage.getItem("cart"));
	var itemList = getItemList();
   for (var i =0; i < cart.items.length; i++) {
		if (cart.items[i] === null) {
			continue;
		}
		if (cart.items[i].cartIdentifierId === cartIdentifierId) {
         var newItemTotal = quantity * cart.items[i].price;
			cart.items[i].quantity = +cart.items[i].quantity + +quantity;
         cart.total = cart.total + (quantity * cart.items[i].price);

			// TODO - update cart total based on quantity
			window.sessionStorage.setItem("cart", JSON.stringify(cart));
         loadCartText();
         return;
		}
	}
}

function itemExists(itemId, itemCondiments) {
   var cart = JSON.parse(window.sessionStorage.getItem("cart"));
   if (cart === null) {
      return -1;
   }
   var itemList = getItemList();
   var matchCount = 0;
   for (var i =0; i < cart.items.length; i++) {
      if (cart.items[i] === null) {
         continue;
      }

      if (cart.items[i].id === itemId) {
         if ( cart.items[i].condiments.length !== itemCondiments.length ) {
              continue;
         } else {
      		for (var counter = 0; counter < cart.items[i].condiments.length; counter++) {
               for(var x = 0; x < itemCondiments.length; x++) {
                  if (itemCondiments[x] === cart.items[i].condiments[counter]) {
                     matchCount++;
                  }
               }
      		}
            if (itemCondiments.length === matchCount) {
               return cart.items[i].cartIdentifierId;
            } else {
               matchCount = 0;
               continue;
            }
         }
      }
   }
   return -1;
}

function getValueFromFormFields(fields, startsWithString, isReplaceValue, replaceValue) {
   var fieldValue = 0;
    $.each( fields, function( i, field ) {
       if ( field.id.indexOf(startsWithString) > -1 ) {
           fieldValue = field.value;
           if (isReplaceValue) {
             field.value = replaceValue;
          }
           return;
       }
   });
   return fieldValue;
}

function addItemToCategory(id, name, appendTo, price) {
   var div = "<div class=\"panel panel-default\">" +
       "<div class=\"panel-heading\" style=\"background-color: #" + itemHeaderBgColor + "; color: #" + itemHeaderFontColor + "\">" +
       "     <h4 class=\"panel-title\">" +
       "        <a data-toggle=\"collapse\" data-parent=\"#" + appendTo + "\" href=\"#" + id + "\">" + name + " - $" + formatNumber(price) + "</a>" +
       "     </h4>" +
       "</div>" +
       "<div id=\"" + id + "\" class=\"panel-collapse collapse\" style=\"background-color: #" + itemPanelBgColor + "\">" +
      "     <div class=\"panel-body\"><div  id=\"" + id + "_condiments\"></div>" +
      " </div></div>";
       //alert(div);
   $("#" + appendTo).append(div).trigger('create');
}

function addCollapsableRow(id, name, appendTo) {
   var div = "<div class=\"panel panel-default\">" +
       "<div class=\"panel-heading\" style=\"background-color: #" + categoryHeaderBgColor + "; color: #" + categoryHeaderFontColor + "\">" +
       "     <h4 class=\"panel-title\">" +
       "        <a data-toggle=\"collapse\" data-parent=\"#" + appendTo + "\" href=\"#" + id + "\">" + name + "</a>" +
       "     </h4>" +
       "</div>" +
       "<div id=\"" + id + "\" class=\"panel-collapse collapse\" style=\"background-color: #" + categoryPanelBgColor + "\">" +
      "     <div class=\"panel-body\" ><div class=\"panel-group\" id=\"" + id + "_accordion\"></div>" +
      " </div></div>";
      // alert(div);
   $("#" + appendTo).append(div).trigger('create');
}
