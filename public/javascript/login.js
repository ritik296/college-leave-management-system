const userId = document.getElementById('user-id');
const password = document.getElementById('password');
const update = document.getElementById('error');

async function signIn() {
    // console.log(userId.value, " ", password.value);
    let res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            "userId": userId.value,
            "password": password.value
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });
    // console.log(res.status)

    if(res.status == 400) {
        update.innerText = "Login with correct credentails.";
        update.classList.remove('text-green-500');
        update.classList.add('text-red-500');
    }

    if(res.status == 200){
        let resData = await res.json();
        update.classList.remove('text-red-500');
        update.classList.add('text-green-500');
        update.innerText = resData['message'];
        sessionStorage.setItem('auth-token', resData.authToken);
        document.cookie = `auth-token=${resData.authToken}`;
        setTimeout(() => {
            window.open('/', '_self');
        }, 500);
    }
}