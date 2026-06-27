bindEvents();

function bindEvents() {
  document.addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
  switch (event.target.dataset.action) {
    case 'delete':
      handleSubmitDelete(event);
      break;
  }
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
