const applicationBody = document.getElementById('application-body');
const applicationSubject = document.getElementById('application-subject');
const applicationleaveDays = document.getElementById('leaves-days');
const leaveFrom = document.getElementById('leave-from');
const updateMessage = document.getElementById('update');
const file = document.getElementById('file');


async function sendApplication() {
    openSpinner();
    updateMessage.classList.add('hidden');
    if(applicationleaveDays.value > 7){
        alert('For more than 7 days leave contact your teacher in person');
        closeSpinner();
        return;
    }

    // console.log(leaveFrom.value);
    if(!isFutureDate(leaveFrom.value)){
        alert('Leave starting date you are requesting had already been passed.');
        closeSpinner();
        return;
    }
    let to = d = new Date((new Date(leaveFrom.value)).getTime() + applicationleaveDays.value*24*60*60*1000);
    var data = new FormData();
    data.append('file', file.files[0]);
    data.append('subject', applicationSubject.value);
    data.append('reason', applicationBody.value);
    data.append('leave', !applicationleaveDays.value ? 2 : applicationleaveDays.value);
    data.append('from', leaveFrom.value);
    data.append('to', `${to.getFullYear()}-${to.getMonth() + 1}-${to.getDate()}`)

    // data.append('file', file.files[0], {filename: file.originalname});
    console.log(data.file);
    
    if(applicationBody.value.length < 15){ 
        updateMessage.classList.remove('hidden');
        updateMessage.innerText = "Reason must be detailed.";
        return;
    }
    let res = await fetch('/api/v1/application/send_application', {
        method: 'POST',
        body: data,
        headers: {
            // 'Content-type': 'multipart/form-data; charset=UTF-8',
             'auth-token': `${sessionStorage.getItem('auth-token')}`
        }
    });


    if(res.status == 200){
        let resData = await res.json();
        // console.log(resData);
        update.classList.remove('text-red-500');
        update.classList.add('text-green-500');
        update.classList.remove('hidden');
        update.innerText = resData['message'];
        alert('Application sended wait for responce.');
        closeSpinner();
        applicationBody.value = "";
        applicationSubject.value = "";
        applicationleaveDays.value = "";
        leaveFrom.value = "";
        file.files = null;
    }
    if(res.status == 401) {
        alert('Authentication error');
        sessionStorage.clear();
        document.cookie = 'auth-token=';
        closeSpinner();
        window.open('/sign-in', '_self');
    }
}

function isFutureDate(idate){
    var today = new Date().getTime();
        // idate = idate.split("-");

    // idate = new Date(idate[2], idate[1] - 1, idate[0]).getTime();
    idate = new Date(idate).getTime();
    return (today - idate) < 0;
}