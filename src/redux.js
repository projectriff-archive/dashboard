import * as k8s from './k8s';

const NAMESPACES = 'namespaces';
const FUNCTIONS = 'functions';
const TOPICS = 'topics';

const RESOURCE_LOADING = 'RESOURCE_LOADING';
const RESOURCE_ERROR = 'RESOURCE_ERROR';
const RESOURCE_LOADED = 'RESOURCE_LOADED';

const systemNamespaces = new Set(['docker', 'kube-public', 'kube-system']);

export function reducer(state = {}, action) {
  switch (action.type) {
    case RESOURCE_LOADING:
      return {
        ...state,
        [action.resourceType]: {
          ...state[action.resourceType],
          loading: true
        }
      };
    case RESOURCE_ERROR:
      return {
        ...state,
        [action.resourceType]: {
          ...state[action.resourceType],
          loading: false,
          error: action.error
        }
      };
    case RESOURCE_LOADED:
      return {
        ...state,
        [action.resourceType]: {
          loading: false,
          error: null,
          resource: action.resource
        }
      };
    default:
      return state
  }
}

export const actions = {
  _load: (resourceType, loader) => async dispatch => {
    dispatch({
      type: RESOURCE_LOADING,
      resourceType
    });
    try {
      const resource = await loader();
      dispatch({
        type: RESOURCE_LOADED,
        resourceType,
        resource
      });
    } catch (error) {
      dispatch({
        type: RESOURCE_ERROR,
        resourceType,
        error
      });
    }
  },
  load: () => dispatch => {
    dispatch(actions.loadNamespaces());
    dispatch(actions.loadFunctions());
    dispatch(actions.loadTopics());
  },
  loadNamespaces: () => actions._load(NAMESPACES, k8s.listNamespaces),
  loadFunctions: () => actions._load(FUNCTIONS, k8s.listFunctions),
  loadTopics: () => actions._load(TOPICS, k8s.listTopics)
};

export const selectors = {
  listResource(state, type, namespace) {
    if (!state[type] || !state[type].resource) return null;
    const items = state[type].resource.items;
    if (!namespace) return items;
    return items.filter(item => {
      return item.metadata.namespace === namespace;
    });
  },
  listNamespaces(state) {
    const namespaces = selectors.listResource(state, 'namespaces');
    return namespaces && namespaces.filter(ns => !systemNamespaces.has(ns.metadata.name))
  },
  loading(state, type) {
    if (type) {
      return state[type] ? state[type].loading : true;
    }
    const keys = Object.keys(state);
    if (!keys.length) return true;
    return keys.some(type => {
      return state[type].loading;
    });
  },
  error(state, type) {
    if (type) {
      return state[type] && state[type].error;
    }
    return Object.keys(state)
      .map(type => state[type].error)
      .filter(e => !!e);
  }
};
