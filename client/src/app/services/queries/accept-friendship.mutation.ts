import gql from 'graphql-tag';


export const AcceptFriendRequest = gql`
    mutation acceptFriendRequest($friendUserId: Int, $friendshipId: Int) {
        acceptFriendRequest(friendUserId: $friendUserId, friendshipId: $friendshipId) {
            id
            isAccepted
            friend {
               id
               email
               displayName
               battleNetId
               battleNetTag
            }
        }
    }
`;
