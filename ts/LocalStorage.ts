/// <reference path="references.ts" />
module Quartz
{
    /**
     * Storage driver for browser's localStorage
     */
    export class LocalStorage implements StorageInterface
    {
        get length(): number
        {
            return localStorage.length;
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
            localStorage.setItem(this.namespace + key, value);
        }

        public deleteItem(key: string): void
        {
            localStorage.removeItem(this.namespace + key);
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
    }
}