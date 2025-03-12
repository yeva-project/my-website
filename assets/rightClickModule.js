// ==UserScript==
// @name         west
// @namespace    http://tampermonkey.net/
// @version      1.4 (без лимита нажатий)
// @description  weest
// @match        *://dynast.io/*
// @match        *://nightly.dynast.cloud/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";
    // ==================== 1. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
    // --- Новые переменные для X Actions (Auto GP) ---
    let isXPressed = false;
    let xActionRunning = false;
    let autoSwap = true; // Управляется чекбоксом Auto GP
    let cursorX = 0;
    let cursorY = 0;

    // Глобальная функция задержки (важна для X Actions)
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // --- Auto GH ---
    let autoGHEnabled = false;
    let autoGHKey = 'F';
    let awaitingGHKey = false;

    // --- Auto Leave ---
    let autoLeaveEnabled = false;
    let autoLeaveActive = false;
    let autoLeaveInterval = null;

    // --- Auto E ---
    let autoEEnabled = false;
    let autoEActive = false;
    let autoETrigger = "Space"; // "Space" или "MouseRight"

    // --- Speed Hack ---
    let speedMultiplier = 1;
    function setGameSpeed(multiplier) {
        speedMultiplier = multiplier;
    }
    const originalPerformanceNow = performance.now.bind(performance);
    const originalDateNow = Date.now.bind(Date);
    let lastTimeHack = originalPerformanceNow();
    performance.now = function() {
        const currentTime = originalPerformanceNow();
        const timeDiff = currentTime - lastTimeHack;
        lastTimeHack = currentTime;
        return currentTime + timeDiff * (speedMultiplier - 1);
    };
    Date.now = function() {
        return Math.floor(performance.now() + originalDateNow() - originalPerformanceNow());
    };
    let speedHackEnabledGlobal = false;
    let speedHackActive = false;
    let speedHackTrigger = "Space";

    // Обновление координат курсора (для кликов и X Actions)
    document.addEventListener("mousemove", (event) => {
        cursorX = event.clientX;
        cursorY = event.clientY;
    });
    // ==================== 2. СТИЛИ ====================
    const style = document.createElement('style');
    style.textContent = `
    /* Общее оформление меню */
    #draggableMenu {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 600px;
        background: #1e1e1e;
        color: #ffffff;
        border: 1px solid #444;
        border-radius: 8px;
        transform: translate(-50%, -50%);
        z-index: 9999;
        user-select: none;
        font-family: Segoe UI, Tahoma, sans-serif;
        display: none;
    }
    /* Верхняя панель для перетаскивания */
    #menuHeader {
        padding: 8px 10px;
        background: #2b2b2b;
        cursor: move;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #555;
    }
    #menuHeader .title {
        font-size: 16px;
        font-weight: bold;
    }
    #closeMenu {
        background: #333;
        border: none;
        color: #fff;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    }
    #closeMenu:hover {
        background: #444;
    }
    /* Вкладки */
    #tabBar {
        display: flex;
        gap: 6px;
        margin: 10px;
        border-bottom: 1px solid #555;
        padding-bottom: 5px;
    }
    .tabButton {
        background: #2b2b2b;
        border: none;
        color: #fff;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
        font-size: 14px;
    }
    .tabButton:hover {
        background: #3a3a3a;
    }
    .tabButton.active {
        background: #505050;
    }
    /* Контент вкладок */
    .tabContent {
        display: none;
        padding: 10px 15px;
    }
    .tabContent.active {
        display: block;
    }
    /* Блоки внутри вкладок */
    .tabBlock {
        margin-bottom: 15px;
        border: 1px solid #555;
        border-radius: 6px;
        padding: 10px;
        background: #2b2b2b;
    }
    .tabBlock h3 {
        margin: 0 0 10px 0;
        font-size: 16px;
        border-bottom: 1px solid #444;
        padding-bottom: 5px;
    }
    .tabBlock label {
        display: flex;
        justify-content: space-between;
        margin: 6px 0;
        align-items: center;
    }
    .tabBlock input[type="checkbox"],
    .tabBlock input[type="number"],
    .tabBlock select {
        transform: scale(1.2);
        margin-left: 8px;
    }
    .tabBlock button {
        background: #333;
        border: none;
        color: #fff;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        margin-left: 8px;
    }
    .tabBlock button:hover {
        background: #444;
    }
    `;
    document.head.appendChild(style);
    // ==================== 3. СОЗДАНИЕ МЕНЮ (HTML) ====================
    const menu = document.createElement('div');
    menu.id = 'draggableMenu';
    const menuHeader = document.createElement('div');
    menuHeader.id = 'menuHeader';
    menuHeader.innerHTML = `
        <div class="title">nerest menu</div>
        <button id="closeMenu">X</button>
    `;
    menu.appendChild(menuHeader);

    // Вкладки меню
    const tabBar = document.createElement('div');
    tabBar.id = 'tabBar';
    tabBar.innerHTML = `
        <button class="tabButton active" data-tab="tabAuto">Авто</button>
        <button class="tabButton" data-tab="tabAim">Aim</button>
        <button class="tabButton" data-tab="tabVisual">Визуал</button>
        <button class="tabButton" data-tab="tabZoom">Зум</button>
        <button class="tabButton" data-tab="tabSettings">Настройки</button>
        <button class="tabButton" data-tab="tabLog">Лог</button>
        <button class="tabButton" data-tab="tabTokens">Токены</button>
        <button class="tabButton" data-tab="tabTokenCheck">Проверка токена</button>
    `;
    menu.appendChild(tabBar);

    // Вкладка "Авто" – добавлен новый чекбокс для Auto GP (X Actions)
    const tabAuto = document.createElement('div');
    tabAuto.className = 'tabContent active';
    tabAuto.id = 'tabAuto';
    tabAuto.innerHTML = `
<div class="tabBlock">
    <h3>Функции</h3>
    <!-- Блок Auto Swap (X Actions) перенесён вверх -->
    <label title="Включает/выключает Auto Swap (X Actions)">
        <span>Auto Swap</span>
        <span>
            <input type="checkbox" id="autoGPToggle" checked>
            <button id="autoGPKeyButton">X</button>
        </span>
    </label>
    <label title="активирует">
        <span>Auto GH</span>
        <span>
            <input type="checkbox" id="autoGHToggle">
            <button id="autoGHKeyButton">F</button>
        </span>
    </label>
    <label title="Автоматически выполняет команду выхода (Leave) при нажатии F2">
        <span>Auto Crash (F2)</span>
        <input type="checkbox" id="autoLeaveToggle">
    </label>
    <label title="Нажатие клавиши 'e' при удержании выбранного триггера">
        <span>E</span>
        <input type="checkbox" id="autoEToggle">
    </label>
    <label title="Выберите триггер для E">
        <span>E Trigger</span>
        <select id="autoEKeySelect">
            <option value="Space" selected>Пробел</option>
            <option value="MouseRight">Правая кнопка мыши</option>
        </select>
    </label>
    <label title="выбранного триггера">
        <span>Speed Hack</span>
        <input type="checkbox" id="speedHackToggle">
    </label>
    <label title="Выберите триггер для Speed Hack">
        <span>Speed Hack Trigger</span>
        <select id="speedHackKeySelect">
            <option value="Space" selected>Пробел</option>
            <option value="MouseRight">Правая кнопка мыши</option>
        </select>
    </label>
</div>

    `;
    menu.appendChild(tabAuto);

    // Вкладка "Aim"
    const tabAim = document.createElement('div');
    tabAim.className = 'tabContent';
    tabAim.id = 'tabAim';
    tabAim.innerHTML = `
        <div class="tabBlock">
            <h3>Aim Функции</h3>
            <p>Скоро...</p>
        </div>
    `;
    menu.appendChild(tabAim);

    // Вкладка "Визуал"
    const tabVisual = document.createElement('div');
    tabVisual.className = 'tabContent';
    tabVisual.id = 'tabVisual';
    tabVisual.innerHTML = `
        <div class="tabBlock">
            <h3>Визуал Функции</h3>
            <p>Скоро...</p>
        </div>
    `;
    menu.appendChild(tabVisual);

    // Вкладка "Зум"
    const tabZoom = document.createElement('div');
    tabZoom.className = 'tabContent';
    tabZoom.id = 'tabZoom';
    tabZoom.innerHTML = `
        <div class="tabBlock">
            <h3>Зум</h3>
            <p>Скоро...</p>
        </div>
    `;
    menu.appendChild(tabZoom);
    // Вкладка "Настройки"
    const tabSettings = document.createElement('div');
    tabSettings.className = 'tabContent';
    tabSettings.id = 'tabSettings';
    tabSettings.innerHTML = `
        <div class="tabBlock">
            <h3>Настройки меню</h3>
            <label title="темы">
                <span>Темы</span>
                <select id="themeSelect">
                    <option value="dark" selected>Тёмная</option>
                    <option value="colorful">Разноцветная</option>
                </select>
            </label>
            <label title="Клавиша сброса Auto E">
    <span>Клавиша Reset Auto E</span>
    <button id="resetKeyButton">R</button>
</label>
            <label title="Изменение размера меню (ширина)">
                <span>Ширина меню (px)</span>
                <input type="number" id="menuWidth" value="600" style="width: 80px;">
            </label>
            <label title="Изменение прозрачности меню">
                <span>Прозрачность меню (0-1)</span>
                <input type="number" step="0.1" id="menuOpacity" value="1" style="width: 80px;">
            </label>
            <label title="Сброс положения меню">
                <span>Положение меню</span>
                <button id="resetMenuPosition">Сброс</button>
            </label>
            <label title="Сбросить все настройки к значениям по умолчанию">
                <span>Сброс настроек</span>
                <button id="resetAllSettings">Сброс по умолчанию</button>
            </label>
        </div>
    `;
    menu.appendChild(tabSettings);

    // Вкладки "Лог", "Токены" и "Проверка токена"
    const tabLog = document.createElement('div');
    tabLog.className = 'tabContent';
    tabLog.id = 'tabLog';
    tabLog.innerHTML = `
        <div class="tabBlock">
            <h3>Лог действий / Статистика</h3>
            <div id="logContainer" style="max-height: 300px; overflow-y: auto; background: #2b2b2b; padding: 10px; border-radius: 4px; border: 1px solid #555;"></div>
            <button id="clearLogButton" style="margin-top: 10px;">Очистить лог</button>
        </div>
    `;
    menu.appendChild(tabLog);
    const tabTokens = document.createElement('div');
    tabTokens.className = 'tabContent';
    tabTokens.id = 'tabTokens';
    tabTokens.innerHTML = `
        <div class="tabBlock">
            <h3>Токены</h3>
            <button id="refreshTokensButton">Обновить</button>
            <div id="tokensContainer" style="max-height: 300px; overflow-y: auto; background: #2b2b2b; padding: 10px; border-radius: 4px; border: 1px solid #555; margin-top: 10px;">
                Загрузка данных...
            </div>
        </div>
    `;
    menu.appendChild(tabTokens);
    const tabTokenCheck = document.createElement('div');
    tabTokenCheck.className = 'tabContent';
    tabTokenCheck.id = 'tabTokenCheck';
    tabTokenCheck.innerHTML = `
        <div class="tabBlock">
            <h3>Проверка токена</h3>
            <label>
                Введите токен:
                <input type="text" id="tokenInput" placeholder="Введите токен">
            </label>
            <button id="checkTokenButton">Проверить</button>
            <div id="tokenCheckResult" style="margin-top: 10px; background: #2b2b2b; padding: 10px; border: 1px solid #555; border-radius: 4px;">
                Результат проверки будет здесь.
            </div>
        </div>
    `;
    menu.appendChild(tabTokenCheck);
    document.body.appendChild(menu);

    // Логика переключения вкладок
    const tabButtons = tabBar.querySelectorAll('.tabButton');
    const tabContents = menu.querySelectorAll('.tabContent');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabContents.forEach(tc => tc.classList.remove('active'));
            const targetTab = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Закрытие меню и его отображение (Insert)
    const closeMenuButton = document.getElementById('closeMenu');
    closeMenuButton.addEventListener('click', () => {
        menu.style.display = 'none';
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Insert') {
            menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
        }
    });

    // Перетаскивание меню
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    menuHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - menu.offsetLeft;
        offsetY = e.clientY - menu.offsetTop;
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            menu.style.left = (e.clientX - offsetX) + 'px';
            menu.style.top = (e.clientY - offsetY) + 'px';
            menu.style.transform = '';
        }
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    // ==================== AUTO GH ====================
    // Функция pressKey здесь определена глобально в рамках этого блока (та же логика, что и в вашем оригинале)
    function pressKey(key, code, keyCode) {
        const eventOptions = { key, code, keyCode, which: keyCode, bubbles: true, cancelable: true };
        window.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
        window.dispatchEvent(new KeyboardEvent("keyup", eventOptions));
    }
    async function clickAtCursor() {
        const element = document.elementFromPoint(cursorX, cursorY);
        if (!element || element.closest('#draggableMenu, .ui, .disabled')) {
            console.warn("Элемент недоступен или заблокирован!");
            logAction("Попытка клика: Элемент недоступен или заблокирован!", 'warn');
            return;
        }
        const eventOptions = {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: cursorX,
            clientY: cursorY
        };
        element.dispatchEvent(new MouseEvent("mousedown", eventOptions));
        await delay(54);
        element.dispatchEvent(new MouseEvent("mouseup", eventOptions));
    }
    document.addEventListener("keydown", async (event) => {
        if (awaitingGHKey) {
            event.preventDefault();
            autoGHKey = event.key.length === 1 ? event.key.toUpperCase() : event.key;
            document.getElementById('autoGHKeyButton').textContent = autoGHKey;
            awaitingGHKey = false;
            logAction(`Клавиша Auto GH изменена на ${autoGHKey}`);
            return;
        }
        if (event.key.toLowerCase() === autoGHKey.toLowerCase() && autoGHEnabled) {
            pressKey("0", "Digit0", 48);
            await delay(56);
            await clickAtCursor();
            pressKey("1", "Digit1", 49);
        }
    });
    const autoGHToggle = document.getElementById('autoGHToggle');
    autoGHToggle.addEventListener('change', () => {
        autoGHEnabled = autoGHToggle.checked;
        logAction(`Auto GH ${autoGHEnabled ? 'включен' : 'выключен'}`);
    });
    const autoGHKeyButton = document.getElementById('autoGHKeyButton');
    autoGHKeyButton.addEventListener('click', () => {
        awaitingGHKey = true;
        autoGHKeyButton.textContent = 'Нажмите клавишу...';
        logAction('Ожидание ввода новой клавиши для Auto GH');
    });
    // ==================== AUTO LEAVE ====================
    const OriginalWebSocket = window.WebSocket;
    let wsInstance = null;
    window.WebSocket = class extends OriginalWebSocket {
        constructor(...args) {
            super(...args);
            wsInstance = this;
        }
    };
    function sendPacket(packet) {
        if (!wsInstance || wsInstance.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket connection is not open!');
            logAction('Попытка отправки пакета: WebSocket не открыт!', 'error');
            return;
        }
        try {
            const array = new Uint8Array(packet);
            wsInstance.send(array);
        } catch (e) {
            console.error('Error sending packet:', e);
            logAction(`Ошибка отправки пакета: ${e.message}`, 'error');
        }
    }
    const packetGH = [23, 3, 3, 0, 38, 0, 0, 0];
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F2' && autoLeaveEnabled) {
            autoLeaveActive = !autoLeaveActive;
            if (autoLeaveActive) {
                autoLeaveInterval = setInterval(() => {
                    simulateKey('e');
                    sendPacket(packetGH);
                }, 50);
                logAction('Auto Leave активирован');
            } else {
                clearInterval(autoLeaveInterval);
                autoLeaveInterval = null;
                logAction('Auto Leave деактивирован');
            }
        }
    });
    function simulateKey(key) {
        const eventOptions = {
            key,
            code: 'Key' + key.toUpperCase(),
            keyCode: key.toUpperCase().charCodeAt(0),
            which: key.toUpperCase().charCodeAt(0),
            bubbles: true,
            cancelable: true
        };
        window.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
        window.dispatchEvent(new KeyboardEvent("keyup", eventOptions));
    }
    const autoLeaveToggle = document.getElementById('autoLeaveToggle');
    autoLeaveToggle.addEventListener('change', () => {
        autoLeaveEnabled = autoLeaveToggle.checked;
        logAction(`Auto Leave ${autoLeaveEnabled ? 'включен' : 'выключен'}`);
    });

    // ==================== AUTO E ====================
    const autoEToggle = document.getElementById('autoEToggle');
    const autoEKeySelect = document.getElementById('autoEKeySelect');
    autoEKeySelect.addEventListener('change', (e) => {
        autoETrigger = e.target.value;
        logAction(`Auto E Trigger изменён на ${autoETrigger === "Space" ? "Пробел" : "Правая кнопка мыши"}`);
    });
    autoEToggle.addEventListener('change', () => {
        autoEEnabled = autoEToggle.checked;
        logAction(`Auto E ${autoEEnabled ? 'включен' : 'выключен'}`);
    });
    document.addEventListener('keydown', (e) => {
        if (!autoEEnabled) return;
        if (autoETrigger === "Space" && e.key === " ") {
            if (!autoEActive) {
                autoEActive = true;
                triggerAutoE();
            }
        }
    });
    document.addEventListener('keyup', (e) => {
        if (autoETrigger === "Space" && e.key === " ") {
            autoEActive = false;
        }
    });
