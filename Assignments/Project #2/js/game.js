// Demo code for the Archaeology game
//
// Loaded by game.html
// Uses GameBoard object defined in board.js
//

// Warning! The function tryDig and the variable board are global variables!

$(function () {

	main();

	function main() {
		board = new GameBoard();
	  board.cellMarker = '<i class="fa fa-2x fa-question-circle"></i>';
	  board.setBoard();

		// make sure each cell is only allowed to click once.
		$("td").one('click', elementClicked);

		// change cursor icon depending on if the cell is excavated or not to indicate to user that he/she can click on it.
		$("td").mouseenter(function() {
			if($(this).data("isDug") !== "true") {
				$(this).css("cursor", "pointer");
			} else {
				$(this).css("cursor", "default");
			}
		});
	}

	function showDigAnimation(cell, object) {
		$(cell).html('<i class="fa-2x fa fa-spinner fa-spin"></i>');
		setTimeout(function() {
			if(object) {
				$(cell).html('<i class="fa fa-2x fa-check text-success"></i>').fadeIn(100);
			} else {
				$(cell).html('<i class="fa fa-2x fa-ban text-danger"></i>').fadeIn(100);
			}
			// mark cell is being dug so we know what cursor to display
			$(cell).data("isDug", "true");
		}, 800);
	}

  tryDig = function(targetCell)
  {
    var targetObj = board.dig(targetCell);
    showDigAnimation("#cell"+targetCell, targetObj);
  }

  function elementClicked() {
    var coordinates = $(this).attr("id").substring(4);
    console.log("digging: " + coordinates);
    tryDig(coordinates);
  }

});
