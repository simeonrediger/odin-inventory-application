import { getArtistPath, getRecordPath } from '/formatting.js';

const modalForms = {
  create: document.forms.create,
  update: document.forms.update,
  delete: document.forms.delete,
};

const modals = {
  create: modalForms.create?.closest('dialog'),
  update: modalForms.update?.closest('dialog'),
  delete: modalForms.delete?.closest('dialog'),
};

const resource = populateResourceProperties();
bindEvents();
openModalIfFormInvalid();

function populateResourceProperties() {
  const resourceType = document.body.dataset.resourceType;
  const resource = {};

  switch (resourceType) {
    case 'artist':
      resource.getPath = getArtistPath;
      break;
    case 'record':
      resource.getPath = getRecordPath;
      resource.getDataFromButton = getRecordDataFromButton;
      resource.populateUpdateForm = populateRecordToUpdateForm;
      resource.populateDeleteForm = populateRecordToDeleteForm;
      resource.populateContext = populateRecordContext;
      break;
    case undefined:
    case '':
      return;
    default:
      throw new TypeError(`Unexpected resource type: ${resourceType}`);
  }

  return resource;
}

function bindEvents() {
  document.addEventListener('click', handleClick);
  document.addEventListener('submit', handleSubmit);
}

function openModalIfFormInvalid() {
  for (const [type, form] of Object.entries(modalForms)) {
    const formInvalid = form?.hasAttribute('data-invalid');

    if (formInvalid) {
      populateReturnUrl(form);
      return modals[type]?.showModal();
    }
  }
}

function handleClick(event) {
  switch (event.target.dataset.action) {
    case 'start-create':
      prepareCreateForm();
      return modals.create.showModal();

    case 'start-update':
      prepareUpdateForm(event.target);
      return modals.update.showModal();

    case 'start-delete':
      prepareDeleteForm(event.target);
      return modals.delete.showModal();

    case 'cancel-create':
      return modals.create.close();

    case 'cancel-update':
      return modals.update.close();

    case 'cancel-delete':
      return modals.delete.close();

    case 'clear-form':
      return resetForm(event.target.closest('form'));
  }

  closeModalIfExternalClick(event.target);
}

function handleSubmit(event) {
  switch (event.target.getAttribute('name')) {
    case 'search':
      return omitEmptyFields(event);
  }
}

function prepareCreateForm() {
  resetForm(modalForms.create);
  populateReturnUrl(modalForms.create);
  modalForms.create.action = getRootRelativeUrl({ path: resource.getPath() });
}

function prepareUpdateForm(updateButton) {
  resetForm(modalForms.update);
  const resourceData = resource.getDataFromButton(updateButton);
  resource.populateUpdateForm(modalForms.update, resourceData);
  populateReturnUrl(modalForms.update);

  modalForms.update.action = getRootRelativeUrl({
    path: resource.getPath(resourceData),
    searchParams: { _method: 'PUT' },
  });
}

function prepareDeleteForm(deleteButton) {
  resetForm(modalForms.delete);
  const resourceData = resource.getDataFromButton(deleteButton);
  resource.populateContext(resourceData);
  resource.populateDeleteForm(modalForms.delete, resourceData);
  populateReturnUrl(modalForms.delete);

  modalForms.delete.action = getRootRelativeUrl({
    path: resource.getPath(resourceData),
    searchParams: { _method: 'DELETE' },
  });
}

function closeModalIfExternalClick(target) {
  for (const [type, modal] of Object.entries(modals)) {
    const modalForm = modalForms[type];
    const isExternalClick =
      modal?.open && modalForm && !modalForm.contains(target);

    if (isExternalClick) {
      return modal.close();
    }
  }
}

function omitEmptyFields(event) {
  const form = event.target;
  let queryIsEmpty = true;

  for (const field of form.elements) {
    if (field.value) {
      queryIsEmpty = false;
    } else {
      field.removeAttribute('name');
    }
  }

  if (queryIsEmpty) {
    location.href = form.action + location.hash;
    return event.preventDefault();
  }
}

function populateReturnUrl(form) {
  form.elements.returnTo.value = getRootRelativeUrl({
    path: resource.getPath(),
  });
}

function resetForm(form) {
  for (const element of form.elements) {
    if (element.hasAttribute('name')) {
      element.value = '';
    }
  }

  form.querySelector('[data-role="errors"]')?.remove();
}

function getRootRelativeUrl({ path, searchParams = {} }) {
  const url = new URL('https://example.invalid' + path);

  for (const [key, value] of new URL(location).searchParams.entries()) {
    url.searchParams.set(key, value);
  }

  url.searchParams.delete('_method');

  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }

  url.hash = location.hash;
  return url.pathname + url.search + url.hash;
}

function getRecordDataFromButton(button) {
  const {
    resourceId: id,
    resourceArtistId: artistId,
    resourceName: name,
    resourcePrice: price,
    resourceQuantity: quantity,
  } = button.dataset;

  const record = { id, artistId, name, price, quantity };
  return record;
}

function populateRecordToUpdateForm(form, record) {
  form.elements.artistId.value = record.artistId;
  form.elements.name.value = record.name;
  form.elements.price.value = record.price;
  form.elements.quantity.value = record.quantity;
}

function populateRecordToDeleteForm(form, record) {
  form.elements.name.value = record.name;
}

function populateRecordContext(record) {
  document
    .querySelectorAll('[data-context="record-name"]')
    .forEach(element => (element.textContent = record.name));
}
