const editBtns = document.getElementsByClassName('edit-contact');

for (let i = 0; i < editBtns.length; i++) {
  editBtns[i].addEventListener('click', function () {
    document.getElementById('edit-contact-form').action = `/contacts/${this.getAttribute('data-id')}`;
    console.log(document.getElementById('edit-contact-form').action);
    document.getElementById('edit-name').value = this.getAttribute('data-name');
    document.getElementById('edit-company').value = this.getAttribute('data-company');
    document.getElementById('edit-phone').value = this.getAttribute('data-phone');
    document.getElementById('edit-email').value = this.getAttribute('data-email');
    document.getElementById('edit-status').value = this.getAttribute('data-status');
    document.getElementById('edit-address').value = this.getAttribute('data-address');
  });
}
