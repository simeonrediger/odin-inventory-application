bindEvents();

function bindEvents() {
  document
    .querySelector('[data-listener="delete"]')
    ?.addEventListener('submit', handleSubmitDelete);
}

function handleSubmitDelete(event) {
  const deleteForm = event.target;
  const resourceName = deleteForm.dataset.resourceName;
  const deleteConfirmed = confirm(`Delete ${resourceName}?`);

  if (!deleteConfirmed) {
    return event.preventDefault();
  }

  const returnToInput = deleteForm.querySelector('[name="returnTo"]');
  returnToInput.value = location.pathname + location.search + location.hash;
}
