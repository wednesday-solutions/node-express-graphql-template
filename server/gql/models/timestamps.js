import { GraphQLDateTime } from 'graphql-iso-date';
export const timestamps = {
  createdAt: { sqlColumn: 'created_at', type: GraphQLDateTime },
  updatedAt: { sqlColumn: 'updated_at', type: GraphQLDateTime },
  deletedAt: { sqlColumn: 'deleted_at', type: GraphQLDateTime }
};
