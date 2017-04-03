export function players(state: any = [], { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'ADD_PLAYER':
      return payload;

    case 'NEW_PLAYER':
      return [...state, payload];

    case 'UPDATE_PLAYER':
      return state.map(player => player.gamerTag === payload.gamerTag ? Object.assign({}, player, payload) : player);

    case 'REMOVE_PLAYER':
      return state.filter(player => player.gamerTag !== payload.gamerTag);

    default:
      return state;
  }
}
