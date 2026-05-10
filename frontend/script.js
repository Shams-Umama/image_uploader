const backendUrl = "http://localhost:5000";

async function uploadImage() {

    const imageInput =
        document.getElementById("imageInput");

    const loading =
        document.getElementById("loading");

    const successMessage =
        document.getElementById("successMessage");

    const result =
        document.getElementById("result");

    const file = imageInput.files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    const formData = new FormData();

    formData.append("image", file);

    try {

        loading.innerText =
            "Uploading and processing...";

        successMessage.innerText = "";

        const response = await fetch(
            `${backendUrl}/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        loading.innerText = "";

        successMessage.innerText =
            "Upload Successful ✅";

        result.innerHTML = `
            <h2
            style="
            margin-top:40px;
            color:#0F172A;
            ">
                Generated Video
            </h2>

            <video controls>
                <source
                    src="${data.output_url}"
                    type="video/mp4">
            </video>
        `;

        imageInput.value = "";

        fetchHistory();

    } catch (error) {

        loading.innerText = "";

        successMessage.innerText = "";

        alert("Upload failed");

    }

}

async function fetchHistory() {

    try {

        const response = await fetch(
            `${backendUrl}/history`
        );

        const data = await response.json();

        const history =
            document.getElementById("history");

        history.innerHTML = "";

        data.data.forEach((item) => {

            history.innerHTML += `

            <div class="history-card">

                <img
                    src="http://localhost:5000/${item.image_url}"
                >

                <video controls>

                    <source
                        src="${item.output_url}"
                        type="video/mp4">

                </video>

                <div class="card-content">

                    <button
                        class="delete-btn"
                        onclick="deleteHistory(${item.id})">

                        Delete

                    </button>

                </div>

            </div>
            `;

        });

    } catch (error) {

        console.log(error);

    }

}
async function deleteHistory(id){

    try{

        await fetch(
            `${backendUrl}/delete/${id}`,
            {
                method:"DELETE"
            }
        );

        fetchHistory();

    }
    catch(error){

        console.log(error);

    }

}

fetchHistory();