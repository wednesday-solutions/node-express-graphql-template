import { GraphQLDateTime } from 'graphql-iso-date';
export const timestamps = {
  createdAt: { type: GraphQLDateTime },
  updatedAt: { type: GraphQLDateTime },
  deletedAt: { type: GraphQLDateTime }
};
