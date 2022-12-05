let cart = document.getElementById('filter');
let cartContainer = document.getElementById('filter-container');
let openFilterBtn = document.getElementById('open-filter-btn');
let closeFilterBtn = document.getElementById('close-filter-btn');

const subject = document.getElementById('subject');
const leave = document.getElementById('leave');
const status1 = document.getElementById('status');

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

function showApplicationDetail(id) {
    window.open(`/admin-dashboard/resources/application/records/${id}/show`, '_self');
}

function filterRecord(){
    let query = `?${subject.value ? 'subject='+ subject.value : ''}${leave.value ? '&leave='+ leave.value: ''}${status1.value ? '&status='+ status1.value : ''}`;
    window.open('/admin-dashboard/resources/application'+ query, '_self');
}