// global variables
var condimentDictionary = [];

var categoryPanelBgColor = "fcf8e3";
var categoryHeaderBgColor = "337ab7";
var categoryHeaderFontColor = "ffffff";
var itemPanelBgColor = "fff";
var itemHeaderBgColor = "79A7CD"; //"00aeef";
var itemHeaderFontColor = "fff";

var PROMO_CODE_SESSION_KEY = "PROMO_CODE";
var RESTAURANT_SESSION_KEY = "RESTAURANT";
var MENU_SESSION_KEY = "MENU";
var CONDIMENT_LIST_SESSION_KEY = "condimentList";
var ITEM_LIST_SESSION_KEY = "itemList";
var CART_SESSION_KEY = "cart";
var USER_SESSION_KEY = "user";
var PROMO_DISCOUNT_SESSION_KEY = "PROMO_DISCOUNT";
var PROMO_DISCOUNT_TYPE_SESSION_KEY = "PROMO_DISCOUNT_TYPE";
var PROMO_DISCOUNT_NAME_SESSION_KEY = "PROMO_DISCOUNT_NAME";
var CURRENT_PAGE_SESSION_KEY = "CURRENT_PAGE";


var RESTAURANT_ID = "1";

//var URL_HOST = "http://api.hectorfirst.org";
var URL_HOST = "http://192.168.0.172/~kstane/mobile/rest-api";

var LOGIN_URL = URL_HOST + "/user/index.php/login";
var REGISTRATION_URL = URL_HOST + "/user/index.php/register";
var MENU_URL = URL_HOST + "/restaurant/index.php/menu/" + RESTAURANT_ID;
var PROMO_URL = URL_HOST + "/order/index.php/promo/";


// var CONSTANTS = {
//    LOGIN_URL: "",
//    REGISTRATION_URL: ""
// }
