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
        private _length: number = 0;

        get length(): number
        {
            return this._length;
        }

        public namespace: string;

        constructor(ns: string)
        {
            this.namespace = ns + ':';
            this._length = document.cookie.match(/\=/g).length;
        }

        public getItem(key: string): any
        {
            if (!key || !this.hasOwnProperty(key)) {
                return null;
            }

            key = this.namespace + key;
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
        }

        public setItem(key: string, value: any): void
        {
            if(!key) {
                return;
            }

            key = this.namespace + key;
            document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
            this._length = document.cookie.match(/\=/g).length;
        }

        public deleteItem(key: string): void
        {
            if (!key || !this.hasOwnProperty(key)) {
                return;
            }

            key = this.namespace + key;
            document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            this._length--;
        }


        public setNamespace(namespace: string): void
        {
            this.namespace = namespace
        }

        public empty(): void
        {
            //TODO
        }

        private fetch()
        {
            //TODO
        }
    }
}