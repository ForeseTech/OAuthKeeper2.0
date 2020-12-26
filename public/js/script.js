// Search through contacts
const searchBox = document.getElementById('search');
const cards = document.getElementsByClassName('card');

searchBox.addEventListener('keyup', function () {
  const searchInput = searchBox.value.toUpperCase();
  console.log(searchInput);

  for (let i = 0; i < cards.length; i++) {
    const contactHeader = cards[i].getElementsByClassName('contact-header')[0].innerText;
    if (contactHeader.toUpperCase().indexOf(searchInput) < 0) {
      cards[i].style.display = 'none';
    } else {
      cards[i].style.display = 'block';
    }
  }
});

// Colors for members, incharges and statuses
const contactIncharge = document.getElementsByClassName('contactIncharge');
const contactStatus = document.getElementsByClassName('contactStatus');

for (let i = 0; i < contactStatus.length; i++) {
  if (['Emailed/Confirmed', 'Called/Accepted'].includes(contactStatus[i].innerText)) {
    contactStatus[i].style.backgroundColor = '#00A878';
  } else if (['Called/Declined', 'Emailed/Declined'].includes(contactStatus[i].innerText)) {
    contactStatus[i].style.backgroundColor = '#D62839';
  } else if (contactStatus[i].innerText == 'Not Called') {
    contactStatus[i].style.backgroundColor = '#011627';
  } else if (contactStatus[i].innerText == 'Wrong Number') {
    contactStatus[i].style.backgroundColor = '#4B3832';
  } else if (contactStatus[i].innerText == 'Called/Not Reachable') {
    contactStatus[i].style.backgroundColor = '#F26419';
  } else if (contactStatus[i].innerText == 'Called/Postponed') {
    contactStatus[i].style.backgroundColor = '#7A3B69';
  } else if (contactStatus[i].innerText == 'Emailed/Awaiting Response') {
    contactStatus[i].style.backgroundColor = '#FDCA40';
  }
}

for (let i = 0; i < contactIncharge.length; i++) {
  if (contactIncharge[i].innerText.includes('Adhihariharan')) {
    contactIncharge[i].style.backgroundColor = '#2191FB';
  } else if (contactIncharge[i].innerText.includes('Anuja')) {
    contactIncharge[i].style.backgroundColor = '#994636';
  } else if (contactIncharge[i].innerText.includes('Dhivya')) {
    contactIncharge[i].style.backgroundColor = '#005b96';
  } else if (contactIncharge[i].innerText.includes('Govind')) {
    contactIncharge[i].style.backgroundColor = '#FFAD05';
  } else if (contactIncharge[i].innerText.includes('Joann')) {
    contactIncharge[i].style.backgroundColor = '#CE6D8B';
  } else {
    contactIncharge[i].style.backgroundColor = '#35C4C8';
  }
}

// Change chevron direction
const chevron = document.querySelectorAll('.fa');

for (let i = 0; i < chevron.length; i++) {
  chevron[i].addEventListener('click', function () {
    chevron[i].classList.toggle('fa-chevron-down');
    chevron[i].classList.toggle('fa-chevron-up');
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
    editForm['address'].value = this.getAttribute('data-address') ?? '';

    const deptPreferences = this.getAttribute('data-deptPreferences').split(',');
    const deptPreference = editForm['deptPreference'];

    for (let i = 0; i < deptPreference.length; i++) {
      if (deptPreferences.includes(deptPreference[i].value)) {
        deptPreference[i].checked = true;
      }
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
