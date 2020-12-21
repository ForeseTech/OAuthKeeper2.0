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
