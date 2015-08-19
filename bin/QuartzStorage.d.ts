declare module Quartz {
    /**
     * Storage driver for browser's localStorage
     */
    class LocalStorage implements StorageInterface {
        length: number;
        namespace: string;
        constructor(namespace: string);
        getItem(key: string): any;
        setItem(key: string, value: any): void;
        deleteItem(key: string): void;
        empty(): void;
        setNamespace(namespace: string): void;
    }
}
declare module Quartz {
    /**
     * Interface that should be implemented by StorageDriver
     */
    interface StorageInterface {
        length: number;
        namespace: string;
        getItem(key: string): any;
        setItem(key: string, value: any): void;
        deleteItem(key: string): void;
        empty(): void;
        setNamespace(namespace: string): void;
    }
    /**
     * Storage manager, on construction it should decide on which driver it should use for writing data
     */
    class Storage {
        private static instance;
        /**
         * property for the driver
         */
        private store;
        /**
         *
         * @param namespace
         */
        constructor();
        /**
         *
         * @param namespace
         * @returns {Storage}
         */
        static getInstance(): Storage;
        static nameSpaceKeyFilter(keys: string[], namespace: string): string[];
        /**
         * Sets a namespace for the keys to be stored in
         *
         * @param namespace
         */
        setNamespace(namespace: string): Storage;
        /**
         * Get an item from storage
         *
         * @param key
         * @returns {any}
         */
        get(key: string): string;
        /**
         * Set an item in storage
         *
         * @param key
         * @param value
         * @returns {Quartz.Storage}
         */
        set(key: string, value: any): Storage;
    }
}
declare module Quartz {
    /**
     * Storage driver for cookies
     */
    class CookieStorage implements StorageInterface {
        private keys;
        private storage;
        private reg;
        length: number;
        namespace: string;
        constructor(ns: string);
        getItem(key: string): any;
        setItem(key: string, value: any): void;
        deleteItem(key: string): void;
        setNamespace(namespace: string): void;
        empty(): void;
        private getNameSpaceMatches();
        private getCookiesForNameSpace();
    }
}
