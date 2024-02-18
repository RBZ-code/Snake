let box; // Déclaration de la variable box en dehors de la fonction onload
let game; // Déclaration de la variable game en dehors de la fonction onload

// Chargement des images
let shenronImg = new Image();
shenronImg.src = "images/teteDragon.jpg";

let dragonBallImg = new Image();
dragonBallImg.src = "images/ball4.png";

// Fonction pour vérifier si toutes les images sont chargées
let imagesLoaded = 0;
const totalImages = 2; // Nombre total d'images à charger

const checkImagesLoaded = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        // Toutes les images sont chargées, démarrer le jeu
        startGame();
    }
};

shenronImg.onload = checkImagesLoaded;
dragonBallImg.onload = checkImagesLoaded;

// Fonction pour démarrer le jeu
const startGame = () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    box = 25; // Assignation de la valeur de box

    let walls = [];
    let snake = [];
    snake[0] = { x: 10 * box, y: 10 * box };

    let food = {
        x: Math.floor(Math.random() * 15 + 1) * box,
        y: Math.floor(Math.random() * 15 + 1) * box,
    };

    let score = 0;

    let direction;

    let wallAdded = false;

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

        for (let i = 0; i < walls.length; i++) {
            ctx.fillStyle = "black";
            ctx.fillRect(walls[i].x, walls[i].y, box, box);
        }

        for (let i = 0; i < snake.length; i++) {
            if (i === 0) {
                ctx.drawImage(shenronImg, snake[i].x, snake[i].y, box, box);
            } else {
                ctx.fillStyle = "#8FBF59";
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
            }
            ctx.strokeStyle = "white";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        ctx.drawImage(dragonBallImg, food.x, food.y, box, box);

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
            generateFood();
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
            collision(newHead, snake) ||
            collisionWithWalls(newHead, walls)
        ) {
            clearInterval(game);
        }

        snake.unshift(newHead);

        ctx.fillStyle = "gold";
        ctx.font = "25px Arial";
        ctx.fillText(score, 1 * box, 2 * box);

        if (score > 0 && score % 5 === 0 && !wallAdded) {
            generateWall();
            wallAdded = true;
        }
        if (score % 5 !== 0) {
            wallAdded = false;
        }
    };

    let collision = (head, array) => {
        for (let g = 0; g < array.length; g++) {
            if (head.x === array[g].x && head.y === array[g].y) {
                return true;
            }
        }
        return false;
    };

    let collisionWithWalls = (head, walls) => {
        for (let i = 0; i < walls.length; i++) {
            if (head.x === walls[i].x && head.y === walls[i].y) {
                return true;
            }
        }
        return false;
    };

    let generateFood = () => {
        let foodX, foodY;
        let isFoodOnSnake = true;

        while (isFoodOnSnake) {
            foodX = Math.floor(Math.random() * 15 + 1) * box;
            foodY = Math.floor(Math.random() * 15 + 1) * box;

            isFoodOnSnake = false;
            for (let i = 0; i < snake.length; i++) {
                if (foodX === snake[i].x && foodY === snake[i].y) {
                    isFoodOnSnake = true;
                    break;
                }
            }
            for (let i = 0; i < walls.length; i++) {
                if (foodX === walls[i].x && foodY === walls[i].y) {
                    isFoodOnSnake = true;
                    break;
                }
            }
            if (foodX === snake[0].x && foodY === snake[0].y) {
                isFoodOnSnake = true;
            }
        }

        // Sélectionnez aléatoirement un nombre entre 1 et 7 pour choisir l'image de la nourriture
        let foodNumber = Math.floor(Math.random() * 7) + 1;
        let foodImg = new Image();
        foodImg.src = `images/ball${foodNumber}.png`;

        // Assignez l'image de la nourriture à l'objet food
        food = { x: foodX, y: foodY, img: foodImg };
    };
    let generateWall = () => {
        let wallX, wallY;
        let isWallOnSnake = true;

        while (isWallOnSnake) {
            wallX = Math.floor(Math.random() * 15 + 1) * box;
            wallY = Math.floor(Math.random() * 15 + 1) * box;

            isWallOnSnake = false;
            for (let i = 0; i < snake.length; i++) {
                if (wallX === snake[i].x && wallY === snake[i].y) {
                    isWallOnSnake = true;
                    break;
                }
            }
            if (wallX === food.x && wallY === food.y) {
                isWallOnSnake = true;
            }
        }
        walls.push({ x: wallX, y: wallY });
    };

    game = setInterval(draw, 100);

    function rejouer() {
        snake = [{ x: 10 * box, y: 10 * box }];
        food = {
            x: Math.floor(Math.random() * 15 + 1) * box,
            y: Math.floor(Math.random() * 15 + 1) * box,
        };
        score = 0;
        direction = undefined;
        walls = [];
        clearInterval(game);
        game = setInterval(draw, 100);
    }

    document.getElementById("rejouer").addEventListener("click", rejouer);
};
