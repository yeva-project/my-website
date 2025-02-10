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
  toggleElement.innerHTML = "Auto E Nego";
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


    const toggleMenu = () => {
        menuVisible = !menuVisible;
        menu.style.display = menuVisible ? 'block' : 'none';
    };


    const exitButton = document.getElementById('exit');
    exitButton.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Эта кнопка не должна быть нажата!');
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
