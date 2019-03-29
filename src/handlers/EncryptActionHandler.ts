import {
    ActionHandler,
    ActionProcessor,
    ActionSnapshot,
    FSUtil,
    IActionHandlerMetadata,
    IContext,
    IDelegatedParameters,
} from 'fbl';

import Container from 'typedi';

import { BaseCryptoActionProcessor } from './BaseCryptoActionProcessor';
import { CryptoService } from '../services';

export class EncryptActionProcessor extends BaseCryptoActionProcessor {
    /**
     * @inheritdoc
     */
    async execute(): Promise<void> {
        const source = FSUtil.getAbsolutePath(this.options.file, this.snapshot.wd);
        const destination = this.options.destination
            ? FSUtil.getAbsolutePath(this.options.destination, this.snapshot.wd)
            : source;

        this.snapshot.log(`Encrypting ${source} into ${destination}`);
        await Container.get(CryptoService).encrypt(source, destination, this.options.password);
    }
}

export class EncryptActionHandler extends ActionHandler {
    private static metadata = <IActionHandlerMetadata>{
        id: 'com.fireblink.fbl.plugins.crypto.encrypt',
        aliases: ['fbl.plugins.crypto.encrypt', 'plugins.crypto.encrypt', 'crypto.encrypt', 'encrypt'],
    };

    /* istanbul ignore next */
    /**
     * @inheritdoc
     */
    getMetadata(): IActionHandlerMetadata {
        return EncryptActionHandler.metadata;
    }

    /**
     * @inheritdoc
     */
    getProcessor(
        options: any,
        context: IContext,
        snapshot: ActionSnapshot,
        parameters: IDelegatedParameters,
    ): ActionProcessor {
        return new EncryptActionProcessor(options, context, snapshot, parameters);
    }
}
