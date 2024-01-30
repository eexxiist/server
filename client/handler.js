import axios from 'https://cdn.skypack.dev/axios';

async function getUsers(){
    try{
        const {data: res} = await axios.get('http://127.0.0.1:5051/', {
            'Content-Type': 'text/plain'
        })

        const tableBody = document.querySelector('#user-table tbody')

        res.forEach((user, index) => {
            const row = document.createElement('tr');

            const deleteCell = document.createElement('td')
            const delete_btn = document.createElement('div')
            delete_btn.classList.add('delete_btn');

            delete_btn.addEventListener('click', e => {
                console.log('Row: ' + (index + 1))
                console.log(user)
            })

            deleteCell.appendChild(delete_btn)

            row.innerHTML = `
                <td>${user.id}</td><td>${user.firstName}</td><td>${user.lastName}</td>
            `;
            row.appendChild(deleteCell)

            tableBody.appendChild(row)
        });
    }catch(err){
        console.log(err);
    }
}

document.getElementById('create_form').addEventListener('submit', async (e) => {
    e.preventDefault() // Прерывание стандартного поведения формы
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    if(firstName && lastName){
        try{
            const formData = {
                firstName,
                lastName
            };

            const {data: res} = await axios.post('http://127.0.0.1:5051/', formData)
    
            console.log(res)
        }catch(err){
            console.log(err)
        }
    }else{
        console.log('Empty form error...')
    }
})

getUsers()