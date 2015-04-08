var CurrenciesAPI = 'https://api.coinbase.com/v1/currencies';
var ExchangeRatesAPI = 'https://api.coinbase.com/v1/currencies/exchange_rates';
var ExchangeRates;

$body = $("body");

$(document).on({
	ajaxStart : function() {
		$body.addClass("loading");
	},
	ajaxStop : function() {
		$body.removeClass("loading");
	}
});

$(window).ready(function() {
	$("#BTC").attr('onchange', 'BtcToFiat();');
	$("#FiatValue").attr('onchange', 'FiatToBtc();');
	$("#FiatCurrency").attr('onchange', 'BtcToFiat();');
	$("#Refresh").attr("onclick", 'RefreshExchangeData();');

	// fetch BTC Data
	RefreshExchangeData();
});

function RefreshExchangeData() {

	$.getJSON('http://ajax.computerfr33k.com/index.php?url=' + CurrenciesAPI, function(data) {

		// parse through available currencies from API
		var keys = [];
		for (var key in data.contents) {
			// the first element in the sub-array will be the name of the currency
			// the second element in the sub-array will be the currency ISO code.
			if (data.contents.hasOwnProperty(key)) {
				keys.push(key);
				$("#FiatCurrency").append('<option value="' + data.contents[key][1].toLowerCase() + '">' + data.contents[key][0] + '</option>');
			}
		}

		// Build up Exchange Rates Array
		$.getJSON('http://ajax.computerfr33k.com/index.php?url=' + ExchangeRatesAPI, function(er) {
			ExchangeRates = er.contents;

			// Populate fiat value after we fetch everything
			//$("#FiatValue").val(ExchangeRates['btc_to_' + keys[0]]);
			BtcToFiat();
		});
	});
}

function BtcToFiat() {
	// calculate what x amount of BTC is in Fiat; (e.g. 1 BTC is $250.00)
	var BTCAmount = Number($("#BTC").val());
	var fiatExchangeRate = Number(ExchangeRates['btc_to_' + $("#FiatCurrency").val()]);

	var total = BTCAmount * fiatExchangeRate;
	$("#FiatValue").val(total.toFixed(2));
}

function FiatToBtc() {
	// Calculate How much Fiat is in BTC; (e.g. $100.00 is 0.41 BTC)
	var FiatAmount = Number($("#FiatValue").val()).toFixed(2);
	var FiatType = $("#FiatCurrency").val();
	var fiatExchangeRate = Number(ExchangeRates[FiatType + '_to_btc']);

	var total = FiatAmount * fiatExchangeRate;
	$("#BTC").val(total);
}
