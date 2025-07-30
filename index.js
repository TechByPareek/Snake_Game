// Game constants and variables
let inputDir = { x: 0, y: 0 }; // initial direction
const foodSound = new Audio('./music/food.mp3');
const moveSound = new Audio('./music/move.mp3');
const gameOverSound = new Audio('./music/gameover.mp3');
const musicSound = new Audio('./music/music.mp3');
let speed = 7;
let score = 0;
let lastPaintTime = 0;
let isPaused = false;
let gameStarted = false;
let snakeArray = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

const board = document.getElementById("board");
const scoreBox = document.getElementById("scoreBox");

// Game loop
function main(ctime) {
    if (isPaused) return;
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

// Collision detection
function isCollide(snake) {
    // Hits itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // Hits wall
    return (
        snake[0].x >= 18 ||
        snake[0].x <= 0 ||
        snake[0].y >= 18 ||
        snake[0].y <= 0
    );
}

// Game engine
function gameEngine() {
    // 1. Collision
    // if (isCollide(snakeArray)) {
    //     gameOverSound.play();
    //     musicSound.pause();
    //     inputDir = { x: 0, y: 0 };
    //     alert("Game Over! Press any key to play again");
    //     snakeArray = [{ x: 13, y: 15 }];
    //     food = { x: 6, y: 7 };
    //     score = 0;
    //     scoreBox.innerHTML = "Score: " + score;
    //     gameStarted = false;
    //     musicSound.play();
    //     return;
    // }
    if (isCollide(snakeArray)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };

    // Show modal with score
    document.getElementById("finalScore").innerText = "Your Score: " + score;
    document.getElementById("gameOverModal").classList.remove("hidden");

    gameStarted = false;
    return;
}
const playAgainBtn = document.getElementById("playAgainBtn");
playAgainBtn.addEventListener("click", () => {
    // Reset everything
    snakeArray = [{ x: 13, y: 15 }];
    food = { x: 6, y: 7 };
    score = 0;
    scoreBox.innerHTML = "Score: 0";
    inputDir = { x: 0, y: 0 };
    document.getElementById("gameOverModal").classList.add("hidden");
    gameStarted = false;
    musicSound.play();
});

    // 2. Food eaten
    if (snakeArray[0].x === food.x && snakeArray[0].y === food.y) {
        foodSound.play();
        score++;
        scoreBox.innerHTML = "Score: " + score;
        snakeArray.unshift({
            x: snakeArray[0].x + inputDir.x,
            y: snakeArray[0].y + inputDir.y,
        });

        let a = 2, b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random()),
        };
    }

    // 3. Move snake
    for (let i = snakeArray.length - 2; i >= 0; i--) {
        snakeArray[i + 1] = { ...snakeArray[i] };
    }
    snakeArray[0].x += inputDir.x;
    snakeArray[0].y += inputDir.y;

    // 4. Render snake
    board.innerHTML = "";
    snakeArray.forEach((e, index) => {
        const snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? "head" : "snake");
        board.appendChild(snakeElement);
    });

    // 5. Render food
    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}

// Pause with spacebar
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        isPaused = !isPaused;
        if (isPaused) {
            musicSound.pause();
        } else {
            musicSound.play();
        }
    }
});

// Controls (arrow keys)
window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
    }

    if (!gameStarted && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        gameStarted = true;
        musicSound.play(); // start music on first move
    }
    moveSound.play(); // Keep sound
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y === 0) inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (inputDir.y === 0) inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (inputDir.x === 0) inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (inputDir.x === 0) inputDir = { x: 1, y: 0 };
            break;
    }
});


// Restart button
const restartBtn = document.getElementById("restartBtn");
if (restartBtn) {
    restartBtn.addEventListener("click", () => {
        location.reload();
    });
}

// Music toggle button
const toggleMusic = document.getElementById("toggleMusic");
let musicPlaying = false;
if (toggleMusic) {
    toggleMusic.addEventListener("click", () => {
        const icon = toggleMusic.querySelector("i");
        if (musicPlaying) {
            musicSound.pause();
            if (icon) icon.className = "fa fa-volume-mute";
        } else {
            musicSound.loop = true;
            musicSound.play();
            if (icon) icon.className = "fa fa-volume-up";
        }
        musicPlaying = !musicPlaying;
    });
}

// Start game
window.requestAnimationFrame(main);
