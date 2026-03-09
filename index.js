

toggles();


function toggles() {
    const menu = document.querySelector(".menu");
    const sideBar = document.querySelector(".sideBar");
    const dropDownToggler = document.querySelectorAll(".dropDownToggler");

    menu.addEventListener("click", () => {
        if (sideBar.classList.contains("hide")) {
            sideBar.classList.remove("hide");
            menu.classList.remove("dropDownOpen");
        } else {
            dropDownClose();
            sideBar.classList.add("hide");
            menu.classList.add("dropDownOpen");

        }

    });

    dropDownToggler.forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const dropDown = toggle.parentElement.querySelector(".dropDown");
            const dropDownIcon = toggle.parentElement.querySelector(".dropDownIcon");

            if (dropDown.classList.contains("toggled")) {
                dropDown.classList.remove("toggled");
                dropDownIcon.classList.remove("dropDownOpen");
            }
            else {
                sideBar.classList.remove("hide");
                menu.classList.remove("dropDownOpen");
                dropDown.classList.add("toggled");
                dropDownIcon.classList.add("dropDownOpen");

            }
        })
    })

    function dropDownClose() {
        dropDownToggler.forEach((toggle) => {
            const dropDown = toggle.parentElement.querySelector(".dropDown");
            const dropDownIcon = toggle.parentElement.querySelector(".dropDownIcon");
            dropDown.classList.remove("toggled");
            dropDownIcon.classList.remove("dropDownOpen");
        });
    };

};



let localDataArray = JSON.parse(localStorage.getItem("key")) || [];

if (localDataArray.length > 0) {
    const warning = document.querySelector("#warning");
    if (warning) warning.style.display = "none";
}
// themeChanger();
noteCreation();
getData(localDataArray);

