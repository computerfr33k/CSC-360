// Demo code for the Archaeology game
//
// Loaded by game.html
// Uses GameBoard object defined in board.js
//

// Warning! The function tryDig and the variable board are global variables!

$(function () {
	var totalDigs = 0;
	var successfulDigs = 0;
	var unsuccessfulDigs = 0;
	var artifactsRemaining = 0;
	var currentScore = 0;

	main();

	function main() {
		board = new GameBoard();
		board.cellMarker = '<i class="fa fa-2x fa-question-circle"></i>';
		board.setBoard();
		
		for(var index = 0; index < board.ruins.length; index++) {
			artifactsRemaining += board.ruins[index].size;
		}
		
		console.log(artifactsRemaining);

		// make sure each cell is only allowed to click once.
		$(".square").one('click', elementClicked);

		// change cursor icon depending on if the cell is excavated or not to indicate to user that he/she can click on it.
		$(".square").mouseenter(function () {
			if ($(this).data("isDug") !== "true") {
				$(this).css("cursor", "pointer");
			} else {
				$(this).css("cursor", "default");
			}
		});
	}
	
	function calculateScore(digResult) {
		currentScore = ;
		
		$("#currentScore").text(currentScore);
		
		return currentScore;
	}

	function showDigAnimation(cell, object) {
		$(cell).html('<i class="fa-2x fa fa-spinner fa-spin"></i>');
		setTimeout(function () {
			if (object) {
				// successful dig
				$(cell).html('<i class="fa fa-2x fa-' + object.name + ' text-success"></i>').fadeIn(100);
				
				successfulDigs += 1;
				artifactsRemaining -= 1;
				$("#" + object.name + "Found").text(Number($("#" + object.name + "Found").text()) + 1);
				$("#" + object.name + "Remaining").text(Number($("#" + object.name + "Remaining").text()) - 1);
			} else {
				// unsuccessful dig
				$(cell).html('<i class="fa fa-2x fa-ban text-danger"></i>').fadeIn(100);
			}
			// mark cell is being dug so we know what cursor to display
			$(cell).data("isDug", "true");
			calculateScore();
			console.log("Score: " + currentScore);
		}, 800);
	}

	tryDig = function (targetCell) {
		totalDigs += 1;
		$("#totalDigs").text(totalDigs);

		var targetObj = board.dig(targetCell);
		showDigAnimation("#cell" + targetCell, targetObj);
	}

	function elementClicked() {
		var coordinates = $(this).attr("id").substring(4);
		console.log("digging: " + coordinates);
		tryDig(coordinates);
	}

});
