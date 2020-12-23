const deleteBtns = document.getElementsByClassName('delete-contact');

for (let i = 0; i < deleteBtns.length; i++) {
  deleteBtns[i].addEventListener('click', function () {
    const deleteForm = document.getElementById('delete-contact-form');
    deleteForm.action = `/contacts/${this.getAttribute('data-id')}`;
  });
}
