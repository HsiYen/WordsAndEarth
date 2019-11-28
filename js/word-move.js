$('#words').on('mousemove', function (e) {

  var offsetX = e.clientX / window.innerWidth - 0.5,
    offsetY = e.clientY / window.innerHeight - 0.5;
  var _left = -40 * offsetX;
  var _top = -40 * offsetY;
  $('#words .list1>li:nth-child(1)').css('left', 60 + _left * 1).css('top', _top *
    1);
  $('#words .list1>:nth-child(2)').css('left', 30 + _left * 0.5).css('top', 110 + _top *
    0.5);
  $('#words .list1>li:nth-child(3)').css('left', 50 + _left * 1.5).css('top', 230 + _top *
    1.5);
  $('#words .list2>li:nth-child(1)').css('left', 60 + _left * 0.5).css('top', _top *
    0.5);
  $('#words .list2>:nth-child(2)').css('left', 100 + _left * 0.5).css('top', 103 + _top *
    0.5);
  $('#words .list2>li:nth-child(3)').css('left', 50 + _left * 3).css('top', 233 + _top *
    3);
});