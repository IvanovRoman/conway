var Game = function() {
  // Размер игрового поля
  var gridSize = null,
      // Коллекция точек для следующей итерации
      pointsToFlip = [];
   //   this.points = [];   //все this.points
   //   this.gameInitPoints = [];
      //Игровая ячейка
      var GamePoint = function(x, y) {
          this.x = x;
          this.y = y;
          this.active = false;
      };

      //Updates cells display in front-end
      this.updateDisplay = function() {
        for (var x = 0; x <= gridSize.width - 1; x++) {
          for (var y = 0; y <= gridSize.height - 1; y++) {
            var point = this.points[x][y];

            this.gridNode.rows[point.x].cells[point.y].style.background = (point.active) ? "#f00" : "#ccc";
            
            if (this.showNeighboursNum) {
              this.gridNode.rows[point.x].cells[point.y].innerHtml = point.neighbours();
            }
          }
        }
      };
      //Включить клетку
      this.enablePoint = function(x,y) {
        this.points[x][y].active = true;
        this.points[x][y].x = x;
        this.points[x][y].y = y;
      };
       //Отключить клетку
       this.disablePoint = function(x,y) {
        this.points[x][y].active = false;
      };
      //Включить множество точек
      this.enablePoints = function(points) {
        $.each(points, function(i, val) {
          game.enablePoint([val[0]][val[1]]);
        });
      };
      //Отключить множество точек
      this.disablePoints = function(points) {
        $.each(points, function(i, val) {
          game.disablePoint([val[0]][val[1]]);
        });
      };

      //Инициализация игры
      this.init = function(gridNode) {
        this.gridNode = gridNode;
        gridSize = {
          width: this.gridNode.rows.length,
          height: this.gridNode.rows[0].cells.length
        };
        //Очистить все клетки
        this.clear();
      };

      //Очистить все клекти (this.points)
      this.clear = function() {
        this.points = [];
        pointsToFlip = [];

        for (var x = 0; x < gridSize.width; x++) {
          this.points[x] = new Array(gridSize.height);
          for (var y = 0; y < gridSize.height; y++) {
            this.points[x][y] = new Game(x, y);
            this.points[x][y].active = false;
            this.points[x][y].x = x;
            this.points[x][y].y = y;
          }
        }
      }
}