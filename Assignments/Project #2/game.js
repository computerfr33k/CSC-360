// Demo code for the Archaeology game
//
// Loaded by game.html
// Uses GameBoard object defined in board.js
//

// Warning! The function tryDig and the variable board are global variables!

$(function () {

	function showDigAnimation(cell, object) {
		$(cell).html('<i class="fa-2x fa fa-spinner fa-spin"></i>');
		setTimeout(function() {
			if(object) {
				$(cell).html('<i class="fa fa-2x fa-check text-success"></i>').fadeIn(100);
			} else {
				$(cell).html('<i class="fa fa-2x fa-ban text-danger"></i>').fadeIn(100);
			}
		}, 800);
	}
  
  tryDig = function(targetCell)
  {
    var targetObj = board.dig(targetCell);
    showDigAnimation("#cell"+targetCell, targetObj);
  }
    
    
  board = new GameBoard();
  board.cellMarker = '<i class="fa fa-2x fa-question-circle"></i>';
  board.setBoard();

  $("td").click(elementClicked);
  function elementClicked() {
    var coordinates = $(this).attr("id").substring(4);
    console.log("digging: " + coordinates);
    tryDig(coordinates);
  }

});
