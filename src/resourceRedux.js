import k8s from './k8s';
export { connect } from 'react-redux';

const RESOURCE_LOADING = 'RESOURCE_LOADING';
const RESOURCE_ERROR = 'RESOURCE_ERROR';
const RESOURCE_LOADED = 'RESOURCE_LOADED';
const RESOURCE_CHANGED = 'RESOURCE_CHANGED';
const RESOURCE_CHANGED_ADDED = 'ADDED';
const RESOURCE_CHANGED_MODIFIED = 'MODIFIED';
const RESOURCE_CHANGED_DELETED = 'DELETED';

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
    case RESOURCE_CHANGED:
      switch (action.change.type) {
        case RESOURCE_CHANGED_ADDED:
        case RESOURCE_CHANGED_MODIFIED:
        case RESOURCE_CHANGED_DELETED:
          return {
            ...state,
            [action.resourceType]: {
              ...state[action.resourceType],
              resource: {
                ...state[action.resourceType].resource,
                metadata: {
                  ...state[action.resourceType].resource.metadata,
                  resourceVersion: action.change.object.metadata.resourceVersion
                },
                items:
                  action.change.type === RESOURCE_CHANGED_ADDED ?
                    state[action.resourceType].resource.items
                      .concat(action.change.object)
                      .sort((a, b) => a.metadata.name.localeCompare(b.metadata.name))
                  : action.change.type === RESOURCE_CHANGED_MODIFIED ?
                    state[action.resourceType].resource.items.map(
                      item => item.metadata.uid === action.change.object.metadata.uid
                        ? action.change.object
                        : item
                    )
                  : action.change.type === RESOURCE_CHANGED_DELETED ?
                    state[action.resourceType].resource.items
                      .filter(item => item.metadata.uid !== action.change.object.metadata.uid)
                  :
                    (() => {
                      // should never get here
                      throw new Error(`Unknown ${RESOURCE_CHANGED} subtype ${action.change.type}`);
                    })()
              }
            }
          };
        default:
          return state;
      }
    default:
      return state
  }
}

export const actions = {
  _load: client => async dispatch => {
    const resourceType = client.type;
    dispatch({ type: RESOURCE_LOADING, resourceType });
    try {
      const resource = await client.list();
      const watcher = client.watch({ resourceVersion: resource.metadata.resourceVersion });
      watcher.on('data', change => {
        dispatch({ type: RESOURCE_CHANGED, resourceType, change });
      });
      dispatch({ type: RESOURCE_LOADED, resourceType, resource });
    } catch (error) {
      dispatch({ type: RESOURCE_ERROR, resourceType, error });
    }
  },
  load: () => dispatch => {
    dispatch(actions._load(k8s.namespaces));
    dispatch(actions._load(k8s.functions));
    dispatch(actions._load(k8s.topics));
    dispatch(actions._load(k8s.deployments));
    dispatch(actions._load(k8s.pods));
  }
};

export const selectors = {
  getResource(state, type, namespace, name) {
    const resources = selectors.listResource(state, type);
    return resources && resources.find(resource => resource.metadata.namespace === namespace && resource.metadata.name === name);
  },
  listResource(state, type, namespace) {
    if (!state[type] || !state[type].resource) return null;
    const items = state[type].resource.items;
    if (!namespace) return items;
    return items.filter(item => {
      return item.metadata.namespace === namespace;
    });
  },
  listNamespaces(state) {
    const namespaces = selectors.listResource(state, k8s.namespaces.type);
    return namespaces && namespaces.filter(ns => !k8s.systemNamespaces.has(ns.metadata.name))
  },
  loading(state, ...types) {
    if (types.length === 0) types = Object.keys(state);
    if (types.length === 0) return true;
    return types.some(type => {
      return state[type] ? state[type].loading : true;
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
