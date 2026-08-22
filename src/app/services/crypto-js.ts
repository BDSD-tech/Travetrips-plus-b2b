import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';

const secretKey = '52345678941834567870723486789052';

@Injectable({
    providedIn: 'root'
})

export class CryptoService {

    constructor() {}

    encryptData(data: string)
    {
        const iv = CryptoJS.lib.WordArray.random(16);
        const encrypted = CryptoJS.AES.encrypt(data, 
        CryptoJS.enc.Utf8.parse(secretKey), 
        {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
        }
        );
        const encryptedData = encrypted.toString();
        const ivHex = iv.toString(CryptoJS.enc.Hex);
        return btoa(encryptedData + '::' + ivHex);
    }

    decryptData(ciphertext: string) 
    {
        if(ciphertext){
            const [encryptedData, ivHex] = atob(ciphertext).split('::');
            const iv = CryptoJS.enc.Hex.parse(ivHex);
            const decrypted = CryptoJS.AES.decrypt(
                encryptedData, 
                CryptoJS.enc.Utf8.parse(secretKey), 
                {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
                }
            );
            return decrypted.toString(CryptoJS.enc.Utf8); 
        }
        return ciphertext;
        
    }

}