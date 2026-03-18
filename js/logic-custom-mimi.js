document.addEventListener('DOMContentLoaded', () => {
    const mimiBox = document.getElementById('mimi-box');
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;

    function setMimiWardrobe(mode) {
        // 1. Находим элементы (пробуем разные варианты селекторов)
        const cap = document.querySelector('.mimi-birthday-cap:not(.crown):not(.hat)');
        const crown = document.querySelector('.mimi-birthday-cap.crown');
        const hat = document.querySelector('.mimi-birthday-cap.hat');
        const radar = document.querySelector('.mimi-love-radar');

        // Добавь в список поиска элементов:
        const engineerHat = document.querySelector('.mimi-birthday-cap.engineer-hat');


        // 2. ЖЕСТКИЙ СБРОС (Скрываем всё)
        [cap, crown, hat, radar, engineerHat].forEach(el => {
            if (el) {
                el.style.display = 'none';
                console.log("Скрываю элемент:", el.className); // ТЕСТ В КОНСОЛИ
            }
        });

        // 3. ВКЛЮЧАЕМ НУЖНЫЙ (Проверь, чтобы эти классы были в HTML!)
        if (mode === 'party-mode' && cap) cap.style.display = 'block';
        if (mode === 'valentine-mode' && radar) radar.style.display = 'block';
        if (mode === 'king-mode' && crown) {
            crown.style.display = 'block';
            console.log("Корона АКТИВИРОВАНА!");
        }
        if (mode === 'gentleman-mode' && hat) {
            hat.style.display = 'block';
            console.log("Цилиндр АКТИВИРОВАН!");
        }

        if (mode === 'engineer-mode' && engineerHat) {
            engineerHat.style.display = 'block';
            console.log("Mimi Engineer: Crafting started! ⚙️");
        }

        // 4. ОБНОВЛЯЕМ КЛАССЫ СИЯНИЯ
        if (mimiBox) {
            mimiBox.classList.remove('party-mode', 'valentine-mode', 'king-mode', 'gentleman-mode', 'engineer-mode');
            if (mode) mimiBox.classList.add(mode);
        }
    }

    // --- ФУНКЦИЯ "ОБОРУДОВАНИЯ" ---
    function equipMimi(mode, firstMessage) {
        if (!mimiBox) return;
        setMimiWardrobe(mode);

        // 1. ПЕРВОЕ ПОЗДРАВЛЕНИЕ
        setTimeout(() => {
            if (window.mimiSay) window.mimiSay(firstMessage, 8000);
        }, 2000);

        // 2. БАЗЫ ФРАЗ
        const birthdayPhrases = ["Геля, ты сегодня — 100/100! 😍", "Мими в восторге от праздника! ✨", "Сегодня весь Шелехов празднует! 🎆"];
        const valentinePhrases = ["Ловлю сигналы любви... ❤️🛰️", "Антенны настроены на твоё сердце! 📡❤️"];

        // 3. ЗАПУСК ЦИКЛА ФРАЗ (ОЖИВЛЯЕМ МИМИ)
        const phrases = (mode === 'valentine-mode') ? valentinePhrases : birthdayPhrases;

        // Удаляем старый интервал, если он был, чтобы не спамить
        if (window.mimiCustomInterval) clearInterval(window.mimiCustomInterval);

        window.mimiCustomInterval = setInterval(() => {
            if (Math.random() > 0.7 && window.mimiSay && !mimiBox.classList.contains('offended')) {
                const text = phrases[Math.floor(Math.random() * phrases.length)];
                window.mimiSay(text);
            }
        }, 45000); // Раз в 45 секунд
    }

    // --- ДЕТОНАТОРЫ (Твой двигатель) ---

    // Бро, для ТЕСТА сегодня (27.02) оставь ОДНУ строку включенной:
    if (day === 18 && month === 3) {
        // equipMimi('party-mode', "ТЕСТ: КОНУС АКТИВИРОВАН! 🥳");
        // equipMimi('king-mode', "ТЕСТ: КОРОНА АКТИВИРОВАНА! 👑");
        // equipMimi('gentleman-mode', "ТЕСТ: ШЛЯПА АКТИВИРОВАНА");
        // equipMimi('valentine-mode', "ТЕСТ: РАДАР АКТИВИРОВАН! ❤️🛰️");
        equipMimi('engineer-mode', "ТЕСТ: ШЛЯПА АКТИВИРОВАНА");
    }

    // БОЕВОЙ РЕЖИМ НА ЗАВТРА (ДЕНЬ РОЖДЕНИЯ)
    else if (day === 28 && month === 2) {
        equipMimi('party-mode', "С ДНЕМ РОЖДЕНИЯ, КОРОЛЕВА! 👑🎉");
    }

    // 14 ФЕВРАЛЯ
    else if (day === 14 && month === 2) {
        equipMimi('valentine-mode', "ЛЮБОВНЫЙ РАДАР ВКЛЮЧЕН! ❤️🛰️");
    }

    // 14 ФЕВРАЛЯ
    else if (day === 14 && month === 2) {
        equipMimi('gentleman-mode', "Кайфовая шляпа ❤️🛰️");
    }

    // 14 ФЕВРАЛЯ
    else if (day === 14 && month === 2) {
        equipMimi('valentine-mode', "ЛЮБОВНЫЙ РАДАР ВКЛЮЧЕН! ❤️🛰️");
    }
});