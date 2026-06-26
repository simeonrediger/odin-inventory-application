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

  const resourceName = deleteForm.dataset.resourceName;
  const deleteConfirmed = confirm(`Delete ${resourceName}?`);

  if (!deleteConfirmed) {
    event.preventDefault();
  }
}
