bindEvents();

function bindEvents() {
  document
    .querySelector('[data-listener="delete"]')
    ?.addEventListener('submit', handleSubmitDelete);
}

function handleSubmitDelete(event) {
  const deleteForm = event.target.closest('[data-action="delete"]');

  if (!deleteForm) {
    return event.preventDefault();
  }

  const recordName = deleteForm.dataset.recordName;
  const deleteConfirmed = confirm(`Delete ${recordName} record?`);

  if (!deleteConfirmed) {
    event.preventDefault();
  }
}
