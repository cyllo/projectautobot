import { assocPath, dissoc, reduce } from 'ramda';
import { Player } from '../models';

export function players(state: any = {}, { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'ADD_PLAYERS':
      return reduce((acc, player: Player) => {
        return updateObjPath(acc, player);
      }, {}, payload);

    case 'NEW_PLAYER':
      return updateObjPath(state, payload);

    case 'UPDATE_PLAYER':
      return updateObjPath(state, payload);

    case 'REMOVE_PLAYER':
      return dissoc(payload.tag, state);

    default:
      return state;
  }
}

function updateObjPath(state, player: Player) {
  return assocPath(objPath(player), player, state);
}

function objPath(player: Player) {
  const tag = player.tag.replace('#', '-');
  if (!player.region) {
    return [tag, player.platform];
  }
  return [tag, player.platform, player.region];
}
