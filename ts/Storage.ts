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
        constructor(namespace:string)
        {
            try {
                if (typeof localStorage === 'object') {
                    localStorage.setItem('testingLocalStorage', 'foo');
                    localStorage.removeItem('testingLocalStorage');
                    this.store = new LocalStorage(namespace);
                } else {
                    this.store = new CookieStorage(namespace);
                }
            } catch (e) {
                this.store = new CookieStorage(namespace);
            }
        }

        /**
         *
         * @param namespace
         * @returns {Storage}
         */
        public static getInstance(namespace?: string)
        {
            if (!Storage.instance) {
                if (!namespace) {
                    namespace = 'Quartz';
                }
                Storage.instance = new Storage(namespace);
            }

            return Storage.instance;
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