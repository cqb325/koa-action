const NodeRSA = require('node-rsa');

/**
 * 解码
 * @param privateKey 
 * @param str 
 * @returns 
 */
export function decrypt (privateKey: string, str: string): string {
    const key = NodeRSA({b: 2048});
    key.setOptions({ encryptionScheme: 'pkcs1' });
    key.importKey(privateKey, 'private');
    return key.decrypt(str);
}