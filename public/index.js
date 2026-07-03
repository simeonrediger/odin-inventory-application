import { getRecordPath } from '/formatting.js';

const modals = {
  create: document.querySelector('[data-modal="create"]'),
  update: document.querySelector('[data-modal="update"]'),
  delete: document.querySelector('[data-modal="delete"]'),
};

const modalForms = {
  create: document.forms.create,
  update: document.forms.update,
  delete: document.forms.delete,
};

bindEvents();
openModalIfFormInvalid();

function bindEvents() {
  document.addEventListener('click', handleClick);
  document.addEventListener('submit', handleSubmit);
}

function openModalIfFormInvalid() {
  for (const [type, form] of Object.entries(modalForms)) {
    if (form?.hasAttribute('data-invalid')) {
      return modals[type]?.showModal();
    }
  }
}

function handleClick(event) {
  switch (event.target.dataset.action) {
    case 'start-create':
      prepareCreateForm();
      modals.create.showModal();
      return;
    case 'cancel-create':
      modals.create.close();
      return;
    case 'start-update':
      prepareUpdateForm(event.target);
      modals.update.showModal();
      return;
    case 'cancel-update':
      modals.update.close();
      return;
    case 'start-delete':
      prepareDeleteForm(event.target);
      modals.delete.showModal();
      return;
    case 'cancel-delete':
      modals.delete.close();
      return;
  }

  for (const [type, modal] of Object.entries(modals)) {
    if (modal.open && !modalForms[type].contains(event.target)) {
      return modal.close();
    }
  }
}

function handleSubmit(event) {
  switch (event.target.getAttribute('name')) {
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

function prepareCreateForm() {
  modalForms.create.reset();
  modalForms.create.action = getFormAction({
    path: getRecordPath(),
    includeLocationSearchParams: true,
    includeLocationFragment: true,
  });
}

function prepareUpdateForm(updateButton) {
  modalForms.update.reset();
  const record = getRecordDataFromButton(updateButton);
}

function prepareDeleteForm(deleteButton) {
  modalForms.delete.reset();
  const record = getRecordDataFromButton(deleteButton);
  modalForms.delete.querySelector('[data-role="record-name"]').textContent =
    record.name;
  modalForms.delete.action = getFormAction({
    path: getRecordPath(record),
    searchParams: { _method: 'DELETE' },
    includeLocationSearchParams: true,
    includeLocationFragment: true,
  });
}

function handleSubmitCreate(event) {
  const createForm = event.target;
  populateReturnUrl(createForm);
}

function handleSubmitUpdate(event) {
  const updateForm = event.target;
  populateReturnUrl(updateForm);
  updateForm.action = `${getRecordPath(record)}?_method=PUT`;
}

function handleSubmitDelete(event) {
  const deleteForm = event.target;
  populateReturnUrl(deleteForm);
}

function handleSubmitSearch(event) {
  const searchForm = event.target;
  omitEmptyFields(searchForm);
}

function getRecordDataFromButton(button) {
  const { resourceId: id, resourceName: name } = button.dataset;
  return { id, name };
}

function getFormAction({
  path,
  searchParams,
  includeLocationSearchParams,
  includeLocationFragment,
}) {
  const url = new URL('https://example.invalid' + path);

  if (includeLocationSearchParams) {
    for (const [key, value] of new URL(location).searchParams.entries()) {
      url.searchParams.set(key, value);
    }
  }

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  if (includeLocationFragment) {
    url.hash = location.hash;
  }

  return url.pathname + url.search + url.hash;
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
