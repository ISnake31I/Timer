document.addEventListener('DOMContentLoaded', function () {
    const $body = document.body;
    let currentActiveTheme = null;

    function checkHolidayEngine() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        // 1. ОПРЕДЕЛЯЕМ ТЕМУ
        let themeToSet = null;
        if (month === 2 && day === 14) themeToSet = 'theme-valentines';
        else if (month === 2 && day === 28) themeToSet = 'theme-birthday-her';
        else if (month === 3) themeToSet = 'theme-diploma';

        // 2. ЕСЛИ ТЕМА ИЗМЕНИЛАСЬ — ОБНОВЛЯЕМ
        if (themeToSet !== currentActiveTheme) {
            // Очищаем старые
            $body.classList.remove('theme-valentines', 'theme-birthday-her', 'theme-kremen-day', 'theme-diploma');
            
            if (themeToSet) {
                $body.classList.add(themeToSet);
                // Запуск сердечек или смайликов
                if (themeToSet === 'theme-valentines') startFallingEffects(['❤️', '💖', '❤️‍🔥']);
                if (themeToSet === 'theme-birthday-her') startFallingEffects(['🥳', '🎂', '🎁', '✨', '👑']);
            }
            currentActiveTheme = themeToSet;
        }
    }

    let effectInterval = null;
    function startFallingEffects(icons) {
        if (effectInterval) clearInterval(effectInterval);
        effectInterval = setInterval(() => {
            if (!currentActiveTheme) return;
            const item = document.createElement('div');
            item.className = 'heart'; // Используем твой CSS класс
            item.innerHTML = icons[Math.floor(Math.random() * icons.length)];
            item.style.left = Math.random() * 100 + 'vw';
            item.style.animationDuration = Math.random() * 3 + 2 + 's';
            document.body.appendChild(item);
            setTimeout(() => item.remove(), 5000);
        }, 400);
    }

    checkHolidayEngine();
    setInterval(checkHolidayEngine, 5000); // Проверяем раз в 5 сек
});