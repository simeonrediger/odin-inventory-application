import { getRecordPath } from '/formatting.js';

bindEvents();

const modals = {
  create: document.querySelector('[data-modal="create"]'),
  update: document.querySelector('[data-modal="update"]'),
  delete: document.querySelector('[data-modal="delete"]'),
};

const forms = {
  create: modals.create?.querySelector('form'),
  update: modals.update?.querySelector('form'),
  delete: modals.delete?.querySelector('form'),
};

const editedRecordField = forms.update?.querySelector('[name="recordId"]');

openInvalidFormModal();

function bindEvents() {
  document.addEventListener('click', handleClick);
  document.addEventListener('submit', handleSubmit);
}

function openInvalidFormModal() {
  if (forms.create?.hasAttribute('data-invalid')) {
    modals.create.showModal();
  } else if (forms.update?.hasAttribute('data-invalid')) {
    modals.update.showModal();
  } else if (forms.delete?.hasAttribute('data-invalid')) {
    modals.delete.showModal();
  }
}

function handleClick(event) {
  switch (event.target.dataset.action) {
    case 'start-create':
      forms.create.reset();
      modals.create.showModal();
      return;
    case 'cancel-create':
      modals.create.close();
      return;
    case 'start-update':
      forms.update.reset();
      editedRecordField.value = event.target.dataset.resourceId;
      editedRecordField.dataset.name = event.target.dataset.resourceName;
      modals.update.showModal();
      return;
    case 'cancel-update':
      modals.update.close();
      return;
    case 'start-delete':
      prepareDeleteForm();
      modals.delete.showModal();
      return;
    case 'cancel-delete':
      modals.delete.close();
      return;
  }

  if (modals.create?.open && !forms.create.contains(event.target)) {
    modals.create.close();
  } else if (modals.update?.open && !forms.update.contains(event.target)) {
    modals.update.close();
  } else if (modals.delete?.open && !forms.delete.contains(event.target)) {
    modals.delete.close();
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
  populateReturnUrl(deleteForm);
}

function prepareDeleteForm() {
  forms.delete.reset();
  const { resourceId, resourceName } = event.target.dataset;
  const record = { id: resourceId, name: resourceName };
  forms.delete.querySelector('[data-role="record-name"]').textContent =
    record.name;
  forms.delete.action = getFormAction({
    path: getRecordPath(record),
    searchParams: { _method: 'DELETE' },
    includeLocationSearchParams: true,
    includeLocationFragment: true,
  });
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
