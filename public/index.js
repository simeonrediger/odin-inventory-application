bindEvents();

const newEntryModal = document.querySelector('[data-modal="new-entry"]');
const newEntryForm = newEntryModal?.querySelector('form');

if (newEntryForm) {
  openInvalidFormModal();
}

function bindEvents() {
  document.addEventListener('click', handleClick);
  document.addEventListener('submit', handleSubmit);
}

function openInvalidFormModal() {
  if (newEntryForm.hasAttribute('data-invalid')) {
    newEntryModal.showModal();
  }
}

function handleClick(event) {
  switch (event.target.dataset.action) {
    case 'start-new-entry':
      newEntryForm.reset();
      newEntryModal.showModal();
      return;
    case 'close-new-entry':
      newEntryModal.close();
      return;
  }

  if (newEntryModal?.open && !newEntryForm.contains(event.target)) {
    newEntryModal.close();
  }
}

function handleSubmit(event) {
  switch (event.target.dataset.action) {
    case 'search':
      handleSubmitSearch(event);
      return;
    case 'create':
      handleSubmitCreate(event);
      break;
    case 'delete':
      handleSubmitDelete(event);
      break;
  }
}

function handleSubmitSearch(event) {
  const searchForm = event.target;
  omitEmptyFields(searchForm);
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

function omitEmptyFields(form) {
  let queryIsEmpty = true;

  for (const field of form.elements) {
    if (field.value === '') {
      field.removeAttribute('name');
    } else {
      queryIsEmpty = false;
    }
  }

  if (queryIsEmpty) {
    location.href = location.pathname + location.hash;
    return event.preventDefault();
  }
}

function populateReturnUrl(form) {
  const returnToField = form.querySelector('[name="returnTo"]');
  returnToField.value = location.pathname + location.search + location.hash;
}
