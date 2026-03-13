// Web Crypto API Engine for The Blind Vault
// Uses AES-GCM and PBKDF2 for deriving keys from a Master Passphrase

const ITERATIONS = 100000;
const KEY_LENGTH = 256;
const DIGEST = "SHA-256";

/**
 * Derives a cryptographic key from a password and salt using PBKDF2
 */
export async function deriveKey(password: string, salt: BufferSource): Promise<CryptoKey> {
  const enc = new TextEncoder();
  
  // 1. Get raw key material from password
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  
  // 2. Derive the actual AES-GCM key
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: ITERATIONS,
      hash: DIGEST
    },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a stringified JSON payload with a given password
 */
export async function encryptVault(dataJSON: string, password: string) {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const key = await deriveKey(password, salt);
  
  const encodedData = enc.encode(dataJSON);
  
  const encryptedBuf = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    encodedData
  );
  
  // Combine salt, iv, and ciphertext into a single Base64 transport package
  const encryptedArray = new Uint8Array(encryptedBuf);
  
  const packArray = (arr: Uint8Array) => btoa(String.fromCharCode(...arr));
  
  return {
    salt: packArray(salt),
    iv: packArray(iv),
    ciphertext: packArray(encryptedArray)
  };
}

export type EncryptedPackage = {
  salt: string;
  iv: string;
  ciphertext: string;
};

/**
 * Decrypts a vault package back into its raw JSON string
 */
export async function decryptVault(encryptedPackage: EncryptedPackage, password: string): Promise<string> {
  try {
    const unpackArray = (b64: string) => {
      const bin = atob(b64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        arr[i] = bin.charCodeAt(i);
      }
      return arr;
    };
    
    const salt = unpackArray(encryptedPackage.salt);
    const iv = unpackArray(encryptedPackage.iv);
    const ciphertext = unpackArray(encryptedPackage.ciphertext);
    
    const key = await deriveKey(password, salt);
    
    const decryptedBuf = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      ciphertext
    );
    
    const dec = new TextDecoder();
    return dec.decode(decryptedBuf);
  } catch (err) {
    throw new Error("Invalid Master Passphrase or corrupted Data Crystal.");
  }
}
