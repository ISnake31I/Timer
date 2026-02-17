document.addEventListener('DOMContentLoaded', () => {
    // --- ГЛОБАЛЬНЫЕ ЭЛЕМЕНТЫ ---
    const snakeBtn = document.getElementById('snakeGameBtn');
    const snakeOverlay = document.getElementById('gameOverlay');
    const snakeClose = document.getElementById('closeGameBtn');

    const tetrisBtn = document.getElementById('tetrisGameBtn');
    const tetrisOverlay = document.getElementById('tetrisOverlay');
    const tetrisClose = document.getElementById('closeTetrisBtn');

    // Функция для iOS-эффекта открытия
    function openApp(btn, overlay, startFunc) {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        overlay.style.transformOrigin = `${centerX}px ${centerY}px`;
        overlay.style.display = 'flex';

        setTimeout(() => {
            overlay.classList.add('active');
            if (typeof startFunc === "function") startFunc();
        }, 10);
    }

    // Функция для iOS-эффекта закрытия
    function closeApp(overlay, stopFunc) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
            if (typeof stopFunc === "function") stopFunc();
        }, 500);
    }

    // --- ОБРАБОТЧИКИ ЗМЕЙКИ ---
    if (snakeBtn) snakeBtn.addEventListener('click', () => openApp(snakeBtn, snakeOverlay, window.initGame));
    if (snakeClose) snakeClose.addEventListener('click', () => closeApp(snakeOverlay, () => {
        if (typeof gameLoop !== 'undefined') clearInterval(gameLoop);
    }));

    // --- ОБРАБОТЧИКИ ТЕТРИСА ---
    if (tetrisBtn) tetrisBtn.addEventListener('click', () => openApp(tetrisBtn, tetrisOverlay, window.initTetris));
    if (tetrisClose) tetrisClose.addEventListener('click', () => closeApp(tetrisOverlay, window.stopTetris));
});

const tetrisClose = document.getElementById('closeTetrisBtn');
const tetrisOverlay = document.getElementById('tetrisOverlay');

if (tetrisClose) {
    tetrisClose.addEventListener('click', () => {
        // 1. Запускаем анимацию схлопывания (iOS Style)
        tetrisOverlay.classList.remove('active');

        // 2. Ждем 0.5 сек (пока идет анимация) и гасим движок
        setTimeout(() => {
            tetrisOverlay.style.display = 'none';
            // ВАЖНО: Останавливаем цикл Тетриса, чтобы не жрал ресурсы
            if (typeof window.stopTetris === "function") {
                window.stopTetris();
            }
        }, 500);
    });
}