const username = document.getElementById('username');
const password = document.getElementById('password');
const update = document.getElementById('error');

async function login(){
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
    // console.log(res.status)

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
}