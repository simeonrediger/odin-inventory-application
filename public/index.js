bindEvents();

const newEntryModal = document.querySelector('[data-modal="new-entry"]');
const newEntryForm = newEntryModal?.querySelector('form');

function bindEvents() {
  document.addEventListener('click', handleClick);
  document.addEventListener('submit', handleSubmit);
}

function handleClick(event) {
  switch (event.target.dataset.action) {
    case 'start-new-entry':
      newEntryForm.reset();
      newEntryModal.showModal();
      break;
  }
}

function handleSubmit(event) {
  switch (event.target.dataset.action) {
    case 'create':
      handleSubmitCreate(event);
      break;
    case 'delete':
      handleSubmitDelete(event);
      break;
  }
}

function handleSubmitCreate(event) {
  const createForm = event.target;
  populateReturnUrl(createForm);
}

function handleSubmitDelete(event) {
  const deleteForm = event.target;
  const resourceName = deleteForm.dataset.resourceName;
  const deleteConfirmed = confirm(`Delete ${resourceName}?`);

  if (!deleteConfirmed) {
    return event.preventDefault();
  }

  populateReturnUrl(deleteForm);
}

function populateReturnUrl(form) {
  const returnToInput = form.querySelector('[name="returnTo"]');
  returnToInput.value = location.pathname + location.search + location.hash;
}
