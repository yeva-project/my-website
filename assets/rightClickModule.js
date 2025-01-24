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
    function generateDeviceId() {
        return `${navigator.userAgent}-${Math.random().toString(36).substring(2)}`;
    }

    // 取得已使用授權金鑰的裝置列表
    function getRegisteredDevices() {
        let devices = localStorage.getItem(deviceStorageKey);
        return devices ? JSON.parse(devices) : [];
    }

    // 保存已使用身份驗證金鑰的裝置的更新列表
    function saveRegisteredDevices(devices) {
        localStorage.setItem(deviceStorageKey, JSON.stringify(devices));
    }

    // 檢查設備是否已註冊
    function isDeviceRegistered(deviceId) {
        const devices = getRegisteredDevices();
        return devices.includes(deviceId);
    }

    // 將新設備新增至已註冊設備清單中
    function registerDevice(deviceId) {
        const devices = getRegisteredDevices();
        devices.push(deviceId);
        saveRegisteredDevices(devices);
    }

    // 檢查註冊設備數量是否超過限制
    function checkDeviceLimit() {
        const devices = getRegisteredDevices();
        return devices.length >= maxDevices;
    }

    // 詢問授權密鑰
    function promptForAuthKey() {
        const enteredKey = prompt("Please enter the auth key:");
        return enteredKey === authKey;
    }

    // 驗證金鑰驗證和設備檢查
    function validateAuth() {
        // 產生或檢索目前設備 ID
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = generateDeviceId();
            localStorage.setItem('deviceId', deviceId);
        }

        // 檢查設備是否已註冊
        if (isDeviceRegistered(deviceId)) {
            console.log("Device is already authorized. Running the script...");
            return true;  // 驗證成功
        } else {
            // 檢查裝置限制並提示輸入授權金鑰
            if (checkDeviceLimit()) {
                alert("Auth key limit reached. The script will not run on this device.");
                return false;  // 授權失敗
            } else {
                if (promptForAuthKey()) {
                    console.log("Auth key validated. Registering the device and running the script...");
                    registerDevice(deviceId);
                    return true;  // 授權成功
                } else {
                    alert("Invalid auth key. The script will not run.");
                    return false;  // 授權失敗
                }
            }
        }
    }

    // 僅當身份驗證成功時才運行腳本
    if (!validateAuth()) {
        return;
    }
    // TimeMachine：當玩家在撿東西按下熱時把遊戲時間改成快150倍
    let speed = 1;

    function setTimeSpeed(multiplier) {
        speed = multiplier;
    }

    //用TimeMachine 腳本的效能 API 覆蓋
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
    window.ePerSecond = 20 //每秒十次點擊"E"

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
            }, 1);  // 每1ms重複一次（每次等於10次）
        }
    }

    // 停止AutoEEE的功能
    function stopAutoE() {
        clearInterval(ePressInterval);
        ePressInterval = null;
    }

    // 建立自訂義的AutoE狀態面板
    let espContainer = document.createElement('div');
    espContainer.id = 'espContainer';
    espContainer.style.position = 'absolute';
    espContainer.style.top = '20px';
    espContainer.style.left = '20px';
    espContainer.style.zIndex = '9999';  // 保持在最上面
    document.body.appendChild(espContainer);

    const statusDiv = document.createElement('div');
    statusDiv.textContent = "AutoE:OFF[Speedx1]";  // 預設為OFF(沒觸發時為OFF)
    statusDiv.style.position = 'absolute';
    statusDiv.style.color = 'red';
    statusDiv.style.fontSize = '14px';
    statusDiv.style.left = '190px';  // 靜態位置：Y軸
    statusDiv.style.top = '45px';    // 靜態位置：X軸
    espContainer.appendChild(statusDiv);

    // 建立自訂義AutoE計數器面板顯示 “AutoE[??/s]”
    const eCounterDiv = document.createElement('div');
    eCounterDiv.textContent = "AutoE[0/s]";
    eCounterDiv.style.position = 'absolute';
    eCounterDiv.style.color = 'red';
    eCounterDiv.style.fontSize = '14px';
    eCounterDiv.style.left = '190px';  // 靜態位置：Y軸
    eCounterDiv.style.top = '60px';    // 靜態位置：X軸
    espContainer.appendChild(eCounterDiv);

    // 更新按下"E"的計數（每1秒更新一次）
    setInterval(() => {
        eCounterDiv.textContent = `AutoE[${ePressCount}/s]`;  // 更新計數器顯示
        ePressCount = 0;  // 每秒重置為0
    }, 2000); //更新延遲

    // 右鍵熱鍵觸發的監聽器
    document.addEventListener("mousedown", function(event) {
        if (event.button === 2) {  // 右鍵(通稱Button 2)
            pickingUpItem = true;
            setTimeSpeed(250);  // 當觸發時遊戲時間更改為150倍
            startAutoE();  // 開始連點AutoE
            statusDiv.style.color = 'green'; //觸發顏色：綠色
            statusDiv.textContent = "AutoE:ON[Speedx150]";  // 顯示狀態為"AutoE:ON[Speedx150]"
        }
    });

    document.addEventListener("mouseup", function(event) {
        if (event.button === 2) {  // 右鍵(通稱Button 2)
            pickingUpItem = false;
            setTimeSpeed(1);  // 當鬆開右鍵時把遊戲時間調回去正常(默認為1)
            stopAutoE();  // 停止連點AutoE
            statusDiv.style.color = 'red'; //未觸發顏色：紅色
            statusDiv.textContent = "AutoE:OFF[Speedx1]";  // 顯示狀態為AutoE:OFF[Speedx1]"
        }
    });

})();
