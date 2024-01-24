// Submit to google spreadsheet
const scriptURL = 'https://script.google.com/macros/s/AKfycbw0eSO6iCN8ukvCflxTI7LBfGibtEOQf7wpVlOx9k9PGfWZN_S0IyNxk8yXQAd4_086/exec';
const form = document.forms['submit-to-google-sheet'];
const btnSimpan = document.querySelector('.btn-simpan');
const btnLoading = document.querySelector('.btn-loading');
const myAlert = document.querySelector('.my-alert');

form.addEventListener('submit', e => {
  e.preventDefault();
  btnSimpan.classList.toggle('d-none');
  btnLoading.classList.toggle('d-none');
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
      console.log('Success!', response);
      btnSimpan.classList.toggle('d-none');
      btnLoading.classList.toggle('d-none');
      myAlert.classList.toggle('d-none');
      form.reset();
    })
    .catch(error => console.error('Error!', error.message));
})