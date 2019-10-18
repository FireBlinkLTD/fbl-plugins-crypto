import { IPlugin } from 'fbl';
import { DecryptActionHandler, EncryptActionHandler } from './src/handlers';
import { PasswordGeneratorTemplateUtility } from './src/templateUtilities';

const packageJson = require('../package.json');

module.exports = <IPlugin>{
    name: packageJson.name,

    description: `Plugin human readable description.`,

    tags: packageJson.keywords,

    version: packageJson.version,

    requires: {
        fbl: packageJson.peerDependencies.fbl,
        plugins: {
            // pluginId: '<0.0.1'
        },
        applications: [],
    },

    reporters: [],

    actionHandlers: [new DecryptActionHandler(), new EncryptActionHandler()],

    templateUtils: [new PasswordGeneratorTemplateUtility()],
};
