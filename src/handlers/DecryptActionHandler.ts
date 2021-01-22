import {
    ActionHandler,
    ActionSnapshot,
    IActionHandlerMetadata,
    IContext,
    IDelegatedParameters,
    FSUtil,
    ActionProcessor,
} from 'fbl';

import { BaseCryptoActionProcessor } from './BaseCryptoActionProcessor';
import { CryptoService } from '../services';

export class DecryptActionProcessor extends BaseCryptoActionProcessor {
    /**
     * @inheritdoc
     */
    async execute(): Promise<void> {
        const source = FSUtil.getAbsolutePath(this.options.file, this.snapshot.wd);
        const destination = this.options.destination
            ? FSUtil.getAbsolutePath(this.options.destination, this.snapshot.wd)
            : source;

        this.snapshot.log(`Decrypting ${source} into ${destination}`);
        await CryptoService.instance.decrypt(source, destination, this.options.password);
    }
}

export class DecryptActionHandler extends ActionHandler {
    private static metadata = <IActionHandlerMetadata>{
        id: 'com.fireblink.fbl.plugins.crypto.decrypt',
        aliases: ['fbl.plugins.crypto.decrypt', 'plugins.crypto.decrypt', 'crypto.decrypt', 'decrypt'],
    };

    /* istanbul ignore next */
    /**
     * @inheritdoc
     */

    getMetadata(): IActionHandlerMetadata {
        return DecryptActionHandler.metadata;
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
        return new DecryptActionProcessor(options, context, snapshot, parameters);
    }
}
