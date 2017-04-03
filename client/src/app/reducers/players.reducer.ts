export function players(state: any = [], { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'ADD_PLAYER':
      return[...state, payload];

    default:
      return state;
  }
}
