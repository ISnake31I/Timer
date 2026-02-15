document.addEventListener('DOMContentLoaded', () => {
    const snakeBtn = document.getElementById('snakeGameBtn');
    const overlay = document.getElementById('gameOverlay');
    const closeBtn = document.getElementById('closeGameBtn');
    const canvas = document.getElementById("snakeCanvas");
    const ctx = canvas.getContext("2d");

    let box = 20;
    let snake, food, score, d, gameLoop;
    let inputQueue = []; // 1. НАША ОЧЕРЕДЬ КЛИКОВ

    function initGame() {
        let savedRecord = localStorage.getItem('snakeRecord') || 0;
        document.getElementById('highScore').innerText = "Рекорд: " + savedRecord;
        document.getElementById('currentScore').innerText = "Очки: 0";
        document.getElementById('currentScore').style.color = "#800000";

        snake = [{ x: 9 * box, y: 10 * box }];
        food = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        };
        score = 0;
        d = null;
        inputQueue = []; // СБРОС ОЧЕРЕДИ
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(draw, 150); 
    }

    if (snakeBtn) {
        snakeBtn.addEventListener('click', () => {
            overlay.style.display = 'flex';
            initGame();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
            clearInterval(gameLoop);
        });
    }

    // --- 2. УПРАВЛЕНИЕ (СТРЕЛКИ + WASD + ОЧЕРЕДЬ) ---
    document.addEventListener("keydown", event => {
        const key = event.keyCode;
        let nextMove = null;

        // Определяем нажатую клавишу
        if (key == 37 || key == 65) nextMove = "LEFT";      // ArrowLeft или A
        else if (key == 38 || key == 87) nextMove = "UP";   // ArrowUp или W
        else if (key == 39 || key == 68) nextMove = "RIGHT";// ArrowRight или D
        else if (key == 40 || key == 83) nextMove = "DOWN"; // ArrowDown или S

        if (nextMove) {
            // Берем последнее направление из очереди, если она не пустая, иначе текущее d
            const lastDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : d;
            
            // Защита от разворота на 180 (чтобы не съесть себя случайно)
            if (nextMove == "LEFT" && lastDir != "RIGHT" && lastDir != "LEFT") inputQueue.push(nextMove);
            else if (nextMove == "UP" && lastDir != "DOWN" && lastDir != "UP") inputQueue.push(nextMove);
            else if (nextMove == "RIGHT" && lastDir != "LEFT" && lastDir != "RIGHT") inputQueue.push(nextMove);
            else if (nextMove == "DOWN" && lastDir != "UP" && lastDir != "DOWN") inputQueue.push(nextMove);
        }
    });

    let touchstartX = 0, touchstartY = 0;
    canvas.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    }, false);

    canvas.addEventListener('touchend', e => {
        let xDiff = e.changedTouches[0].screenX - touchstartX;
        let yDiff = e.changedTouches[0].screenY - touchstartY;
        
        let swipeMove = null;
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) swipeMove = "RIGHT";
            else swipeMove = "LEFT";
        } else {
            if (yDiff > 0) swipeMove = "DOWN";
            else swipeMove = "UP";
        }

        if (swipeMove) {
            const lastDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : d;
            if (swipeMove == "LEFT" && lastDir != "RIGHT" && lastDir != "LEFT") inputQueue.push(swipeMove);
            else if (swipeMove == "UP" && lastDir != "DOWN" && lastDir != "UP") inputQueue.push(swipeMove);
            else if (swipeMove == "RIGHT" && lastDir != "LEFT" && lastDir != "RIGHT") inputQueue.push(swipeMove);
            else if (swipeMove == "DOWN" && lastDir != "UP" && lastDir != "DOWN") inputQueue.push(swipeMove);
        }
    }, false);

    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x == array[i].x && head.y == array[i].y) return true;
        }
        return false;
    }

    function draw() {
        // --- 3. ПРИМЕНЯЕМ СЛЕДУЮЩИЙ ШАГ ИЗ ОЧЕРЕДИ ---
        if (inputQueue.length > 0) {
            d = inputQueue.shift();
        }

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i == 0) ? "#800000" : "#4a0404";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            ctx.strokeStyle = "#000";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        ctx.fillStyle = "#4B0082";
        ctx.fillRect(food.x, food.y, box, box);

        if (!d) return;

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (d == "LEFT") snakeX -= box;
        if (d == "UP") snakeY -= box;
        if (d == "RIGHT") snakeX += box;
        if (d == "DOWN") snakeY += box;

        let newHead = { x: snakeX, y: snakeY };

        if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
            clearInterval(gameLoop);
            document.getElementById('currentScore').innerText = "GAME OVER! (" + score + ")";
            document.getElementById('currentScore').style.color = "#ff0000";
            setTimeout(() => { initGame(); }, 1500);
            return;
        }

        if (snakeX == food.x && snakeY == food.y) {
            score++;
            document.getElementById('currentScore').innerText = "Очки: " + score;
            let currentRecord = localStorage.getItem('snakeRecord') || 0;
            if (score > currentRecord) {
                localStorage.setItem('snakeRecord', score);
                document.getElementById('highScore').innerText = "Рекорд: " + score;
            }
            food = {
                x: Math.floor(Math.random() * 19) * box,
                y: Math.floor(Math.random() * 19) * box
            };
        } else {
            snake.pop();
        }
        snake.unshift(newHead);
    }
});