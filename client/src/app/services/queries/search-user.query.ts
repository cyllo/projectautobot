import gql from 'graphql-tag';

export const userSearchQuery = gql`
    query users($displayName: String!) {
        users(search: $displayName) {
            email
            displayName
            id
        }
    }
`