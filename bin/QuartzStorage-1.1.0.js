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
        LocalStorage.prototype.setNamespace = function (namespace) {
            this.namespace = namespace;
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
        function Storage() {
            try {
                if (typeof localStorage === 'object') {
                    localStorage.setItem('testingLocalStorage', 'foo');
                    localStorage.removeItem('testingLocalStorage');
                    this.store = new Quartz.LocalStorage('Quartz');
                }
                else {
                    this.store = new Quartz.CookieStorage('Quartz');
                }
            }
            catch (e) {
                this.store = new Quartz.CookieStorage('Quartz');
            }
        }
        /**
         *
         * @param namespace
         * @returns {Storage}
         */
        Storage.getInstance = function () {
            if (!Storage.instance) {
                Storage.instance = new Storage();
            }
            return Storage.instance;
        };
        /**
         * Sets a namespace for the keys to be stored in
         *
         * @param namespace
         */
        Storage.prototype.setNamespace = function (namespace) {
            this.store.setNamespace(namespace);
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
        function CookieStorage(ns) {
            this.keys = [];
            this.storage = {};
            this._length = 0;
            this.namespace = ns + ':';
            this._length = document.cookie.match(/\=/g).length;
        }
        Object.defineProperty(CookieStorage.prototype, "length", {
            get: function () {
                return this._length;
            },
            enumerable: true,
            configurable: true
        });
        CookieStorage.prototype.getItem = function (key) {
            if (!key || !this.hasOwnProperty(key)) {
                return null;
            }
            key = this.namespace + key;
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
        };
        CookieStorage.prototype.setItem = function (key, value) {
            if (!key) {
                return;
            }
            key = this.namespace + key;
            document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
            this._length = document.cookie.match(/\=/g).length;
        };
        CookieStorage.prototype.deleteItem = function (key) {
            if (!key || !this.hasOwnProperty(key)) {
                return;
            }
            key = this.namespace + key;
            document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            this._length--;
        };
        CookieStorage.prototype.setNamespace = function (namespace) {
            this.namespace = namespace;
        };
        CookieStorage.prototype.empty = function () {
            //TODO
        };
        CookieStorage.prototype.fetch = function () {
            //TODO
        };
        return CookieStorage;
    })();
    Quartz.CookieStorage = CookieStorage;
})(Quartz || (Quartz = {}));
//# sourceMappingURL=QuartzStorage-1.1.0.js.map