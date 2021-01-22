import { suite, test } from 'mocha-typescript';
import { ActionSnapshot, ContextUtil, TempPathsRegistry } from 'fbl';
import { promisify } from 'util';
import { readFile, writeFile } from 'fs';
import * as assert from 'assert';
import { EncryptActionHandler, DecryptActionHandler } from '../../../src/handlers';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

@suite()
class CryptoTestSuite {
    async after(): Promise<void> {
        await TempPathsRegistry.instance.cleanup();
    }

    @test()
    async failValidation(): Promise<void> {
        const actionHandler = new EncryptActionHandler();
        const context = ContextUtil.generateEmptyContext();
        const snapshot = new ActionSnapshot('index.yml', '.', {}, '', 0, {});

        await chai.expect(actionHandler.getProcessor([], context, snapshot, {}).validate()).to.be.rejected;

        await chai.expect(actionHandler.getProcessor({}, context, snapshot, {}).validate()).to.be.rejected;

        await chai.expect(actionHandler.getProcessor(123, context, snapshot, {}).validate()).to.be.rejected;

        await chai.expect(actionHandler.getProcessor('test', context, snapshot, {}).validate()).to.be.rejected;

        await chai.expect(
            actionHandler
                .getProcessor(
                    {
                        password: false,
                        file: ['/tmp'],
                    },
                    context,
                    snapshot,
                    {},
                )
                .validate(),
        ).to.be.rejected;
    }

    @test()
    async passValidation(): Promise<void> {
        const actionHandler = new EncryptActionHandler();
        const context = ContextUtil.generateEmptyContext();
        const snapshot = new ActionSnapshot('index.yml', '.', {}, '', 0, {});

        await actionHandler
            .getProcessor(
                {
                    password: 'secret',
                    file: '/tmp',
                },
                context,
                snapshot,
                {},
            )
            .validate();

        await actionHandler
            .getProcessor(
                {
                    password: 'secret',
                    file: '/tmp',
                    destination: '/tmp',
                },
                context,
                snapshot,
                {},
            )
            .validate();
    }

    @test()
    async encryptDecryptSameFile(): Promise<void> {
        const encryptActionHandler = new EncryptActionHandler();
        const decryptActionHandler = new DecryptActionHandler();

        const tmpDir = await TempPathsRegistry.instance.createTempDir();
        const writeFileAsync = promisify(writeFile);
        const readFileAsync = promisify(readFile);

        const context = ContextUtil.generateEmptyContext();
        const snapshot = new ActionSnapshot('index.yml', '.', {}, tmpDir, 0, {});

        const src = await TempPathsRegistry.instance.createTempFile();

        const fileContent = 'test@'.repeat(100);
        await writeFileAsync(src, fileContent, 'utf8');

        const password = 'super_secret_password';

        await encryptActionHandler
            .getProcessor(
                {
                    password: password,
                    file: src,
                },
                context,
                snapshot,
                {},
            )
            .execute();

        let content = await readFileAsync(src, 'utf8');
        assert.notStrictEqual(content, fileContent);

        await decryptActionHandler
            .getProcessor(
                {
                    password: password,
                    file: src,
                },
                context,
                snapshot,
                {},
            )
            .execute();

        content = await readFileAsync(src, 'utf8');
        assert.strictEqual(content, fileContent);
    }

    @test()
    async encryptDecryptDifferentFile(): Promise<void> {
        const encryptActionHandler = new EncryptActionHandler();
        const decryptActionHandler = new DecryptActionHandler();

        const tmpDir = await TempPathsRegistry.instance.createTempDir();
        const writeFileAsync = promisify(writeFile);
        const readFileAsync = promisify(readFile);

        const context = ContextUtil.generateEmptyContext();
        const snapshot = new ActionSnapshot('index.yml', '.', {}, tmpDir, 0, {});

        const src = await TempPathsRegistry.instance.createTempFile();
        const dst1 = await TempPathsRegistry.instance.createTempFile();
        const dst2 = await TempPathsRegistry.instance.createTempFile();

        const fileContent = 'test@'.repeat(100);
        await writeFileAsync(src, fileContent, 'utf8');

        const password = 'super_secret_password';

        await encryptActionHandler
            .getProcessor(
                {
                    password: password,
                    file: src,
                    destination: dst1,
                },
                context,
                snapshot,
                {},
            )
            .execute();

        let content = await readFileAsync(dst1, 'utf8');
        assert.notStrictEqual(content, fileContent);

        await decryptActionHandler
            .getProcessor(
                {
                    password: password,
                    file: dst1,
                    destination: dst2,
                },
                context,
                snapshot,
                {},
            )
            .execute();

        content = await readFileAsync(dst2, 'utf8');
        assert.strictEqual(content, fileContent);
    }
}
