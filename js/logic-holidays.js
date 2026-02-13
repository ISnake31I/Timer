document.addEventListener('DOMContentLoaded', function () {
    const now = new Date();
    const month = now.getMonth() + 1; // 1 - Январь, 2 - Февраль...
    const day = now.getDate();
    const $body = document.body;

    // Праздничные даты (Месяц, День)
    if (month === 2 && day === 14) {
    $body.classList.add('theme-valentines');

    const hearts = ['❤️', '💖', '❤️‍🔥']; // Это "Heart on Fire". Скопируй именно этот символ

    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        // РАНДОМНЫЙ ВЫБОР ИЗ МАССИВА
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 2 + 's';
        heart.style.opacity = Math.random() * 0.5 + 0.5; // Чтоб не были совсем прозрачными
        heart.style.fontSize = Math.random() * 20 + 15 + 'px';
        
        document.body.appendChild(heart);

        setTimeout(() => { heart.remove(); }, 5000);
    }, 400); // Чуть реже, чтоб не заспамить весь экран
}
    if (month === 2 && day === 23) $body.classList.add('theme-kremen-day'); // 23 фев
    if (month === 3 && day === 8)  $body.classList.add('theme-march8');     // 8 марта
    if (month === 12 && day === 31) $body.classList.add('theme-newyear');   // 31 дек
    if (month === 1 && day === 1)   $body.classList.add('theme-newyear');   // 1 янв
    
    // ТВОЙ ДР И ЕЁ ДР (замени цифры)
    // if (month === МЕСЯЦ && day === ЧИСЛО) $body.classList.add('theme-birthday');
});