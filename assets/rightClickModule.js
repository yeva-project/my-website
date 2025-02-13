// ==UserScript==
// @name         am am am
// @namespace    none
// @version      24141424
// @description  none
// @author       none
// @grant        none
// ==/UserScript==

(function () {
  'use strict';


  window.autoResetKey = "r";
  window.ePerSecond = 250000;
  window.autoekey = ' ';

  function get(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }



  function showResetMessage() {
    const message = document.createElement("div");
    message.innerText = "Reset";
    Object.assign(message.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "16px",
      fontWeight: "bold",
      color: "black",
      zIndex: "9999",
      textShadow: "0 0 5px rgba(255, 255, 255, 0.8)",
    });
    document.body.appendChild(message);
    setTimeout(() => {
      message.style.display = "none";
    }, 2000);
  }

  function trackCount() {
    let count = localStorage.getItem("ctt");
    return count === null ? 0 : parseInt(count, 10);
  }

  function updateCounter() {
    return;
  }

  updateCounter();
  window.Function = new Proxy(window.Function, {
    construct: function (target, args) {
      return new target(args[0]);
    }
  });


  const toggleElement = document.createElement("div");
  toggleElement.innerHTML = "𝒜𝓊𝓉𝑜 𝐸 𝓌𝑒𝑒𝓈𝓉";
  Object.assign(toggleElement.style, {
    color: "black",
    position: "fixed",
    backgroundColor: "transparent",
    userSelect: "none",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    visibility: "hidden",
    fontSize: "32px",
    fontWeight: "bold",
    textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
    animation: "colorPulse 3s infinite alternate",
  });
  document.body.appendChild(toggleElement);
  let isActive = false;


  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes colorPulse {
      0% {
        color: #ff0000; /* Начальный цвет (красный) */
      }
      50% {
        color: #00ff00; /* Промежуточный цвет (зелёный) */
      }
      100% {
        color: #0000ff; /* Конечный цвет (синий) */
      }
    }
  `;
  document.head.appendChild(styleSheet);

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function toggleAutoAction() {
    isActive = !isActive;
    toggleElement.style.visibility = isActive ? "visible" : "hidden";

    while (isActive) {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: 'e', code: "KeyE" }));
      await delay(1);
      window.dispatchEvent(new KeyboardEvent("keyup", { key: 'e', code: "KeyE" }));
    }
  }

  document.addEventListener("keydown", function (event) {
    if (event.keyCode === 120) {
      toggleAutoAction();
    }
  });
  document.querySelectorAll("[data-time], [data-delay], [data-animation-delay], [data-transition-delay]").forEach(element => {
    element.removeAttribute("data-time");
    element.removeAttribute("data-delay");
    element.removeAttribute("data-animation-delay");
    element.removeAttribute("data-transition-delay");
  });
  document.querySelectorAll("[style*='transition'], [style*='animation']").forEach(element => {
    element.style.transition = "none";
    element.style.animation = "none";
  });
  document.querySelectorAll("script").forEach(script => {
    script.textContent = script.textContent.replace(/requestAnimationFrame\([^,]+,?\s*\d+\s*\)/g, "requestAnimationFrame(() => {}, 0)");
    script.textContent = script.textContent.replace(/window\.addEventListener\(['"]load['"]\s*,\s*function[^{]+{[^}]+}\)/g, '');
    script.textContent = script.textContent.replace(/navigator\.onLine\s*&&\s*[^;]+;/g, '');
  });
  let isPpk = false;
  document.addEventListener("keydown", async function (event) {
    if (event.key === 'F9') {
      await delay(2000);
      isPpk = !isPpk;
      while (isPpk) {
        await delay(50);
      }
    } else {
      isPpk = false;
    }
  });
  async function startAutoE() {
    while (isPpk) {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: 'e', code: "KeyE" }));
      await delay(1);
      window.dispatchEvent(new KeyboardEvent("keyup", { key: 'e', code: "KeyE" }));
    }
  }

  startAutoE();
  function injectCustomScript() {
    const script = document.createElement("script");
    script.innerHTML = `
      let isActive = false;
      let ePerSecond = ${window.ePerSecond};
      let key = '${window.autoekey}';

      document.addEventListener('keydown', event => {
        if (event.key === key) isActive = true;
      });

      document.addEventListener('keyup', event => {
        if (event.key === key) isActive = false;
      });
      setInterval(() => {
        if (isActive) {
          for (let i = 0; i < ePerSecond / 500; i++) {
            const eventDown = new KeyboardEvent('keydown', { key: 'e', code: 'KeyE' });
            const eventUp = new KeyboardEvent('keyup', { key: 'e', code: 'KeyE' });
            window.dispatchEvent(eventDown);
            window.dispatchEvent(eventUp);
          }
        }
      }, 1);
    `;
    document.head.appendChild(script);
  }
  injectCustomScript();


  document.addEventListener('keyup', function (event) {

    if (event.key === 'r' || event.key === 'к') {
      showResetMessage();
    }
  });

})();

// ==UserScript==
// @name         не читать геи
// @namespace    none
// @version      none
// @description  хз хз!
// @author       нит
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let speed = 1;

    function setTimeSpeed(multiplier) {
        speed = multiplier;
    }


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


    window.autoEKey = "q";
    window.useRightClick = true;
    window.ePerSecond = 999999999999999999999999999999999999999999999999

    let pickingUpItem = false;
    let ePressInterval;
    let ePressCount = 0;


    function startAutoE() {
        if (!ePressInterval) {
            ePressInterval = setInterval(() => {
                const KeyISdown = new KeyboardEvent('keydown', { key: 'e', keyCode: 69, code: 'KeyE' });
                const KeyISup = new KeyboardEvent('keyup', { key: 'e', keyCode: 69, code: 'KeyE' });
                window.dispatchEvent(KeyISdown);
                window.dispatchEvent(KeyISup);
                ePressCount++;
            }, 0);
        }
    }


    function stopAutoE() {
        clearInterval(ePressInterval);
        ePressInterval = null;
    }


    let scriptEnabled = false;
    let menuVisible = false;
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '10px';
    menu.style.right = '10px';
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
            <button id="enableScript" style="width: 100%; padding: 5px;">𝔈𝔫𝔞𝔟𝔩𝔢 𝔰𝔠𝔯𝔦𝔭𝔱</button>
        </div>
        <div style="margin-bottom: 5px;">
            <button id="disableScript" style="width: 100%; padding: 5px;">𝔇𝔦𝔰𝔞𝔟𝔩𝔢 𝔰𝔠𝔯𝔦𝔭𝔱</button>
        </div>
        <div>
            <button id="exit" style="color: white; background-color: red; border: 1px solid white; width: 100%; padding: 5px;">𝘸єє𝔰𝕥_𝓫𝓮𝓴</button>
        </div>
    `;
    document.body.appendChild(menu);


    const toggleMenu = () => {
        menuVisible = !menuVisible;
        menu.style.display = menuVisible ? 'block' : 'none';
    };


    const exitButton = document.getElementById('exit');
    exitButton.addEventListener('click', (e) => {
        e.preventDefault();
        alert('телочку на веранде оу ес');
        location.reload();
    });


    const enableButton = document.getElementById('enableScript');
    enableButton.addEventListener('click', () => {
        scriptEnabled = true;
        alert('Скрипт включен!');
        menu.style.display = 'none';
        menuVisible = false;
        runOriginalScript();
    });


    const disableButton = document.getElementById('disableScript');
    disableButton.addEventListener('click', () => {
        scriptEnabled = false;
        alert('Скрипт отключен!');
        menu.style.display = 'none';
        menuVisible = false;
        stopOriginalScript();
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === 'Insert') {
            toggleMenu();
        }
    });


    document.addEventListener('mousedown', (e) => {
        if (e.button === 2 && scriptEnabled) {
            e.preventDefault();
            executeECommands();
        }
    });


    document.addEventListener("mousedown", function(event) {
        if (event.button === 2 && scriptEnabled) {
            pickingUpItem = true;
            setTimeSpeed(3);
            startAutoE();
        }
    });

    document.addEventListener("mouseup", function(event) {
        if (event.button === 2) {
            pickingUpItem = false;
            setTimeSpeed(1);
            stopAutoE();
        }
    });

})();

