const currentPassword = document.getElementById('current-password');
const newPassword = document.getElementById('new-password');
const conformPassword = document.getElementById('conform-password');
const update = document.getElementById('error');

async function changePassword() {
    openSpinner();
    if(!(currentPassword.value !== "" && newPassword.value !== '' && conformPassword.value !== '')){
        update.classList.remove('text-green-500');
        update.classList.add('text-red-500');
        update.innerText = 'Fill all fields.';
        closeSpinner();
        return;
    }

    if(newPassword.value !== conformPassword.value) {
        update.classList.remove('text-green-500');
        update.classList.add('text-red-500');
        update.innerText = "Password doesn't match.";
        closeSpinner();
        return;
    }

    res = await fetch('/api/v1/auth/change_pass', {
        method: 'PUT',
        body: JSON.stringify({
            "password": currentPassword.value,
            "newPassword": newPassword.value
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8', "auth-token": `${sessionStorage.getItem('auth-token')}`
        }
    });
    if(res.status == 401) {
        alert("Login with correct credentails.");
        sessionStorage.clear();
        document.cookie = 'auth-token=';
        window.open('/sign-in', '_self');
        closeSpinner();
    }
    else if(res.status == 200){
        let resData = await res.json();
        update.classList.remove('text-red-500');
        update.classList.add('text-green-500');
        update.innerText = resData['message'];
        currentPassword.value = "";
        newPassword.value = "";
        conformPassword.value = "";
        closeSpinner();
    }
    else if(res.status == 400){
        let resData = await res.json();
        update.classList.remove('text-green-500');
        update.classList.add('text-red-500');
        update.innerText = resData['error'];
        closeSpinner();
        // console.log(resData['error']);
    }
}