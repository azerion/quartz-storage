/// <reference path="references.ts" />
var Quartz;
(function (Quartz) {
    /**
     * Storage driver for browser's localStorage
     */
    var LocalStorage = (function () {
        function LocalStorage(namespace) {
            this.namespace = '';
            this.setNamespace(namespace);
        }
        Object.defineProperty(LocalStorage.prototype, "length", {
            get: function () {
                var keys = Object.keys(localStorage);
                return Quartz.Storage.nameSpaceKeyFilter(keys, this.namespace).length;
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
            var keys = Object.keys(localStorage);
            var spacedKeys = Quartz.Storage.nameSpaceKeyFilter(keys, this.namespace);
            for (var i = 0; i < spacedKeys.length; i++) {
                localStorage.removeItem(spacedKeys[i]);
            }
        };
        LocalStorage.prototype.setNamespace = function (namespace) {
            if (namespace) {
                this.namespace = namespace + ':';
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
        function Storage() {
            /**
             * property for the driver
             */
            this.store = null;
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
            return this;
        }
        /**
         *
         * @param namespace
         * @returns {Storage}
         */
        Storage.getInstance = function () {
            if (null === Quartz.Storage.instance) {
                Quartz.Storage.instance = new Quartz.Storage();
            }
            return Quartz.Storage.instance;
        };
        Storage.nameSpaceKeyFilter = function (keys, namespace) {
            return keys.filter(function (keyName) {
                return (keyName.substring(0, namespace.length) === namespace);
            });
        };
        /**
         * Sets a namespace for the keys to be stored in
         *
         * @param namespace
         */
        Storage.prototype.setNamespace = function (namespace) {
            if (null === this.store) {
                throw new Error('No storage available, unable to set namespace: ' + namespace);
            }
            this.store.setNamespace(namespace);
            return this;
        };
        /**
         * Get an item from storage
         *
         * @param key
         * @returns {any}
         */
        Storage.prototype.get = function (key) {
            if (null === this.store) {
                throw new Error('No storage available, unable to get key: ' + key);
            }
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
            if (null === this.store) {
                throw new Error('No storage available, unable to set key: ' + key);
            }
            this.store.setItem(key, value);
            return this;
        };
        Storage.instance = null;
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
            this.namespace = '';
            this.setNamespace(ns);
        }
        Object.defineProperty(CookieStorage.prototype, "length", {
            get: function () {
                return (this.getNameSpaceMatches() !== null) ? this.getNameSpaceMatches().length : 0;
            },
            enumerable: true,
            configurable: true
        });
        CookieStorage.prototype.getItem = function (key) {
            return this.getCookiesForNameSpace()[key] || null;
        };
        CookieStorage.prototype.setItem = function (key, value) {
            document.cookie = encodeURIComponent(this.namespace + key) + "=" + encodeURIComponent(value) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
        };
        CookieStorage.prototype.deleteItem = function (key) {
            document.cookie = encodeURIComponent(this.namespace + key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        };
        CookieStorage.prototype.setNamespace = function (namespace) {
            if (namespace) {
                this.namespace = namespace + ':';
                this.reg = new RegExp('^' + this.namespace + '[a-zA-Z0-9]*', 'g');
            }
        };
        CookieStorage.prototype.empty = function () {
            var cookies = this.getCookiesForNameSpace();
            for (var key in cookies) {
                this.deleteItem(key);
            }
        };
        CookieStorage.prototype.getNameSpaceMatches = function () {
            var _this = this;
            var cookies = decodeURIComponent(document.cookie).split(' ');
            return cookies.filter(function (val) {
                return (val.match(_this.reg) !== null) ? val.match(_this.reg).length > 0 : false;
            });
        };
        CookieStorage.prototype.getCookiesForNameSpace = function () {
            var _this = this;
            var cookies = {};
            this.getNameSpaceMatches().forEach(function (cookie) {
                var temp = cookie.replace(_this.namespace, '').split('=');
                cookies[temp[0]] = temp[1];
            });
            return cookies;
        };
        return CookieStorage;
    })();
    Quartz.CookieStorage = CookieStorage;
})(Quartz || (Quartz = {}));
//# sourceMappingURL=quartz-storage.js.map