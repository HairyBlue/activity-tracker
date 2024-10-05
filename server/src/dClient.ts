import * as express from "express";
import { configs } from "./settings";
import {
  bcryptCompareHashedPassword,
  jwtSignUser,
} from "./helpers/formatAndValidation";
import { show } from "./db/dbcon";
import { accessRightType, getAccessLevelType } from "./types";
import * as crypto from "crypto";
import * as cryptojs from "crypto-js"
import * as logging from "./logger";
import "dotenv/config";

const clientSecret: any = configs.default.client.secret;


function encryptSymmetric (plaintext: string) {
   const iv = crypto.randomBytes(12).toString('base64');
   const cipher = crypto.createCipheriv(
     "aes-256-gcm", 
     Buffer.from(clientSecret, 'base64'), 
     Buffer.from(iv, 'base64')
   );
   let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
   ciphertext += cipher.final('base64');
   const tag = cipher.getAuthTag()
   
   return { ciphertext, iv, tag }
};

function decryptSymmetric (key: string, ciphertext: string, iv: any, tag: any) {
   const decipher = crypto.createDecipheriv(
     "aes-256-gcm", 
     Buffer.from(key, 'base64'),
     Buffer.from(iv, 'base64')
   );
   
   decipher.setAuthTag(Buffer.from(tag, 'base64'));
 
   let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
   plaintext += decipher.final('utf8');
 
   return plaintext;
 }

 
function encrypWithCryptojs(plaintext: string) {
     return cryptojs.AES.encrypt(plaintext, clientSecret).toString();
}

function decrypWithCryptojs(ciphertext: string) {
   const bytes = cryptojs.AES.decrypt(ciphertext, clientSecret);
   return bytes.toString(cryptojs.enc.Utf8);
}

// const encrypteds: any = encrypWithCryptojs("WEBMASTER");
// try {
//   console.log(decrypWithCryptojs("U2FsdGVkX19ZxDQbjMUtzhJsiE/v52kxdRZlzG"))
// } catch(e) {
//   console.log(e)
// }
export { 
   encrypWithCryptojs, 
   clientSecret,
};
