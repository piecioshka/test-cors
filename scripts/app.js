/*global Function, window, console */

(function () {
    'use strict';

    var bind = Function.prototype.bind;
    var $ = bind.call(document.querySelector, document);
    var rDomain = /^https?:\/\/.+$/;
    var $domain = $('#domain');
    var $result = $('#result');

    function assert(cond, msg) {
        if (!cond) throw new Error(msg || 'AssertionError');
    }

    function pad(n) {
        assert(typeof n === 'number', 'Passed value is not a number');
        return (n < 10) ? '0' + n : n;
    }

    function time() {
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var ml = d.getMilliseconds();
        return '[' + pad(h) + ':' + pad(m) + ':' + pad(s) + '.' + ml + ']';
    }

    function warn(msg) {
        $result.innerHTML += time() + ' ' + '<span class="bg-warning">' + msg + "</span>\n";
        console.warn(msg);
    }

    function log(msg) {
        $result.innerHTML += time() + ' ' + msg + "\n";
        console.log(msg);
    };

    function info(msg) {
        $result.innerHTML += time() + ' ' + '<span class="bg-success">' + msg + "</span>\n";
        console.info(msg);
    }

    function error(msg) {
        $result.innerHTML += time() + ' ' + '<span class="bg-danger">' + msg + "</span>\n";
        console.error(msg);
    }

    function clear() {
        $result.innerHTML = '';
        console.clear();
    }

    function checkConnection(domain) {
        assert(typeof domain === 'string', 'Passed value is not a string!');
        assert(isDomain(domain), 'Passed domain is not correct!');

        log('Create request.');
        var xhr = new XMLHttpRequest();
        assert('withCredentials' in xhr, "Sorry, your browser doesn't support CORS");
        xhr.open('GET', domain, true);
        xhr.withCredentials = true;
        xhr.onload = function () {
            log(xhr.responseText);
        };
        xhr.onerror = function (e) {
            error('An error occurred');
        };
        xhr.onreadystatechange = function () {
            var status = xhr.status;
            var readyState = xhr.readyState;

            log(' > Current HTTP Status ' + status + ', with readyState ' + readyState);

            if (status === 200 && readyState === XMLHttpRequest.DONE) {
                info('Success - CORS enabled.');
            }
        };
        xhr.send();
        log('Send request.');
    }

    function isDomain(string) {
        return rDomain.test(string);
    }

    function main() {
        // Handle form.
        $('#form').addEventListener('submit', function (evt) {
            evt.preventDefault();
            clear();
            warn('Checking domain: "' + $domain.value + '"');
            checkConnection($domain.value);
        });

        // Set focus() on input.
        $domain.focus();

        // Set global error handler.
        window.onerror = function (msg, file, line) {
            error(msg + ' ' + file + ':' + line);
        };

        // Set handle to hash change.
        window.onhashchange = function () {
            $domain.value = location.hash.substr(1);
        };

        // Get URL from hash.
        if (location.hash) {
            $domain.value = location.hash.substr(1);
        }
    }

    // Go go go!!1
    main();
}());
