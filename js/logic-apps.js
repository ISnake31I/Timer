// Ждем, пока DOM загрузится
document.addEventListener('DOMContentLoaded', () => {
    const snakeBtn = document.getElementById('snakeGameBtn');
    const gameContainer = document.getElementById('gameOverlay');
    const closeBtn = document.getElementById('closeGameBtn'); // Находим крестик

    // ОТКРЫТИЕ (iOS Style)
    if (snakeBtn) {
        snakeBtn.addEventListener('click', (e) => {
            if (!snakeBtn.classList.contains('hidden-app')) {
                const rect = snakeBtn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                gameContainer.style.transformOrigin = `${centerX}px ${centerY}px`;
                openSnakeGame();
            }
        });
    }

    // ЗАКРЫТИЕ (Reverse iOS Style — Фикс схлопывания)
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            // 1. УБИРАЕМ АКТИВНЫЙ КЛАСС (запускаем обратный scale(0))
            gameContainer.classList.remove('active');

            // ВАЖНО: Мы НЕ меняем display: none сразу, 
            // иначе анимация мгновенно исчезнет, не успев схлопнуться.

            // 2. ТАЙМЕР НА ПОЛНОЕ ИСЧЕЗНОВЕНИЕ (0.5 сек — как в CSS transition)
            setTimeout(() => {
                // Только когда окно уже стало точкой (scale 0), гасим его совсем
                if (!gameContainer.classList.contains('active')) {
                    gameContainer.style.display = 'none';
                    // Глушим игру
                    if (typeof gameLoop !== 'undefined') clearInterval(gameLoop);
                }
            }, 500);
        });
    }
});

function openSnakeGame() {
    console.log("PROJECT: ANGEL OS — Launching Snake... 🐍");
    const gameContainer = document.getElementById('gameOverlay');
    if (gameContainer) {
        gameContainer.style.display = 'flex';
        setTimeout(() => {
            gameContainer.classList.add('active');
        }, 10);

        if (typeof initGame === "function") initGame();
    }
}