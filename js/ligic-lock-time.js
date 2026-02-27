(function() {
    const unlockDate = new Date("2026-05-20T00:00:00").getTime();
    const now = new Date().getTime();
    const isLocked = now < unlockDate;

    // Создаем стиль прямо в памяти и бахаем в документ
    const style = document.createElement('style');
    style.innerHTML = isLocked 
        ? '.timer__placeholder { display: block !important; }' 
        : '.timer { display: flex !important; }';
    document.head.appendChild(style);
})();