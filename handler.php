<?
  // Инициализация сессии
  session_start(); 
  if (!isset($_SESSION['Data'])) $_SESSION['Data'] = array();
  if (!isset($_SESSION['width'])) $_SESSION['width'] = 0;
  if (!isset($_SESSION['height'])) $_SESSION['height'] = 0;

  $data = $_SESSION['Data'];

  $width = $_SESSION['width'];
  $height = $_SESSION['height'];
  $_SESSION['width'] = 20;
  $_SESSION['height'] = 20;  

  $data_point = array();
  // Прочитаем полученные входные данные
  $data_input = json_decode(file_get_contents('php://input'), true);
  if ($data_input != null)
  {
    $data = $data_input;
    foreach ($data as $key) {
      $data_point = array_merge($data_point, $key);
    }
  }
  else
  {
    $data_point = $data;
  }

  $data_point[0][0]["active"] = true;
  //Ширина и высота клеток
  $array_answer = array(); //Массив для ответа

  // Выполним действия с соответствии с полученными входными данными
  /*
  switch ($data["PosCell"]) 
  {
    case "IncRows":
         $RowNew += 1;
         break;
    default:
    break;
  };
  */
  $array_answer = FlipToPoints($data_point);

  function FlipToPoints($data_point)
  {
    $pointsToFlip = $data_point;
    $width = $_SESSION['width'];
    $height = $_SESSION['height'];
    // Цикл для всех точек
    for ($x = 0; $x < $width; $x++)
    {
      for ($y = 0; $y < $height; $y++)
      {
        $neibours = FindNeighbours($x, $y, $data_point);
        // Применение основных правил игры
        if ($pointsToFlip[$x][$y]["active"] && $neibours < 2) {
          $pointsToFlip[$x][$y]["active"] = false;
        }
        if ($pointsToFlip[$x][$y]["active"] && $neibours > 3)
        {
          $pointsToFlip[$x][$y]["active"] = false;
        }
        if (!$pointsToFlip[$x][$y]["active"] && $neibours == 3)
        {
          $pointsToFlip[$x][$y]["active"] = true;
        }
        if ($pointsToFlip[$x][$y]["active"] && ($neibours == 2  || $neibours == 3))
        {
          $pointsToFlip[$x][$y]["active"] = true;
        }
      }
    }
    return $pointsToFlip;
  }
  
  function FindNeighbours($x, $y, $data_point)
  {
    $neighbours = array();
    $width = $_SESSION['width'];
    $height = $_SESSION['height'];
    // Проверка границ и получение всех 8 ячеек около текущей ячейки
    // ABC
    // DXE
    // FGH
    if ($x >= 1) { //D
      $neighbours = array_merge($neighbours, array(array("x" => $x - 1, "y" => $y))); 
      if ($y <= $height - 2) { //A
        $neighbours = array_merge($neighbours, array(array("x" => $x - 1, "y" => $y + 1)));
      } 
      if ($y >= 1) { //F
        $neighbours = array_merge($neighbours, array(array("x" => $x - 1, "y" => $y - 1)));
      }
    }
    if ($x <= $width - 2) { //E
      $neighbours = array_merge($neighbours, array(array("x" => $x + 1, "y" => $y)));
      if (($x <= $width - 2) && ($y <= $height - 2)) //C
      { 
        $neighbours = array_merge($neighbours, array(array("x" => $x + 1, "y" => $y + 1)));
      }
      if (($x <= $width - 2) && ($y >= 1)) //H
      {
        $neighbours = array_merge($neighbours, array(array("x" => $x + 1, "y" => $y - 1)));
      }
    }
    if ($y >= 1) //G
    { 
      $neighbours = array_merge($neighbours, array(array("x" => $x, "y" => $y - 1)));
    }
    if ($y <= $height - 2) //B
    { 
      $neighbours = array_merge($neighbours, array(array("x" => $x, "y" => $y + 1)));
    }

    $count = 0;
    for ($i = 0; $i < count($neighbours); $i++)
    {
      $x = $neighbours[$i]["x"];
      $y = $neighbours[$i]["y"];
     $active_true = $data_point[$x][$y]["active"];

      if ($neighbours[$i] != null && $active_true)
      {
        $count++;
      }
    }
    return $count;
  }
  /*
  $x_data = array();
  $neighbours = array();
  $x = 3;
  $y = 4;

 //Для заполнения многомерного массива 
 $neighbours = array_merge($neighbours, array(array("x" => $x - 1, "y" => $y + 1)));
 $neighbours = array_merge($neighbours, array(array("x" => $x - 1, "y" => $y + 1)));
 $neighbours = array_merge($neighbours, array(array("x" => $x - 1, "y" => $y + 1)));

  for ($j = 0; $j < count($data["PosCell"]); $j++)
  {
    $x_data["Array"]["x"]["y"] = $data["PosCell"][$j]["x"]["y"];
    array_push($x_data, $data["PosCell"][$j]["x"], $data["PosCell"][$j]["y"]);
  }
*/

  // Новые значения строк и столбцов запомним в сессии
 // $_SESSION['Rows'] = $RowNew;
 // $_SESSION['Cols'] = $ColNew;

  // // Формируем ответ клиенту
  // $answer = "<table bgcolor=\"#00ffff\" border=\"1\" bordercolor=\"#000000\" cellspacing=\"0\">";
  // for ($row=1; $row <= $RowNew; $row++) 
  // {
  //   $answer .= "<tr>";
  //   for ($col=1; $col <= $ColNew; $col++) 
  //   {
  //     $answer .= "<td>Х</td>";
  //   };
  //   $answer .= "</tr>";
  // };
  // $answer .= "</table>";

  $answer = json_encode($array_answer);
  $_SESSION['Data'] = $array_answer;
  // Сформированный ответ посылаем клиенту
  echo $answer;
?>