export function getSlug(text) {
  return text.toLowerCase().replaceAll(' ', '-');
}

export function getRecordPath({ id, name } = {}) {
  return id == null ? '/records' : `/records/${id}/${getSlug(name)}`;
}
