const appMilestones = [
    { id: 'snakeGameBtn', date: '2026-02-17T00:00:00', msg: 'Привет! Создатель просил передать тебе игру на неделю :)' },
    { id: 'mathIcon', date: '2026-03-01T00:00:00', msg: 'А вот и новая тренировка для мозга от создателя! :)' }
];

function checkAppAccess() {
    const now = new Date().getTime();
    appMilestones.forEach(app => {
        const unlockTime = new Date(app.date).getTime();
        const element = document.getElementById(app.id);
        
        if (now >= unlockTime) {
            // element.classList.remove('hidden-app');
            // Тут можно менять текст приветствия в твоем статус-баре
            const statusText = document.getElementById('statusText');
            if (statusText) statusText.innerText = app.msg;
        } else {
            // element.classList.add('hidden-app');
        }
    });
}
setInterval(checkAppAccess, 1000); // Проверка каждую секунду
// Ждем, пока DOM загрузится
document.addEventListener('DOMContentLoaded', () => {
    
    // Клик по Змейке
    const snakeBtn = document.getElementById('snakeGameBtn');
    if (snakeBtn) {
        snakeBtn.addEventListener('click', () => {
            // Если иконка не скрыта (значит дата наступила)
            if (!snakeBtn.classList.contains('hidden-app')) {
                openSnakeGame(); // Эту функцию мы сейчас пропишем
            }
        });
    }
});

function openSnakeGame() {
    console.log("Запуск Змейки... 🐍");
    const gameContainer = document.getElementById('snakeGameContainer');
    if (gameContainer) {
        gameContainer.style.display = 'flex'; // Показываем окно с игрой
        // Здесь мы будем вызывать старт самой игры из твоего CodePen
    }
}