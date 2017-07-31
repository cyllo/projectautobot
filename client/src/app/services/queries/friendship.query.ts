import gql from 'graphql-tag';


export const friendShipsQuery = gql`
    query friendShipsQuery($isIncoming: Boolean, $isAccepted: Boolean) {
        me {
            friendships(isIncoming: $isIncoming, isAccepted: $isAccepted) {
            id
            insertedAt
            isAccepted
            user {
                id
                email
                displayName
                battleNetId
                battleNetTag
            }
        }
        }
    }
`;
