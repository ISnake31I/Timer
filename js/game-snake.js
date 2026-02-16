document.addEventListener('DOMContentLoaded', () => {
    const snakeBtn = document.getElementById('snakeGameBtn');
    const overlay = document.getElementById('gameOverlay');
    const closeBtn = document.getElementById('closeGameBtn');
    const canvas = document.getElementById("snakeCanvas");
    const ctx = canvas.getContext("2d");

    let box = 20;
    let moveStep = 5;
    let snake, food, score, d, gameLoop;
    let inputQueue = [];
    let currentDifficulty = 'EASY';
    let obstacles = [];
    let currentSpeed = 50;

    const diffSettings = {
        'EASY': { speed: 50, wallDeath: false, accelerate: false, obsCount: 0 },
        'MEDIUM': { speed: 45, wallDeath: true, accelerate: false, obsCount: 0 },
        'HARD': { speed: 40, wallDeath: true, accelerate: true, obsCount: 0 },
        'ULTRA': { speed: 35, wallDeath: true, accelerate: true, obsCount: 5 }
    };

    function initGame(diff = 'EASY') {
        currentDifficulty = diff;
        const settings = diffSettings[diff];
        currentSpeed = settings.speed;

        snake = [];
        for (let i = 4; i >= 0; i--) snake.push({ x: 200 + (i * moveStep), y: 200 });

        score = 0; d = null; inputQueue = []; obstacles = [];
        if (settings.obsCount > 0) generateWideLabyrinth(settings.obsCount);

        food = createFood();
        updateUI();

        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(draw, currentSpeed);
    }

    function generateWideLabyrinth(count) {
        obstacles = [];
        for (let i = 0; i < count; i++) {
            let startX = (Math.floor(Math.random() * 7) * 2 + 2) * box;
            let startY = (Math.floor(Math.random() * 7) * 2 + 2) * box;
            let isVert = Math.random() > 0.5;
            let len = Math.floor(Math.random() * 7) + 4; // 4-10 блоков

            for (let j = 0; j < len; j++) {
                let obsX = isVert ? startX : startX + (j * box);
                let obsY = isVert ? startY + (j * box) : startY;
                if (obsX >= 20 && obsX <= 360 && obsY >= 20 && obsY <= 360) {
                    if (Math.abs(obsX - 200) > 60 || Math.abs(obsY - 200) > 60) {
                        obstacles.push({ x: obsX, y: obsY });
                    }
                }
            }
        }
    }

    function createFood() {
        let f;
        while (true) {
            f = {
                x: Math.floor(Math.random() * 18 + 1) * box,
                y: Math.floor(Math.random() * 18 + 1) * box
            };
            let onSnake = snake.some(p => Math.abs(p.x - f.x) < 15 && Math.abs(p.y - f.y) < 15);
            let onObs = obstacles.some(o => o.x === f.x && o.y === f.y);
            if (!onSnake && !onObs) break;
        }
        return f;
    }

    function updateUI() {
        document.getElementById('currentScore').innerText = `Очки: ${score} | [${currentDifficulty}]`;
        document.getElementById('highScore').innerText = "Record: " + (localStorage.getItem(`snakeRec_${currentDifficulty}`) || 0);
    }

    function draw() {
        if (snake[0].x % box === 0 && snake[0].y % box === 0) {
            if (inputQueue.length > 0) d = inputQueue.shift();
        }

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // ОТРИСОВКА СЕТКИ (Фикс для iPhone)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.075)"; // Очень тонкий белый (5% прозрачности)
        // ИЛИ если хочешь в цвет проекта:
        // ctx.strokeStyle = "rgba(75, 0, 130, 0.15)"; // Тонкий фиолетовый
        ctx.lineWidth = 0.5; // Сделаем линию тоньше, но заметнее за счет цвета
        for (let i = 0; i <= canvas.width; i += box) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        ctx.fillStyle = "#222";
        obstacles.forEach(o => ctx.fillRect(o.x + 1, o.y + 1, box - 2, box - 2));

        snake.forEach((p, i) => {
            if (i === 0) ctx.fillStyle = "#800000";
            else {
                let ratio = i / snake.length;
                ctx.fillStyle = `rgb(${Math.max(25, 90 - (ratio * 60))}, 0, 0)`;
            }
            ctx.fillRect(p.x + 1, p.y + 1, box - 2, box - 2);
        });

        ctx.fillStyle = "#4B0082";
        ctx.fillRect(food.x + 1, food.y + 1, box - 2, box - 2);

        if (!d) return;

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (d == "LEFT") snakeX -= moveStep;
        if (d == "UP") snakeY -= moveStep;
        if (d == "RIGHT") snakeX += moveStep;
        if (d == "DOWN") snakeY += moveStep;

        const settings = diffSettings[currentDifficulty];

        if (!settings.wallDeath) {
            if (snakeX < 0) snakeX = canvas.width - moveStep;
            else if (snakeX >= canvas.width) snakeX = 0;
            if (snakeY < 0) snakeY = canvas.height - moveStep;
            else if (snakeY >= canvas.height) snakeY = 0;
        }

        let newHead = { x: snakeX, y: snakeY };

        const hitWall = settings.wallDeath && (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height);
        const hitSelf = snake.some((p, idx) => idx > 12 && p.x === newHead.x && p.y === newHead.y);
        const hitObs = obstacles.some(o => Math.abs(o.x - snakeX) < 16 && Math.abs(o.y - snakeY) < 16);

        if (hitWall || hitSelf || hitObs) {
            clearInterval(gameLoop);
            setTimeout(() => { initGame(currentDifficulty); }, 1200);
            return;
        }

        if (Math.abs(snakeX - food.x) < 8 && Math.abs(snakeY - food.y) < 8) {
            score++;
            if (settings.accelerate && score % 10 === 0) {
                currentSpeed = Math.max(20, currentSpeed - 5);
                clearInterval(gameLoop);
                gameLoop = setInterval(draw, currentSpeed);
            }
            updateUI();
            let recKey = `snakeRec_${currentDifficulty}`;
            if (score > (localStorage.getItem(recKey) || 0)) localStorage.setItem(recKey, score);
            food = createFood();
            for (let j = 0; j < 4; j++) snake.push({ ...snake[snake.length - 1] });
        } else {
            snake.pop();
        }
        snake.unshift(newHead);
    }

    // --- ЛОГИКА ОТКРЫТИЯ (СХЛОПЫВАНИЕ) ---
    if (snakeBtn) {
        snakeBtn.addEventListener('click', () => {
            const rect = snakeBtn.getBoundingClientRect();
            overlay.style.transformOrigin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
            overlay.style.display = 'flex';
            setTimeout(() => { overlay.classList.add('active'); initGame('EASY'); }, 10);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
            setTimeout(() => { overlay.style.display = 'none'; clearInterval(gameLoop); }, 400);
        });
    }

    // --- УПРАВЛЕНИЕ ---
    function handleInput(m) {
        const last = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : d;
        if ((m == "LEFT" && last != "RIGHT" && last != "LEFT") ||
            (m == "UP" && last != "DOWN" && last != "UP") ||
            (m == "RIGHT" && last != "LEFT" && last != "RIGHT") ||
            (m == "DOWN" && last != "UP" && last != "DOWN")) {
            inputQueue.push(m);
        }
    }

    document.addEventListener("keydown", e => {
        const k = e.keyCode;
        let m = null;
        if (k == 37 || k == 65) m = "LEFT";
        if (k == 38 || k == 87) m = "UP";
        if (k == 39 || k == 68) m = "RIGHT";
        if (k == 40 || k == 83) m = "DOWN";
        if (m) handleInput(m);
    });

    let tsX, tsY;
    canvas.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; tsY = e.touches[0].clientY; }, { passive: true });
    canvas.addEventListener('touchmove', e => {
        if (!tsX || !tsY) return;
        let xD = tsX - e.touches[0].clientX;
        let yD = tsY - e.touches[0].clientY;
        if (Math.abs(xD) > 20 || Math.abs(yD) > 20) {
            let m = Math.abs(xD) > Math.abs(yD) ? (xD > 0 ? "LEFT" : "RIGHT") : (yD > 0 ? "UP" : "DOWN");
            handleInput(m);
            tsX = e.touches[0].clientX; tsY = e.touches[0].clientY;
        }
        if (e.cancelable) e.preventDefault();
    }, { passive: false });

    window.setDifficulty = (level) => initGame(level);
});