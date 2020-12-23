const editBtns = document.getElementsByClassName('edit-contact');

for (let i = 0; i < editBtns.length; i++) {
  editBtns[i].addEventListener('click', function () {
    const editForm = document.getElementById('edit-contact-form');
    editForm.action = `/contacts/${this.getAttribute('data-id')}`;
    editForm['name'].value = this.getAttribute('data-name') ?? '';
    editForm['company'].value = this.getAttribute('data-company') ?? '';
    editForm['phone'].value = this.getAttribute('data-phone') ?? '';
    editForm['email'].value = this.getAttribute('data-email') ?? '';
    editForm['status'].value = this.getAttribute('data-status') ?? '';
    editForm['mode'].value = this.getAttribute('data-mode') ?? '';
    editForm['count'].value = parseInt(this.getAttribute('data-count')) ?? '';
    editForm['address'].value = this.getAttribute('data-address') ?? '';
  });
}
