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
    data = JSON.parse(data);
    console.log(data);
    events.emit('data', data);
  });
  socket.addEventListener('close', () => {
    // TODO handle reconnect?
    events.emit('end', resourceVersion);
  });
  events.close = socket.close.bind(socket);
  return events;
}

export async function listNamespaces() {
  return list('/api/v1/namespaces', 'namespaces');
}

export function watchNamespaces(resourceVersion) {
  return watch('/api/v1/namespaces', resourceVersion);
}

export function listFunctions() {
  return list('/apis/projectriff.io/v1/functions/', 'functions');
}

export function watchFunctions(resourceVersion) {
  return watch('/apis/projectriff.io/v1/functions/', resourceVersion);
}

export function listTopics() {
  return list('/apis/projectriff.io/v1/topics/', 'topics');
}

export function watchTopics(resourceVersion) {
  return watch('/apis/projectriff.io/v1/topics/', resourceVersion);
}
