import gql from 'graphql-tag';

export const newsPostQuery = gql`
  query blogPosts($take: Int!) {
    blogPosts(last: $take) {
      id
      content
      summary
      thumbnailUrl
      insertedAt
      title
      updatedAt
      author {
        id
        displayName
      }
      blogCategories {
        name
      }
    }
  }
`;
