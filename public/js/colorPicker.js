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
    contactStatus[i].style.backgroundColor = '#4b3832';
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
