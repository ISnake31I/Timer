// logic-lock-time.js

// 1. СРАЗУ создаем флаг, не дожидаясь загрузки всей страницы
const unlockDate = new Date("2026-05-20T00:00:00"); // Дата 5-го конверта
const now = new Date();
window.isTimerBlocked = (now < unlockDate);

// 2. А теперь решаем, что показать визуально, когда DOM подгрузится
document.addEventListener('DOMContentLoaded', function () {
    const $timerUI = document.querySelector('.timer');
    const $placeholderUI = document.querySelector('.timer__placeholder');

    if (window.isTimerBlocked) {
        if ($timerUI) $timerUI.style.display = 'none';
        if ($placeholderUI) $placeholderUI.style.display = 'block';
    } else {
        if ($timerUI) $timerUI.style.display = 'flex';
        if ($placeholderUI) $placeholderUI.style.display = 'none';
    }

});


