document.addEventListener('DOMContentLoaded', function () {
    const $body = document.body;
    let effectInterval = null; // Один интервал для всех спецэффектов

    function checkHolidayEngine() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        const holidayThemes = ['theme-valentines', 'theme-kremen-day', 'theme-birthday-her', 'theme-diploma', 'theme-march8', 'theme-newyear'];
        $body.classList.remove(...holidayThemes);

        // 1. ДЕНЬ РОЖДЕНИЯ (28.02)
        if (month === 2 && day === 27) {
            $body.classList.add('theme-birthday-her');
            // Запускаем праздничный десант (Тортики, шарики, звезды)
            startFallingEffects(['🥳', '🎂', '🎁', '✨', '👑']);
        }
        // 2. 14 ФЕВРАЛЯ
        else if (month === 2 && day === 14) {
            $body.classList.add('theme-valentines');
            startFallingEffects(['❤️', '💖', '❤️‍🔥']);
        }
        // ОСТАЛЬНЫЕ ПРАЗДНИКИ (Просто темы)
        else if (month === 2 && day === 23) { $body.classList.add('theme-kremen-day'); stopEffects(); }
        else if (month === 3) { $body.classList.add('theme-diploma'); stopEffects(); }
        else { stopEffects(); }
    }

    function startFallingEffects(icons) {
        if (effectInterval) return;
        effectInterval = setInterval(() => {
            const item = document.createElement('div');
            item.classList.add('heart'); // Используем твой CSS класс для падающих штук
            item.innerHTML = icons[Math.floor(Math.random() * icons.length)];
            item.style.left = Math.random() * 100 + 'vw';
            item.style.animationDuration = Math.random() * 3 + 2 + 's';
            item.style.opacity = Math.random() * 0.7 + 0.3;
            item.style.fontSize = Math.random() * 20 + 20 + 'px';
            document.body.appendChild(item);
            setTimeout(() => { item.remove(); }, 5000);
        }, 450); // Чуть медленнее, чтобы не перегружать экран
    }

    function stopEffects() {
        if (effectInterval) {
            clearInterval(effectInterval);
            effectInterval = null;
        }
    }

    checkHolidayEngine();
    setInterval(checkHolidayEngine, 10000); // Раз в 10 сек хватит для проверки даты
});