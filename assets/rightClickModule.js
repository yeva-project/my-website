(function() {
    'use strict';

    // Ждём, когда страница полностью загрузится
    window.addEventListener('load', () => {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '50%';
        notification.style.left = '50%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.padding = '20px';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = '#fff';
        notification.style.fontSize = '20px';
        notification.style.borderRadius = '10px';
        notification.style.zIndex = '9999';
        notification.style.textAlign = 'center';

        // Устанавливаем текст уведомления
        notification.innerText = 'Обновления ждите тгк @nerest_skripts';

        // Добавляем элемент на страницу
        document.body.appendChild(notification);

        // Удаляем уведомление через 10 секунд
        setTimeout(() => {
            notification.remove();
        }, 100000);
    });
})();
