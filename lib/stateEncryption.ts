import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export class StateEncryption {
    private static readonly algorithm = 'aes-256-gcm';
    private static readonly key = Buffer.from(
        process.env.ENCRYPTION_KEY || 'a7e2f8d1b3c6e9a4d5b8c2e7f3a9d6b4',
        'hex'
    );
    
    static encrypt(data: any): string {
        const iv = randomBytes(16);
        const cipher = createCipheriv(this.algorithm, this.key, iv);
        
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        return Buffer.concat([
            iv,
            Buffer.from(encrypted, 'hex'),
            authTag
        ]).toString('base64');
    }
    
    static decrypt(encryptedData: string): any {
        const buf = Buffer.from(encryptedData, 'base64');
        const iv = buf.subarray(0, 16);
        const authTag = buf.subarray(buf.length - 16);
        const encrypted = buf.subarray(16, buf.length - 16);
        
        const decipher = createDecipheriv(this.algorithm, this.key, iv);
        decipher.setAuthTag(authTag);
        
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        return JSON.parse(decrypted.toString());
    }
}