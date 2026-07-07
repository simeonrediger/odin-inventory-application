export function getRecordPath({ id } = {}) {
  return id == null ? '/records' : `/records/${id}`;
}
