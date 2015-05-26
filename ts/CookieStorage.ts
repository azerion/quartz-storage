/// <reference path="references.ts" />
module Quartz
{
    /**
     * Storage driver for cookies
     */
    export class CookieStorage implements StorageInterface
    {
        private keys = [];
        private storage = {};

        get length(): number
        {
            return this.keys.length;
        }

        public namespace: string;

        constructor(namespace: string)
        {
            this.namespace = namespace + ':';
        }

        public getItem(key: string): any
        {
            return localStorage.getItem(this.namespace + key);
        }

        public setItem(key: string, value: any): void
        {
            if(!key) { return; }
            document.cookie = encodeURI(this.namespace +key) + "=" + encodeURI(value) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";

        }

        public deleteItem(key: string): void
        {
            if(!key) { return; }
            document.cookie = encodeURI(this.namespace + key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

        }

        public empty(): void
        {
            var keys = Object.keys(localStorage);
            var spacedKeys = keys.filter((keyName: string) => {
                return (keyName.indexOf(this.namespace) !== -1);
            });

            for (var i = 0; i < spacedKeys.length; i++) {
                localStorage.removeItem(spacedKeys[i]);
            }
        }

        private fetch()
        {
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
        }
    }
}