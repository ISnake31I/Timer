document.addEventListener('DOMContentLoaded', () => {
    console.log("Stream Mode Initiated... 📡");

    setTimeout(() => {
        const mimiBox = document.getElementById('mimi-box');
        const mimiBubble = document.querySelector('.mimi-bubble');

        if (mimiBox) {
            document.body.classList.add('stream-mode');
            // Принудительно показываем кубик, если он был спрятан логикой сайта
            mimiBox.style.display = 'block';
            mimiBox.style.opacity = '1';
            mimiBox.style.visibility = 'visible';
        }

        const streamPhrases = [
            "Ангелок, смотри как Артём тащит! 😎",
            "Геля, я всё вижу! 👀",
            "Кремень в здании! 🦁",
            "Смотри-смотри, сейчас будет мув! 🔥",
            "Ангелочек, ты самая лучшая! 👸",
            "Артём, не отвлекайся на бабуинов! 🐒",
            "Мими одобряет этот каток! ✅",
            "Геля, а ты знала, что Артём — лучший? 🎮"
        ];

        function launchMimiTalk() {
            if (mimiBubble) {
                mimiBubble.innerText = streamPhrases[Math.floor(Math.random() * streamPhrases.length)];
                console.log("Mimi said: " + mimiBubble.innerText);
            }
            const nextTime = Math.floor(Math.random() * (300000 - 180000) + 180000);
            setTimeout(launchMimiTalk, nextTime);
        }

        launchMimiTalk();
    }, 3000); 
});