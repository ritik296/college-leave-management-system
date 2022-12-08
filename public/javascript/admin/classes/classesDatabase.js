let cart = document.getElementById('filter');
let cartContainer = document.getElementById('filter-container');
let openFilterBtn = document.getElementById('open-filter-btn');
let closeFilterBtn = document.getElementById('close-filter-btn');
let cartItemContainer = document.getElementById('cart-item-container');

// const fullname = document.getElementById('name');
// const contact = document.getElementById('contact');
// const userId = document.getElementById('user-id');
// const role = document.getElementById('role');
// const branch = document.getElementById('branch');
// const semester = document.getElementById('semester');
// const section = document.getElementById('section');


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
    let query = `?${fullname.value ? 'name='+ fullname.value : ''}${contact.value ? '&contact='+ contact.value: ''}${userId.value ? '&userId='+ userId.value : ''}${role.value ? '&role='+ role.value : ''}${branch.value ? '&branch='+ branch.value : ''}${semester.value ? '&semester='+ semester.value : ''}${section.value ? '&section='+ section.value: ''}`;

    window.open('/admin-dashboard/resources/classes'+query, '_self');
}