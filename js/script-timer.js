function changeTimezone(date, ianatz) {
    var invdate = new Date(date.toLocaleString('en-US', {
        timeZone: ianatz
    }));
    var diff = invdate.getTime() - date.getTime();
    return new Date(date.getTime() - diff);
}

document.addEventListener('DOMContentLoaded', function () {
    // 1. Сначала решаем, ЧТО показать визуально
    const $timerUI = document.querySelector('.timer');
    const $placeholderUI = document.querySelector('.timer__placeholder');

    if (window.isTimerBlocked) {
        if ($timerUI) $timerUI.style.display = 'none';
        if ($placeholderUI) $placeholderUI.style.display = 'block';
        return; // СТОП! Дальше код таймера не пойдет
    } else {
        if ($timerUI) $timerUI.style.display = 'flex';
        if ($placeholderUI) $placeholderUI.style.display = 'none';
    }

    // 2. Если НЕ заблокировано — запускаем движок
    const x = new Date("2027-04-20T10:00:00");
    var deadline = changeTimezone(x, "Asia/Irkutsk");
    let timerId = null;

    function declensionNum(num, words) {
        return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
    }

    const $days = document.querySelector('.timer__days');
    const $hours = document.querySelector('.timer__hours');
    const $minutes = document.querySelector('.timer__minutes');
    const $seconds = document.querySelector('.timer__seconds');

    function countdownTimer() {
        const diff = deadline - new Date();
        if (diff <= 0) {
            clearInterval(timerId);
            return;
        }
        const days = Math.floor(diff / 1000 / 60 / 60 / 24);
        const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
        const minutes = Math.floor(diff / 1000 / 60) % 60;
        const seconds = Math.floor(diff / 1000) % 60;

        $days.textContent = days < 10 ? '0' + days : days;
        $hours.textContent = hours < 10 ? '0' + hours : hours;
        $minutes.textContent = minutes < 10 ? '0' + minutes : minutes;
        $seconds.textContent = seconds < 10 ? '0' + seconds : seconds;

        $days.dataset.title = declensionNum(days, ['день', 'дня', 'дней']);
        $hours.dataset.title = declensionNum(hours, ['час', 'часа', 'часов']);
        $minutes.dataset.title = declensionNum(minutes, ['минута', 'минуты', 'минут']);
        $seconds.dataset.title = declensionNum(seconds, ['секунда', 'секунды', 'секунд']);
    }

    countdownTimer();
    timerId = setInterval(countdownTimer, 1000);
});