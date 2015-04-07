function updateTotal() {
	var tip = Number(document.getElementById("service-rating").value.trim());
	var check = Number(document.getElementById("check-amount").value.trim());
	
	var tipTotal = (check * (tip/100));
	document.getElementById("tip-value").innerText = tipTotal.toFixed(2);
	
	var totalAmount = check + tipTotal;
	document.getElementById("total-value").innerText = totalAmount.toFixed(2);
}
