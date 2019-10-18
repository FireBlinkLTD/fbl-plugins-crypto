import { suite, test } from 'mocha-typescript';
import { ActionSnapshot, ContextUtil } from 'fbl';
import { PasswordGeneratorTemplateUtility } from '../../../src/templateUtilities';
import { assert } from 'joi';

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

        let password = await generatePassword();
        assert(password.split('-').length, 4);

        password = await generatePassword(2);
        assert(password.split('-').length, 2);

        password = await generatePassword(3, '@');
        assert(password.split('@').length, 3);
    }
}
