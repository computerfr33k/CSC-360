function createCorsRequest(method, url) {
	var xhr = new XMLHttpRequest(method, url);
	if ("withCredentials" in xhr) {
		// Check if the XMLHttpRequest object has a "withCredentials" property.
		// "withCredentials" only exists on XMLHTTPRequest2 objects.
		xhr.open(method, url, true);

	} else if (typeof XDomainRequest != "undefined") {
		// Otherwise, check if XDomainRequest.
		// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
		xhr = new XDomainRequest();
		xhr.open(method, url);

	} else {
		// Otherwise, CORS is not supported by the browser.
		xhr = null;
	}

	return xhr;
}

var mycrypto = {
	CurrenciesAPI: 'https://api.coinbase.com/v1/currencies',
	ExchangeRatesAPI: 'https://api.coinbase.com/v1/currencies/exchange_rates',
	ExchangeRates: null,

	RefreshCurrencies: function () {
		var deferred = $.Deferred();

		var xhr = createCorsRequest('GET', 'https://cors-anywhere.herokuapp.com/' + mycrypto.CurrenciesAPI);
		xhr.onload = function () {
			var data = JSON.parse(xhr.responseText);

			// parse through available currencies from API
			var keys = [];
			$("#CurrencyType").empty();
			$("#CurrencyType").append('<option disabled>Choose A Currency</option>');

			for (var key in data) {
				// the first element in the sub-array will be the name of the currency
				// the second element in the sub-array will be the currency ISO code.
				if (data.hasOwnProperty(key)) {
					keys.push(key);
					$("#CurrencyType").append('<option value="' + data[key][1].toLowerCase() + '">' + data[key][0] + '</option>');
				}
			}

			// re-initialize the select elements to be rendered
			$('select').material_select();
			// Select USD
			$('#CurrencyType').val('usd').prop('selected');

			deferred.resolve();
		}

		xhr.onerror = function () {
			errorAlert('Woops, there was an error making the request.', 4000);
			deferred.reject();
		};

		xhr.send();

		return deferred.promise();
	},

	RefreshExchangeRates: function () {
		var deferred = $.Deferred();

		// Build up Exchange Rates Array
		var xhr = createCorsRequest('GET', 'https://cors-anywhere.herokuapp.com/' + mycrypto.ExchangeRatesAPI);
		xhr.onload = function () {
			mycrypto.ExchangeRates = JSON.parse(xhr.responseText);
			$('select').material_select();
			mycrypto.BtcToFiat();

			deferred.resolve();
		}

		xhr.onerror = function () {
			errorAlert('Error Loading Exchange Rates', 4000);
			deferred.reject("HTTP error: " + xhr.status);
		}

		xhr.send();

		return deferred.promise();
	},

	errorAlert: function (message, length) {
		Materialize.toast(message, length, 'red');
	},

	BtcToFiat: function () {
		// calculate what x amount of BTC is in Fiat; (e.g. 1 BTC is $250.00)
		var BTCAmount = Number($("#BitcoinValue").val());
		var fiatExchangeRate = Number(mycrypto.ExchangeRates['btc_to_' + $("#CurrencyType").val()]);

		var total = BTCAmount * fiatExchangeRate;
		$("#CurrencyValue").val(total.toFixed(2));
	},

	FiatToBtc: function () {
		// Calculate How much Fiat is in BTC; (e.g. $100.00 is 0.41 BTC)
		var FiatAmount = Number($("#CurrencyValue").val()).toFixed(2);
		var FiatType = $("#CurrencyType").val();
		var fiatExchangeRate = Number(mycrypto.ExchangeRates[FiatType + '_to_btc']);

		var total = FiatAmount * fiatExchangeRate;
		$("#BitcoinValue").val(total);
	}
};

$(function () {

	$("#BitcoinValue").attr('onchange', 'mycrypto.BtcToFiat();');
	$("#CurrencyValue").attr('onchange', 'mycrypto.FiatToBtc();');
	$("#CurrencyType").attr('onchange', 'mycrypto.BtcToFiat();');
	$("#RefreshExchange").attr("onclick", 'mycrypto.RefreshExchangeRates();');
	// Render select elements so they aren't missing during the initial load which would look weird
	$('select').material_select();

	// fetch BTC Data
	mycrypto.RefreshCurrencies().then(mycrypto.RefreshExchangeRates()).then(function () {
		$('#preloader').fadeOut('slow', function () { $(this).remove(); });
	});
});