// ==UserScript==
// @name         гей
// @namespace    none
// @version      none
// @description  none
// @author       You
// @match        none
// @grant        none
// ==/UserScript==

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

    creditsDisplay.innerHTML = 'weest_bek | <a href="https://docs.google.com/spreadsheets/d/1bqLvzatj1TBfln0rGBf8X96T_UzXUhTykiiM9Y6cLVU/edit?gid=1695479590#gid=1695479590" target="_blank" style="color: white; text-decoration: underline;">Инструкция</a>';

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

// ==UserScript==
// @name         ам ам чел
// @namespace    none
// @version      none
// @description  none
// @author       none
// @match        none
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const googleScriptURL = "https://script.google.com/macros/s/AKfycbzXZHV5ch-DwydZZ_T5AK_q8r2ex2Vbyp7NKALcSQE4UqGiwCFyisHs9taESMTElL4X/exec";  // Ваша ссылка

    function updatePlayersCount() {
        GM_xmlhttpRequest({
            method: "GET",
            url: googleScriptURL,
            onload: function(response) {
                let count = response.responseText;
                displayPlayersCount(count);
            }
        });
    }

    function displayPlayersCount(count) {
        let element = document.createElement('div');
        element.style.position = 'fixed';
        element.style.top = '10px';
        element.style.right = '10px';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        element.style.padding = '5px 10px';
        element.style.borderRadius = '5px';
        element.style.fontSize = '16px';
        element.style.fontWeight = 'bold';
        element.style.animation = 'rainbow 3s infinite';

        element.innerText = `Зашли за день: ${count}типов`;

        let style = document.createElement('style');
        style.innerHTML = `
            @keyframes rainbow {
                0% { color: red; }
                16% { color: orange; }
                32% { color: yellow; }
                48% { color: green; }
                64% { color: blue; }
                80% { color: indigo; }
                100% { color: violet; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(element);
    }

    updatePlayersCount();
})();