function noteCreation() {
    const addEntry = document.querySelector("#addEntry");
    const emptyNoteAdd = document.querySelector("#emptyNoteAdd");

    addEntry.addEventListener('click', noteFormShow);
    emptyNoteAdd.addEventListener("click", noteFormShow);

    const inputItem = document.querySelector("#inputItem");



    function noteFormShow() {

        if (document.querySelector(".noteInputContainer")) {
            return;
        }

        const noteInputContainer = document.createElement("div");
        noteInputContainer.setAttribute("class", "noteInputContainer");

        const noteInputWrapper = document.createElement("div");
        noteInputWrapper.setAttribute("class", "noteInputWrapper");

        const headInput = document.createElement("input");
        headInput.setAttribute("class", "headInput");
        headInput.placeholder = 'Write your Note heading';
        const textInput = document.createElement("textarea");
        textInput.setAttribute("class", "textInput");
        textInput.placeholder = 'Your Journal context';
        const saveButton = document.createElement("button");
        saveButton.textContent = 'Save entry';
        saveButton.setAttribute("class", "saveButton");

        noteInputWrapper.append(headInput);
        noteInputWrapper.append(textInput);
        noteInputWrapper.append(saveButton);

        noteInputContainer.append(noteInputWrapper);
        document.body.append(noteInputContainer);

        saveButton.addEventListener("click", (e) => {
            e.preventDefault();

            const text = textInput.value.trim();
            const headingText = headInput.value.trim();

            const timeDateDigit = new Date();
            const timeDigit = timeDateDigit.toLocaleTimeString();
            const dateDigit = timeDateDigit.toLocaleDateString('en-Gb').replace(/\//g, ".");


            if (text !== '' && headingText !== '') {
                const obj = {
                    heading: headingText,
                    text: text,
                    id: Date.now(),
                    date: dateDigit,
                    time: timeDigit
                };

                localDataArray.push(obj);

                setData(localDataArray);

                showJournal(obj.text, obj.heading, obj.id, obj.date, obj.time);
                addNoteToast();

                textInput.value = "";
                headInput.value = "";
            }

            noteInputContainer.remove();

        });

    };

};




function setData(localDataArray) {
    localStorage.setItem("key", JSON.stringify(localDataArray));
};


function getData(localDataArray) {
    localDataArray.forEach((element, index) => {
        showJournal(element.text, element.heading, element.id, element.date, element.time);
    });
};


function showJournal(text, headingText, id, date, time) {
    const contentPage = document.querySelector("#contentPage");


    const warning = document.querySelector("#warning");
    if (warning) { warning.style.display = "none" };

    const noteContainer = document.createElement("div");
    noteContainer.setAttribute("class", "noteContainer");
    noteContainer.classList.add("activeShowUp");

    let noteEditImageSrc;
    let noteDeleteImageSrc;
    let noteSaveImageSrc;

    if (document.body.classList.contains("dark")) {

        noteEditImageSrc = "images/editNoteLight.svg";
        noteDeleteImageSrc = "images/deleteLight.svg";
        noteSaveImageSrc = "images/saveLight.svg";
    } else {
        noteEditImageSrc = "images/editNoteDark.svg";
        noteDeleteImageSrc = "images/deleteDark.svg";
        noteSaveImageSrc = "images/saveDark.svg";
    }

    const note = document.createElement("div");
    note.setAttribute("class", "note");

    const noteHead = document.createElement("h3");
    noteHead.setAttribute("class", "noteHead");

    const notePara = document.createElement("p");
    notePara.setAttribute("class", "notePara");

    const dividerLine = document.createElement("span");
    dividerLine.setAttribute("class", "dividerLine");

    const noteLastSection = document.createElement("div");
    noteLastSection.setAttribute("class", "noteLastSection");

    const createdData = document.createElement("div");
    createdData.setAttribute("class", "createdData");

    const correction = document.createElement("div");
    correction.setAttribute("class", "correction");

    const createdDateTime = document.createElement("p");
    createdDateTime.setAttribute("class", "createdDateTime");

    const noteEditImage = document.createElement("img");
    noteEditImage.setAttribute("class", "noteEditImage");

    const noteDeleteImage = document.createElement("img");
    noteDeleteImage.setAttribute("class", "noteDeleteImage");



    createdDateTime.textContent = `${date} | ${time}`;
    noteHead.textContent = headingText;
    notePara.textContent = text;

    noteEditImage.src = noteEditImageSrc;
    noteDeleteImage.src = noteDeleteImageSrc;

    note.append(noteHead);
    note.append(dividerLine);
    note.append(notePara);

    noteLastSection.append(createdData);
    createdData.append(createdDateTime);
    noteLastSection.append(correction);
    correction.append(noteEditImage);
    correction.append(noteDeleteImage);

    noteContainer.append(note);
    noteContainer.append(noteLastSection);

    const fragment = document.createDocumentFragment();
    fragment.append(noteContainer);
    contentPage.appendChild(fragment);


    noteDeleteImage.addEventListener("click", () => {
        localDataArray = localDataArray.filter((journal) => {
            return journal.id !== id;
        });

        setData(localDataArray);
        noteContainer.remove();
        deletedNoteToast();

        if (localDataArray.length === 0) {
            const warning = document.querySelector("#warning");
            if (warning) warning.style.display = "flex";
        }
    });


    noteEditImage.onclick = noteEditAndSave;
    function noteEditAndSave() {

        const headingEditInput = document.createElement("input");
        headingEditInput.setAttribute("class", "headingEdittng");
        headingEditInput.value = noteHead.textContent;

        note.replaceChild(headingEditInput, noteHead);

        const paraEditInput = document.createElement("textarea");
        paraEditInput.setAttribute("class", "paraEdittng");
        paraEditInput.value = notePara.textContent;

        note.replaceChild(paraEditInput, notePara);


        noteEditImage.src = noteSaveImageSrc;

        noteEditImage.onclick = () => {

            const editableObject = localDataArray.find((element) => {

                return element.id === id;
            })
            if (editableObject) {

                if (editableObject.heading !== headingEditInput.value || editableObject.text !== paraEditInput.value) {

                    editableObject.heading = headingEditInput.value;
                    editableObject.text = paraEditInput.value;

                    noteHead.textContent = headingEditInput.value;
                    notePara.textContent = paraEditInput.value;
                }

                setData(localDataArray);
                note.replaceChild(noteHead, headingEditInput);
                note.replaceChild(notePara, paraEditInput);


                noteEditImage.src = noteEditImageSrc;
                noteEditImage.onclick = noteEditAndSave;
            };

        };

    };

};



function addNoteToast() {
    const addToast = document.createElement("div");
    addToast.innerHTML = `<p>Your note is added</p>`;
    addToast.setAttribute("class", "addToast");
    document.body.append(addToast);

    setTimeout(() => addToast.remove(), 5000);
}

function deletedNoteToast() {
    const deleteToast = document.createElement("div");
    deleteToast.innerHTML = `<p>Your note is deleted</p>`;
    deleteToast.setAttribute("class", "deleteToast");
    document.body.append(deleteToast);

    setTimeout(() => deleteToast.remove(), 5000);
}