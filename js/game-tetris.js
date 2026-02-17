// 1. Глобальные команды (чтобы их видел logic-apps.js)
window.initTetris = () => {
    const event = new CustomEvent('start-tetris-internal');
    document.dispatchEvent(event);
};

window.stopTetris = () => {
    const event = new CustomEvent('stop-tetris-internal');
    document.dispatchEvent(event);
};

// 2. Основная логика внутри изоляции
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetrisCanvas');
    const ctx = canvas.getContext('2d');
    const nextCanvas = document.getElementById('nextCanvas');
    const nctx = nextCanvas.getContext('2d');

    const ROWS = 20; const COLS = 10; const BLOCK_SIZE = 24;
    let board = [], currentPiece = null, nextPiece = null, gameLoop = null;
    let score = 0, lines = 0, currentSpeed = 500, dropCounter = 0, lastTime = 0;
    let isAnimating = false, gameOver = false;

    const COLORS = { I: '#620000', J: '#350060', L: '#500000', O: '#250045', S: '#600000', T: '#1a0035', Z: '#400000' };

    const PIECES = {
        'I': [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
        'J': [[0, 1, 0], [0, 1, 0], [1, 1, 0]],
        'L': [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
        'O': [[1, 1], [1, 1]],
        'S': [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
        'T': [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
        'Z': [[1, 1, 0], [0, 1, 1], [0, 0, 0]]
    };

    function cloneMatrix(m) { return m.map(row => [...row]); }
    function resetBoard() { board = Array.from({ length: ROWS }, () => Array(COLS).fill(0)); }

    function createPiece() {
        const types = 'IJLOSTZ';
        const type = types[Math.floor(Math.random() * types.length)];
        return { pos: { x: 3, y: 0 }, matrix: cloneMatrix(PIECES[type]), color: COLORS[type] };
    }

    function draw() {
        ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        for (let i = 0; i <= canvas.width; i += BLOCK_SIZE) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }

        drawMatrix(ctx, board, { x: 0, y: 0 }, true);
        if (currentPiece && !isAnimating && !gameOver) {
            let visualY = currentPiece.pos.y + (dropCounter / currentSpeed);
            if (collide(board, { ...currentPiece, pos: { x: currentPiece.pos.x, y: currentPiece.pos.y + 1 } })) {
                visualY = currentPiece.pos.y;
            }
            drawMatrix(ctx, currentPiece.matrix, { x: currentPiece.pos.x, y: visualY }, false, currentPiece.color);
        }
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#800000'; ctx.font = '18px Courier New'; ctx.textAlign = 'center';
            ctx.fillText('НАЧАТЬ ЗАНОВО', canvas.width / 2, canvas.height / 2 - 5);
            ctx.font = '12px Courier New'; ctx.fillText('W или ТАП', canvas.width / 2, canvas.height / 2 + 20);
        }
        if (nextPiece) drawNext();
    }

    function drawMatrix(context, m, offset, isBoard, color) {
        m.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    context.fillStyle = (value === 'flash') ? 'rgba(180, 0, 0, 0.9)' : (isBoard ? value : color);
                    context.fillRect((x + offset.x) * BLOCK_SIZE + 1, (y + offset.y) * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
                }
            });
        });
    }

    function drawNext() {
        nctx.fillStyle = '#000'; nctx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
        if (!nextPiece) return;
        const size = nextPiece.matrix.length;
        drawMatrix(nctx, nextPiece.matrix, { x: (size === 4 ? 0 : 0.5), y: 0.5 }, false, nextPiece.color);
    }

    async function playerDrop() {
        if (isAnimating || gameOver || !currentPiece) return;
        currentPiece.pos.y++;
        if (collide(board, currentPiece)) {
            currentPiece.pos.y--; merge(board, currentPiece);
            await arenaSweep(); playerReset();
        }
        dropCounter = 0;
    }

    function playerReset() {
        currentPiece = nextPiece || createPiece();
        nextPiece = createPiece();
        if (collide(board, currentPiece)) { gameOver = true; }
    }

    async function arenaSweep() {
        if (isAnimating) return;
        isAnimating = true;

        let comboFound = true;
        while (comboFound) {
            let rowsToClear = [];
            for (let y = ROWS - 1; y >= 0; --y) {
                if (board[y].every(value => value !== 0 && value !== 'flash')) {
                    rowsToClear.push(y);
                }
            }

            if (rowsToClear.length === 0) {
                comboFound = false;
                break;
            }

            // 1. НЕОНОВАЯ ВСПЫШКА
            for (let i = 0; i < 2; i++) {
                rowsToClear.forEach(y => board[y].fill('flash'));
                draw(); await new Promise(r => setTimeout(r, 80));
                rowsToClear.forEach(y => board[y].fill(0));
                draw(); await new Promise(r => setTimeout(r, 80));
            }

            // ТОЧКА ПРОБУЖДЕНИЯ (Нижняя граница взрыва)
            let awakeningLine = Math.max(...rowsToClear);
            
            // Метим тех, кто ВЫШЕ взрыва, как "живых" (сохраняя их родной цвет)
            for (let y = 0; y < awakeningLine; y++) {
                for (let x = 0; x < COLS; x++) {
                    if (board[y][x] !== 0 && typeof board[y][x] === 'string') {
                        board[y][x] = { color: board[y][x], awake: true };
                    }
                }
            }

            score += rowsToClear.length * 50; lines += rowsToClear.length;
            updateScore();

            // 2. МЕДЛЕННОЕ АТОМАРНОЕ ПАДЕНИЕ (БЕЗ ГРАНИЦ)
            let moving = true;
            while (moving) {
                moving = false;
                for (let y = ROWS - 2; y >= 0; y--) {
                    for (let x = 0; x < COLS; x++) {
                        if (board[y][x] !== 0 && board[y + 1][x] === 0) {
                            if (board[y][x].awake || y < awakeningLine) {
                                let particle = board[y][x].awake ? board[y][x] : { color: board[y][x], awake: true };
                                board[y + 1][x] = particle;
                                board[y][x] = 0;
                                moving = true;
                            }
                        }
                    }
                }
                if (moving) {
                    draw(); 
                    // ВОТ ТУТ ЗАМЕДЛЕНИЕ: 90мс вместо 40мс. Теперь падение "кинематографичное"
                    await new Promise(r => setTimeout(r, 90)); 
                }
            }
            
            // Сброс меток перед новым кругом комбо
            for (let y = 0; y < ROWS; y++) {
                for (let x = 0; x < COLS; x++) {
                    if (board[y][x].awake) board[y][x] = board[y][x].color;
                }
            }
        }
        isAnimating = false;
    }

    // Отрисовка (Фикс цветов)
    function drawMatrix(context, m, offset, isBoard, color) {
        m.forEach((row, y) => { row.forEach((value, x) => {
            if (value !== 0) {
                let targetColor = value.color ? value.color : (value === 'flash' ? 'rgba(180,0,0,0.9)' : (isBoard ? value : color));
                context.fillStyle = targetColor;
                context.fillRect((x + offset.x) * BLOCK_SIZE + 1, (y + offset.y) * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            }
        });});
    }

    function collide(board, piece) {
        const [m, o] = [piece.matrix, piece.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 && (board[Math.floor(y + o.y)] && board[Math.floor(y + o.y)][x + o.x]) !== 0) return true;
            }
        }
        return false;
    }

    function merge(board, piece) {
        piece.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) board[y + Math.floor(piece.pos.y)][x + piece.pos.x] = piece.color;
            });
        });
    }

    function updateScore() {
        const s = document.getElementById('tetrisScore');
        const l = document.getElementById('tetrisLines');
        if (s) s.innerText = `Очки: ${score}`;
        if (l) l.innerText = `Линии: ${lines}`;
    }

    function update(time = 0) {
        if (gameOver) { draw(); return; }
        const deltaTime = time - lastTime; lastTime = time;
        dropCounter += deltaTime;
        if (dropCounter > currentSpeed && !isAnimating) playerDrop();
        draw(); gameLoop = requestAnimationFrame(update);
    }

    function rotate(matrix) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
        matrix.forEach(row => row.reverse());
    }

    document.addEventListener('keydown', e => {
        if (gameOver) { if (e.keyCode === 38 || e.keyCode === 87) internalStart(); return; }
        if (isAnimating || !currentPiece) return;
        if (e.keyCode === 37 || e.keyCode === 65) { currentPiece.pos.x--; if (collide(board, currentPiece)) currentPiece.pos.x++; }
        if (e.keyCode === 39 || e.keyCode === 68) { currentPiece.pos.x++; if (collide(board, currentPiece)) currentPiece.pos.x--; }
        if (e.keyCode === 40 || e.keyCode === 83) playerDrop();
        if (e.keyCode === 38 || e.keyCode === 87) {
            rotate(currentPiece.matrix);
            if (collide(board, currentPiece)) { rotate(currentPiece.matrix); rotate(currentPiece.matrix); rotate(currentPiece.matrix); }
        }
    });

    canvas.addEventListener('touchstart', e => { if (gameOver) internalStart(); });

    function internalStart() {
        if (gameLoop) cancelAnimationFrame(gameLoop);
        resetBoard(); score = 0; lines = 0; currentSpeed = 500; gameOver = false;
        updateScore(); nextPiece = createPiece(); playerReset();
        lastTime = performance.now(); update();
    }

    document.addEventListener('start-tetris-internal', internalStart);
    document.addEventListener('stop-tetris-internal', () => { if (gameLoop) cancelAnimationFrame(gameLoop); });
});
