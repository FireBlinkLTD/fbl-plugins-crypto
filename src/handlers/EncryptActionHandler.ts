import {
    ActionSnapshot, 
    FSUtil,
    IActionHandlerMetadata, 
    IContext, 
    IDelegatedParameters
} from 'fbl';

import {BaseCryptoActionHandler} from './BaseCryptoActionHandler';
import Container from 'typedi';
import { CryptoService } from '../services';

export class EncryptActionHandler extends BaseCryptoActionHandler {
    private static metadata = <IActionHandlerMetadata> {
        id: 'com.fireblink.fbl.plugins.crypto.encrypt',
        aliases: [
            'fbl.plugins.crypto.encrypt',
            'plugins.crypto.encrypt',
            'crypto.encrypt',
            'encrypt'
        ]
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
    async execute(options: any, context: IContext, snapshot: ActionSnapshot, parameters: IDelegatedParameters): Promise<void> {
        const source = FSUtil.getAbsolutePath(options.file, snapshot.wd);
        const destination = options.destination ? FSUtil.getAbsolutePath(options.destination, snapshot.wd) : source;
        
        snapshot.log(`Encrypting ${source} into ${destination}`);
        await Container.get(CryptoService).encrypt(source, destination, options.password);        
    }
}
