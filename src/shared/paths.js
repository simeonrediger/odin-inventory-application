export function getGenrePath({ id } = {}) {
  return id == null ? '/genres' : `/genres/${id}`;
}

export function getArtistPath({ id } = {}) {
  return id == null ? '/artists' : `/artists/${id}`;
}

export function getRecordPath({ id } = {}) {
  return id == null ? '/records' : `/records/${id}`;
}
