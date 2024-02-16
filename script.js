// Chargez votre image
let snakeHeadImg = new Image();
snakeHeadImg.src = 'images/snake.png'; // Remplacez 'chemin/vers/votre/image.png' par le chemin de votre image

// Assurez-vous que l'image est chargée avant de commencer à dessiner
snakeHeadImg.onload = () => {
    // Continuez avec le reste du code ici, à l'intérieur de la fonction onload
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    let box = 25;

    let walls = [];
    let snake = [];
    snake[0] = { x: 10 * box, y: 10 * box };

    let food = {
        x: Math.floor(Math.random() * 15 + 1) * box,
        y: Math.floor(Math.random() * 15 + 1) * box,
    };

    let score = 0;

    let direction;

    // Variable pour suivre si un mur a déjà été ajouté après le dernier multiple de 5
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
    
        // Ajouter un mur après chaque multiple de 10 seulement si aucun mur n'a été ajouté
        if (score > 0 && score % 10 === 0 && !wallAdded) {
            generateWall();
            wallAdded = true; // Marquer qu'un mur a été ajouté
        }
    
        // Réinitialiser wallAdded lorsque le score n'est pas un multiple de 5
        if (score % 5 !== 0) {
            wallAdded = false;
        }
    
        // Dessiner les murs
        for (let i = 0; i < walls.length; i++) {
            ctx.fillStyle = "black";
            ctx.fillRect(walls[i].x, walls[i].y, box, box);
        }
    
        // Dessiner le serpent
        for (let i = 0; i < snake.length; i++) {
            if (i === 0) {
                // Dessiner la tête du serpent en utilisant l'image chargée
                ctx.drawImage(snakeHeadImg, snake[i].x, snake[i].y, box, box);
            } else {
                ctx.fillStyle = "blue";
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
            }
            ctx.strokeStyle = "white";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }
    
        // Dessiner la nourriture
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    
        // Déplacer le serpent
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
    
        // Vérifier si le serpent a mangé la nourriture
        if (snakeX === food.x && snakeY === food.y) {
            score++;
            generateFood(); // Générer une nouvelle nourriture
        } else {
            snake.pop();
        }
    
        // Créer une nouvelle tête pour le serpent
        let newHead = {
            x: snakeX,
            y: snakeY,
        };
    
        // Vérifier les collisions avec les murs ou le serpent lui-même
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
    
        // Ajouter la nouvelle tête au serpent
        snake.unshift(newHead);
    
        // Afficher le score
        ctx.fillStyle = "gold";
        ctx.font = "25px Arial";
        ctx.fillText(score, 1 * box, 2 * box);
    
        // Ajouter un mur si nécessaire
        if (score > 0 && score % 10 === 0 && !wallAdded) {
            generateWall();
            wallAdded = true; // Marquer qu'un mur a été ajouté
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
            // Vérifier si la nourriture est sur une partie du corps du serpent
            for (let i = 0; i < snake.length; i++) {
                if (foodX === snake[i].x && foodY === snake[i].y) {
                    isFoodOnSnake = true;
                    break;
                }
            }
        }
    
        food = { x: foodX, y: foodY };
    };

   

    let generateWall = () => {
        let wallX, wallY;
        let isWallOnSnake = true;
    
        while (isWallOnSnake) {
            wallX = Math.floor(Math.random() * 15 + 1) * box;
            wallY = Math.floor(Math.random() * 15 + 1) * box;
    
            isWallOnSnake = false;
            // Vérifier si le mur est sur une partie du corps du serpent
            for (let i = 0; i < snake.length; i++) {
                if (wallX === snake[i].x && wallY === snake[i].y) {
                    isWallOnSnake = true;
                    break;
                }
            }
        }
    
        walls.push({ x: wallX, y: wallY });
    };

    let game = setInterval(draw, 100);
};
