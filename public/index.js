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
  modalForms.create.reset();
  modalForms.create.querySelector('[data-role="errors"]')?.remove();
  populateReturnUrl(modalForms.create);
  modalForms.create.action = getRootRelativeUrl({ path: getRecordPath() });
}

function prepareUpdateForm(updateButton) {
  modalForms.update.reset();
  modalForms.update.querySelector('[data-role="errors"]')?.remove();
  const record = getRecordDataFromButton(updateButton);

  modalForms.update.elements.artistId.value = record.artistId;
  modalForms.update.elements.name.value = record.name;
  modalForms.update.elements.price.value = record.price;
  modalForms.update.elements.quantity.value = record.quantity;
  populateReturnUrl(modalForms.update);

  modalForms.update.action = getRootRelativeUrl({
    path: getRecordPath(record),
    searchParams: { _method: 'PUT' },
  });
}

function prepareDeleteForm(deleteButton) {
  modalForms.delete.reset();
  modalForms.delete.querySelector('[data-role="errors"]')?.remove();
  const record = getRecordDataFromButton(deleteButton);
  populateContext(record);

  modalForms.delete.elements.name.value = record.name;
  populateReturnUrl(modalForms.delete);

  modalForms.delete.action = getRootRelativeUrl({
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

function populateContext(record) {
  document
    .querySelectorAll('[data-context="record-name"]')
    .forEach(element => (element.textContent = record.name));
}

function populateReturnUrl(form) {
  form.elements.returnTo.value = getRootRelativeUrl({
    path: getRecordPath(),
  });
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
