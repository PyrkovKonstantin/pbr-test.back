import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageMetaDto } from '../../../app/dtos/page/dto/page-meta.dto';

export const ApiGetAllResponse = <TModel extends Type<unknown>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        required: ['data'],
        properties: {
          data: {
            type: 'array',
            items: {
              oneOf: [{ $ref: getSchemaPath(model) }],
            },
          },
          meta: {
            $ref: getSchemaPath(PageMetaDto),
          },
        },
      },
    }),
  );
};

export const ApiGetOneResponse = <TModel extends Type<unknown>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      type: model,
    }),
  );
};