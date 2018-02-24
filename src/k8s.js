export function url(strings, ...variables) {
  return strings.reduce((chunks, chunk, i) => {
    const variable = variables[i] || '';
    chunks.push(chunk, encodeURIComponent(variable));
    return chunks;
  }, []).join('');
}

export async function get(url) {
  const res = await global.fetch(url);
  if (res.status >= 400) throw new Error('Unable to load');
  const resource = await res.json();
  return resource
}
