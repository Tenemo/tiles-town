import { RequestHandler } from 'express';
import { TSchema } from '@sinclair/typebox';
import { TypeCheck, TypeCompiler } from '@sinclair/typebox/compiler';
import type { MessageResponse } from '@tiles-town/contracts';

type RequestSegment = 'body' | 'params';

type ValidationConfig = {
    body?: TSchema;
    params?: TSchema;
};

const getValidationMessage = (
    segment: RequestSegment,
    validator: TypeCheck<TSchema>,
    value: unknown,
): string => {
    const [firstError] = Array.from(validator.Errors(value));

    if (!firstError) {
        return `${segment} validation failed.`;
    }

    return `${segment} validation failed at ${firstError.path || '/'}: ${
        firstError.message
    }`;
};

export const validateRequest = ({
    body,
    params,
}: ValidationConfig): RequestHandler => {
    const validators: Partial<Record<RequestSegment, TypeCheck<TSchema>>> = {
        body: body ? TypeCompiler.Compile(body) : undefined,
        params: params ? TypeCompiler.Compile(params) : undefined,
    };

    return (req, res, next): void => {
        for (const segment of ['params', 'body'] as const) {
            const validator = validators[segment];

            if (!validator) {
                continue;
            }

            const value: unknown = segment === 'body' ? req.body : req.params;
            if (validator.Check(value)) {
                continue;
            }

            const response: MessageResponse = {
                message: getValidationMessage(segment, validator, value),
            };
            res.status(400).json(response);
            return;
        }

        next();
    };
};
