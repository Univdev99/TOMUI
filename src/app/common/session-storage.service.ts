import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionStorageService {

    constructor( 
    ) {
    }

    setObjectValue(key, value) {
        sessionStorage.setItem(key, value);
    }

    getObjectValue(key) {
        return sessionStorage.getItem(key);
    }

    removeItem(key) {
         sessionStorage.removeItem(key)
    }
}
