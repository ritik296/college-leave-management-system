const userId = document.getElementById('user-id');
const password = document.getElementById('password');
const update = document.getElementById('error');

async function updatePassword() {
    openSpinner();
    if(!(userId.value !== "")){
        alert("Enter user id");
        closeSpinner();
        return;
    }
    res = await fetch('/api/admin/forget_pass', {
        method: 'PUT',
        body: JSON.stringify({
            "password": password.value == "" ? '12345678': password.value,
            "userId": userId.value,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8', "admin-token": `${sessionStorage.getItem('admin-token')}`
        }
    });
    if(res.status == 401) {
        alert("Login with correct credentails.");
        sessionStorage.clear();
        document.cookie = 'admin-token=';
        window.open('/admin-dashboard/login', '_self');
    }
    else if(res.status == 200){
        let resData = await res.json();
        update.classList.remove('text-red-500');
        update.classList.add('text-green-500');
        update.innerText = resData['message'];
        userId.value = "";
    }
    else if(res.status == 400){
        let resData = await res.json();
        update.classList.remove('text-green-500');
        update.classList.add('text-red-500');
        update.innerText = resData['error'];
        console.log(resData['error']);
    }
    closeSpinner();
}