/// <reference path="references.ts" />
module Quartz
{
    /**
     * Interface that should be implemented by StorageDriver
     */
    export interface StorageInterface
    {
        //The amount of items in the storage
        length: number;

        //The namespace for the current storge
        namespace:string;

        //Get an item from the storage
        getItem(key: string): any;

        //Set an item in the storage
        setItem(key: string, value:any): void;

        //Remove an item from the storage
        deleteItem(key: string): void;

        //empty the (namespaced) storage
        empty(): void;

        setNamespace(namespace: string): void;
    }

    /**
     * Storage manager, on construction it should decide on which driver it should use for writing data
     */
    export class Storage
    {
        private static instance: Storage

        /**
         * property for the driver
         */
        private store: StorageInterface;

        /**
         *
         * @param namespace
         */
        constructor()
        {
            try {
                if (typeof localStorage === 'object') {
                    localStorage.setItem('testingLocalStorage', 'foo');
                    localStorage.removeItem('testingLocalStorage');
                    this.store = new LocalStorage('Quartz');
                } else {
                    this.store = new CookieStorage('Quartz');
                }
            } catch (e) {
                this.store = new CookieStorage('Quartz');
            }
        }

        /**
         *
         * @param namespace
         * @returns {Storage}
         */
        public static getInstance(): Storage
        {
            if (!Storage.instance) {
                Storage.instance = new Storage();
            }

            return Storage.instance;
        }

        /**
         * Sets a namespace for the keys to be stored in
         *
         * @param namespace
         */
        public setNamespace(namespace: string): void
        {
            this.store.setNamespace(namespace);
        }

        /**
         * Get an item from storage
         *
         * @param key
         * @returns {any}
         */
        public get(key: string): string
        {
            return this.store.getItem(key);
        }

        /**
         * Set an item in storage
         *
         * @param key
         * @param value
         * @returns {Quartz.Storage}
         */
        public set(key: string, value: any): Storage
        {
            this.store.setItem(key, value);

            return this;
        }
    }
}