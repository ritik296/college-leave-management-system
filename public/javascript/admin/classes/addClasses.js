const tableRowContainer = document.getElementById('add-teacher-data');
const branch = document.getElementById('branch');
const semester = document.getElementById('semester');
const section = document.getElementById('section');
const coordinatorId = document.getElementById('coordinator-id');
const update = document.getElementById('error');

const classJson = {};
let tableRowCount = 0;


function tableRow(count){
    return `<th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <input id="teacher-id-${count}" class="w-full border-none focus:outline-none" type="text" id="teacher-id-" placeholder="Enter Teacher ID">
            </th>
            <td class="py-4 px-6">
                <input id="subject-name-${count}" class="w-full border-none focus:outline-none" type="text" id="subject-name-" placeholder="Enter Subject Name">
            </td>
            <td class="py-4 px-6">
                <input id="subject-code-${count}" class="w-full border-none focus:outline-none" type="text" id="subject-code-" placeholder="Enter Subject Code">
            </td>
            <td class="py-4 px-6">
                <button class="p-1 rounded-full bg-red-500 px-2 text-white font-bold" onclick="removeRow(${count})">Remove</button>
            </td>`;
}

function removeRow(i){
    document.getElementById(`table-row-${i}`).remove();
}

function addTableRow(){
    let tr = document.createElement('tr');
    tr.id = `table-row-${tableRowCount}`;
    // tr.onclick = function(tableRowCount){
    //     this.remove();
    // };
    tr.classList.add('bg-white');
    tr.classList.add('dark:bg-gray-800');
    tr.classList.add('dark:border-gray-700');
    tr.classList.add('border-b');

    tr.innerHTML = tableRow(tableRowCount);
    tableRowContainer.appendChild(tr);
    tableRowCount++;
}

function addClasses(){
    openSpinner();
    classJson.branch = branch.value;
    classJson.semester = semester.value;
    classJson.section = section.value;
    classJson.coordinatorId = coordinatorId.value;
    classJson.teachers = [];

    for(let i = 0; i < tableRowCount; i++){
        let teacherId = document.getElementById(`teacher-id-${i}`);
        if(!teacherId){
            continue;
        }
        let subjectName = document.getElementById(`subject-name-${i}`);
        let subjectCode = document.getElementById(`subject-code-${i}`);
        if(!teacherId.value){
            console.log(`Enter teacher id of ${i} teacher`);
            update.classList.remove('text-green-500');
            update.classList.add('text-red-500');
            update.innerText = `Enter teacher id of ${i} teacher`;
            continue;
        }
        classJson.teachers.push({
            teacherId: teacherId.value,
            subjectName: subjectName.value,
            subjectCode: subjectCode.value
        });
    }
    // console.log(classJson)
    sendDataToServer();
}

async function sendDataToServer(){

    let res = await fetch('/api/v1/class/add_class', {
        method: 'POST',
        body: JSON.stringify(classJson),
        headers: {
            'Content-type': 'application/json; charset=UTF-8', "admin-token": `${sessionStorage.getItem('admin-token')}`
        }
    });

    if(res.status == 401) {
        alert("Login with correct credentails.");
        sessionStorage.clear();
        window.open('/admin-dashboard/login', '_self');
    }
    else if(res.status == 200){
        let resData = await res.json();
        update.classList.remove('text-red-500');
        update.classList.add('text-green-500');
        update.innerText = resData['message'];
    }
    else if(res.status == 400){
        let resData = await res.json();
        update.classList.remove('text-green-500');
        update.classList.add('text-red-500');
        update.innerText = resData['error'];
        console.log(resData['error']);
    }
    closeSpinner();
}


