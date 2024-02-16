const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let box = 25;

let snake = [];
snake[0] = { x: 15 * box, y: 15 * box };

let food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box,
};

let score = 0;

let direction;

let update = (event) => {
    let key = event.keyCode;
    if (key == 37 && direction != "right") {
        direction = "left";
    } else if (key == 38 && direction != "down") {
        direction = "up";
    } else if (key == 39 && direction != "left") {
        direction = "right";
    } else if (key == 40 && direction != "up") {
        direction = "down";
    }
};

document.addEventListener("keydown", update);

let draw = () => {
    ctx.clearRect(0, 0, 500, 500);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "blue";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "white";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "right") {
        snakeX += box;
    } else if (direction === "left") {
        snakeX -= box;
    } else if (direction === "up") {
        snakeY -= box;
    } else if (direction === "down") {
        snakeY += box;
    }

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    };
    if (
        snakeX < 0 ||
        snakeX >= 20 * box ||
        snakeY < 0 ||
        snakeY >= 20 * box ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
    }

    snake.unshift(newHead);
    ctx.fillStyle = "gold" ;
    ctx.font = "25px Arial";
    ctx.fillText(score, 1 * box, 2 * box);
    

};

let collision = (head, array) => {
    for (let g = 0; g < array.length; g++) {
        if (head.x === array[g].x && head.y === array[g].y) {
            return true;
        }
    }
    return false;
};

let game = setInterval(draw, 100);
