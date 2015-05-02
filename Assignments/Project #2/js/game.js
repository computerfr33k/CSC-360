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
	var animationOn = false;

	main();

	function main() {
		totalDigs = 0;
		successfulDigs = 0;
		unsuccessfulDigs = 0;
		artifactsRemaining = 0;
		currentScore = 0;

		board = new GameBoard();
		board.cellMarker = '<i class="fa fa-2x fa-question-circle"></i>';
		board.setBoard();

		for (var index = 0; index < board.ruins.length; index++) {
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

		$("#NewGame").click(function () {
			location.reload();
		});
	}

	function calculateScore(digResult) {
		console.log(digResult);

		if (digResult) {
			currentScore += 100;
		} else {
			currentScore -= 25;
		}

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
				if (Number($("#" + object.name + "Remaining").text()) === 0) {
					var name = object.name.toLowerCase().replace(/\b[a-z]/g, function (letter) {
						return letter.toUpperCase();
					});
					$('.top-right').notify({
						message: { text: 'All ' + name + 's have been found!' }
					}).show();
				}
				
			} else {
				// unsuccessful dig
				$(cell).html('<i class="fa fa-2x fa-ban text-danger"></i>').fadeIn(100);
			}
			// mark cell is being dug so we know what cursor to display
			$(cell).data("isDug", "true");
			calculateScore(object);
			console.log("Score: " + currentScore);
			if (artifactsRemaining === 0) {
				gameEnd();
			}
		}, 800);
	}

	tryDig = function (targetCell) {
		if (!animationOn) {
			animationOn = true;
			totalDigs += 1;
			$("#totalDigs").text(totalDigs);

			var targetObj = board.dig(targetCell);
			showDigAnimation("#cell" + targetCell, targetObj);
			console.log("Remain: " + artifactsRemaining);
			animationOn = false;
		} else {
			$('.top-right').notify({
				message: { text: "Slow down, you need to finish excavating this one before starting a new one." }
			}).show();
		}
	}

	function gameEnd() {
		$('td').off('click');
		var msg = "";

		if (currentScore < 500) {
			msg = "You've completed the game, but didn't do so well. Better luck next time!";
		} else if (currentScore > 500 && currentScore < 1000) {
			msg = "You've Completed the game and have done considerably well. Well Done!";
		} else {
			msg = "Woah, looks like we've got a professional over here. Very well done, Consider challenging a friend for more competition.";
		}

		$('.top-right').notify({
			message: { text: msg }
		}).show();
	}

	function elementClicked() {
	var coordinates = $(this).attr("id").substring(4);
console.log("digging: " + coordinates);
tryDig(coordinates);

}
});
