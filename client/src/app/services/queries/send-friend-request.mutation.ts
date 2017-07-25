import gql from 'graphql-tag';

export const SendFriendRequest = gql`
    mutation sendFriendRequest($id: Int) {
        sendFriendRequest(friendUserId: $id) {
            id
            isAccepted
            insertedAt
            friend {
                displayName
                id
            }
            
        }
    }
`