document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === window.autoResetKey.toLowerCase()) {
        autoReset(); // Вызываем функцию сброса
    }
});


    document.addEventListener('mousedown', (e) => {
        if (!autoEEnabled) return;
        if (autoETrigger === "MouseRight" && e.button === 2) {
            if (!autoEActive) {
                autoEActive = true;
                triggerAutoE();
            }
        }
    });
    document.addEventListener('mouseup', (e) => {
        if (autoETrigger === "MouseRight" && e.button === 2) {
            autoEActive = false;
        }
    });
    document.addEventListener('contextmenu', (e) => {
        if (autoETrigger === "MouseRight") {
            e.preventDefault();
        }
    });
    async function triggerAutoE() {
        while (autoEActive) {
            let keyDownEvent = new KeyboardEvent("keydown", {
                key: "e",
                keyCode: 69,
                code: "KeyE",
                bubbles: true
            });
            let keyUpEvent = new KeyboardEvent("keyup", {
                key: "e",
                keyCode: 69,
                code: "KeyE",
                bubbles: true
            });
document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === window.autoResetKey.toLowerCase()) {
        autoReset(); // Вызываем функцию сброса
    }
});
            window.dispatchEvent(keyDownEvent);
            window.dispatchEvent(keyUpEvent);
            await sleep(45);
        }
    }

    // ==================== SPEED HACK ====================
    const speedHackToggle = document.getElementById('speedHackToggle');
    const speedHackKeySelect = document.getElementById('speedHackKeySelect');
    speedHackKeySelect.addEventListener('change', (e) => {
        speedHackTrigger = e.target.value;
        logAction(`Speed Hack Trigger изменён на ${speedHackTrigger === "Space" ? "Пробел" : "Правая кнопка мыши"}`);
    });
    speedHackToggle.addEventListener('change', () => {
        speedHackEnabledGlobal = speedHackToggle.checked;
        if (!speedHackEnabledGlobal && speedHackActive) {
            speedHackActive = false;
            setGameSpeed(1);
        }
        logAction(`Speed Hack ${speedHackEnabledGlobal ? 'включен' : 'выключен'}`);
    });
    async function triggerSpeedHack() {
         while (speedHackActive) {
             let keyDownEvent = new KeyboardEvent("keydown", {
                 key: "e",
                 keyCode: 69,
                 code: "KeyE",
                 bubbles: true
             });
             let keyUpEvent = new KeyboardEvent("keyup", {
                 key: "e",
                 keyCode: 69,
                 code: "KeyE",
                 bubbles: true
             });
             window.dispatchEvent(keyDownEvent);
             window.dispatchEvent(keyUpEvent);
             await sleep(45);
         }
    }
    document.addEventListener('keydown', (e) => {
         if (!speedHackEnabledGlobal) return;
         if (speedHackTrigger === "Space" && e.key === " ") {
             if (!speedHackActive) {
                 speedHackActive = true;
                 setGameSpeed(9999);
                 triggerSpeedHack();
             }
         }
    });
    document.addEventListener('keyup', (e) => {
         if (speedHackTrigger === "Space" && e.key === " ") {
             speedHackActive = false;
             setGameSpeed(1);
         }
    });
   document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === window.autoResetKey.toLowerCase()) {
        autoReset(); // Вызываем функцию сброса
    }
});
    document.addEventListener('mousedown', (e) => {
         if (!speedHackEnabledGlobal) return;
         if (speedHackTrigger === "MouseRight" && e.button === 2) {
             if (!speedHackActive) {
                 speedHackActive = true;
                 setGameSpeed(9999);
                 triggerSpeedHack();
             }
         }
    });
    document.addEventListener('mouseup', (e) => {
         if (speedHackTrigger === "MouseRight" && e.button === 2) {
             speedHackActive = false;
             setGameSpeed(1);
         }
    });
    document.addEventListener('contextmenu', (e) => {
         if (speedHackTrigger === "MouseRight") {
             e.preventDefault();
         }
    });
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
        // ==================== 6.5. Дополнительные параметры для Speed Hack и Auto E ====================
    // Параметры управления частотой кадров и циклов
    let speedIncrease = Infinity;
    let delayUs = 0;
    window.msLower = {
        enabled: true,        // Включить пакеты
        showAlert: false      // Показ предупреждений
    };
    speedIncrease = {
        enabled: true,        // Включить 8% увеличение
        ShowAlert: false      // Показ предупреждений
    };
    window.fpsControl = true;
    window.cpsControl = false;
    window.autoResetKey = 'r'; // Клавиша сброса
    window.boostPack = true; // Усиление шанса выпадения, не теряйте выносливость
    window.ePerSecond = Infinity;

    let intervalId = null;
    let keyPressCount = 0;

    // Для работы showResetIcon используется конфигурация времени показа (можно изменить)
    let config = {
        showResetIconDuration: 1000 // длительность показа в мс
    };

    function autoReset() {
        showResetIcon();
        keyPressCount = 0;
    }

    function showResetIcon() {
        const resetIcon = document.createElement('div');
        resetIcon.innerText = 'Reset';
        resetIcon.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 12px;
            font-weight: bold;
            color: white;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 5px;
            border-radius: 10px;
            z-index: 9999;
            text-align: center;
        `;
        document.body.appendChild(resetIcon);
        setTimeout(() => resetIcon.remove(), config.showResetIconDuration);
    }

    // ==================== FPS & CREDITS DISPLAY ====================
    (function () {
        let lastTimeFPS = 0;
        let fps = 0;
        let frameCount = 0;
        function updateFPS() {
            let now = performance.now();
            frameCount++;
            if (now - lastTimeFPS >= 1000) {
                fps = frameCount;
                frameCount = 0;
                lastTimeFPS = now;
            }
            requestAnimationFrame(updateFPS);
        }
        updateFPS();
        const creditsDisplay = document.createElement('div');
        creditsDisplay.id = 'creditsDisplay';
        creditsDisplay.style.position = 'absolute';
        creditsDisplay.style.bottom = '10px';
        creditsDisplay.style.left = '10px';
        creditsDisplay.style.fontSize = '14px';
        creditsDisplay.style.color = 'white';
        creditsDisplay.style.textAlign = 'center';
        creditsDisplay.style.zIndex = '9999';
        creditsDisplay.style.background = 'linear-gradient(45deg, #2b2b2b, #3a3a3a)';
        creditsDisplay.style.padding = '5px 10px';
        creditsDisplay.style.borderRadius = '5px';
        creditsDisplay.style.border = '1px solid #444';
        creditsDisplay.style.opacity = '0.9';
        creditsDisplay.innerHTML = `
            By Mr.Negotiv | By Weest_bek
            | <a href="https://t.me/nerest_skripts"
                 target="_blank"
                 style="color: white; text-decoration: underline;">
                 КАНАЛ
            </a>
        `;
        document.body.appendChild(creditsDisplay);
        const fpsDisplay = document.createElement('div');
        fpsDisplay.id = 'fpsDisplay';
        fpsDisplay.style.position = 'absolute';
        fpsDisplay.style.top = '10px';
        fpsDisplay.style.left = '10px';
        fpsDisplay.style.fontSize = '14px';
        fpsDisplay.style.color = 'white';
        fpsDisplay.style.textAlign = 'center';
        fpsDisplay.style.zIndex = '9999';
        fpsDisplay.style.background = 'linear-gradient(45deg, #2b2b2b, #3a3a3a)';
        fpsDisplay.style.padding = '5px 10px';
        fpsDisplay.style.borderRadius = '5px';
        fpsDisplay.style.border = '1px solid #444';
        fpsDisplay.style.opacity = '0.9';
        document.body.appendChild(fpsDisplay);
        function updateDisplay() {
            fpsDisplay.textContent = 'FPS: ' + fps;
            requestAnimationFrame(updateDisplay);
        }
        updateDisplay();
    })();

    // ==================== НАСТРОЙКИ МЕНЮ И ЛОГ ====================
    const themeSelect = document.getElementById('themeSelect');
    const menuWidthInput = document.getElementById('menuWidth');
    const menuOpacityInput = document.getElementById('menuOpacity');
    const resetMenuPositionButton = document.getElementById('resetMenuPosition');
    const resetAllSettingsButton = document.getElementById('resetAllSettings');
    themeSelect.addEventListener('change', () => {
        document.getElementById('resetKeyButton').addEventListener('click', () => {
    awaitingResetKey = true;
    document.getElementById('resetKeyButton').textContent = 'Нажмите клавишу...';
    logAction('Ожидание ввода новой клавиши для Reset Auto E');
});

document.addEventListener('keydown', (event) => {
    if (awaitingResetKey) {
        event.preventDefault();
        window.autoResetKey = event.key.length === 1 ? event.key.toUpperCase() : event.key;
        document.getElementById('resetKeyButton').textContent = window.autoResetKey;
        awaitingResetKey = false;
        logAction(`Клавиша сброса Auto E изменена на ${window.autoResetKey}`);
    }
});

        const theme = themeSelect.value;
        const fpsDisplay = document.getElementById('fpsDisplay');
        const creditsDisplay = document.getElementById('creditsDisplay');
        if (theme === 'colorful') {
            menu.style.background = 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)';
            menu.style.color = '#000';
            menuHeader.style.background = 'linear-gradient(45deg, pink, lightblue)';
            if (fpsDisplay) {
                fpsDisplay.style.background = 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)';
                fpsDisplay.style.color = '#000';
            }
            if (creditsDisplay) {
                creditsDisplay.style.background = 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)';
                creditsDisplay.style.color = '#000';
            }
        } else {
            menu.style.background = '#1e1e1e';
            menu.style.color = '#fff';
            menuHeader.style.background = '#2b2b2b';
            if (fpsDisplay) {
                fpsDisplay.style.background = 'linear-gradient(45deg, #2b2b2b, #3a3a3a)';
                fpsDisplay.style.color = '#fff';
            }
            if (creditsDisplay) {
                creditsDisplay.style.background = 'linear-gradient(45deg, #2b2b2b, #3a3a3a)';
                creditsDisplay.style.color = '#fff';
            }
        }
        logAction(`Изменена цветовая тема на ${theme === 'colorful' ? 'Разноцветная' : 'Тёмная'}`);
    });
    menuWidthInput.addEventListener('change', () => {
        menu.style.width = menuWidthInput.value + 'px';
        logAction(`Изменена ширина меню: ${menuWidthInput.value}px`);
    });
    menuOpacityInput.addEventListener('change', () => {
        menu.style.opacity = menuOpacityInput.value;
        logAction(`Изменена прозрачность меню: ${menuOpacityInput.value}`);
    });
    resetMenuPositionButton.addEventListener('click', () => {
        menu.style.top = '50%';
        menu.style.left = '50%';
        menu.style.transform = 'translate(-50%, -50%)';
        logAction('Положение меню сброшено');
    });
    resetAllSettingsButton.addEventListener('click', () => {
        themeSelect.value = 'dark';
        menuWidthInput.value = 600;
        menuOpacityInput.value = 1;
        menu.style.width = '600px';
        menu.style.opacity = '1';
        menu.style.background = '#1e1e1e';
        menu.style.color = '#fff';
        menuHeader.style.background = '#2b2b2b';
        menu.style.top = '50%';
        menu.style.left = '50%';
        menu.style.transform = 'translate(-50%, -50%)';
        logAction('Все настройки сброшены к значениям по умолчанию');
    });
    function logAction(message, type = 'info') {
        const logContainer = document.getElementById('logContainer');
        if (!logContainer) return;
        const time = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.style.marginBottom = '4px';
        if (type === 'error') {
            logEntry.style.color = 'red';
        } else if (type === 'warn') {
            logEntry.style.color = 'yellow';
        } else {
            logEntry.style.color = '#fff';
        }
        logEntry.textContent = `[${time}] ${message}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    document.getElementById('clearLogButton').addEventListener('click', () => {
        const logContainer = document.getElementById('logContainer');
        if (logContainer) {
            logContainer.innerHTML = '';
        }
    });
    // ==================== ЗАГРУЗКА ТОКЕНОВ И ПРОВЕРКА ТОКЕНА ====================
    const tokensAccessPassword = "StivilPro123@123";
    async function loadTokens() {
        const userPass = prompt("Введите пароль (Admin):");
        if (userPass !== tokensAccessPassword) {
            alert("Неверный пароль!");
            return;
        }
        const container = document.getElementById('tokensContainer');
        container.textContent = 'Загрузка данных...';
        try {
            const response = await fetch('https://mrnegotiv1.github.io/tokens/tokes/tokens.json');
            if (!response.ok) throw new Error('Ошибка загрузки');
            const tokens = await response.json();
            let html = '';
            if (Array.isArray(tokens)) {
                tokens.forEach(tokenObj => {
                    html += `<div style="padding: 5px; border-bottom: 1px solid #555;">
                        <strong>Token:</strong> ${tokenObj.token}<br>
                        <strong>Active:</strong> ${tokenObj.active}<br>
                        <strong>User:</strong> ${tokenObj.user}<br>
                        <strong>Expiry Date:</strong> ${tokenObj.expiry_date}
                    </div>`;
                });
            } else {
                html += `<div style="padding: 5px;">
                        <strong>Token:</strong> ${tokens.token}<br>
                        <strong>Active:</strong> ${tokens.active}<br>
                        <strong>User:</strong> ${tokens.user}<br>
                        <strong>Expiry Date:</strong> ${tokens.expiry_date}
                    </div>`;
            }
            container.innerHTML = html;
        } catch (error) {
            container.textContent = 'Ошибка загрузки данных';
            console.error(error);
        }
    }
    document.getElementById('refreshTokensButton').addEventListener('click', loadTokens);
    const tokensTabButton = tabBar.querySelector('[data-tab="tabTokens"]');
    tokensTabButton.addEventListener('click', loadTokens);
    document.getElementById('checkTokenButton').addEventListener('click', async () => {
        const input = document.getElementById('tokenInput').value.trim();
        const resultDiv = document.getElementById('tokenCheckResult');
        if (!input) {
            resultDiv.textContent = "Введите токен";
            return;
        }
        resultDiv.textContent = "Проверка...";
        try {
            const response = await fetch('https://mrnegotiv1.github.io/tokens/tokes/tokens.json');
            if (!response.ok) throw new Error("Ошибка загрузки токенов");
            const tokens = await response.json();
            let found = null;
            if (Array.isArray(tokens)) {
                found = tokens.find(t => t.token === input);
            } else {
                if (tokens.token === input) found = tokens;
            }
            if (found) {
                resultDiv.innerHTML = `
                    <strong>Token:</strong> ${found.token}<br>
                    <strong>Active:</strong> ${found.active}<br>
                    <strong>User:</strong> ${found.user}<br>
                    <strong>Expiry Date:</strong> ${found.expiry_date}
                `;
            } else {
                resultDiv.textContent = "Токен не найден";
            }
        } catch (error) {
            resultDiv.textContent = "Ошибка проверки токена";
            console.error(error);
        }
    });
       // ==================== AUTO SWAP X ACTIONS (Auto GP) ====================
    // Глобальные переменные для настройки Auto GP
    let autoGPKey = "X";
    let awaitingGPKey = false;

    // Обработчик для кнопки изменения клавиши Auto GP
    const autoGPKeyButton = document.getElementById('autoGPKeyButton');
    autoGPKeyButton.addEventListener('click', () => {
        awaitingGPKey = true;
        autoGPKeyButton.textContent = 'Нажмите клавишу...';
        logAction('Ожидание ввода новой клавиши для Auto GP');
    });

    // Функция X Actions (аналогичная оригиналу)
    async function performXActions() {
        if (xActionRunning || !autoSwap) return;
        xActionRunning = true;
        while (isXPressed) {
            pressKey("8", "Digit8", 56);
            await delay(62);
            await clickAtCursor();
            pressKey("7", "Digit7", 55);
            await delay(376);
        }
        xActionRunning = false;
    }

    // Обработчики для запуска Auto GP по нажатой клавише (используем autoGPKey)
    document.addEventListener("keydown", (event) => {
        if (awaitingGPKey) {
            event.preventDefault();
            autoGPKey = event.key.length === 1 ? event.key.toUpperCase() : event.key;
            autoGPKeyButton.textContent = autoGPKey;
            awaitingGPKey = false;
            logAction(`Клавиша Auto GP изменена на ${autoGPKey}`);
            return;
        }
        if (event.key.toUpperCase() === autoGPKey.toUpperCase() && !isXPressed) {
            isXPressed = true;
            if (autoSwap) performXActions();
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.key.toUpperCase() === autoGPKey.toUpperCase()) isXPressed = false;
    });

    // Чекбокс для включения/выключения Auto GP
    const autoGPToggle = document.getElementById('autoGPToggle');
    autoGPToggle.addEventListener('change', () => {
        autoSwap = autoGPToggle.checked;
        logAction(`Auto GP (X Actions) ${autoSwap ? 'включен' : 'выключен'}`);
    });
})();
