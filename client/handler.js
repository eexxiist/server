import axios from "https://cdn.skypack.dev/axios";

const userModel = {
    id: null,
    firstname: null, 
    lastname: null
}

let getUsersAllowed = true;

async function getUsers() {
    try {
        
        const { data: res } = await axios.get("http://127.0.0.1:5051/", {
            "Content-Type": "text/plain",
        });

        const tableBody = document.querySelector("#user-table tbody");

        res.forEach((user, index) => {
            const row = document.createElement("tr");
            const deleteCell = document.createElement("td");
            const delete_btn = document.createElement("div");
            delete_btn.classList.add("delete_btn");
            const ediitCell = document.createElement("td");
            const edit_btn = document.createElement("div");
            edit_btn.classList.add("edit_btn");

            ediitCell.appendChild(edit_btn);
            deleteCell.appendChild(delete_btn);

            row.innerHTML = `
                <td>${user.id}</td><td>${user.firstName}</td><td>${user.lastName}</td>
            `;
            row.appendChild(deleteCell);
            row.appendChild(ediitCell);

            tableBody.appendChild(row);

            delete_btn.addEventListener("click", async (e) => {
                const { data: id } = await axios.delete(
                    "http://localhost:5051/api",
                    {
                        params: { id: user.id },
                    }
                );
            });

            edit_btn.addEventListener("click", async (e) => {
                    document.querySelector(".wrap_edit").classList.toggle("hidden");
                    userModel.id = user.id;

                    document.getElementById('firstName_edit').value = user.firstName
                    document.getElementById('lastName_edit').value = user.lastName
            });
        });
    } catch (err) {
        console.log(err);
    }
}

document.getElementById("edit_form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Прерывание стандартного поведения формы

    const firstName = document.getElementById("firstName_edit").value;
    const lastName = document.getElementById("lastName_edit").value;
    const id = userModel.id;

    // console.log(firstName, lastName)

    if (firstName && lastName) {
        try {

            const formData = {
                firstName,
                lastName,
                id
            };

            // console.log(!formData.id || !formData.firstName || !formData.lastName)

            if(!formData.id || !formData.firstName || !formData.lastName){
                const fieldName = (!formData.id) ? 'id' : (!formData.name) ? 'firstname' : 'lastname';
                throw new Error(`Server was waiting for the field ${fieldName}` );
            }

            const { data: res } = await axios.post(
                "http://127.0.0.1:5051/api/edit",
                formData
            );

            console.log(formData);
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log("Empty form error...");
    }
});

document.getElementById("create_form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Прерывание стандартного поведения формы

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;

    if (firstName && lastName) {
        try {
            const formData = {
                firstName,
                lastName,
            };

            const { data: res } = await axios.post(
                "http://127.0.0.1:5051/api",
                formData
            );

            console.log(res);
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log("Empty form error...");
    }
});

;[
    document.getElementById("button_toggle"),
    document.getElementById("close_button")
].forEach((target) => {
    target.addEventListener("click", () => {
        document.querySelector(".wrap").classList.toggle("hidden");
    });
});

document.getElementById('close_button_edit').addEventListener('click', (e) => {
    e.target.closest('.wrap_edit').classList.toggle('hidden');
    document.getElementById('firstName_edit').value = '';
    document.getElementById('lastName_edit').value = '';

    userModel.id = null;
    userModel.firstname = null;
    userModel.lastname = null;
})

getUsers();
