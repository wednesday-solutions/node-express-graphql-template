import { GraphQLDateTime } from 'graphql-iso-date';
export const timestamps = () => ({
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
    deleted_at: { type: GraphQLDateTime }
});
