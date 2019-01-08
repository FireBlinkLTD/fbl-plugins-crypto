import {ActionHandler} from 'fbl';
import * as Joi from 'joi';

export abstract class BaseCryptoActionHandler extends ActionHandler {
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
    getValidationSchema(): Joi.SchemaLike | null {
        return BaseCryptoActionHandler.validationSchema;
    }
}
