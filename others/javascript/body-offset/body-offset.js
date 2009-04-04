/**
 * Функция определения позиции <body>
 *
 * Требуется совместимость со следующими браузерами:
 *   • IE 6+
 *   • Firefox 2+
 *   • Opera 9.2+
 *   • Safari 3+
 *   • Google Chrome 2+
 *
 * Основная проблема в Firefox 2 и Opera 9.2, когда для body установлены следующие стили:
 *   body {
 *          position: relative;
 *          width: 500px;
 *          margin: 10% auto;
 *        }
 * Для Opera 9.2 проблема решена с помощью метода elementFromPoint,
 * хотелось бы найти более рациональное решение.
 *
 * Пример: http://js-core.googlecode.com/svn/others/javascript/body-offset/body-offset.zip
 */

function bodyOffsets() {

    // Инициализируем начальные значения позиции body
    var top = 0;
    var left = 0;

    // Создаем ссылки для быстрого доступа
    var doc = document;
    var body = doc.body;
    var documentElement = doc.documentElement;

    // Определяем браузер
    var ie = /*@cc_on!@*/false;
    var opera = window.opera && window.opera.version;
    var webkit = navigator.userAgent.toLowerCase().indexOf('webkit') != -1;
    
    // Определяем режим отображения (Quirks или Standards)
    var standards = doc.compatMode === 'CSS1Compat';

    // Создаем DOM-элемент для дальнейших проверок
    var node = doc.createElement('div');

    // Создаем функцию, возвращающую текущие стили элемента
    var computedStyle = ie ? function(node) {
        return node.currentStyle;
    } : function(node) {
        return doc.defaultView.getComputedStyle(node, null);
    };

    // Запоминаем стили body
    var style = computedStyle(body);

    // Если браузер в режиме Standards Compliance Mode
    if(standards) {
        
        // Для браузеров поддерживающих getBoundingClientRect
        // (IE 6+, Firefox 3+, Opera 9.5+, Google Chrome 2+)
        if(node.getBoundingClientRect) {
            var rect = body.getBoundingClientRect();
            top = rect.top + documentElement.scrollTop;
            left = rect.left + documentElement.scrollLeft;
        }
        // Для браузеров не поддерживающих (getBoundingClientRect)
        // (Firefox 2, Opera 9.2, Safari 3)
        else {
            // Если body {position: static}
            if(style.position == 'static') {
                // Сбрасываем возможные пользовательские стили для служебного блока и абсолютно позиционируем его
                node.style.cssText = 'position: static; margin: 0; padding: 0; float: none; width: auto; height: auto; border: none;';
                // Помещаем в начало списка дочерних элементов body
                body.insertBefore(node, body.firstChild);
                // Расчитываем смещение относительно documentElement
                top = node.offsetTop - (parseInt(style.paddingTop) || 0);
                left = node.offsetLeft - (parseInt(style.paddingLeft) || 0);
                // Для Opera 9.2 учитываем border
                if(opera) {
                    top -= parseInt(style.borderTopWidth) || 0;
                    left -= parseInt(style.borderLeftWidth) || 0;
                }
                // Удаляем служебный элемент
                body.removeChild(node);
            }
            // Если body {position: relative}
            else if(style.position == 'relative') {
                // Если не Safari
                if(!webkit) {
                    // Если Opera 9.2
                    if(doc.elementFromPoint) {
                        var element, top1;
                        // Сбрасываем возможные пользовательские стили для служебного блока и абсолютно позиционируем его
                        // Важно: z-index должен быть таким, чтобы элемент был сверху
                        node.style.cssText = 'position: absolute; top: 0; left: 0; width: 10px; height: 10px; z-index: 99999;';
                        // Создаем специальный ключ, по которому можно будет быстро и однозначно идентифицированть
                        // служебный элемент
                        node.specialKey = 1;
                        // Определяем начальную позицию
                        top = parseInt(style.marginTop) || 0;
                        top1 = top + (parseInt(style.borderTopWidth) || 0);
                        left = -1;
                        // Добавляем служебный блок в конец списка дочерних узлов body
                        body.appendChild(node);
                        // Пока не попадем на служебный элемент, изменяем координату по x
                        // и получаем элемент в точке (top, left)
                        while(element = doc.elementFromPoint(++left, top1)) if(element.specialKey) break;
                        // Удаляем служебный элемент
                        body.removeChild(node);
                        // Учитываем border для body
                        left -= parseInt(style.borderLeftWidth) || 0;
                    }
                    // Если Firefox 2
                    else {
                        // как победить? :-)
                    }
                }
                // Safari нормально рассчитывает marginTop/marginLeft
                else {
                    top = parseInt(style.marginTop) || 0;
                    left = parseInt(style.marginLeft) || 0;
                }
            }
        }
    }
    // Если браузер в режиме Quirks Mode
    else {
        // …
    }
    
    return {top: top, left: left};
}

