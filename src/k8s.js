async function request(url, type) {
  const res = await fetch(url);
  if (res.status >= 400) {
    // TODO create a better error message
    throw new Error(`Unable to load ${type}`);
  }
  const resource = await res.json();
  return resource
}

export function listNamespaces() {
  return request('/api/v1/namespaces', 'namespaces');
}

export function listFunctions() {
  return request('/apis/projectriff.io/v1/functions/', 'functions');
}

export function listTopics() {
  return request('/apis/projectriff.io/v1/topics/', 'topics');
}
