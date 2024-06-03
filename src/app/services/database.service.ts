import { Injectable } from "@angular/core";
import { Storage, Drivers } from "@ionic/storage";
import * as cordovaSQLiteDriver from "localforage-cordovasqlitedriver";

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    private _storage: Storage | null = null;
    constructor(private storage: Storage) {
        this.initDb();
     }

     private async initDb() {
        this._storage = new Storage({
            driverOrder: [ cordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage ]
        });

        await this.storage.defineDriver(cordovaSQLiteDriver);
        const storage = await this.storage.create();
        this._storage = storage;
     }

     public set(key: string, value: any) {
         this._storage?.set(key, value);
     }

     async get<T>(key: string): Promise<T | null> {
         const dataObject = await this._storage?.get(key);
         if(dataObject){
            try{
                const data: T = dataObject as T;
                return new Promise((resolve, _) => {
                    resolve(data);
                });
            } catch(error) {
                return new Promise((_, reject) => {
                    reject(error);
                });
            }
         } else {
            return new Promise((resolve, _) => {
                resolve(null);
            });
         }
     }
}