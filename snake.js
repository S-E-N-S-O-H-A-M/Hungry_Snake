function init() {
    canvas = document.getElementById("mycanvas");
    W = H = canvas.width = canvas.height = 1000;
    pen = canvas.getContext('2d');
    cs = 67;
    game_over = false;
    score = 0;

    food_img = new Image();
    food_img.src = "Assets/apple.png";

    trophy_img = new Image();
    trophy_img.src = "Assets/trophy.png";

    eat_sound = new Audio();
    eat_sound.src = "Assets/eat.mp3";

    hit_sound = new Audio();
    hit_sound.src = "Assets/hit.mp3";

    food = getRandomFood();
    snake = {
        init_len: 5,
        color: "blue",
        cells: [],
        direction: "right",

        createSnake: function() {
            for (var i = this.init_len; i > 0; i--) {
                this.cells.push({ x: i, y: 0 });
            }
        },
        drawSnake: function() {
            for (var i = 0; i < this.cells.length; i++) {
                pen.fillStyle = this.color;
                pen.fillRect(this.cells[i].x * cs, this.cells[i].y * cs, cs - 2, cs - 2);
            }
        },
        updateSnake: function() {
            console.log("Updating Snake");
            var headX = this.cells[0].x;
            var headY = this.cells[0].y;
            if (headX == food.x && headY == food.y) {
                console.log("Food eaten");
                eat_sound.play();
                food = getRandomFood();
                score++;
            } else {
                this.cells.pop();
            }

            var nextX, nextY;
            if (this.direction == "right") {
                nextX = headX + 1;
                nextY = headY;
            } else if (this.direction == "left") {
                nextX = headX - 1;
                nextY = headY;
            } else if (this.direction == "up") {
                nextX = headX;
                nextY = headY - 1;
            } else {
                nextX = headX;
                nextY = headY + 1;
            }
            this.cells.unshift({ x: nextX, y: nextY });

            var last_x = Math.round(W / cs);
            var last_y = Math.round(H / cs);

            if (this.cells[0].x < 0 || this.cells[0].y < 0 || this.cells[0].x > (last_x - 1) || this.cells[0].y > (last_y - 1)) {
                hit_sound.play();
                game_over = true;
            }
        },
    };
    snake.createSnake();

    function KeyPressed(e) {
        if (e.key == "ArrowRight") {
            snake.direction = "right";
        } else if (e.key == "ArrowLeft") {
            snake.direction = "left";
        } else if (e.key == "ArrowDown") {
            snake.direction = "down";
        } else {
            snake.direction = "up";
        }
        console.log(snake.direction);
    }
    document.addEventListener("keydown", KeyPressed);
}

function draw() {
    pen.clearRect(0, 0, W, H);
    snake.drawSnake();
    food.drawFood();

    pen.drawImage(trophy_img, 18, 20, cs, cs);
    pen.fillStyle = "blue";
    pen.font = "20px Roboto";
    pen.fillText(score, 50, 50);
}

function update() {
    snake.updateSnake();
}

function getRandomFood() {
    var foodX = Math.round(Math.random() * (W - cs) / cs);
    var foodY = Math.round(Math.random() * (H - cs) / cs);
    var food = {
        x: foodX,
        y: foodY,
        color: "red",

        drawFood: function() {
            pen.fillStyle = this.color;
            pen.drawImage(food_img, this.x * cs, this.y * cs, cs, cs);
        }
    }
    return food;
}

function gameloop() {
    if (game_over == true) {
        clearInterval(f);
        alert("Game Over");
    }
    draw();
    update();
}

init();
var f = setInterval(gameloop, 100);
