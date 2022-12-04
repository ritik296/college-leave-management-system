// console.log("connected")
function toggleOption(id){
    let option = document.getElementById(`${id}option`);
    if(option.classList.contains('hidden')){
        option.classList.remove('hidden');
    } else {
        option.classList.add('hidden');
    }
}

function showUserDetail(id) {
    window.open(`/admin-dashboard/resources/user/records/${id}/show`, '_self');
}