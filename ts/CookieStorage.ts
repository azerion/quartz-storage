/// <reference path="references.ts" />
module Quartz
{
    /**
     * Storage driver for cookies
     */
    export class CookieStorage implements StorageInterface
    {
        private keys: string[] = [];
        private reg: RegExp;

        get length(): number
        {
            return (this.getNameSpaceMatches() !== null) ? this.getNameSpaceMatches().length : 0
        }

        public namespace: string = '';

        constructor(ns: string)
        {
            this.setNamespace(ns);
        }

        public getItem(key: string): string
        {
            return this.getCookiesForNameSpace()[key] || null;
        }

        public setItem(key: string, value: any): void
        {
            document.cookie = encodeURIComponent(this.namespace + key) + "=" + encodeURIComponent(value) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
        }

        public deleteItem(key: string): void
        {
            document.cookie = encodeURIComponent(this.namespace + key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        }


        public setNamespace(namespace: string): void
        {
            if (namespace) {
                this.namespace = namespace + ':';
                this.reg = new RegExp('^' + this.namespace + '[a-zA-Z0-9]*', 'g');
            }
        }

        public empty(): void
        {
            var cookies = this.getCookiesForNameSpace();
            for (var key in cookies) {
                this.deleteItem(key);
            }
        }

        private getNameSpaceMatches(): string[]
        {
            var cookies = decodeURIComponent(document.cookie).split('; ');
            console.log(cookies)
            return cookies.filter((val: string) => {
                return (val.match(this.reg) !== null) ? val.match(this.reg).length > 0 : false;
            });
        }

        private getCookiesForNameSpace(): {[name: string]: string}
        {
            var cookies:{[name: string]: string} = {};
            this.getNameSpaceMatches().forEach((cookie: string) => {
                var temp = cookie.replace(this.namespace, '').split('=');
                cookies[temp[0]] = temp[1];
            });
            return cookies;
        }
    }
}