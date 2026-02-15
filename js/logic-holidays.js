document.addEventListener('DOMContentLoaded', function () {
    const $body = document.body;

    function checkHolidayEngine() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        // 1. УДАЛЯЕМ ТОЛЬКО ТЕМЫ (не трогаем базу!)
        const holidayThemes = [
            'theme-valentines',
            'theme-kremen-day',
            'theme-birthday-her',
            'theme-diploma',
            'theme-march8',
            'theme-newyear'
        ];
        $body.classList.remove(...holidayThemes); // Удаляем только список выше

        // 2. ЛОГИКА ПРАЗДНИКОВ (оставляем как была)
        if (month === 2 && day === 14) {
            $body.classList.add('theme-valentines');
            startHearts();
        } else if (month === 2 && day === 23) {
            $body.classList.add('theme-kremen-day');
        } else if (month === 2 && day === 28) {
            $body.classList.add('theme-birthday-her');
        } else if (month === 3) {
            $body.classList.add('theme-diploma'); // Март - месяц Диплома 🎓
        }
    }

    // ВЫНОСИМ СЕРДЦА В ОТДЕЛЬНУЮ ФУНКЦИЮ (чтобы не плодить таймеры)
    let heartInterval = null;
    function startHearts() {
        if (heartInterval) return; // Если уже летят - не спамим
        const hearts = ['❤️', '💖', '❤️‍🔥'];
        heartInterval = setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 3 + 2 + 's';
            heart.style.opacity = Math.random() * 0.5 + 0.5;
            heart.style.fontSize = Math.random() * 20 + 15 + 'px';
            document.body.appendChild(heart);
            setTimeout(() => { heart.remove(); }, 5000);
        }, 400);
    }

    // ЗАПУСК ДВИГАТЕЛЯ (проверка каждую секунду)
    checkHolidayEngine();
    setInterval(checkHolidayEngine, 1000);
});