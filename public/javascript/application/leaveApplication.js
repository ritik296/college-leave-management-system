const applicationSubject = document.getElementById('application-subject');
const applicationleaveDays = document.getElementById('leaves-days');
const leaveFrom = document.getElementById('leave-from');
const updateMessage = document.getElementById('update');
const attachedFileName = document.getElementById('attached-file-name');
const file = document.getElementById('file');
let applicationBody ;


ClassicEditor
.create( document.querySelector( '#application-body' ),{
    ckfinder: {
        uploadUrl: '/upload/image?command=QuickUpload&type=Files&responseType=json'
        // uploadUrl: '/cksource.com/weuy2g4ryt278ywiue/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json'
    }
} )
.then(editor => {
    applicationBody = editor;
})
.catch(error => {
    console.error( error );
});

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
    let to = d = new Date((new Date(leaveFrom.value)).getTime() + !applicationleaveDays.value ? 24*60*60*1000 : applicationleaveDays.value*24*60*60*1000 );
    var data = new FormData();
    data.append('file', file.files[0]);
    data.append('subject', applicationSubject.value);
    data.append('reason', applicationBody.getData());
    data.append('leave', !applicationleaveDays.value ? 1 : applicationleaveDays.value);
    data.append('from', leaveFrom.value);
    data.append('to', `${to.getFullYear()}-${to.getMonth() + 1}-${to.getDate()}`)

    // data.append('file', file.files[0], {filename: file.originalname});
    // console.log(data.file);
    
    if(applicationBody.getData().length < 25){ 
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
        applicationBody.setData("");
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

function textChange(){
    console.log(applicationBody.getData())
}

function onAttachFile() {
    attachedFileName.innerHTML = `<p><span class="font-bold">Attached file: - </span>${file.files.item(0).name}</p>`;
}