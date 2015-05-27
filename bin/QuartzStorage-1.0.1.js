/// <reference path="references.ts" />
var Quartz;
(function (Quartz) {
    /**
     * Storage driver for browser's localStorage
     */
    var LocalStorage = (function () {
        function LocalStorage(namespace) {
            this.namespace = namespace + ':';
        }
        Object.defineProperty(LocalStorage.prototype, "length", {
            get: function () {
                return localStorage.length;
            },
            enumerable: true,
            configurable: true
        });
        LocalStorage.prototype.getItem = function (key) {
            return localStorage.getItem(this.namespace + key);
        };
        LocalStorage.prototype.setItem = function (key, value) {
            localStorage.setItem(this.namespace + key, value);
        };
        LocalStorage.prototype.deleteItem = function (key) {
            localStorage.removeItem(this.namespace + key);
        };
        LocalStorage.prototype.empty = function () {
            var _this = this;
            var keys = Object.keys(localStorage);
            var spacedKeys = keys.filter(function (keyName) {
                return (keyName.indexOf(_this.namespace) !== -1);
            });
            for (var i = 0; i < spacedKeys.length; i++) {
                localStorage.removeItem(spacedKeys[i]);
            }
        };
        return LocalStorage;
    })();
    Quartz.LocalStorage = LocalStorage;
})(Quartz || (Quartz = {}));
/// <reference path="references.ts" />
var Quartz;
(function (Quartz) {
    /**
     * Storage manager, on construction it should decide on which driver it should use for writing data
     */
    var Storage = (function () {
        /**
         *
         * @param namespace
         */
        function Storage(namespace) {
            if (typeof localStorage === 'object') {
                try {
                    localStorage.setItem('testingLocalStorage', 'foo');
                    localStorage.removeItem('testingLocalStorage');
                    this.store = new Quartz.LocalStorage(namespace);
                }
                catch (e) {
                }
            }
            this.store = new Quartz.CookieStorage(namespace);
        }
        /**
         *
         * @param namespace
         * @returns {Storage}
         */
        Storage.getInstance = function (namespace) {
            if (!Storage.instance) {
                if (!namespace) {
                    namespace = 'Quartz';
                }
                Storage.instance = new Storage(namespace);
            }
            return Storage.instance;
        };
        /**
         * Get an item from storage
         *
         * @param key
         * @returns {any}
         */
        Storage.prototype.get = function (key) {
            return this.store.getItem(key);
        };
        /**
         * Set an item in storage
         *
         * @param key
         * @param value
         * @returns {Quartz.Storage}
         */
        Storage.prototype.set = function (key, value) {
            this.store.setItem(key, value);
            return this;
        };
        return Storage;
    })();
    Quartz.Storage = Storage;
})(Quartz || (Quartz = {}));
/// <reference path="references.ts" />
var Quartz;
(function (Quartz) {
    /**
     * Storage driver for cookies
     */
    var CookieStorage = (function () {
        function CookieStorage(namespace) {
            this.keys = [];
            this.storage = {};
            this.namespace = namespace + ':';
        }
        Object.defineProperty(CookieStorage.prototype, "length", {
            get: function () {
                return this.keys.length;
            },
            enumerable: true,
            configurable: true
        });
        CookieStorage.prototype.getItem = function (key) {
            return localStorage.getItem(this.namespace + key);
        };
        CookieStorage.prototype.setItem = function (key, value) {
            if (!key) {
                return;
            }
            document.cookie = encodeURI(this.namespace + key) + "=" + encodeURI(value) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
        };
        CookieStorage.prototype.deleteItem = function (key) {
            if (!key) {
                return;
            }
            document.cookie = encodeURI(this.namespace + key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        };
        CookieStorage.prototype.empty = function () {
            var _this = this;
            var keys = Object.keys(localStorage);
            var spacedKeys = keys.filter(function (keyName) {
                return (keyName.indexOf(_this.namespace) !== -1);
            });
            for (var i = 0; i < spacedKeys.length; i++) {
                localStorage.removeItem(spacedKeys[i]);
            }
        };
        CookieStorage.prototype.fetch = function () {
            var iThisIndx;
            for (var sKey in this.storage) {
                iThisIndx = this.keys.indexOf(sKey);
                if (iThisIndx === -1) {
                    this.setItem(sKey, this.storage[sKey]);
                }
                else {
                    this.keys.splice(iThisIndx, 1);
                }
                delete this.storage[sKey];
            }
            for (this.keys; this.keys.length > 0; this.keys.splice(0, 1)) {
                this.deleteItem(this.keys[0]);
            }
            for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
                aCouple = aCouples[nIdx].split(/\s*=\s*/);
                if (aCouple.length > 1) {
                    this.storage[iKey = aCouple[0]] = aCouple[1];
                    this.keys.push(iKey);
                }
            }
            return this.storage;
        };
        return CookieStorage;
    })();
    Quartz.CookieStorage = CookieStorage;
})(Quartz || (Quartz = {}));
//# sourceMappingURL=QuartzStorage-1.0.1.js.map