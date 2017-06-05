import gql from 'graphql-tag';

export const heroSearchQuery = gql`
  query{
    heroes {
      id,
      name,
      code
    }
  }
`;
