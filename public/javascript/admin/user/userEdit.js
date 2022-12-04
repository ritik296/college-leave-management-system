const fullName = document.getElementById('name');
const contact = document.getElementById('contact');
const userId = document.getElementById('user-id');
const password = document.getElementById('password');
const dob = document.getElementById('dob');
const semester = document.getElementById('semester');
const branch = document.getElementById('branch');
const section = document.getElementById('section');
const role = document.getElementById('role');
const batch = document.getElementById('batch');
const course = document.getElementById('course');
const update = document.getElementById('error');

const semesterContainer = document.getElementById('semester-container');
const batchContainer = document.getElementById('batch-container');
const branchContainer = document.getElementById('branch-container');
const sectionContainer = document.getElementById('section-container');

async function updateDetail(id) {
    openSpinner();
    if(!(fullName.value !== "" && contact.value !== "" && userId.value !== "" && dob.value !== "")){
        alert("Enter all required field.");
        closeSpinner();
        return;
    }
    let res = await fetch('/api/admin/update', {
        method: 'PUT',
        body: JSON.stringify({
            "id": id,
            "name": fullName.value,
            "contact": contact.value,
            "dob": dob.value,
            "password": password.value == "" ? '12345678': password.value,
            "role": role.value,
            "userId": userId.value,
            "branch": branch.value,
            "semester": semester.value,
            "section": section.value,
            "batch": batch.value,
            "course": course.value,
            "batch": batch.value 
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8', "admin-token": `${sessionStorage.getItem('admin-token')}`
        }
    });
    console.log(res.status)

    if(res.status == 401) {
        alert("Login with correct credentails.");
        sessionStorage.clear();
        document.cookie = 'auth-token=';
        window.open('/admin-dashboard/login', '_self');
    }
    else if(res.status == 200){
        let resData = await res.json();
        update.classList.remove('text-red-500');
        update.classList.add('text-green-500');
        update.innerText = resData['message'];
        alert(resData['message']);
    }
    else if(res.status == 400){
        let resData = await res.json();
        update.classList.remove('text-green-500');
        update.classList.add('text-red-500');
        update.innerText = resData['error'];
        console.log(resData['error']);
        alert(resData['error']);
    }
    closeSpinner();
}