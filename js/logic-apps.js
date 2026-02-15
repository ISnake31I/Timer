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
    // ЗАКРЫТИЕ (Reverse iOS Style — ФИКС СХЛОПЫВАНИЯ В ИКОНКУ)
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const snakeBtn = document.getElementById('snakeGameBtn');
            const gameContainer = document.getElementById('gameOverlay');

            // 1. Снова вычисляем координаты иконки (на всякий случай)
            const rect = snakeBtn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // 2. ФИКС: Удерживаем точку схлопывания именно в иконке
            gameContainer.style.transformOrigin = `${centerX}px ${centerY}px`;

            // 3. Запускаем анимацию уменьшения
            gameContainer.classList.remove('active'); 
            
            // 4. Ждем завершения анимации (0.5 сек) и гасим блок
            setTimeout(() => {
                // Если за это время мы не нажали "Открыть" снова
                if (!gameContainer.classList.contains('active')) {
                    gameContainer.style.display = 'none';
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