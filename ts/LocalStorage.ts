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
            var keys = Object.keys(localStorage);
            return Quartz.Storage.nameSpaceKeyFilter(keys, this.namespace).length;
        }

        public namespace: string = '';

        constructor(namespace: string)
        {
            this.setNamespace(namespace);
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
            var spacedKeys = Quartz.Storage.nameSpaceKeyFilter(keys, this.namespace);
            for (var i = 0; i < spacedKeys.length; i++) {
                localStorage.removeItem(spacedKeys[i]);
            }
        }

        public setNamespace(namespace: string): void
        {
            if (namespace) {
                this.namespace = namespace + ':'
            }
        }
    }
}