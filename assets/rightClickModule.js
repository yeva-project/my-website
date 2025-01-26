(function() {
    'use strict';

    // TimeMachine：當玩家在撿東西按下熱時把遊戲時間改成快150倍
    let speed = 1;

    function setTimeSpeed(multiplier) {
        speed = multiplier;
    }

    // 用TimeMachine 腳本的效能 API 覆蓋
    let lastPNow = performance.now();
    let pNowOffset = 0;

    window.performance.now = new Proxy(window.performance.now, {
        apply: function(target, thisArg, argList) {
            const time = Reflect.apply(target, thisArg, argList);
            pNowOffset += (time - lastPNow) * (speed - 1);
            lastPNow = time;
            return time + pNowOffset;
        }
    });

    // 日期 API 覆蓋
    let lastD = Date.now();
    let dOffset = 0;

    window.Date.now = new Proxy(window.Date.now, {
        apply: function(target, thisArg, argList) {
            const time = Reflect.apply(target, thisArg, argList);
            dOffset += (time - lastD) * (speed - 1);
            lastD = time;
            return Math.floor(time + dOffset);
        }
    });

    // 動畫幀覆蓋（requestAnimationFrame）
    let lastRAF = performance.now();
    let rAFOffset = 0;

    window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
        apply: function(target, thisArg, argList) {
            if (typeof argList[0] === "function") {
                argList[0] = new Proxy(argList[0], {
                    apply: function(target2, thisArg2, argList2) {
                        const time = argList2[0];
                        rAFOffset += (time - lastRAF) * (speed - 1);
                        lastRAF = time;
                        argList2[0] = time + rAFOffset;
                        return Reflect.apply(target2, thisArg2, argList2);
                    }
                });
            }
            return Reflect.apply(target, thisArg, argList);
        }
    });

    // Dynast.io AutoEEE
    window.autoEKey = "q";  // 可根據需要自訂自動E鍵
    window.useRightClick = true;  // 啟用右鍵熱鍵
    window.ePerSecond = 999999999999999999999999999999999999999999999999 // 每秒十次點擊"E"

    let pickingUpItem = false;
    let ePressInterval;
    let ePressCount = 0;  // 計算"E"被按下的次數

    // 觸發AutoEEE的功能
    function startAutoE() {
        if (!ePressInterval) {
            ePressInterval = setInterval(() => {
                const KeyISdown = new KeyboardEvent('keydown', { key: 'e', keyCode: 69, code: 'KeyE' });
                const KeyISup = new KeyboardEvent('keyup', { key: 'e', keyCode: 69, code: 'KeyE' });
                window.dispatchEvent(KeyISdown);
                window.dispatchEvent(KeyISup);
                ePressCount++;  // 每次觸發"E"時增加"E"按下數
            }, 0);  // 每1ms重複一次（每次等於10次）
        }
    }

    // 停止AutoEEE的功能
    function stopAutoE() {
        clearInterval(ePressInterval);
        ePressInterval = null;
    }

    // Создание меню для управления скриптом
    let scriptEnabled = false;  // Флаг, показывающий, включен ли скрипт
    let menuVisible = false;
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '10px';
    menu.style.right = '10px';  // Меню теперь будет в правом верхнем углу
    menu.style.padding = '10px';
    menu.style.backgroundColor = 'black';
    menu.style.color = 'white';
    menu.style.border = '1px solid white';
    menu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    menu.style.zIndex = '9999';
    menu.style.display = 'none';
    menu.style.fontSize = '14px';
    menu.style.width = '160px';
    menu.style.textAlign = 'center';
    menu.innerHTML = `
        <div style="margin-bottom: 5px;">
            <button id="enableScript" style="width: 100%; padding: 5px;">Включить скрипт</button>
        </div>
        <div style="margin-bottom: 5px;">
            <button id="disableScript" style="width: 100%; padding: 5px;">Отключить скрипт</button>
        </div>
        <div>
            <button id="exit" style="color: white; background-color: red; border: 1px solid white; width: 100%; padding: 5px;">НЕ НАЖИМАТЬ</button>
        </div>
    `;
    document.body.appendChild(menu);

    // Показ и скрытие меню
    const toggleMenu = () => {
        menuVisible = !menuVisible;
        menu.style.display = menuVisible ? 'block' : 'none';
    };

    // Кнопка "НЕ НАЖИМАТЬ"
    const exitButton = document.getElementById('exit');
    exitButton.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Эта кнопка не должна быть нажата!');
        location.reload(); // Перезагружает страницу
    });

    // Включение скрипта
    const enableButton = document.getElementById('enableScript');
    enableButton.addEventListener('click', () => {
        scriptEnabled = true;
        alert('Скрипт включен!');
        menu.style.display = 'none';
        menuVisible = false;
        runOriginalScript();
    });

    // Отключение скрипта
    const disableButton = document.getElementById('disableScript');
    disableButton.addEventListener('click', () => {
        scriptEnabled = false;
        alert('Скрипт отключен!');
        menu.style.display = 'none';
        menuVisible = false;
        stopOriginalScript();
    });

    // Слушатель для клавиши Insert
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Insert') {
            toggleMenu();
        }
    });

    // Слушатель для правой кнопки мыши
    document.addEventListener('mousedown', (e) => {
        if (e.button === 2 && scriptEnabled) {  // Если правая кнопка и скрипт включен
            e.preventDefault(); // Блокируем стандартное действие
            executeECommands();
        }
    });

    // 右鍵熱鍵觸發的監聽器
    document.addEventListener("mousedown", function(event) {
        if (event.button === 2 && scriptEnabled) {  // 右鍵(通稱Button 2) и скрипт включен
            pickingUpItem = true;
            setTimeSpeed(99999999999);  // 當觸發時遊戲時間更改為150倍
            startAutoE();  // 開始連點AutoE
        }
    });

    document.addEventListener("mouseup", function(event) {
        if (event.button === 2) {  // 右鍵(通稱Button 2)
            pickingUpItem = false;
            setTimeSpeed(1);  // 當鬆開右鍵時把遊戲時間調回去正常(默認為1)
            stopAutoE();  // 停止連點AutoE
        }
    });

})();
