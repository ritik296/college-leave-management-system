let cart = document.getElementById('filter');
let cartContainer = document.getElementById('filter-container');
let openFilterBtn = document.getElementById('open-filter-btn');
let closeFilterBtn = document.getElementById('close-filter-btn');
let cartItemContainer = document.getElementById('cart-item-container');

const coordinatorId = document.getElementById('coordinatorId');
const branch = document.getElementById('branch');
const semester = document.getElementById('semester');
const section = document.getElementById('section');


openFilterBtn.addEventListener('click', () => {
    cart.classList.remove('translate-x-96');
});

closeFilterBtn.addEventListener('click', () => {
    cart.classList.add('translate-x-96');
});


function toggleOption(id){
    let option = document.getElementById(`${id}option`);
    if(option.classList.contains('hidden')){
        option.classList.remove('hidden');
    } else {
        option.classList.add('hidden');
    }
}

function showClassesDetail(id) {
    window.open(`/admin-dashboard/resources/classes/records/${id}/show`, '_self');
}

function filterRecord(){
    let query = `?${coordinatorId.value ? 'coordinatorId='+ coordinatorId.value : ''}${branch.value ? '&branch='+ branch.value : ''}${semester.value ? '&semester='+ semester.value : ''}${section.value ? '&section='+ section.value: ''}`;

    window.open('/admin-dashboard/resources/classes'+query, '_self');
}

async function deleteRecord(id){
    let con = confirm(`Confirm delete record`);
}

async function deleteRecord(id){
    openSpinner()
    let con = confirm(`Confirm delete record`);
    console.log(con);

    if(con){
        let res = await fetch(`/admin-dashboard/resources/classes/records/${id}/delete`, {
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
            location.reload();
        }
        else if(res.status == 400){
            let resData = await res.json();
            console.log(resData['error']);
            alert(resData['error']);
        }
    }
    closeSpinner();
}