import { ActionProcessor } from 'fbl';
import * as Joi from 'joi';

export abstract class BaseCryptoActionProcessor extends ActionProcessor {
    private static validationSchema = Joi.object({
        password: Joi.string().required(),
        file: Joi.string().min(1).required(),
        destination: Joi.string().min(1),
    })
        .required()
        .options({ abortEarly: true });

    /**
     * @inheritdoc
     */
    getValidationSchema(): Joi.Schema | null {
        return BaseCryptoActionProcessor.validationSchema;
    }
}
