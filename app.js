document.addEventListener('DOMContentLoaded', function() {
    let mainTimerInterval;
    let secondaryTimerInterval;

    const startButton = document.getElementById('start');
    const finishButton = document.getElementById('finish');
    const mainTimerContainer = document.getElementById('main-timer-container');
    const secondaryTimerContainer = document.getElementById('secondary-timer-container');
    const mainTimerDisplay = document.getElementById('main-timer');
    const secondaryTimerDisplay = document.getElementById('secondary-timer');
    const resultDisplay = document.getElementById('result');
    const discomfortText = document.getElementById('discomfort-text');

    let mainTime = 0;
    let secondaryTime = 0;

    startButton.addEventListener('click', () => {
        startButton.classList.add('hidden');
        mainTimerContainer.classList.remove('hidden');
        discomfortText.classList.remove('hidden');
        finishButton.classList.remove('hidden');

        mainTime = 0;
        secondaryTime = 0;
        mainTimerDisplay.textContent = formatTime(mainTime);
        secondaryTimerDisplay.textContent = formatTime(secondaryTime);

        mainTimerInterval = setInterval(() => {
            mainTime++;
            mainTimerDisplay.textContent = formatTime(mainTime);
        }, 1000);

        setInterval(() => {
            speakTime(mainTime);
        }, 30000); // Озвучивать каждые 30 секунд
    });

    document.body.addEventListener('click', (event) => {
        if (startButton.classList.contains('hidden') && secondaryTimerContainer.classList.contains('hidden') && !event.target.matches('#start') && !event.target.matches('#finish')) {
            secondaryTimerContainer.classList.remove('hidden');
            discomfortText.classList.add('hidden');

            secondaryTime = 0;
            secondaryTimerDisplay.textContent = formatTime(secondaryTime);

            secondaryTimerInterval = setInterval(() => {
                secondaryTime++;
                secondaryTimerDisplay.textContent = formatTime(secondaryTime);
            }, 1000);

            finishButton.style.marginTop = '20px'; // Перемещаем кнопку "FINISH" под второй секундомер
        }
    });

    finishButton.addEventListener('click', () => {
        clearInterval(mainTimerInterval);
        clearInterval(secondaryTimerInterval);

        finishButton.classList.add('hidden');
        resultDisplay.classList.remove('hidden');
        mainTimerDisplay.classList.add('blue');
        secondaryTimerDisplay.classList.add('blue');
    });

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }

    function pad(number) {
        return number < 10 ? '0' + number : number;
    }

    function speakTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        let message = 'Elapsed';
        if (hrs > 0) {
            message += ` ${hrs} ${declineWord(hrs, ['hour', 'hours', 'hours'])}`;
        }
        if (mins > 0) {
            message += ` ${mins} ${declineWord(mins, ['minute', 'minutes', 'minutes'])}`;
        }
        if (secs > 0 || (hrs === 0 && mins === 0)) {
            message += ` ${secs} ${declineWord(secs, ['second', 'seconds', 'seconds'])}`;
        }

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'en-US'; // Устанавливаем английский язык
        speechSynthesis.speak(utterance);
    }

    function declineWord(number, words) {
        const cases = [2, 0, 1, 1, 1, 2];
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }
});
