bindEvents();

function bindEvents() {
  document
    .querySelector('[data-listener="delete"]')
    ?.addEventListener('click', handleDeleteClick);
}

function handleDeleteClick(event) {
  const deleteButton = event.target.closest('[data-action="delete"]');

  if (!deleteButton) {
    return;
  }

  const recordName = deleteButton
    .closest('[data-record]')
    .querySelector('[data-record-name]')
    .textContent.trim();

  const deleteConfirmed = confirm(`Delete ${recordName} record?`);

  if (!deleteConfirmed) {
    event.preventDefault();
  }
}
