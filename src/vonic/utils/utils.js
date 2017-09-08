/**
 * Given a min and max, restrict the given number
 * to the range.
 * @param min the minimum
 * @param n the value
 * @param max the maximum
 */
export function clamp(min, n, max) {
    return Math.max(min, Math.min(n, max));
}

export function extend (target, source) {
    for (let key in source) {
        target[key] = source[key]
    }

    return target
}

export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function deepEqual(a, b) {
    if (a === b) {
        return true;
    }
    return JSON.stringify(a) === JSON.stringify(b);
}

export function debounce(fn, wait, immediate) {
    if (immediate === void 0) {
        immediate = false;
    }
    var timeout, args, context, timestamp, result;
    return function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var later = function () {
            var last = Date.now() - timestamp;
            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            }
            else {
                timeout = null;
                if (!immediate)
                    result = fn.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow)
            result = fn.apply(context, args);
        return result;
    };
}

export function isBoolean(val) {
    return typeof val === 'boolean';
}

export function isString(val) {
    return typeof val === 'string';
}

export function isNumber(val) {
    return typeof val === 'number';
}

export function isFunction(val) {
    return typeof val === 'function';
}

export function isDefined(val) {
    return typeof val !== 'undefined';
}
export function isUndefined(val) {
    return typeof val === 'undefined';
}

export function isPresent(val) {
    return val !== undefined && val !== null;
}

export function isBlank(val) {
    return val === undefined || val === null;
}

export function isObject(val) {
    return typeof val === 'object';
}

export function isArray(val) {
    return Array.isArray(val);
}

export function isTrueProperty(val) {
    if (typeof val === 'string') {
        val = val.toLowerCase().trim();
        return (val === 'true' || val === 'on' || val === '');
    }
    return !!val;
}

export function isCheckedProperty(a, b) {
    if (a === undefined || a === null || a === '') {
        return (b === undefined || b === null || b === '');
    }
    else if (a === true || a === 'true') {
        return (b === true || b === 'true');
    }
    else if (a === false || a === 'false') {
        return (b === false || b === 'false');
    }
    else if (a === 0 || a === '0') {
        return (b === 0 || b === '0');
    }
    // not using strict comparison on purpose
    return (a == b); // tslint:disable-line
}


export function assert(actual, reason) {
    if (!actual) {
        var message = 'IONIC ASSERT: ' + reason;
        console.error(message);
        debugger; // tslint:disable-line
        throw new Error(message);
    }
}

export function createElement (marker, parent, setFirstChild = false) {
    let el = document.createElement('div')
    el.setAttribute(marker, '')

    let container = parent || document.body;
    if (setFirstChild)
        container.insertBefore(el, container.firstChild)
    else
        container.appendChild(el)

    return el
}

export function removeElement (marker) {
    let el = document.querySelector(marker) || document.querySelector(`[${marker}]`)
    if (el)
        document.body.removeChild(el)
}

export function timeout (duration = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    })
}

export function uuid() {
    return Math.random().toString(36).substr(3, 8)
}


/**
 * transitionEnd事件注册，绑定的函数触发后会自动解绑
 * @param {HTMLElement} el      - 绑定的元素
 * @param {Function} callbackFn   - 绑定的函数
 * @return {Function}           - 取消绑定的函数
 * */
export function transitionEnd (el, callbackFn) {
    const unRegs = []

    function unregister () {
        unRegs.forEach(function (unReg) {
            unReg && unReg()
        })
    }

    function onTransitionEnd (ev) {
        if (el === ev.target) {
            callbackFn && callbackFn(ev)
            unregister()
        }
    }

    if (el) {
        registerListener(el, 'webkitTransitionEnd', onTransitionEnd, {}, unRegs)
        registerListener(el, 'transitionend', onTransitionEnd, {}, unRegs)
    }

    return unregister
}

/**
 * hashChange，hash变化后执行回调, 并自动解绑
 * @param {function} callback - 回调函数
 * @return {function} - 解绑函数
 * */
export function hashChange (callback) {
    let unReg = null

    const onHashChange = (ev) => {
        unReg && unReg()
        callback(ev)
    }

    unReg = registerListener(window, 'hashchange', onHashChange, {})
    return unReg
}

/**
 * urlChange(popstate)注册，绑定的函数触发后会自动解绑
 * @param {function} callback - 回调函数
 * @return {function} - 解绑函数
 * */
export function urlChange (callback) {
    let unReg = null
    const onStateChange = (ev) => {
        unReg && unReg()
        callback(ev)
    }
    unReg = registerListener(window, 'popstate', onStateChange, {})
    return unReg
}

/**
 *
 * 给addEventListener增加passive属性, 如果不支持将降级使用!!opts.capture, 事件的关闭需要自己手动解除, 切记!!
 * @param {any} ele                               - 监听的元素
 * @param {string} eventName                      - 监听的名称
 * @param {function} callback                     - 回调
 * @param {object} [opts]                         - addEventListener的第三个参数 EventListenerOptions
 * @param {object} [opts.capture]                 - capture
 * @param {object} [opts.passive]                 - passive
 * @param {array} [unregisterListenersCollection] - 如果提供Function[], 则unReg将压如这个列表中
 * @return {Function}                             - 返回removeEventListener的函数
 */
export function registerListener (ele, eventName, callback, opts = {}, unregisterListenersCollection) {
    // use event listener options when supported
    // otherwise it's just a boolean for the "capture" arg
    const listenerOpts = isPassive() ? {
        'capture': !!opts.capture,
        'passive': !!opts.passive
    } : !!opts.capture

    // use the native addEventListener
    ele['addEventListener'](eventName, callback, listenerOpts)

    let unReg = function unregisterListener () {
        ele['removeEventListener'](eventName, callback, listenerOpts)
    }

    if (unregisterListenersCollection && Array.isArray(unregisterListenersCollection)) {
        unregisterListenersCollection.push(unReg)
    }

    return unReg
}

/**
 * 判断的当前浏览器是否支持isPassive属性
 * @return {Boolean}
 * */
export function isPassive () {
    var supportsPassiveOption = false
    try {
        window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassiveOption = true
            }
        }))
    } catch (e) {}
    return supportsPassiveOption
}

/**
 * document的ready事件监听
 * @param {Function} [callback] - 回调函数
 * @return {Promise} - 返回promise，completed后自动解绑
 * */
export function docReady (callback) {
    let promise = null // Promise;

    if (!callback) {
        // a callback wasn't provided, so let's return a promise instead
        promise = new Promise(function (resolve) { callback = resolve })
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        callback()
    } else {
        document.addEventListener('DOMContentLoaded', completed, false)
        window.addEventListener('load', completed, false)
    }

    return promise

    function completed () {
        document.removeEventListener('DOMContentLoaded', completed, false)
        window.removeEventListener('load', completed, false)
        callback()
    }
}
