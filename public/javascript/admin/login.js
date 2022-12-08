const username = document.getElementById('username');
const password = document.getElementById('password');
const update = document.getElementById('error');
const spinner = document.getElementById('progress-spinner');

function openSpinner(){
    spinner.classList.remove('-translate-y-20');
    spinner.classList.add('translate-y-0');
}

function closeSpinner(){
    spinner.classList.remove('translate-y-0');
    spinner.classList.add('-translate-y-20');
}

async function login(){
    openSpinner();
    let res = await fetch('/api/admin/admin-login', {
        method: 'POST',
        body: JSON.stringify({
            "username": username.value,
            "password": password.value
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });

    if(res.status == 401) {
        update.innerText = "Login with correct credentails.";
        update.classList.remove('text-green-500');
        update.classList.add('text-red-500');
    }
    else if(res.status == 200){
        let resData = await res.json();
        update.classList.remove('text-red-500');
        update.classList.add('text-green-500');
        update.innerText = resData['message'];
        sessionStorage.setItem('admin-token', resData['admin-token']);
        document.cookie = `admin-token=${resData['admin-token']}`;
        setTimeout(() => {
            window.open('/admin-dashboard/resources/user', '_self');
        }, 500);
    }
    closeSpinner();
}