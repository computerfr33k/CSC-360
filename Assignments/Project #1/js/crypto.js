var CurrenciesAPI = 'https://api.coinbase.com/v1/currencies';
var ExchangeRatesAPI = 'https://api.coinbase.com/v1/currencies/exchange_rates';
var ExchangeRates;

$(window).ready(function() {
	RefreshCurrencies();
	
	$("#BitcoinValue").attr('onchange', 'BtcToFiat();');
	$("#CurrencyValue").attr('onchange', 'FiatToBtc();');
	$("#CurrencyType").attr('onchange', 'BtcToFiat();');
	$("#RefreshExchange").attr("onclick", 'RefreshExchangeRates();');
    	// Render select elements so they aren't missing during the initial load which would look weird
    	$('select').material_select();

	// fetch BTC Data
	RefreshExchangeRates();
});

function RefreshCurrencies() {
    // Inform user that data is being fetched
    Materialize.toast('loading currency data', 4000);
    
	$.getJSON('http://ajax.computerfr33k.com/index.php?url=' + CurrenciesAPI, function(data) {

		// parse through available currencies from API
		var keys = [];
		$("#CurrencyType").empty();
		$("#CurrencyType").append('<option disabled>Choose A Currency</option>');
		for (var key in data.contents) {
			// the first element in the sub-array will be the name of the currency
			// the second element in the sub-array will be the currency ISO code.
			if (data.contents.hasOwnProperty(key)) {
				keys.push(key);
                		$("#CurrencyType").append('<option value="' + data.contents[key][1].toLowerCase() + '">' + data.contents[key][0] + '</option>');
			}
		}
		
        // re-initialize the select elements to be rendered
        $('select').material_select();
        // Select USD
        $('#CurrencyType').val('usd').prop('selected');
		Materialize.toast('Currency Load Complete', 4000);
	});
}

function RefreshExchangeRates() {
	// Build up Exchange Rates Array
	var Exchange = $.getJSON('http://ajax.computerfr33k.com/index.php?url=' + ExchangeRatesAPI, function() {
	}).done(function(data) {        
        	if(data.status.http_code === 200) {
            		// API request was successful
            		ExchangeRates = data.contents;
            
        	} else {
            		// API Server returned an error
            		// we check the http_code because my server is proxying the API call and so JQuery can't tell if the API call returned an error on its own
            		Materialize.toast('Error Loading Exchange Rates', 4000);
        	}
        
	}).fail(function() {
        	Materialize.toast('Error Loading Exchange Rates', 4000);
    	}).always(function() {
        	Materialize.toast('Loading Exchange Rates', 4000);
    	});
    
    	Exchange.complete(function() {
        // Populate fiat value after we fetch everything
		//$("#FiatValue").val(ExchangeRates['btc_to_' + keys[0]]);
        
        $('select').material_select();
        BtcToFiat();
        Materialize.toast('Loading Exchange Rates Complete', 4000);
    });
}

function BtcToFiat() {
	// calculate what x amount of BTC is in Fiat; (e.g. 1 BTC is $250.00)
	var BTCAmount = Number($("#BitcoinValue").val());
	var fiatExchangeRate = Number(ExchangeRates['btc_to_' + $("#CurrencyType").val()]);

	var total = BTCAmount * fiatExchangeRate;
	$("#CurrencyValue").val(total.toFixed(2));
}

function FiatToBtc() {
	// Calculate How much Fiat is in BTC; (e.g. $100.00 is 0.41 BTC)
	var FiatAmount = Number($("#CurrencyValue").val()).toFixed(2);
	var FiatType = $("#CurrencyType").val();
	var fiatExchangeRate = Number(ExchangeRates[FiatType + '_to_btc']);

	var total = FiatAmount * fiatExchangeRate;
	$("#BitcoinValue").val(total);
}
