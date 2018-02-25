import { EventEmitter } from "events";

async function list(url, type) {
  const res = await fetch(url);
  if (res.status >= 400) {
    // TODO create a better error message
    throw new Error(`Unable to load ${type}`);
  }
  const resource = await res.json();
  return resource
}

function watch(url, resourceVersion) {
  const { protocol, host } = window.location;
  const socket = new WebSocket(`${protocol === 'https:' ? 'wss:' : 'ws:'}//${host}${url}?watch&resourceVersion=${resourceVersion}`);
  const events = new EventEmitter();
  socket.addEventListener('message', ({ data }) => {
    events.emit('data', JSON.parse(data));
  });
  socket.addEventListener('close', () => {
    // TODO handle reconnect?
    events.emit('end', resourceVersion);
  });
  events.close = socket.close.bind(socket);
  return events;
}

function createResourceClient(path) {
  return {
    list: list.bind(null, path),
    watch: watch.bind(null, path)
  };
}

export default {
  namespaces: createResourceClient('/api/v1/namespaces'),
  functions: createResourceClient('/apis/projectriff.io/v1/functions'),
  topics: createResourceClient('/apis/projectriff.io/v1/topics')
};
