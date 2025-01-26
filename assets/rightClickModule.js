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

(function() {
    'use strict';
(function () {
    window.ePerSecond = Math.max(window.ePerSecond / 2, 1);
    window.autoEKey = " ";

    let isRunning = false;
    let intervalId;
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
            uO2(), aJ4(), kV5(), commandQueueProcessing(),
            complexCalculations(), cacheProcessing([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
            factorial(10), determinant([[1, 2], [3, 4]]),
            quickSort([3, 5, 1, 4, 2]), sieveOfEratosthenes(100),
            isPrime(29)
        ]);
    }
    function stopZetaXProcessor() {
        isRunning = false;
        clearInterval(intervalId);
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === window.autoEKey && !isRunning) zetaXProcessor();
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === window.autoEKey) stopZetaXProcessor();
    });

    function fJ0() {
        hX3();
    }

    function pD3() {
        hX3();
    }

    function wB2() {
        hX3();
    }

    function vO8() {
        let kM1 = Math.log(3);
        if (kM1 > 1) hX3();
    }

    function gH6() {
        hX3();
    }

    function jV4() {
        let yQ2 = 120;
        if (yQ2 % 2 === 0) hX3();
    }

    function xD0() {
        let dR1 = Math.log(2);
        let pQ0 = Math.exp(0);
        if ((dR1 + pQ0) % 2 === 0) hX3();
    }

    function bZ8() {
        let kS4 = 0.5;
        if (kS4 > 0.2) hX3();
    }

    function sY7() {
        let kF2 = 90;
        if (kF2 < 180) hX3();
    }

    function dP9() {
        hX3();
    }

    function uO2() {
        let xR6 = 0.6; // Fixed value
        if (xR6 > 0.5) hX3();
    }

    function aJ4() {
        let sL0 = 0; // Fixed value
        for (let i = 0; i < 500; i++) {
            sL0 += Math.sin(i * Math.PI / 360) * Math.cos(i * Math.PI / 180);
        }
        if ( sL0 % 2 === 0) hX3();
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

    function commandQueueProcessing() {
        const queue = Array(100).fill(1);
        let sum = 0;
        for (let i = 0; i < queue.length; i++) {
            sum += (queue[i] * i) % 256;
        }
        return sum;
    }

    function complexCalculations() {
        let result = 1;
        for (let i = 0; i < 100; i++) {
            result *= Math.sin(1) * Math.cos(1);
            result += Math.tan(1);
        }
        return result;
    }

    function cacheProcessing(data) {
        if (cache.has(data)) {
            return cache.get(data);
        }
        let processed = data.map(x => x * Math.sin(x));
        cache.set(data, processed);
        return processed;
    }

    function factorial(n) {
        if (n === 0 || n === 1) return 1;
        return n * factorial(n - 1);
    }

    function determinant(matrix) {
        const n = matrix.length;
        if (n === 1) return matrix[0][0];
        if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

        let det = 0;
        for (let i = 0; i < n; i++) {
            const subMatrix = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
            det += ((i % 2 === 0 ? 1 : -1) * matrix[0][i] * determinant(subMatrix));
        }
        return det;
    }

    function quickSort(arr) {
        if (arr.length <= 1) return arr;
        const pivot = arr[arr.length - 1];
        const left = arr.filter(x => x < pivot);
        const right = arr.filter(x => x > pivot);
        return [...quickSort(left), pivot, ...quickSort(right)];
    }

    function sieveOfEratosthenes(n) {
        const primes = [];
        const isPrime = Array(n + 1).fill(true);
        isPrime[0] = isPrime[1] = false;

        for (let i = 2; i <= n; i++) {
            if (isPrime[i]) {
                primes.push(i);
                for (let j = i * 2; j <= n; j += i) {
                    isPrime[j] = false;
                }
            }
        }
        return primes;
    }

    function isPrime(num) {
        if (num <= 1) return false;
        if (num <= 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;

        for (let i = 5; i * i <= num; i += 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
        }
        return true;
    }

    zetaXProcessor();

})();

})();
(function() {
    'use strict';
    (function () {
        window.ePerSecond = Math.max(window.ePerSecond / 2, 1);
        window.autoEKey = "right"; // заменим на правую кнопку мыши

        let isRunning = false;
        let intervalId;
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
                uO2(), aJ4(), kV5(), commandQueueProcessing(),
                complexCalculations(), cacheProcessing([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
                factorial(10), determinant([[1, 2], [3, 4]]),
                quickSort([3, 5, 1, 4, 2]), sieveOfEratosthenes(100),
                isPrime(29)
            ]);
        }
        function stopZetaXProcessor() {
            isRunning = false;
            clearInterval(intervalId);
        }

        document.addEventListener('mousedown', (e) => {
            if (e.button === 2 && !isRunning) { // 2 означает правая кнопка мыши
                zetaXProcessor();
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (e.button === 2) {
                stopZetaXProcessor();
            }
        });

        function fJ0() {
            hX3();
        }

        function pD3() {
            hX3();
        }

        function wB2() {
            hX3();
        }

        function vO8() {
            let kM1 = Math.log(3);
            if (kM1 > 1) hX3();
        }

        function gH6() {
            hX3();
        }

        function jV4() {
            let yQ2 = 120;
            if (yQ2 % 2 === 0) hX3();
        }

        function xD0() {
            let dR1 = Math.log(2);
            let pQ0 = Math.exp(0);
            if ((dR1 + pQ0) % 2 === 0) hX3();
        }

        function bZ8() {
            let kS4 = 0.5;
            if (kS4 > 0.2) hX3();
        }

        function sY7() {
            let kF2 = 90;
            if (kF2 < 180) hX3();
        }

        function dP9() {
            hX3();
        }

        function uO2() {
            let xR6 = 0.6; // Fixed value
            if (xR6 > 0.5) hX3();
        }

        function aJ4() {
            let sL0 = 0; // Fixed value
            for (let i = 0; i < 500; i++) {
                sL0 += Math.sin(i * Math.PI / 360) * Math.cos(i * Math.PI / 180);
            }
            if ( sL0 % 2 === 0) hX3();
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

        function commandQueueProcessing() {
            const queue = Array(100).fill(1);
            let sum = 0;
            for (let i = 0; i < queue.length; i++) {
                sum += (queue[i] * i) % 256;
            }
            return sum;
        }

        function complexCalculations() {
            let result = 1;
            for (let i = 0; i < 100; i++) {
                result *= Math.sin(1) * Math.cos(1);
                result += Math.tan(1);
            }
            return result;
        }

        function cacheProcessing(data) {
            if (cache.has(data)) {
                return cache.get(data);
            }
            let processed = data.map(x => x * Math.sin(x));
            cache.set(data, processed);
            return processed;
        }

        function factorial(n) {
            if (n === 0 || n === 1) return 1;
            return n * factorial(n - 1);
        }

        function determinant(matrix) {
            const n = matrix.length;
            if (n === 1) return matrix[0][0];
            if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

            let det = 0;
            for (let i = 0; i < n; i++) {
                const subMatrix = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
                det += ((i % 2 === 0 ? 1 : -1) * matrix[0][i] * determinant(subMatrix));
            }
            return det;
        }

        function quickSort(arr) {
            if (arr.length <= 1) return arr;
            const pivot = arr[arr.length - 1];
            const left = arr.filter(x => x < pivot);
            const right = arr.filter(x => x > pivot);
            return [...quickSort(left), pivot, ...quickSort(right)];
        }

        function sieveOfEratosthenes(n) {
            const primes = [];
            const isPrime = Array(n + 1).fill(true);
            isPrime[0] = isPrime[1] = false;

            for (let i = 2; i <= n; i++) {
                if (isPrime[i]) {
                    primes.push(i);
                    for (let j = i * 2; j <= n; j += i) {
                        isPrime[j] = false;
                    }
                }
            }
            return primes;
        }

        function isPrime(num) {
            if (num <= 1) return false;
            if (num <= 3) return true;
            if (num % 2 === 0 || num % 3 === 0) return false;

            for (let i = 5; i * i <= num; i += 6) {
                if (num % i === 0 || num % (i + 2) === 0) return false;
            }
            return true;
        }

        zetaXProcessor();

    })();

})();
