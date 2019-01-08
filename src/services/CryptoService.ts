import { Service, Inject } from "typedi";
import {createCipheriv, createDecipheriv, pbkdf2, randomBytes} from 'crypto';
import {createReadStream, createWriteStream, ReadStream, rename, WriteStream} from 'fs';
import {promisify} from 'util';
import {TempPathsRegistry, FSUtil} from 'fbl';
import { dirname } from "path";

@Service()
export class CryptoService {
    private static encryptionAlgorithm = 'aes-256-cbc';
    
    private static hashAlgorithm = 'sha512';
    private static hashIterations = 100000;
    private static keySize = 32;

    private static ivSize = 16;    
    private static saltSize = 24;    
    
    // encryption logic version, reserved for future use
    private static version = Buffer.alloc(2, '0001', 'hex'); 

    @Inject(() => TempPathsRegistry)
    private tempPathsRegistry: TempPathsRegistry;

    /**
     * Create pbkdf2 hash with 100k iterations with provided password and optionally salt
     * If salt is not provided - it will be generated and returned back
     * @param password 
     * @param salt 
     */
    public async getPasswordHash(password: string, salt?: Buffer): Promise<{hash: Buffer, salt: Buffer}> {
        salt = salt || randomBytes(CryptoService.saltSize);
        const hash = await promisify(pbkdf2)(
            password, 
            salt, 
            CryptoService.hashIterations, 
            CryptoService.keySize, 
            CryptoService.hashAlgorithm
        );

        return {
            salt: salt,
            hash: hash
        };
    }

    /**
     * Encrypt file with provided password
     * @param source
     * @param destination
     * @param password 
     */
    async encrypt(source: string, destination: string, password: string): Promise<void> {
        const passwordHash = await this.getPasswordHash(password);
        const iv = randomBytes(CryptoService.ivSize);
        const cipher = createCipheriv(CryptoService.encryptionAlgorithm, passwordHash.hash, iv);

        let tmpFile: string;
        let ws: WriteStream;
        if (source === destination) {
            tmpFile = await this.tempPathsRegistry.createTempFile(true);
            ws = createWriteStream(tmpFile);
        } else {
            await FSUtil.mkdirp(dirname(destination));
            ws = createWriteStream(destination);
        }
        
        const rs = createReadStream(source);

        const writeAsync = (chunk: Buffer): Promise<void> => {
            return new Promise<void>(resolve => {
                ws.write(chunk, () => resolve());
            });
        };

        await writeAsync(CryptoService.version);
        await writeAsync(passwordHash.salt);
        await writeAsync(iv);

        await new Promise<void>(resolve => {
            rs.pipe(cipher).pipe(ws);
            rs.on('close', () => {
                ws.end();
                resolve();
            });
        });

        if (source === destination) {
            await promisify(rename)(tmpFile, destination);
        }
    }

    /**
     * Decrypt file
     * @param source 
     * @param destination
     * @param password 
     */
    async decrypt(source: string, destination: string, password: string): Promise<void> {
        const headerSize = 2 + CryptoService.saltSize + CryptoService.ivSize;

        let rs = createReadStream(source, {
            end: headerSize
        });

        const header = await this.streamToBuffer(rs);

        const salt = header.slice(2, 2 + CryptoService.saltSize);
        const iv = header.slice(2 + CryptoService.saltSize, headerSize);

        rs = createReadStream(source, {
            start: headerSize
        });

        const passwordHash = await this.getPasswordHash(password, salt);
        const decipher = createDecipheriv(CryptoService.encryptionAlgorithm, passwordHash.hash, iv);

        let ws: WriteStream;
        let tmpFile: string;
        if (source === destination) {
            tmpFile = await this.tempPathsRegistry.createTempFile(true);
            ws = createWriteStream(tmpFile);    
        } else {
            await FSUtil.mkdirp(dirname(destination));
            ws = createWriteStream(destination);
        }
        
        await new Promise<void>(resolve => {
            rs.pipe(decipher).pipe(ws);
            rs.on('close', () => {
                ws.end();
                resolve();
            });
        });

        if (source === destination) {
            await promisify(rename)(tmpFile, destination);
        }
    }

    /**
     * Read stream into buffer
     * @param stream 
     */
    private streamToBuffer(stream: ReadStream): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const buffers: Buffer[] = [];
            stream.on('error', reject);
            stream.on('data', (data) => buffers.push(data));
            stream.on('end', () => resolve(Buffer.concat(buffers)));
        });
    }
}
