// logic-stream.js — МОДУЛЬ УПРАВЛЕНИЯ МИМИ НА СТРИМЕ (Hotkeys)
document.addEventListener('keydown', (event) => {
    // Находим облако текста Мими по твоему классу или ID
    const mimiText = document.querySelector('.mimi-bubble'); 
    
    // F8 — ТЫ КРАСАВА (Килл, победа, крутой мув)
    if (event.key === 'F8') {
        mimiText.innerText = 'Ангелок, видела как Артём размотал?! 😎';
        mimiText.style.color = '#FFD700'; // Золотой цвет для победы
        setTimeout(() => { mimiText.innerText = 'Геля, я всё вижу! 👀'; mimiText.style.color = ''; }, 5000);
    } 

    // F9 — ТЫ "ЗАЛАГАЛ" (Смерть, тупняк, бабуины подвели)
    if (event.key === 'F9') {
        mimiText.innerText = 'Геля, не смотри! Кремень просто залагал! 😵';
        mimiText.style.color = '#ff4d4d'; // Красный для фейла
        setTimeout(() => { mimiText.innerText = 'Геля, я всё вижу! 👀'; mimiText.style.color = ''; }, 5000);
    }
});

// Добавляем класс для OBS, чтобы скрыть всё лишнее
document.body.classList.add('stream-mode');