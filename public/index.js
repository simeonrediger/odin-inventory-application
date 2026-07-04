import { getRecordPath } from '/formatting.js';

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

bindEvents();
openModalIfFormInvalid();

function bindEvents() {
  document.addEventListener('click', handleClick);
  document.addEventListener('submit', handleSubmit);
}

function openModalIfFormInvalid() {
  for (const [type, form] of Object.entries(modalForms)) {
    const formInvalid = form?.hasAttribute('data-invalid');

    if (formInvalid) {
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
  }

  closeModalIfExternalClick(event.target);
}

function handleSubmit(event) {
  switch (event.target.getAttribute('name')) {
    case 'search':
      return omitEmptyFields(event.target);

    case 'create':
    case 'update':
    case 'delete':
      return populateReturnUrl(event.target);
  }
}

function prepareCreateForm() {
  modalForms.create.reset();
  modalForms.create.action = getFormAction({ path: getRecordPath() });
}

function prepareUpdateForm(updateButton) {
  modalForms.update.reset();
  const record = getRecordDataFromButton(updateButton);

  modalForms.update.elements.artistId.value = record.artistId;
  modalForms.update.elements.name.value = record.name;
  modalForms.update.elements.price.value = record.price;
  modalForms.update.elements.quantity.value = record.quantity;

  modalForms.update.action = getFormAction({
    path: getRecordPath(record),
    searchParams: { _method: 'PUT' },
  });
}

function prepareDeleteForm(deleteButton) {
  modalForms.delete.reset();
  const record = getRecordDataFromButton(deleteButton);

  modalForms.delete.querySelector('[data-role="record-name"]').textContent =
    record.name;

  modalForms.delete.action = getFormAction({
    path: getRecordPath(record),
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
  const returnToField = form.elements.returnTo;
  returnToField.value = location.pathname + location.search + location.hash;
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

function getFormAction({ path, searchParams = {} }) {
  const url = new URL('https://example.invalid' + path);

  for (const [key, value] of new URL(location).searchParams.entries()) {
    url.searchParams.set(key, value);
  }

  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }

  url.hash = location.hash;
  return url.pathname + url.search + url.hash;
}
