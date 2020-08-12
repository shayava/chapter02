$(function () {
  "use strict";
  $("#createGame").submit(function (event) {
    $.post($(this).attr("action"), { word: $("#word").val() }, function (
      result
    ) {
      $("#createdGames").append(result);
    });
    event.preventDefault();
  });
});
