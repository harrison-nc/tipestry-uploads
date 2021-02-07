const input = document.querySelector('input[type=file]');
const submit = document.querySelector('input[type=submit]');

let selectedFile;

input.oninput = (e) => {
    const { files } = e.target;

    if (!files || files.length == 0) {
        selectedFile = null;
        return;
    };

    const file = files[0];
    selectedFile = file;
};

submit.onclick = async (e) => {
    e.preventDefault();

    if (!selectedFile) return console.log('no file was selected');

    const encodedFile = await convertFileToDataURL(selectedFile);

    const data = new FormData();
    data.append('file', encodedFile);
    data.append('name', selectedFile.name);
    data.append('mimeType', selectedFile.type);
    data.append('size', selectedFile.size);

    await sendForm(data);
};

const sendForm = async (data) => {
    console.log('uploading file...');
    try {
        const response = await fetch('.netlify/functions/upload', {
            method: "POST",
            headers: {
                'Content-Type': "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            body: new URLSearchParams(data).toString()
        });

        if (response.headers['Content-Type'] === 'application/json')
            return processJsonResponse(response);
        else
            console.info(await response.text());

    } catch (ex) {
        console.log(ex);
    }

    const processJsonResponse = async (response) => {
        const result = await response.json();

        if (Number(response.status) !== 200)
            return console.log('upload failed', result);
        else
            console.log('successfully uploaded file', result);
    };
};

const convertFileToDataURL = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(reader.result);
    reader.readAsDataURL(file);
});
