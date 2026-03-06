// --- ANGEL OS: MIMI ULTIMATE MOTION ---

// ВАЖНО: Выносим угол наружу, чтобы его видел глобальный mimiSay
let currentRotation = 0; 

document.addEventListener('DOMContentLoaded', () => {
    const mimiElement = document.getElementById('mimi-box');
    const mimiFrame = mimiElement.querySelector('.mimi-frame');
    const mimiEyes = mimiElement.querySelector('.mimi-eyes');
    const mimiMessage = document.getElementById('mimiMessage');
    let mimiIdleTime = 0;

    // --- ГЛОБАЛЬНЫЙ МОСТ: Теперь облачко будет умным везде! ---
    window.mimiSay = function(text) {
        if (!mimiMessage || !mimiElement) return;

        // 1. Твой УМНЫЙ ТАЙМЕР (Символы * 125мс)
        const calculatedDuration = Math.min(Math.max(4000, text.length * 125), 17500);

        mimiMessage.innerText = text;
        mimiElement.classList.add('speaking');

        // 2. Твоя ИДЕАЛЬНАЯ ЛОГИКА ПОЗИЦИИ (adjustBubble)
        const adjustBubble = () => {
            if (!mimiElement.classList.contains('speaking')) return;

            const rect = mimiElement.getBoundingClientRect();
            const msgRect = mimiMessage.getBoundingClientRect();
            const screenW = window.innerWidth;

            // Вертикаль
            if (rect.top < 150) {
                mimiMessage.style.bottom = "auto";
                mimiMessage.style.top = "70px";
            } else {
                mimiMessage.style.bottom = "80px";
                mimiMessage.style.top = "auto";
            }

            // Горизонталь (Центровка + Края)
            let desiredLeft = rect.left + (rect.width / 2) - (msgRect.width / 2);
            if (desiredLeft < 10) desiredLeft = 10;
            if (desiredLeft + msgRect.width > screenW - 10) {
                desiredLeft = screenW - msgRect.width - 10;
            }

            mimiMessage.style.left = `${desiredLeft - rect.left}px`;
            
            // СОПРОТИВЛЕНИЕ ВРАЩЕНИЮ (Берет внешнюю currentRotation)
            mimiMessage.style.transform = `rotate(${-currentRotation}deg)`;

            requestAnimationFrame(adjustBubble);
        };

        requestAnimationFrame(adjustBubble);

        // Уборка текста по таймеру
        setTimeout(() => {
            mimiElement.classList.remove('speaking');
        }, calculatedDuration);
    };

    // --- 1. РАНДОМНЫЙ СТАРТ ---
    function setRandomStart() {
        const mSize = 70;
        const x = Math.random() * (window.innerWidth - mSize - 20) + 10;
        const y = Math.random() * (window.innerHeight - mSize - 20) + 10;
        mimiElement.style.transition = "none";
        mimiElement.style.left = `${x}px`;
        mimiElement.style.top = `${y}px`;
        setTimeout(() => {
            mimiElement.style.transition = "all 0.8s cubic-bezier(0.5, 1.5, 0.6, 1)";
        }, 100);
    }
    setRandomStart();

    // --- 2. МОРГАНИЕ ---
    function mimiBlink() {
        mimiElement.classList.add('blink');
        setTimeout(() => mimiElement.classList.remove('blink'), 150);
    }
    setInterval(() => { if (Math.random() > 0.5) mimiBlink(); }, 4000);

    // --- 3. УТИЛИТЫ (Проверка границ и препятствий) ---
    function checkOverlap(x, y, element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const mSize = 70; // Учитываем размер куба
        return (x < rect.right && x + mSize > rect.left && y < rect.bottom && y + mSize > rect.top);
    }

    function isOutOfBounds(x, y) {
        const mSize = 80; // Размер Мими + небольшой запас
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        // Если точка выходит за любой из краев экрана — это аут
        return (x < 10 || x > screenW - mSize || y < 10 || y > screenH - mSize);
    }

    // --- 4. ДВИЖЕНИЕ ПО ОСЯМ (ШАГИ КУБИКА) ---
    function moveMimi() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent || mainContent.style.opacity !== "1") return;

        const currentX = parseFloat(mimiElement.style.left) || 0;
        const currentY = parseFloat(mimiElement.style.top) || 0;
        const cubeSize = 60; // Размер грани

        // 1. Выбираем длинную дистанцию (например, от 3 до 8 перекатов)
        const stepsCount = Math.floor(Math.random() * 6) + 3;
        const dir = Math.floor(Math.random() * 4);

        let targetX = currentX;
        let targetY = currentY;
        let rotationChange = stepsCount * 90; // Каждый шаг — 90 градусов

        if (dir === 0) targetX -= (stepsCount * cubeSize); // Влево
        else if (dir === 1) targetX += (stepsCount * cubeSize); // Вправо
        else if (dir === 2) targetY -= (stepsCount * cubeSize); // Вверх
        else if (dir === 3) targetY += (stepsCount * cubeSize); // Вниз

        // 2. ПРОВЕРКА ПРЕПЯТСТВИЙ (Чтобы не врезаться в меню по пути)
        const timer = document.querySelector('.timer');
        const apps = document.getElementById('appGrid');

        if (checkOverlap(targetX, targetY, timer) || checkOverlap(targetX, targetY, apps) || isOutOfBounds(targetX, targetY)) {
            mimiBlink(); // Озадаченно моргнул, если путь прегражден
            return;
        }

        // 3. ПЛАВНАЯ ФИЗИКА (Время зависит от количества шагов)
        const travelTime = stepsCount * 0.6; // 0.6 сек на один кувырок
        const easing = `cubic-bezier(0.45, 0.05, 0.55, 0.95)`; // Плавный старт и стоп

        mimiElement.style.transition = `left ${travelTime}s ${easing}, top ${travelTime}s ${easing}, transform ${travelTime}s ${easing}`;
        if (mimiEyes) mimiEyes.style.transition = `transform ${travelTime}s ${easing}`;

        // Применяем движение
        currentRotation += (dir === 0 || dir === 2 ? -rotationChange : rotationChange);

        mimiElement.style.left = `${targetX}px`;
        mimiElement.style.top = `${targetY}px`;
        mimiElement.style.transform = `rotate(${currentRotation}deg)`;

        if (mimiEyes) {
            mimiEyes.style.transform = `rotate(${-currentRotation}deg)`;
        }
    }

    setInterval(() => {
        mimiIdleTime++;
        if (mimiIdleTime >= 4) { // Каждые 4 секунды пробует шагнуть
            moveMimi();
            mimiIdleTime = 0;
        }
    }, 1000);

    // --- 5. РЕАКЦИЯ НА КЛИК (С ЛОГИКОЙ ОБИДКИ) ---
    let clickCount = 0;
    let isOffended = false;

    mimiElement.addEventListener('click', () => {
        if (isOffended) return; // Игнор, если уже обижен

        mimiIdleTime = 0;
        clickCount++;

        if (clickCount >= 3) {
            // --- ФАЗА: ОБИДКА ---
            isOffended = true;
            mimiElement.classList.remove('happy');
            mimiElement.classList.add('offended');

            // Краснеет от возмущения (Бордовый 🍷)
            mimiFrame.style.borderColor = "#800020";
            mimiFrame.style.boxShadow = "0 0 30px #800020";

            mimiSay("Ну всё, ты меня затискала! Ухожу! 😠");

            // Сваливает в угол через 500мс
            setTimeout(() => {
                moveMimi();
            }, 500);

            // Остывает через 7 секунд
            setTimeout(() => {
                isOffended = false;
                clickCount = 0;
                mimiElement.classList.remove('offended');
                mimiFrame.style.borderColor = "#8A2BE2";
                mimiFrame.style.boxShadow = "0 0 20px rgba(138, 43, 226, 0.5)";
                mimiSay("Ладно, мир... 💜");
            }, 7000);

        } else {
            // ОБЫЧНАЯ РАДОСТЬ
            mimiElement.classList.add('happy');
            mimiFrame.style.borderColor = "#800020";
            mimiFrame.style.boxShadow = "0 0 30px #800020";

            setTimeout(() => {
                mimiElement.classList.remove('happy');
                mimiFrame.style.borderColor = "#8A2BE2";
                mimiFrame.style.boxShadow = "0 0 20px rgba(138, 43, 226, 0.5)";
            }, 2000);
        }
    });

    // 2. Рандомные фразы
    setInterval(() => {
        // Если Мими не обижен и экран разблокирован
        const mainContent = document.getElementById('main-content');
        if (!isOffended && mainContent && mainContent.style.opacity === "1") {
            const phrases = [
                "Интересно, а они оба выспались?🤔",
                "Качусь по своим делам...🎲",
                "Артём просил тебе передать что ты очень красивая🥰",
                "Тут уютно!💜",
                "Мими на связи!📡",
                "Геля, а ты сегодня уже улыбалась? Это важно!🩺✨",
                "Я тут посчитал... вероятность твоего успеха сегодня 100%!📈"
            ];
            
            if (Math.random() > 0.9) {
                const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
                // Вызываем ГЛОБАЛЬНУЮ функцию, которую мы объявили в 1-й части
                window.mimiSay(randomPhrase); 
            }
        }
    }, 30000); 

    function checkDoctorOrders() {
        const hour = new Date().getHours();
        if (hour >= 23 || hour < 6) {
            if (!isOffended) {
                isOffended = true;
                mimiElement.classList.add('offended');
                window.mimiSay("ГЕЛЯ ИДИ СПАТЬ!😠");
            }
        } else if (clickCount < 3) {
            isOffended = false;
            mimiElement.classList.remove('offended');
        }
    }
    setInterval(checkDoctorOrders, 10000);

    // --- ФИКС ДЛЯ ТЕЛЕФОНА ---
    window.addEventListener('resize', () => {
        const currentX = parseFloat(mimiElement.style.left);
        const currentY = parseFloat(mimiElement.style.top);
        if (isOutOfBounds(currentX, currentY)) {
            setRandomStart();
            console.log("Мими: Ого, мир изменился! Я вернулся! 🧭");
        }
    });
}); // Конец DOMContentLoaded