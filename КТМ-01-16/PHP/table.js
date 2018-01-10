$.ajaxSetup(
  { async: true,
    timeout: 10000,
    type: "POST"
  }
);

// Будем перехватывать нажатия клавиш
addEventListener("keydown", EventHandler);

// Обработка нажатий клавиш
function EventHandler(oEvent) {
  var Command = "None";
  switch (oEvent.key) 
  {
    case "ArrowDown":
         Command = "DecRows";
         break;
    case "ArrowUp":
         Command = "IncRows";
         break;
    case "ArrowLeft":
         Command = "DecCols";
         break;
    case "ArrowRight":
         Command = "IncCols";
         break;
  };

  // Посылаем команду на сервер
  var SendData = {
                   "Command": Command
                 };
  SendData = JSON.stringify(SendData);
  $.post("handler.php", SendData, WhatDo);
};

// Обработка ответа от сервера
function WhatDo(ServerAnswer, RequestStatus) {
  $("#idTable").html(ServerAnswer);
};
