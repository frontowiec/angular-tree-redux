import {pickBy} from 'lodash';

const initialState = {
  roots: [
    {
      id: 0,
      name: 'A',
      childIds: [1, 2],
      hasChildren: true
    }
  ],
  nodes: {
    0: {id: 0, name: 'A', childIds: [1, 2], hasChildren: true},
    1: {id: 1, name: 'B', childIds: [3], hasChildren: true},
    2: {id: 2, name: 'C', hasChildren: false},
    3: {id: 3, name: 'D', hasChildren: false}
  }
};

const GENERATE_NAME = 'GENERATE_NAME';

export const generateName = (name, id) => ({
  type: GENERATE_NAME,
  name,
  id
});

const node = (state, action) => {
  switch (action.type) {
    case GENERATE_NAME:
      return Object.assign({}, state, {name: action.name});
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GENERATE_NAME: {
      const nodeToChange = state.nodes[action.id];
      const newNode = node(nodeToChange, action);
      const filteredNodes = pickBy(state.nodes, n => n.id !== action.id);
      const nodes = {...filteredNodes, [action.id]: {...newNode}};
      return {
        ...state,
        nodes
      };
    }
    default:
      return state;
  }
}
