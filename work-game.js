var game = new Game();
$(function() {
  GameInit();
});

var GameInit = function() {
  var $ = jQuery,
      t = this;

  this.record = function() {
    var content = "";
    for (var w = 0; w < 20; w++)
    {
      content += '<tr>';
      for (var h = 0; h < 20; h++)
      {
        content += '<td></td>';
      }
      content += '</tr>';
    }
    $('#game-grid').append(content);
    game.init($('#game-grid')[0]);
  //  gameInitPoints = [];

    $(game.gridNode).find('td').click(function() {
      var coord = {
        x: $(this)[0].parentNode.rowIndex,
        y: $(this)[0].cellIndex,
      };
      // Действие с точкой
      if (!game.points[coord.x][coord.y].active) {
        $(this).css("background", "#333333");
        game.enablePoint(coord.x, coord.y);
      //  game.gameInitPoints.push(coord);
      //  game.points.push(coord);
      }
      else
      {
        $(this).css("background", "#cccccc");
        game.disablePoint(coord.x, coord.y);
     //   game.gameInitPoints.pop(coord);
     //   game.points.pop(coord);
      }
    });
  }
};

var records = {
  "states": [
      {
        "name": "Игра1",
        "date": "09.11.17 20:56"
      },
      {
        "name": "Игра2",
        "date": "09.11.17 20:46"
      },
      {
        "name": "Игра3",
        "date": "09.11.17 20:36"
      },
      {
        "name": "Игра4",
        "date": "09.11.17 20:26"
      },
      {
        "name": "Игра5",
        "date": "09.11.17 20:16"
      }
  ]
};
var SendData;
// Окно для выбора сохраненной игры из списка
$(document).ready(function() {
  //Первоначальная инициализация данных для сервера
  $('body').append('<div class="popup-box" id="popup-box-1"><div class="top"><h2>Список игр. Игрока с ID:45673</h2></div><div class="bottom"><ul id="ul"></ul></div><button class="new-game">Новая игра</button></div>');

  $.each(records.states, function (key, val) {
    $('#ul').append($('<li class="item">')
          .text('Наименование: ' + val.name)
          .append($('<strong>')
          .text(' Дата: ' + val.date)));
  });

$('body').append('<div id="blackout"></div>');
var boxWidth = 250;
function centerBox() {
  var winWidth = $(window).width();
  var winHeight = $(document).height();
  var scrollPos = $(window).scrollTop();

  // Вычисление позиций
  var disWidth = (winWidth - boxWidth) / 2;
  var disHeight = scrollPos + 150;

  // Задание css стилей
  $('.popup-box').css({'width' : boxWidth+'px', 'left' : disWidth+'px', 'top' : disHeight+'px'});
  $('#blackout').css({'width' : winWidth+'px', 'height' : winHeight+'px'});
  return false;
};

$(window).resize(centerBox);
$(window).scroll(centerBox);
centerBox();

  $(document).ready(function() {
    record();

    /* Get the id (the number appended to the end of the classes) */
    var name = $(this).attr('class');
  // var id = name[name.length - 1];
    var id = 1;
    var scrollPos = $(window).scrollTop();

    /* Show the correct popup box, show the blackout and disable scrolling */
    if (records.states != null)
    {
      $('#popup-box-1').show();
      $('#blackout').show();
      $('html,body').css('overflow', 'hidden');
    }

    /* Fixes a bug in Firefox */
    $('html').scrollTop(scrollPos);
  });

  $('li').click(function() {
    var scrollPos = $(window).scrollTop();
    /* Скрыть окно когда кликнут по элементу списка. */
    $('[id^=popup-box-]').hide();
    $('#blackout').hide();
    $('html,body').css("overflow", "auto");
    $('html').scrollTop(scrollPos);
    //Для передачи данных в теги h2 и h3
    var index = $('li').index(this);
    $('h2').text('Наименование игры: ' + records.states[index].name);
    $('h3').text('Время: ' + records.states[index].date);
  });  

  $('#gameSave').click(function() {
    var nameGame = prompt('Название игры', '');
    var date = new Date();
    $('h2').text('Наименование игры: ' + nameGame);
    $('h3').text('Время: ' + date.getHours()+':'+date.getMinutes()+':'+date.getSeconds());
  });         
  $('.new-game').click(function() {
    var scrollPos = $(window).scrollTop();
    $('[id^=popup-box-]').hide();
    $('#blackout').hide();
    $("html,body").css("overflow", "auto");
    $('html').scrollTop(scrollPos);

    $('h2').text('Наименование игры: Новая игра');
    var date = new Date();
    $('h3').text('Время: ' + date.getHours()+':'+date.getMinutes()+':'+date.getSeconds());
  });

//Отправка данных на сервер
$.ajaxSetup(
  { async: true,
    timeout: 10000,
    type: "POST"
  }
);

var newGame = true;
//Обработка клика по кнопке "Сделать ход"
$('#gameGo').click(function() {
  if (newGame == true)
  {
    newGame = false;
    SendData = {
      "PosCell" : game.points
    };
  }
  else
  {
    SendData = {
   //   "PosCell" : game.points
    };
  }
  
  SendData = JSON.stringify(SendData);
  $.post("handler.php", SendData, WhatDo);
});
function WhatDo(ServerAnswer, RequestStatus) {
  var flipToPoints = JSON.parse(ServerAnswer);
  for (var x = 0; x < 20; x++)
  {
    for (var y = 0; y < 20; y++)
    {
      $('#game-grid')[0].rows[x].cells[y].style.background = "#cccccc";
    }
  }
  for (var x = 0; x < 20; x++)
  {
    for (var y = 0; y < 20; y++)
    {
      var color = flipToPoints[x][y].active;
      $('#game-grid')[0].rows[x].cells[y].style.background = (color == true) ? "#666" : "#cccccc";
    }
  } 
  console.log(flipToPoints);
  };
});


