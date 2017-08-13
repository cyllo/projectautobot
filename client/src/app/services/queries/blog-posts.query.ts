import gql from 'graphql-tag';

export const blogPostQuery = gql`
  query blogPost($title: String) {
    blogPost(title: $title) {
      id
      author {
        displayName
      }
      blogCategories {
        name
      }
      thumbnailUrl
      heroImageUrl
      title
      summary
      content
      insertedAt
      updatedAt
    }
  }
`;

export const blogPostsBeforeQuery = gql`
  query blogPostsBefore($last: Int!, $before: Int!) {
    blogPosts(last: $last, before: $before) {
      id
      author {
        displayName
      }
      blogCategories {
        id
        name
      }
      thumbnailUrl
      heroImageUrl
      title
      summary
      content
      insertedAt
      updatedAt
    }
  }
`;

export const blogPostsAfterQuery = gql`
  query blogPostsAfter($first: Int!, $after: Int!) {
    blogPosts(first: $first, after: $after) {
      id
      author {
        displayName
      }
      blogCategories {
        id
        name
      }
      thumbnailUrl
      heroImageUrl
      title
      summary
      content
      insertedAt
      updatedAt
    }
  }
`;

export const blogCategoriesQuery = gql`
  query blogCategories {
    blogCategories {
      id
      name
    }
  }
`;
