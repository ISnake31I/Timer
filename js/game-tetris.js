// 1. Глобальные команды
window.initTetris = () => {
    const event = new CustomEvent('start-tetris-internal');
    document.dispatchEvent(event);
};

window.stopTetris = () => {
    const event = new CustomEvent('stop-tetris-internal');
    document.dispatchEvent(event);
};

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetrisCanvas');
    const ctx = canvas.getContext('2d');
    const nextCanvas = document.getElementById('nextCanvas');
    const nctx = nextCanvas.getContext('2d');

    const ROWS = 20; const COLS = 10; const BLOCK_SIZE = 24;
    let board = [], currentPiece = null, nextPiece = null, gameLoop = null;
    let score = 0, lines = 0, currentSpeed = 500, dropCounter = 0, lastTime = 0;
    let isAnimating = false, gameOver = false;

    const COLORS = { I: '#700000', J: '#350060', L: '#500000', O: '#250045', S: '#600000', T: '#1a0035', Z: '#400000' };

    const PIECES = {
        'I': [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
        'J': [[0,1,0],[0,1,0],[1,1,0]],
        'L': [[0,1,0],[0,1,0],[0,1,1]],
        'O': [[1,1],[1,1]],
        'S': [[0,1,1],[1,1,0],[0,0,0]],
        'T': [[0,1,0],[1,1,1],[0,0,0]],
        'Z': [[1,1,0],[0,1,1],[0,0,0]]
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
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        for (let i = 0; i <= canvas.width; i += BLOCK_SIZE) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
        drawMatrix(ctx, board, { x: 0, y: 0 }, true);
        if (currentPiece && !isAnimating && !gameOver) {
            let visualY = currentPiece.pos.y + (dropCounter / currentSpeed);
            if (collide(board, { ...currentPiece, pos: { x: currentPiece.pos.x, y: currentPiece.pos.y + 1 } })) visualY = currentPiece.pos.y;
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
        m.forEach((row, y) => { row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = value.color ? value.color : (value === 'flash' ? 'rgba(180, 0, 0, 0.9)' : (isBoard ? value : color));
                context.fillRect((x + offset.x) * BLOCK_SIZE + 1, (y + offset.y) * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            }
        });});
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
        if (collide(board, currentPiece)) gameOver = true;
    }

    async function arenaSweep() {
        if (isAnimating) return;
        isAnimating = true;
        let combo = true;
        while (combo) {
            let rows = [];
            for (let y = ROWS - 1; y >= 0; --y) if (board[y].every(v => v !== 0 && v !== 'flash')) rows.push(y);
            if (rows.length === 0) { combo = false; break; }
            for (let i = 0; i < 2; i++) {
                rows.forEach(y => board[y].fill('flash')); draw(); await new Promise(r => setTimeout(r, 80));
                rows.forEach(y => board[y].fill(0)); draw(); await new Promise(r => setTimeout(r, 80));
            }
            let awkY = Math.max(...rows);
            for (let y = 0; y < awkY; y++) {
                for (let x = 0; x < COLS; x++) if (board[y][x] !== 0 && typeof board[y][x] === 'string') board[y][x] = { color: board[y][x], awake: true };
            }
            score += rows.length * 50; lines += rows.length; updateScore();
            let move = true;
            while (move) {
                move = false;
                for (let y = ROWS - 2; y >= 0; y--) {
                    for (let x = 0; x < COLS; x++) {
                        if (board[y][x] !== 0 && board[y + 1][x] === 0) {
                            if (board[y][x].awake || y < awkY) {
                                board[y + 1][x] = board[y][x].awake ? board[y][x] : { color: board[y][x], awake: true };
                                board[y][x] = 0; move = true;
                            }
                        }
                    }
                }
                if (move) { draw(); await new Promise(r => setTimeout(r, 90)); }
            }
            for (let y = 0; y < ROWS; y++) {
                for (let x = 0; x < COLS; x++) if (board[y][x].awake) board[y][x] = board[y][x].color;
            }
        }
        isAnimating = false;
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
            row.forEach((v, x) => { if (v !== 0) board[y + Math.floor(piece.pos.y)][x + piece.pos.x] = piece.color; });
        });
    }

    function updateScore() {
        document.getElementById('tetrisScore').innerText = `Score: ${score}`;
        document.getElementById('tetrisLines').innerText = `Lines: ${lines}`;
    }

    function rotate(m) {
        for (let y = 0; y < m.length; ++y) { for (let x = 0; x < y; ++x) [m[x][y], m[y][x]] = [m[y][x], m[x][y]]; }
        m.forEach(row => row.reverse());
    }

    function update(time = 0) {
        if (gameOver) { draw(); return; }
        const dt = time - lastTime; lastTime = time;
        dropCounter += dt;
        if (dropCounter > currentSpeed && !isAnimating) playerDrop();
        draw(); gameLoop = requestAnimationFrame(update);
    }

    // --- УПРАВЛЕНИЕ ---
    document.addEventListener('keydown', e => {
        if (gameOver) { if (e.keyCode === 38 || e.keyCode === 87) internalStart(); return; }
        if (isAnimating || !currentPiece) return;
        if (e.keyCode === 37 || e.keyCode === 65) { currentPiece.pos.x--; if(collide(board, currentPiece)) currentPiece.pos.x++; }
        if (e.keyCode === 39 || e.keyCode === 68) { currentPiece.pos.x++; if(collide(board, currentPiece)) currentPiece.pos.x--; }
        if (e.keyCode === 40 || e.keyCode === 83) playerDrop();
        if (e.keyCode === 38 || e.keyCode === 87) { 
            rotate(currentPiece.matrix);
            if(collide(board, currentPiece)) { rotate(currentPiece.matrix); rotate(currentPiece.matrix); rotate(currentPiece.matrix); }
        }
    });

    let tX = 0, tY = 0;
    canvas.addEventListener('touchstart', e => {
        if(gameOver) { internalStart(); return; }
        tX = e.touches[0].clientX; tY = e.touches[0].clientY;
        rotate(currentPiece.matrix); if(collide(board, currentPiece)) { rotate(currentPiece.matrix); rotate(currentPiece.matrix); rotate(currentPiece.matrix); }
    }, {passive: false});

    canvas.addEventListener('touchmove', e => {
        if (isAnimating || gameOver || !currentPiece) return;
        e.preventDefault();
        let dX = e.touches[0].clientX - tX, dY = e.touches[0].clientY - tY;
        if (Math.abs(dX) > 30) { currentPiece.pos.x += dX > 0 ? 1 : -1; if(collide(board, currentPiece)) currentPiece.pos.x -= dX > 0 ? 1 : -1; tX = e.touches[0].clientX; }
        else if (dY > 40) { playerDrop(); tY = e.touches[0].clientY; }
    }, {passive: false});

    function internalStart() {
        if(gameLoop) cancelAnimationFrame(gameLoop);
        resetBoard(); score = 0; lines = 0; currentSpeed = 500; gameOver = false;
        updateScore(); nextPiece = createPiece(); playerReset(); 
        lastTime = performance.now(); update();
    }

    document.addEventListener('start-tetris-internal', internalStart);
    document.addEventListener('stop-tetris-internal', () => { if(gameLoop) cancelAnimationFrame(gameLoop); });
});