// global variables
var condimentDictionary = [];

// This is used to identify whether they need to upgrade the UI or not. Old versions will not be able to continue
var APPLICATION_VERSION_NUMBER = 1.04;

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
var ORDER_CONFIRMATION_NO_SESSION_KEY = "ORDER_CONFIRMATION_NO";
var ORDER_CONFIRMATION_NAME_SESSION_KEY = "ORDER_CONFIRMATION_NAME";
var PREVIOUS_ORDER_HISTORY = "PREVIOUS_ORDER_HISTORY";
var RESTAURANT_LIST_SESSION_KEY = "restaurant-list";
var ORDER_CONFIRMATION_PAYMENT_TYPE_SESSION_KEY = "order-confirmation-payment-type";
var FIRST_TIME_USER = "first-time-user";

var URL_HOST = "https://api.menu-junction.com";
//var URL_HOST = "http://127.0.0.1/~kstane/mobile/rest-api";

var LOGIN_URL = URL_HOST + "/user/index.php/login";
var REGISTRATION_URL = URL_HOST + "/user/index.php/register";
var MENU_URL = URL_HOST + "/restaurant/index.php/menu/franchise/" + FRANCHISE_ID;
var PROMO_URL = URL_HOST + "/order/index.php/promo/";
var SUBMIT_ORDER_URL = URL_HOST + "/order/index.php/create";
var UPDATE_PASSWORD_URL = URL_HOST + "/user/index.php/change-password";
var UPDATE_USER_INFO_URL = URL_HOST + "/user/index.php/update-user";
var RESET_PASSWORD_URL = URL_HOST + "/user/index.php/reset-password";
