// Search through contacts
const searchBox = document.getElementById('search');
const cards = document.getElementsByClassName('card');

searchBox.addEventListener('keyup', function () {
  const searchInput = searchBox.value.toUpperCase();

  for (let i = 0; i < cards.length; i++) {
    const contactHeader = cards[i].getElementsByClassName('contact-header')[0].innerText;
    if (contactHeader.toUpperCase().indexOf(searchInput) < 0) {
      cards[i].style.display = 'none';
    } else {
      cards[i].style.display = 'block';
    }
  }
});

// Colors for ED Incharges and Statuses
const contactStatus = document.getElementsByClassName('contactStatus');
const statusColors = {
  'Emailed/Confirmed': '#00A878',
  'Called/Accepted': '#00A878',
  'Called/Declined': '#D62839',
  'Emailed/Declined': '#D62839',
  'Not Called': '#011627',
  'Wrong Number': '#4B3832',
  'Called/Not Reachable': '#F26419',
  'Called/Postponed': '#7A3B69',
  'Emailed/Awaiting Response': '#FDCA40',
};

for (let i = 0; i < contactStatus.length; i++) {
  const status = contactStatus[i].innerText;
  contactStatus[i].style.backgroundColor = statusColors[status];
}

const contactIncharge = document.getElementsByClassName('contactIncharge');
const edColors = { Adhihariharan: '#2191FB', Anuja: '#994636', Dhivya: '#005b96', Govind: '#FFAD05', Joann: '#CE6D8B' };

for (let i = 0; i < contactIncharge.length; i++) {
  const edName = contactIncharge[i].innerText.split(' /')[0];
  contactIncharge[i].style.backgroundColor = edColors[edName] ?? '#35C4C8';
}

// Change chevron direction
const chevron = document.querySelectorAll('.fa');

for (let i = 0; i < chevron.length; i++) {
  chevron[i].addEventListener('click', function () {
    chevron[i].classList.toggle('fa-chevron-down');
    chevron[i].classList.toggle('fa-chevron-up');
  });
}

// Hide address input and label if contact choose ownTransport
const ownTransport = document.querySelectorAll("input[name='ownTransport']");
const address = document.querySelectorAll("textarea[name='address']");

for (let i = 0; i < ownTransport.length; i++) {
  ownTransport[i].addEventListener('change', function () {
    if (ownTransport[i].checked) {
      address[i].classList.add('d-none');
      address[i].previousElementSibling.classList.add('d-none');
    } else {
      address[i].classList.remove('d-none');
      address[i].previousElementSibling.classList.remove('d-none');
    }
  });
}

// Populate edit modal with data
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
    editForm['comments'].value = this.getAttribute('data-comments') ?? '';

    const deptPreferences = this.getAttribute('data-deptPreferences').split(',');
    const deptPreference = editForm['deptPreference'];

    for (let i = 0; i < deptPreference.length; i++) {
      if (deptPreferences.includes(deptPreference[i].value)) {
        deptPreference[i].checked = true;
      }
    }

    const isOwnTransport = this.getAttribute('data-ownTransport');

    // Hide address field if the contact chooses ownTransport
    if (isOwnTransport == 'true') {
      editForm['ownTransport'].checked = true;
      // Hide address input
      editForm['address'].classList.add('d-none');
      // Hide address label
      editForm['address'].previousElementSibling.classList.add('d-none');
    } else {
      editForm['ownTransport'].checked = false;
      editForm['address'].value = this.getAttribute('data-address') ?? '';
      // Show address input
      editForm['address'].classList.remove('d-none');
      // Show address label
      editForm['address'].previousElementSibling.classList.remove('d-none');
    }
  });
}

// Ask for confirmation before deleting a contact
const deleteBtns = document.getElementsByClassName('delete-contact');

for (let i = 0; i < deleteBtns.length; i++) {
  deleteBtns[i].addEventListener('click', function () {
    const deleteForm = document.getElementById('delete-contact-form');
    deleteForm.action = `/contacts/${this.getAttribute('data-id')}`;
  });
}
