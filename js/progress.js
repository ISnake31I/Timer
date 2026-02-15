function updateDynamicProgress() {
    // 1. Берем данные из внешнего конфига
    const milestones = window.MY_MILESTONES || []; 

    const now = new Date().getTime();

    // 2. Ищем ближайшую будущую цель
    const nextGoal = milestones.find(m => new Date(m.date).getTime() > now);

    if (nextGoal) {
        const targetDate = new Date(nextGoal.date).getTime();
        
        // Точка отсчета - запуск проекта (14 фев)
        const startDate = new Date("2026-02-14T00:00:00").getTime();

        const total = targetDate - startDate;
        const current = now - startDate;
        let percent = (current / total) * 100;

        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;

        const bar = document.getElementById('progressBar');
        const text = document.getElementById('statusText');

        if (bar) bar.style.width = percent.toFixed(4) + "%";
        if (text) {
            text.innerText = `Loading: ${percent.toFixed(4)}%`;
        }
    }
}

setInterval(updateDynamicProgress, 100);