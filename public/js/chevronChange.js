const chevron = document.querySelectorAll('.fa');

for (let i = 0; i < chevron.length; i++) {
  chevron[i].addEventListener('click', function () {
    chevron[i].classList.toggle('fa-chevron-down');
    chevron[i].classList.toggle('fa-chevron-up');
  });
}
