const hamb = document.querySelector('.sidenav-btn');
const nav = document.querySelector('header.dark.lower');
let sidenavActive = false;
hamb.addEventListener('click', () => {
  console.log('clicked')
  if(!sidenavActive) {
    hamb.classList.add('active');
    nav.classList.add('active');
    sidenavActive = true;
  } else {
    hamb.classList.remove('active');
    nav.classList.remove('active');
    sidenavActive = false;
  }
});