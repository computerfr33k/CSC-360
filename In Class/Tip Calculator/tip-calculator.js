function updateTotal() {
	var tip = Number($("#service-rating").val());
	var check = Number($("#check-amount").val());
	
	var tipTotal = (check * (tip/100));
	document.getElementById("tip-value").innerText = tipTotal.toFixed(2);
	
	var totalAmount = check + tipTotal;
	document.getElementById("total-value").innerText = totalAmount.toFixed(2);
}

$(document).ready(function() {
	$("#calc").attr("onClick", "updateTotal();");
});