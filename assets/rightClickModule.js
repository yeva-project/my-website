(function() {
    'use strict';

    let lastTime = 0;
    let fps = 0;
    let frameCount = 0;

    function updateFPS() {
        let now = performance.now();
        frameCount++;

        if (now - lastTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = now;
        }

        requestAnimationFrame(updateFPS);
    }

    updateFPS();

    const creditsDisplay = document.createElement('div');
    creditsDisplay.style.position = 'absolute';
    creditsDisplay.style.bottom = '10px';
    creditsDisplay.style.left = '10px';
    creditsDisplay.style.fontSize = '14px';
    creditsDisplay.style.color = 'white';
    creditsDisplay.style.textAlign = 'center';
    creditsDisplay.style.zIndex = '9999';


    creditsDisplay.style.background = 'linear-gradient(45deg, red, yellow, green, blue, purple)';
    creditsDisplay.style.backgroundSize = '400% 400%';
    creditsDisplay.style.animation = 'gradientAnimation 3s ease infinite';

    document.body.appendChild(creditsDisplay);


    creditsDisplay.textContent = 'By Mr.Negotiv beta';

    const fpsDisplay = document.createElement('div');
    fpsDisplay.style.position = 'absolute';
    fpsDisplay.style.top = '10px';
    fpsDisplay.style.left = '10px';
    fpsDisplay.style.fontSize = '14px';
    fpsDisplay.style.color = 'white';
    fpsDisplay.style.textAlign = 'center';
    fpsDisplay.style.zIndex = '9999';

    fpsDisplay.style.background = 'linear-gradient(45deg, red, yellow, green, blue, purple)';
    fpsDisplay.style.backgroundSize = '400% 400%';
    fpsDisplay.style.animation = 'gradientAnimation 3s ease infinite';

    document.body.appendChild(fpsDisplay);

    function updateDisplay() {
        fpsDisplay.textContent = 'FPS: ' + fps;
        requestAnimationFrame(updateDisplay);
    }

    updateDisplay();

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);
})();
(function() {
    var uid = 0;
    var storage = {};
    var firstCall = true;
    var slice = Array.prototype.slice;
    var message = String.fromCharCode(0);
    function fastApply(args) {
        var func = args[0];
        switch (args.length) {
            case 1:
                return func(Math.floor(performance.now() * 10000) / 100000);
            case 2:
                return func(args[1]);
            case 3:
                return func(args[1], args[2]);
        }
        return func.apply(window, slice.call(args, 1));
    }
    function callback(event) {
        var key = event.data;
        var data;
        if (typeof key == 'string' && key.indexOf(message) == 0) {
            data = storage[key];
            if (data) {
                delete storage[key];
                fastApply(data);
            }
        }
    }
    function setImmediate() {
        var id = uid++;
        var key = message + id;
        var i = arguments.length;
        var args = new Array(i);
        while (i--) {
            args[i] = arguments[i];
        }
        storage[key] = args;
        if (firstCall) {
            firstCall = false;
            window.addEventListener('message', callback);
        }
        window.postMessage(key);
        return id;
    }
    function clearImmediate(id) {
        delete storage[message + id];
    }
    window.requestAnimationFrame = function(callback) {
        setImmediate(callback);
    }
    window.cancelAnimationFrame = function(id) {
        clearImmediate(id);
    }
})();
(function() {
    let uid = 0;
    const storage = {};
    let firstCall = true;
    const message = String.fromCharCode(0);
    function fastApply(args) {
        const func = args[0];
        return func(...args.slice(1));
    }
    function callback(event) {
        const key = event.data;
        if (typeof key === 'string' && key.startsWith(message)) {
            const data = storage[key];
            if (data) {
                delete storage[key];
                fastApply(data);
            }
        }
    }
    function setImmediate(...args) {
        const id = uid++;
        const key = message + id;
        storage[key] = args;

        if (firstCall) {
            firstCall = false;
            window.addEventListener('message', callback);
        }

        window.postMessage(key, '*');
        return id;
    }
    function clearImmediate(id) {
        delete storage[message + id];
    }
    window.requestAnimationFrame = function(callback) {
        return setImmediate(callback);
    };
    window.cancelAnimationFrame = function(id) {
        clearImmediate(id);
    };
    let ws;
    const optimizeWebSocket = () => {
        const originalWebSocket = window.WebSocket;
        window.WebSocket = function(url) {
            ws = new originalWebSocket(url);
            ws.addEventListener('message', (event) => {
                const data = JSON.parse(event.data);
                if (data.type !== 'unnecessary_data_type') {
                    processImportantData(data);
                }
            });
            return ws;
        };
    };

    const processImportantData = (data) => {
        console.log('Processed important data:', data);
    };
    const removeUnusedElements = () => {
        const elementsToRemove = [
            '.footer',
            '.ads',
            '.header'
        ];
        elementsToRemove.forEach(selector => {
            const elem = document.querySelector(selector);
            if (elem) elem.remove();
        });
    };
    const optimizeCSS = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            body {
                background: #000 !important;
                color: #fff !important;
                margin: 0;
                padding: 0;
                overflow: hidden;
            }
            .game-container {
                max-width: 100vw;
                max-height: 100vh;
            }
        `;
        document.head.appendChild(style);
    };
    const initOptimizations = () => {
        removeUnusedElements();
        optimizeWebSocket();
        optimizeCSS();
    };
    window.addEventListener('load', initOptimizations);
})();

(function () {
    'use strict';

    // === Параметры управления частотой кадров и циклов ===
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
    window.boostPack = true;   // Усиление шанса выпадения, не теряйте выносливость
    window.ePerSecond = Infinity;

    let intervalId = null;
    let keyPressCount = 0;
    let isRunning = false;

    function autoReset() {
        showResetIcon();
        keyPressCount = 0;
        isRunning = false;
        clearInterval(intervalId);
    }

    function showResetIcon() {
        const resetIcon = document.createElement('div');
        resetIcon.innerText = 'Reset auto E';
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
        setTimeout(() => resetIcon.remove(), 1000);
    }

    // === Второй скрипт (автонажатие "E") ===
    (function () {
        window.ePerSecond = Math.max(window.ePerSecond / 2, 1);
        window.autoEKey = " ";

        const cache = new Map();

        async function zetaXProcessor() {
            if (isRunning) return;
            isRunning = true;
            intervalId = setInterval(() => {
                executeECommands();
                executeOtherCommands();
            }, Math.max(window.ePerSecond, 1));
        }

        function executeECommands() {
            hX3();
        }

        function hX3() {
            const eH9 = { key: 'e', code: 'KeyE', bubbles: true };
            for (let i = 0; i < 10; i++) {
                window.dispatchEvent(new KeyboardEvent('keydown', eH9));
                window.dispatchEvent(new KeyboardEvent('keyup', eH9));
            }
        }

        function executeOtherCommands() {
            Promise.all([
                fJ0(), pD3(), wB2(), vO8(), gH6(),
                jV4(), xD0(), bZ8(), sY7(), dP9(),
                uO2(), aJ4(), kV5()
            ]);
        }

        function stopZetaXProcessor() {
            isRunning = false;
            clearInterval(intervalId);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === window.autoEKey && !isRunning) zetaXProcessor();
            if (e.key === window.autoResetKey) autoReset(); // Теперь Reset работает!
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === window.autoEKey) stopZetaXProcessor();
        });

        function fJ0() { hX3(); }
        function pD3() { hX3(); }
        function wB2() { hX3(); }
        function vO8() { if (Math.log(3) > 1) hX3(); }
        function gH6() { hX3(); }
        function jV4() { if (120 % 2 === 0) hX3(); }
        function xD0() { if ((Math.log(2) + Math.exp(0)) % 2 === 0) hX3(); }
        function bZ8() { if (0.5 > 0.2) hX3(); }
        function sY7() { if (90 < 180) hX3(); }
        function dP9() { hX3(); }
        function uO2() { if (0.6 > 0.5) hX3(); }

        function aJ4() {
            let sL0 = 0;
            for (let i = 0; i < 500; i++) {
                sL0 += Math.sin(i * Math.PI / 360) * Math.cos(i * Math.PI / 180);
            }
            if (sL0 % 2 === 0) hX3();
        }

        function kV5() {
            let lR6 = [
                [0.1, 0.2, 0.3],
                [0.4, 0.5, 0.6],
                [0.7, 0.8, 0.9]
            ];
            let zL1 = lR6[0][0] * lR6[1][1] * lR6[2][2];
            for (let i = 0; i < 25; i++) {
                zL1 = zL1 * Math.sin(i * Math.PI / 180);
            }
            if (zL1 > 0.5) hX3();
        }

        zetaXProcessor();
    })();

})();
