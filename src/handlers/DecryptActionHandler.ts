import {
    ActionSnapshot, 
    IActionHandlerMetadata, 
    IContext, 
    IDelegatedParameters,
    FSUtil
} from 'fbl';

import {BaseCryptoActionHandler} from './BaseCryptoActionHandler';
import Container from 'typedi';
import { CryptoService } from '../services';

export class DecryptActionHandler extends BaseCryptoActionHandler {
    private static metadata = <IActionHandlerMetadata> {
        id: 'com.fireblink.fbl.plugins.crypto.decrypt',
        aliases: [
            'fbl.plugins.crypto.decrypt',
            'plugins.crypto.decrypt',
            'crypto.decrypt',
            'decrypt'
        ]
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
    async execute(options: any, context: IContext, snapshot: ActionSnapshot, parameters: IDelegatedParameters): Promise<void> {
        const source = FSUtil.getAbsolutePath(options.file, snapshot.wd);
        const destination = options.destination ? FSUtil.getAbsolutePath(options.destination, snapshot.wd) : source;
        
        snapshot.log(`Decrypting ${source} into ${destination}`);
        await Container.get(CryptoService).decrypt(source, destination, options.password);        
    }
}
