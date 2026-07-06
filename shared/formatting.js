export function getSlug(text) {
  const rawSlug = text.toLowerCase().replaceAll(' ', '-');
  return encodeURIComponent(rawSlug);
}

export function getRecordPath({ id, name } = {}) {
  return id == null ? '/records' : `/records/${id}/${getSlug(name)}`;
}
