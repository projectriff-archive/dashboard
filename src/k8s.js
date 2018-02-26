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

function createResourceClient(path, defaultParams) {
  return {
    list: params => list(path, { ...defaultParams, ...params }),
    watch: params => watch(path, { ...defaultParams, ...params })
  };
}

export default {
  namespaces: createResourceClient('/api/v1/namespaces'),
  functions: createResourceClient('/apis/projectriff.io/v1/functions'),
  topics: createResourceClient('/apis/projectriff.io/v1/topics'),
  deployments: createResourceClient('/apis/extensions/v1beta1/deployments', { labelSelector: 'function' }),
  pods: createResourceClient('/api/v1/pods', { labelSelector: 'function' })
};
