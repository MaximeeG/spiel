 document.addEventListener("DOMContentLoaded", () => {
    const landingPage = document.getElementById('landingPage');
    const gamePage = document.getElementById('gamePage');
    const startButton = document.getElementById('startButton');
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    const livesContainer = document.getElementById('lives');
    const scoreElement = document.getElementById('score');
    
    let playerLeft = 135;
    let obstacles = [];
    let lovers = [];
    let gameInterval, obstacleInterval, loverInterval;
    let speed = 2;
    let speedIncreaseInterval = 2000;
    const playerSpeed = 20;
    let lives = 3;
    let score = 0;

    // ✅ Debugging: Ensure elements exist
    console.log("Landing Page:", landingPage);
    console.log("Game Page:", gamePage);
    console.log("Start Button:", startButton);

    startButton.addEventListener('click', () => {
        console.log('Button clicked!');

        // Hide landing page
        landingPage.classList.add('hidden');
        landingPage.style.display = "none"; // 🔥 Ensure it's hidden

        // Show game page
        gamePage.classList.remove('hidden');
        gamePage.style.display = "block"; // 🔥 Force visibility

        console.log("Game page display after click:", getComputedStyle(gamePage).display);

        startGame(); // Start the game
    });

    document.addEventListener('keydown', movePlayer);

    function movePlayer(event) {
        if (event.key === 'ArrowLeft' && playerLeft > 0) {
            playerLeft -= playerSpeed;
        } else if (event.key === 'ArrowRight' && playerLeft < 270) {
            playerLeft += playerSpeed;
        }
        player.style.left = playerLeft + 'px';
    }

    function createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = Math.floor(Math.random() * 250) + 'px';
        gameArea.appendChild(obstacle);
        obstacles.push(obstacle);
    }

    function createLover() {
        const lover = document.createElement('div');
        lover.classList.add('lover');
        lover.style.left = Math.floor(Math.random() * 250) + 'px';
        gameArea.appendChild(lover);
        lovers.push(lover);
    }

    function moveObstacles() {
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];
            let obstacleTop = parseInt(obstacle.style.top) || 0;
            obstacleTop += speed;
            obstacle.style.top = obstacleTop + 'px';

            if (obstacleTop > gameArea.offsetHeight) { // eigentlich 500
                gameArea.removeChild(obstacle);
                obstacles.splice(i, 1);
                score++;
                scoreElement.textContent = `Score: ${score}`;
            }

            if (checkCollision(player, obstacle)) {
                loseLife();
                gameArea.removeChild(obstacle);
                obstacles.splice(i, 1);
            }
        }
    }

    function moveLovers() {
        for (let i = 0; i < lovers.length; i++) {
            const lover = lovers[i];
            let loverTop = parseInt(lover.style.top) || 0;
            loverTop += speed;
            lover.style.top = loverTop + 'px';

            if (loverTop > gameArea.offsetHeight) {
                gameArea.removeChild(lover);
                lovers.splice(i, 1);
            }

            if (checkCollision(player, lover)) {
                gainLife();
                gameArea.removeChild(lover);
                lovers.splice(i, 1);
            }
        }
    }

    function checkCollision(player, element) {
        const playerRect = player.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        return !(
            playerRect.top > elementRect.bottom ||
            playerRect.bottom < elementRect.top ||
            playerRect.left > elementRect.right ||
            playerRect.right < elementRect.left
        );
    }

    // Player loses a life when hit by an obstacle
    function loseLife() {
        lives--; // Reduce life count
        console.log(`Lives left: ${lives}`); // Debugging log

        const hearts = livesContainer.querySelectorAll('img');
        if (hearts[lives]) {
            hearts[lives].remove(); // Remove a heart icon
        }

        // If lives reach 0, stop the game and show Game Over screen
        if (lives <= 0) {
            console.log("Game Over triggered!");

            // Stop all game activity
            clearInterval(gameInterval);
            clearInterval(obstacleInterval);
            clearInterval(loverInterval);
            clearInterval(speedInterval);

            // Show Game Over message
            const gameOverScreen = document.getElementById('gameOverScreen');
            gameOverScreen.classList.remove('hidden');
            gameOverScreen.style.display = "block";

            // Display final score
            document.getElementById('finalScore').textContent = score;
        }
    }

// Restart the game when clicking the restart button
document.getElementById('restartButton').addEventListener('click', () => {
    location.reload(); // Reload the page to restart the game
});


    function gainLife() {
        lives++;
        const newHeart = document.createElement('img');
        newHeart.src = 'heart.png';
        newHeart.classList.add('life');
        newHeart.alt = 'Life';
        livesContainer.appendChild(newHeart);
    }

    function increaseSpeed() {
        speed += 0.5;
    }

    function startGame() {
        gameInterval = setInterval(() => {
            moveObstacles();
            moveLovers();
        }, 20);
        obstacleInterval = setInterval(createObstacle, 1000);
        loverInterval = setInterval(createLover, 5000);
        speedInterval = setInterval(increaseSpeed, speedIncreaseInterval);
    }

    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');

    if (leftButton && rightButton) {
        // Prevent zooming on double-tap
        leftButton.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent default touch behavior
            if (playerLeft > 0) {
                playerLeft -= playerSpeed;
                player.style.left = playerLeft + 'px';
            }
        });

        rightButton.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent default touch behavior
            if (playerLeft < 270) {
                playerLeft += playerSpeed;
                player.style.left = playerLeft + 'px';
            }
        });

        console.log("✅ Touchscreen buttons activated!");
    } else {
        console.error("❌ Touchscreen buttons not found! Check your HTML.");
    }

});
