import { getSlug, getRecordPath } from '/formatting.js';

bindEvents();

const newEntryModal = document.querySelector('[data-modal="new-entry"]');
const newEntryForm = newEntryModal?.querySelector('form');
const editEntryModal = document.querySelector('[data-modal="edit-entry"]');
const editEntryForm = editEntryModal?.querySelector('form');
const editedRecordField = editEntryForm?.querySelector('[name="recordId"]');

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
  } else if (editEntryForm.hasAttribute('data-invalid')) {
    editEntryModal.showModal();
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
    case 'start-edit-entry':
      editEntryForm.reset();
      editedRecordField.value = event.target.dataset.resourceId;
      editedRecordField.dataset.name = event.target.dataset.resourceName;
      editEntryModal.showModal();
      return;
    case 'close-edit-entry':
      editEntryModal.close();
      return;
  }

  if (newEntryModal?.open && !newEntryForm.contains(event.target)) {
    newEntryModal.close();
  } else if (editEntryModal?.open && !editEntryForm.contains(event.target)) {
    editEntryModal.close();
  }
}

function handleSubmit(event) {
  switch (event.target.dataset.action) {
    case 'search':
      handleSubmitSearch(event);
      return;
    case 'create':
      handleSubmitCreate(event);
      return;
    case 'update':
      handleSubmitUpdate(event);
      break;
    case 'delete':
      handleSubmitDelete(event);
      return;
  }
}

function handleSubmitSearch(event) {
  const searchForm = event.target;
  omitEmptyFields(searchForm);
}

function handleSubmitCreate(event) {
  const createForm = event.target;
  populateReturnUrl(createForm, {
    appendQueryToAction: true,
    appendFragmentToAction: true,
  });
}

function handleSubmitUpdate(event) {
  const updateForm = event.target;
  populateReturnUrl(updateForm);

  const record = {
    id: editedRecordField.value,
    name: editedRecordField.dataset.name,
  };

  updateForm.action = `${getRecordPath(record)}?_method=PUT`;
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

function populateReturnUrl(
  form,
  { appendQueryToAction, appendFragmentToAction } = {},
) {
  const returnToField = form.querySelector('[name="returnTo"]');
  returnToField.value = location.pathname + location.search + location.hash;

  if (appendQueryToAction) {
    form.action += location.search;
  }

  if (appendFragmentToAction) {
    form.action += location.hash;
  }
}
