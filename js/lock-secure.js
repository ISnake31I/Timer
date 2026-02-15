document.addEventListener('DOMContentLoaded', () => {
    const unlockBtn = document.getElementById('unlockBtn');
    const passInput = document.getElementById('passInput');
    const lockscreen = document.getElementById('lockscreen');
    const errorMsg = document.getElementById('errorMsg');

    const checkPass = () => {
        if (passInput.value.toLowerCase() === 'ангелок') {
            // 1. Прячем экран защиты
            lockscreen.classList.add('unlocked');

            // 2. Показываем основной контент сайта
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.opacity = '1';

            sessionStorage.setItem('isLogged', 'true');
        } else {
            errorMsg.style.display = 'block';
            passInput.style.borderColor = 'red';
            setTimeout(() => { errorMsg.style.display = 'none'; }, 3000);
        }
    };

    unlockBtn.addEventListener('click', checkPass);

    // Вход по Enter
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPass();
    });
});