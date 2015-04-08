var BitcoinPrice;
var CurrenciesAPI = 'https://api.coinbase.com/v1/currencies';
var ExchangeRatesAPI = 'https://api.coinbase.com/v1/currencies/exchange_rates';
var ExchangeRates;

$.getJSON('http://ajax.computerfr33k.com/index.php?url=' + CurrenciesAPI, function(data) {

	// parse through available currencies from API
	for (var key in data.contents) {
		// the first element in the sub-array will be the name of the currency
		// the second element in the sub-array will be the currency ISO code.
		if (data.contents.hasOwnProperty(key)) {
			$("#FiatCurrency").append('<option value="' + data.contents[key][1].toLowerCase() + '">' + data.contents[key][0] + '</option>');
		}
	}
});

$.getJSON('http://ajax.computerfr33k.com/index.php?url=' + ExchangeRatesAPI, function(data) {
	ExchangeRates = data.contents;
});

$(window).ready(function() {
	$("#BTC").attr('onchange', 'BtcToFiat();');
});

function BtcToFiat() {
	$("#FiatValue").val(ExchangeRates['btc_to_' + $("#FiatCurrency").val()]);
}

function FiatToBtc() {
	
}
