import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import {
  IsNull,
  Not,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  ILike,
  In,
} from 'typeorm';
import { Request } from 'express';

export type Pagination = {
  skip: number;
  limit: number;
};
export type Filtering = Record<
  string,
  {
    rule: string;
    value: string;
  }
>;

export type QueryParams = {
  pagination: Pagination;
  filter?: Filtering;
  order?: Record<string, 'asc' | 'desc'>;
};

// valid filter rules
export enum FilterRule {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
}

export const QueryParams = createParamDecorator(
  (data, ctx: ExecutionContext): QueryParams => {
    const req: Request = ctx.switchToHttp().getRequest();
    const query = req.query;
    if (!query) return null;
    const {
      skip: skipRaw,
      limit: limitRaw,
      sortOrder,
      sortField,
      ...rawFilter
    } = query;
    const filterRes: Filtering = {};

    Object.entries(rawFilter).forEach(([key, value]) => {
      const [name, filter] = key.split(/\[|\]/);
      if (filter && !filter.match(/eq|neq|gt|gte|lt|lte|like|nlike|in|nin/)) {
        throw new BadRequestException('Invalid filter parameter');
      }
      filterRes[name] = { rule: filter, value: value as string };
    });

    const skip = parseInt(skipRaw as string);
    const limit = parseInt(limitRaw as string);

    if (isNaN(skip) || skip < 0 || isNaN(limit) || limit < 0) {
      throw new BadRequestException('Invalid pagination params');
    }

    if (limit > 100) {
      throw new BadRequestException(
        'Invalid pagination params: Max size is 100',
      );
    }

    const sortFieldWithOrder =
      sortField && sortOrder
        ? { [sortField as string]: sortOrder as 'asc' | 'desc' }
        : undefined;

    return {
      pagination: { skip, limit },
      filter: filterRes,
      order: sortFieldWithOrder,
    };
  },
);

export const getWhere = (filter: Filtering): Record<string, string> => {
  if (!filter) return {};
  const filterRes = {};

  Object.entries(filter).forEach(([key, params]) => {
    const { rule, value } = params;

    if (rule === FilterRule.IS_NULL) filterRes[key] = IsNull();
    if (rule === FilterRule.IS_NOT_NULL) filterRes[key] = Not(IsNull());
    if (rule === FilterRule.EQUALS) filterRes[key] = value;
    if (rule === FilterRule.NOT_EQUALS) filterRes[key] = Not(value);
    if (rule === FilterRule.GREATER_THAN) filterRes[key] = MoreThan(value);
    if (rule === FilterRule.GREATER_THAN_OR_EQUALS)
      filterRes[key] = MoreThanOrEqual(value);
    if (rule === FilterRule.LESS_THAN) filterRes[key] = LessThan(value);
    if (rule === FilterRule.LESS_THAN_OR_EQUALS)
      filterRes[key] = LessThanOrEqual(value);
    if (rule === FilterRule.LIKE) filterRes[key] = ILike(`%${value}%`);
    if (rule === FilterRule.NOT_LIKE)
      return (filterRes[key] = Not(ILike(`%${value}%`)));
    if (rule === FilterRule.IN) return (filterRes[key] = In(value.split(',')));
    if (rule === FilterRule.NOT_IN)
      return (filterRes[key] = Not(In(value.split(','))));
  });

  return filterRes;
};
