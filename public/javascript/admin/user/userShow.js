async function deleteRecord(id, fullname){
    openSpinner()
    let con = confirm(`Confirm delete ${fullname} record`);
    console.log(con);

    if(con){
        let res = await fetch(`/admin-dashboard/resources/user/records/${id}/delete`, {
            method: 'DELETE',
            body: JSON.stringify(),
            headers: {
                'Content-type': 'application/json; charset=UTF-8', "admin-token": `${sessionStorage.getItem('admin-token')}`
            }
        });
        if(res.status == 401) {
            alert("Login with correct credentails.");
            sessionStorage.clear();
            document.cookie = 'auth-token=';
            window.open('/admin-dashboard/login', '_self');
        }
        else if(res.status == 200){
            let resData = await res.json();
            alert(resData['message']);
            history.back();
        }
        else if(res.status == 400){
            let resData = await res.json();
            console.log(resData['error']);
            alert(resData['error']);
        }
    }
    closeSpinner();
}