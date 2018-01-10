<?
  // Инициализация сессии
  session_start(); 
  if (!isset($_SESSION['Rows'])) $_SESSION['Rows']=3;
  if (!isset($_SESSION['Cols'])) $_SESSION['Cols']=3;

  $RowNew = $_SESSION['Rows'];
  $ColNew = $_SESSION['Cols'];

  // Прочитаем полученные входные данные
  $data = json_decode(file_get_contents('php://input'), true);

  // Выполним действия с соответствии с полученными входными данными
  switch ($data["Command"]) 
  {
    case "IncRows":
         $RowNew += 1;
         break;
    case "DecRows":
         $RowNew -= 1;
         break;
    case "IncCols":
         $ColNew += 1;
         break;
    case "DecCols":
         $ColNew -= 1;
         break;
  };

  // Ограничим диапазон изменения строк и столбцов
  if ($RowNew > 20) $RowNew = 20;
  if ($RowNew < 2)  $RowNew = 2;
  if ($ColNew > 40) $ColNew = 40;
  if ($ColNew < 2)  $ColNew = 2;

  // Новые значения строк и столбцов запомним в сессии
  $_SESSION['Rows'] = $RowNew;
  $_SESSION['Cols'] = $ColNew;

  // Формируем ответ клиенту
  $answer = "<table bgcolor=\"#00ffff\" border=\"1\" bordercolor=\"#000000\" cellspacing=\"0\">";
  for ($row=1; $row <= $RowNew; $row++) 
  {
    $answer .= "<tr>";
    for ($col=1; $col <= $ColNew; $col++) 
    {
      $answer .= "<td>Х</td>";
    };
    $answer .= "</tr>";
  };
  $answer .= "</table>";

  // Сформированный ответ посылаем клиенту
  echo $answer;

?>