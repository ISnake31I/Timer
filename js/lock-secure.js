document.addEventListener('DOMContentLoaded', () => {
    const lockscreen = document.getElementById('lockscreen');
    const mainContent = document.getElementById('main-content');
    const passInput = document.getElementById('passInput');
    const unlockBtn = document.getElementById('unlockBtn');
    const errorMsg = document.getElementById('errorMsg');

    const EXPIRATION_TIME = 60 * 60 * 1000; // 1 час

    function checkSession() {
        const lastLogin = localStorage.getItem('lastLoginTime');
        const now = new Date().getTime();
        if (lastLogin && (now - lastLogin < EXPIRATION_TIME)) {
            lockscreen.classList.add('unlocked');
            if (mainContent) mainContent.style.opacity = '1';
        }
    }
    checkSession();

    const checkPass = () => {
        if (passInput.value.toLowerCase() === '123123') {
            localStorage.setItem('lastLoginTime', new Date().getTime());
            lockscreen.classList.add('unlocked');
            if (mainContent) mainContent.style.opacity = '1';
        } else {
            errorMsg.style.display = 'block';
            passInput.style.borderColor = 'red';
            setTimeout(() => { errorMsg.style.display = 'none'; }, 3000);
        }
    };

    unlockBtn.addEventListener('click', checkPass);
    passInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPass(); });
});