const sideBarOpenBtn = document.getElementById('side-bar-open-btn');
const sideBarCloseBtn = document.getElementById('side-bar-close-btn');
const sideBar = document.getElementById('sidebar');
const spinner = document.getElementById('progress-spinner');

function openSpinner(){
    spinner.classList.remove('-translate-y-20');
    spinner.classList.add('translate-y-0');
}

function closeSpinner(){
    spinner.classList.remove('translate-y-0');
    spinner.classList.add('-translate-y-20');
}
let sideBarToggleState = false;

sideBarCloseBtn.addEventListener('click', ()=> {
    sideBar.classList.add('-translate-x-80');
    sideBarToggleState = false;
});

sideBarOpenBtn.addEventListener('click', ()=> {
    if(!sideBarToggleState){
        sideBar.classList.remove('-translate-x-80');
        sideBarToggleState = true;
    }
    else {
        sideBar.classList.add('-translate-x-80');
        sideBarToggleState = false;
    }
});

function signOut() {
    sessionStorage.clear();
    document.cookie = "admin-token=";
    window.open('/admin-dashboard/login', "_self");
}

async function checkLoginState(){
    let token = sessionStorage.getItem('admin-token');
    if(!token){
        window.open('/admin-dashboard/login', '_self');
    }
}
checkLoginState();

