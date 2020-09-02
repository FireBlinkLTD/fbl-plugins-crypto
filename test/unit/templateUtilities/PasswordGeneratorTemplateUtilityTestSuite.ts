import { suite, test } from 'mocha-typescript';
import { ActionSnapshot, ContextUtil } from 'fbl';
import { PasswordGeneratorTemplateUtility } from '../../../src/templateUtilities';
import { strictEqual } from 'assert';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

@suite()
class PasswordGeneratorTemplateUtilityTestSuite {
    @test()
    async generatePassword(): Promise<void> {
        const generatePassword = new PasswordGeneratorTemplateUtility().getUtilities(
            ContextUtil.generateEmptyContext(),
            new ActionSnapshot('.', '.', {}, '.', 0, {}),
            {},
            '.',
        ).password.generate;

        let password = generatePassword();
        strictEqual(password.split('-').length, 4);

        password = generatePassword(2);
        strictEqual(password.split('-').length, 2);

        password = generatePassword(3, '@');
        strictEqual(password.split('@').length, 3);
    }
}
