const editBtns = document.getElementsByClassName('edit-contact');

for (let i = 0; i < editBtns.length; i++) {
  editBtns[i].addEventListener('click', function () {
    const editForm = document.getElementById('edit-contact-form');
    editForm.action = `/contacts/${this.getAttribute('data-id')}`;
    editForm['name'].value = this.getAttribute('data-name') ? this.getAttribute('data-name') : '';
    editForm['company'].value = this.getAttribute('data-company') ? this.getAttribute('data-company') : '';
    editForm['phone'].value = this.getAttribute('data-phone') ? this.getAttribute('data-phone') : '';
    editForm['email'].value = this.getAttribute('data-email') ? this.getAttribute('data-email') : '';
    editForm['status'].value = this.getAttribute('data-status') ? this.getAttribute('data-status') : '';
    editForm['mode'].value = this.getAttribute('data-mode') ? this.getAttribute('data-mode') : '';
    editForm['count'].value = this.getAttribute('data-count') ? parseInt(this.getAttribute('data-count')) : 0;
    editForm['address'].value = this.getAttribute('data-address') ? this.getAttribute('data-address') : '';
  });
}
