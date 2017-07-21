import gql from 'graphql-tag';

export const RejectFriendRequest = gql`
    mutation rejectFriendRequest($friendUserId: Int, $friendshipId: Int) {
        rejectFriendRequest(friendUserId: $friendUserId, friendshipId: $friendshipId) {
            rejected
        }
    }
`;
