document.addEventListener('DOMContentLoaded', () => {
    const snakeBtn = document.getElementById('snakeGameBtn');
    const overlay = document.getElementById('gameOverlay');
    const closeBtn = document.getElementById('closeGameBtn');
    const canvas = document.getElementById("snakeCanvas");
    const ctx = canvas.getContext("2d");

    let box = 20;
    let snake, food, score, d, gameLoop;
    let inputQueue = [];

    // --- 1. ЛОГИКА ОТКРЫТИЯ (ВЗЛЕТ ИЗ ИКОНКИ) ---
    if (snakeBtn) {
        snakeBtn.addEventListener('click', () => {
            const rect = snakeBtn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            overlay.style.transformOrigin = `${centerX}px ${centerY}px`;
            overlay.style.display = 'flex';

            setTimeout(() => {
                overlay.classList.add('active');
                initGame();
            }, 10);
        });
    }

    // --- 2. ЛОГИКА ЗАКРЫТИЯ (СХЛОПЫВАНИЕ В ИКОНКУ) ---
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            // Сначала запускаем анимацию уменьшения
            overlay.classList.remove('active');

            // Ждем 500мс (время анимации в CSS) и только потом гасим блок полностью
            setTimeout(() => {
                if (!overlay.classList.contains('active')) {
                    overlay.style.display = 'none';
                    clearInterval(gameLoop);
                }
            }, 500);
        });
    }

    // --- 3. БЛОКИРОВКА ДЕРГАНЬЯ ЭКРАНА (IPHONE) ---
    overlay.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    function createFood() {
        let newFood;
        while (true) {
            newFood = {
                x: Math.floor(Math.random() * (canvas.width / box)) * box,
                y: Math.floor(Math.random() * (canvas.height / box)) * box
            };
            let onSnake = snake.some(part => part.x === newFood.x && part.y === newFood.y);
            if (!onSnake) break;
        }
        return newFood;
    }

    function initGame() {
        let savedRecord = localStorage.getItem('snakeRecord') || 0;
        document.getElementById('highScore').innerText = "Рекорд: " + savedRecord;
        document.getElementById('currentScore').innerText = "Очки: 0";
        document.getElementById('currentScore').style.color = "#800000";

        snake = [{ x: 9 * box, y: 10 * box }];
        food = createFood();
        score = 0;
        d = null;
        inputQueue = [];
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(draw, 150);
    }

    // --- УПРАВЛЕНИЕ (КЛАВА + WASD) ---
    document.addEventListener("keydown", event => {
        const key = event.keyCode;
        let nextMove = null;
        if (key == 37 || key == 65) nextMove = "LEFT";
        else if (key == 38 || key == 87) nextMove = "UP";
        else if (key == 39 || key == 68) nextMove = "RIGHT";
        else if (key == 40 || key == 83) nextMove = "DOWN";

        if (nextMove) {
            const lastDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : d;
            if (nextMove == "LEFT" && lastDir != "RIGHT" && lastDir != "LEFT") inputQueue.push(nextMove);
            else if (nextMove == "UP" && lastDir != "DOWN" && lastDir != "UP") inputQueue.push(nextMove);
            else if (nextMove == "RIGHT" && lastDir != "LEFT" && lastDir != "RIGHT") inputQueue.push(nextMove);
            else if (nextMove == "DOWN" && lastDir != "UP" && lastDir != "DOWN") inputQueue.push(nextMove);
        }
    });

    // --- УПРАВЛЕНИЕ (СВАЙПЫ - МГНОВЕННЫЕ) ---
    let touchstartX = 0, touchstartY = 0;
    const threshold = 15;
    canvas.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    }, { passive: true });

    canvas.addEventListener('touchmove', e => {
        if (!touchstartX || !touchstartY) return;

        let xDiff = e.changedTouches[0].screenX - touchstartX;
        let yDiff = e.changedTouches[0].screenY - touchstartY;

        // ПОРОГ ЧУВСТВИТЕЛЬНОСТИ (20-30 - золотая середина)
        const threshold = 25;

        if (Math.abs(xDiff) > threshold || Math.abs(yDiff) > threshold) {
            let swipeMove = null;

            // Определяем доминирующее направление (что сильнее: влево/вправо или вверх/вниз)
            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                swipeMove = xDiff > 0 ? "RIGHT" : "LEFT";
            } else {
                swipeMove = yDiff > 0 ? "DOWN" : "UP";
            }

            if (swipeMove) {
                const lastDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : d;

                // Проверка на 180 градусов (чтобы не самоубиться)
                if ((swipeMove == "LEFT" && lastDir != "RIGHT" && lastDir != "LEFT") ||
                    (swipeMove == "UP" && lastDir != "DOWN" && lastDir != "UP") ||
                    (swipeMove == "RIGHT" && lastDir != "LEFT" && lastDir != "RIGHT") ||
                    (swipeMove == "DOWN" && lastDir != "UP" && lastDir != "DOWN")) {

                    inputQueue.push(swipeMove); // КЛАДЕМ В ТВОЮ ОЧЕРЕДЬ

                    // МАГИЯ Г-ОБРАЗНОГО СВАЙПА: сбрасываем точку старта на текущую
                    touchstartX = e.changedTouches[0].screenX;
                    touchstartY = e.changedTouches[0].screenY;
                }
            }
        }
        // УБИВАЕМ ДЕРГАНЬЕ ЭКРАНА SAFARI
        if (e.cancelable) e.preventDefault();
    }, { passive: false });

    function collision(head, array) {
        for (let i = 0; i < array.length; i++) if (head.x == array[i].x && head.y == array[i].y) return true;
        return false;
    }

    function draw() {
        if (inputQueue.length > 0) d = inputQueue.shift();

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            if (i === 0) {
                ctx.fillStyle = "#660000";
                ctx.shadowBlur = 5;
                ctx.shadowColor = "#ff0000";
            } else {
                let ratio = i / snake.length;
                let r = Math.floor(100 - (ratio * 60));
                ctx.fillStyle = `rgb(${r}, 0, 0)`;
                ctx.shadowBlur = 0;
            }
            ctx.fillRect(Math.round(snake[i].x), Math.round(snake[i].y), box, box);
            ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
            ctx.lineWidth = 1;
            ctx.strokeRect(Math.round(snake[i].x), Math.round(snake[i].y), box, box);
        }

        ctx.fillStyle = "#4B0082";
        ctx.fillRect(Math.round(food.x), Math.round(food.y), box, box);

        if (!d) return;

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (d == "LEFT") snakeX -= box;
        if (d == "UP") snakeY -= box;
        if (d == "RIGHT") snakeX += box;
        if (d == "DOWN") snakeY += box;

        let newHead = { x: snakeX, y: snakeY };

        if (Math.round(snakeX) === Math.round(food.x) && Math.round(snakeY) === Math.round(food.y)) {
            score++;
            document.getElementById('currentScore').innerText = "Очки: " + score;
            let currentRec = localStorage.getItem('snakeRecord') || 0;
            if (score > currentRec) {
                localStorage.setItem('snakeRecord', score);
                document.getElementById('highScore').innerText = "Рекорд: " + score;
            }
            food = createFood();
        } else {
            snake.pop();
        }

        if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
            clearInterval(gameLoop);
            document.getElementById('currentScore').innerText = "GAME OVER!";
            setTimeout(() => { initGame(); }, 1500);
            return;
        }

        snake.unshift(newHead);
    }
});