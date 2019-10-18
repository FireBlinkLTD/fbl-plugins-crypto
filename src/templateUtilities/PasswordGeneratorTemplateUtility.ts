import { ITemplateUtility, IContext, ActionSnapshot, IDelegatedParameters } from 'fbl';

const niceware = require('niceware');

export class PasswordGeneratorTemplateUtility implements ITemplateUtility {
    /**
     * @inheritdoc
     */
    getUtilities(
        context: IContext,
        snapshot: ActionSnapshot,
        parameters: IDelegatedParameters,
        wd: string,
    ): { [key: string]: any } {
        return {
            password: {
                generate: async (words = 4, delimiter?: string): Promise<string> => {
                    const passWords: string[] = niceware.generatePassphrase(words * 2);

                    return passWords.join(delimiter || '-');
                },
            },
        };
    }
}
