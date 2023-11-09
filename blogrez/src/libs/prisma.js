'use strict';

import { PrismaClient } from '@prisma/client';
import Validator from 'validatorjs';
import { StatusCodes } from 'http-status-codes';
import ApiCustomError from '../http/errors/api-custom-error.js';

const database = new PrismaClient();

function isUnique(value, attribute, requirement, passes) {
    const attributes = attribute.toString().split(',');
    const tableName = attributes[0].trim();
    const columnName = attributes[1].trim();

    if (!attribute)
        throw new ApiCustomError(
            'Specify Requirements i.e fieldName: unique:table,column',
            StatusCodes.INTERNAL_SERVER_ERROR,
        );
    if (attributes.length < 2)
        throw new ApiCustomError(
            `Invalid format for validation rule on ${attribute}`,
            StatusCodes.INTERNAL_SERVER_ERROR,
        );

    //
    // .toString().toLowerCase()
    database[tableName]
        .findUnique({ where: { [columnName]: value } })
        .then((modelExists) => {
            if (attributes.length > 2) {
                const modelId = attributes[2].trim();

                if (
                    !modelExists ||
                    (modelExists && modelExists.id == parseInt(modelId))
                ) {
                    passes();
                } else {
                    passes(false, `${columnName} has already been taken.`);
                    return;
                }
            } else if (!modelExists) {
                passes();
            } else {
                passes(false, `${columnName} has already been taken.`);
                return;
            }
        })
        .catch((error) => {
            throw new ApiCustomError(error, StatusCodes.INTERNAL_SERVER_ERROR);
        });
}

// register unique validation
Validator.registerAsync(
    'unique',
    isUnique,
    ':attribute has already been taken.',
);

export { database };
