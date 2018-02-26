import { EventEmitter } from 'events';
import querystring from 'querystring'


async function list(path, params, type) {
  const res = await fetch(`${path}?${querystring.stringify(params)}`);
  if (res.status >= 400) {
    // TODO create a better error message
    throw new Error(`Unable to load ${type}`);
  }
  const resource = await res.json();
  return resource
}

function watch(url, params) {
  const { protocol, host } = window.location;
  const socket = new WebSocket(`${protocol === 'https:' ? 'wss:' : 'ws:'}//${host}${url}?watch&${querystring.stringify(params)}`);
  const events = new EventEmitter();
  socket.addEventListener('message', ({ data }) => {
    events.emit('data', JSON.parse(data));
  });
  socket.addEventListener('close', () => {
    // TODO handle reconnect?
    events.emit('end');
  });
  events.close = socket.close.bind(socket);
  return events;
}

function createResourceClient(type, path, defaultParams) {
  return {
    type,
    list: params => list(path, { ...defaultParams, ...params }),
    watch: params => watch(path, { ...defaultParams, ...params })
  };
}

export default {
  namespaces: createResourceClient('namespaces', '/api/v1/namespaces'),
  functions: createResourceClient('functions', '/apis/projectriff.io/v1/functions'),
  topics: createResourceClient('topics', '/apis/projectriff.io/v1/topics'),
  deployments: createResourceClient('deployments', '/apis/extensions/v1beta1/deployments', { labelSelector: 'function' }),
  pods: createResourceClient('pods', '/api/v1/pods', { labelSelector: 'function' }),

  systemNamespaces: new Set(['docker', 'kube-public', 'kube-system'])
};
