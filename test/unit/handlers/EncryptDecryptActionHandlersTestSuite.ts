import {suite, test} from 'mocha-typescript';
import {ActionSnapshot, ContextUtil, TempPathsRegistry} from 'fbl';
import {promisify} from 'util';
import {readFile, writeFile} from 'fs';
import {join} from 'path';
import * as assert from 'assert';
import {Container} from 'typedi';
import { EncryptActionHandler, DecryptActionHandler } from '../../../src/handlers';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

@suite()
class CryptoTestSuite {
    async after(): Promise<void> {
        await Container.get(TempPathsRegistry).cleanup();
        Container.reset();
    }

    @test()
    async failValidation(): Promise<void> {
        const actionHandler = new EncryptActionHandler();
        const context = ContextUtil.generateEmptyContext();
        const snapshot = new ActionSnapshot('.', {}, '', 0, {});

        await chai.expect(
            actionHandler.validate([], context, snapshot, {})
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate({}, context, snapshot, {})
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate(123, context, snapshot, {})
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate('test', context, snapshot, {})
        ).to.be.rejected;

        await chai.expect(
            actionHandler.validate({
                password: false,
                file: ['/tmp']
            }, context, snapshot, {})
        ).to.be.rejected;        
    }

    @test()
    async passValidation(): Promise<void> {
        const actionHandler = new EncryptActionHandler();
        const context = ContextUtil.generateEmptyContext();
        const snapshot = new ActionSnapshot('.', {}, '', 0, {});

        await actionHandler.validate({
            password: 'secret',
            file: '/tmp',            
        }, context, snapshot, {});

        await actionHandler.validate({
            password: 'secret',
            file: '/tmp',
            destination: '/tmp'
        }, context, snapshot, {});
    }

    @test()
    async encryptDecryptSameFile(): Promise<void> {
        const tempPathsRegistry = Container.get(TempPathsRegistry);

        const encryptActionHandler = new EncryptActionHandler();
        const decryptActionHandler = new DecryptActionHandler();

        const tmpDir = await tempPathsRegistry.createTempDir();
        const writeFileAsync = promisify(writeFile);
        const readFileAsync = promisify(readFile);        

        const context = ContextUtil.generateEmptyContext();
        const snapshot = new ActionSnapshot('.', {}, tmpDir, 0, {});

        const src = await Container.get(TempPathsRegistry).createTempFile();

        const fileContent = 'test@'.repeat(100);
        await writeFileAsync(src, fileContent, 'utf8');        

        const password = 'super_secret_password';

        await encryptActionHandler.execute({
            password: password,
            file: src
        }, context, snapshot, {});

        let content = await readFileAsync(src, 'utf8');
        assert.notStrictEqual(content, fileContent);

        await decryptActionHandler.execute({
            password: password,
            file: src            
        }, context, snapshot, {});
        
        content = await readFileAsync(src, 'utf8');
        assert.strictEqual(content, fileContent);        
    }

    @test()
    async encryptDecryptDifferentFile(): Promise<void> {
        const tempPathsRegistry = Container.get(TempPathsRegistry);

        const encryptActionHandler = new EncryptActionHandler();
        const decryptActionHandler = new DecryptActionHandler();

        const tmpDir = await tempPathsRegistry.createTempDir();
        const writeFileAsync = promisify(writeFile);
        const readFileAsync = promisify(readFile);        

        const context = ContextUtil.generateEmptyContext();
        const snapshot = new ActionSnapshot('.', {}, tmpDir, 0, {});

        const src = await Container.get(TempPathsRegistry).createTempFile();
        const dst1 = await Container.get(TempPathsRegistry).createTempFile();
        const dst2 = await Container.get(TempPathsRegistry).createTempFile();

        const fileContent = 'test@'.repeat(100);
        await writeFileAsync(src, fileContent, 'utf8');        

        const password = 'super_secret_password';

        await encryptActionHandler.execute({
            password: password,
            file: src,
            destination: dst1
        }, context, snapshot, {});

        let content = await readFileAsync(dst1, 'utf8');
        assert.notStrictEqual(content, fileContent);
        
        await decryptActionHandler.execute({
            password: password,
            file: dst1,
            destination: dst2            
        }, context, snapshot, {});
        
        content = await readFileAsync(dst2, 'utf8');
        assert.strictEqual(content, fileContent);        
    }
}
