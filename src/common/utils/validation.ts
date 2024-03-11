import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
export * from "class-validator";

export const validationPipe = async (schema: new () => {}, requestObject: object): Promise<ValidationError[]> => {
    const transformedClass: any = plainToInstance(schema, requestObject);
    return await validate(transformedClass);
};
