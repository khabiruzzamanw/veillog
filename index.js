
let localDataArray = JSON.parse(localStorage.getItem("key")) || [];

if (localDataArray.length > 0) {
    const warning = document.querySelector("#warning");
    if (warning) warning.style.display = "none";
}
themeChanger();
noteCreation();
getData(localDataArray);

function noteCreation() {

    const addButton = document.querySelector("#addButton");
    const inputItem = document.querySelector("#inputItem");
    const addNoteButton = document.querySelector("#addNoteButton");
    const emptyNoteAdd = document.querySelector("#emptyNoteAdd");

    emptyNoteAdd.addEventListener("click", noteFormShow);

    addNoteButton.addEventListener('click', noteFormShow);

    function noteFormShow() {
        if (inputItem.classList.contains("activeShowUp")) {
            addNoteButton.classList.remove("activeButtonRotate");
            inputItem.classList.remove("activeShowUp");
            inputItem.classList.add("activeShowDown");

        } else {
            inputItem.classList.remove("activeShowDown");
            addNoteButton.classList.add("activeButtonRotate");
            inputItem.classList.add("activeShowUp");
        }
    }

    addButton.addEventListener("click", (e) => {
        e.preventDefault();

        const textInput = document.querySelector("#textInput");
        const headingInput = document.querySelector("#headingInput");

        const text = textInput.value.trim();
        const headingText = headingInput.value.trim();

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
            headingInput.value = "";
        }

    });


};




function setData(localDataArray) {
    localStorage.setItem("key", JSON.stringify(localDataArray));
};




function getData(localDataArray) {
    localDataArray.forEach((element, index) => {
        showJournal(element.text, element.heading, element.id, element.date, element.time);
    });
};


function addNoteToast() {
    const addToast = document.createElement("div");
    addToast.innerHTML = `<p>Your note is added</p>`;
    addToast.setAttribute("class", "addToast");
    document.body.append(addToast);

    setTimeout(() => addToast.remove(), 5000);
}


function showJournal(text, headingText, id, date, time) {
    const savedDiary = document.querySelector("#savedDiary");
    const warning = document.querySelector("#warning");
    if (warning) { warning.style.display = "none"; }
    const diaryContainer = document.createElement("div");
    diaryContainer.setAttribute("class", "noteContainer");
    diaryContainer.classList.add("activeShowUp");
    let noteEditImgSrc;
    let noteDeleteImgSrc;
    let noteSaveImgSrc;

    if (document.body.classList.contains("dark")) {

        noteEditImgSrc = "images/editNoteLight.svg";
        noteDeleteImgSrc = "images/deleteLight.svg";
        noteSaveImgSrc = "images/saveLight.svg";
    } else {
        noteEditImgSrc = "images/editNoteDark.svg";
        noteDeleteImgSrc = "images/deleteDark.svg";
        noteSaveImgSrc = "images/saveDark.svg";
    }

    const diary = document.createElement("div");
    const correction = document.createElement("div");
    const journalHeading = document.createElement("h3");
    const journalPara = document.createElement("p");
    const noteEdit = document.createElement("button");
    const noteDelete = document.createElement("button");
    const noteSave = document.createElement("button");
    const noteEditImg = document.createElement("img");
    const noteDeleteImg = document.createElement("img");
    const noteSaveImg = document.createElement("img");
    const createdDateTime = document.createElement("span");

    diary.setAttribute("class", "note");
    correction.setAttribute("class", "correction");
    journalHeading.setAttribute("class", "noteHeading");
    journalPara.setAttribute("class", "notePara");
    noteEdit.setAttribute("class", "noteEdit");
    noteDelete.setAttribute("class", "noteDelete");
    noteSave.setAttribute("class", "noteSave");
    noteEditImg.setAttribute("class", "noteEditImg");
    noteDeleteImg.setAttribute("class", "noteDeleteImg");
    noteSaveImg.setAttribute("class", "noteSaveImg");
    createdDateTime.setAttribute("class", "createdDateTime");

    createdDateTime.textContent = `${date} | ${time}`;
    journalHeading.textContent = headingText;
    journalPara.textContent = text;


    noteEditImg.src = noteEditImgSrc;
    noteDeleteImg.src = noteDeleteImgSrc;
    noteSaveImg.src = noteSaveImgSrc;

    noteEdit.appendChild(noteEditImg);
    noteDelete.appendChild(noteDeleteImg);
    noteSave.appendChild(noteSaveImg);

    correction.appendChild(noteEdit);
    correction.appendChild(noteDelete);
    correction.appendChild(noteSave);
    diary.appendChild(createdDateTime);
    diary.appendChild(journalHeading);
    diary.appendChild(journalPara);

    diaryContainer.appendChild(correction);
    diaryContainer.appendChild(diary);
    const fragment = document.createDocumentFragment();
    fragment.append(diaryContainer);
    savedDiary.appendChild(fragment);


    noteDelete.addEventListener("click", () => {
        localDataArray = localDataArray.filter((journal) => {
            return journal.id !== id;
        });

        setData(localDataArray);
        diaryContainer.remove();
        deletedNoteToast();

        if (localDataArray.length === 0) {
            const warning = document.querySelector("#warning");
            if (warning) warning.style.display = "flex";
        }
    });


    noteEdit.addEventListener("click", () => {
        const headingEditInput = document.createElement("input");
        headingEditInput.setAttribute("class", "headingEdittng");
        headingEditInput.value = journalHeading.textContent;

        diary.replaceChild(headingEditInput, journalHeading);

        const paraEditInput = document.createElement("textarea");
        paraEditInput.setAttribute("class", "paraEdittng");
        paraEditInput.value = journalPara.textContent;

        diary.replaceChild(paraEditInput, journalPara);

        noteEdit.style.opacity = "0.1";
        noteEdit.disabled = true;
        noteSave.style.opacity = "1";


        noteSave.onclick = () => {

            const editableObject = localDataArray.find((element) => {

                return element.id === id;
            })
            if (editableObject) {

                if (editableObject.heading !== headingEditInput.value || editableObject.text !== paraEditInput.value) {

                    editableObject.heading = headingEditInput.value;
                    editableObject.text = paraEditInput.value;

                    journalHeading.textContent = headingEditInput.value;
                    journalPara.textContent = paraEditInput.value;
                }

                setData(localDataArray);
                diary.replaceChild(journalHeading, headingEditInput);
                diary.replaceChild(journalPara, paraEditInput);


                noteSave.style.opacity = "0.1";
                noteEdit.style.opacity = "1";
                noteEdit.disabled = false;
            };

        };

    });

};




function deletedNoteToast() {
    const deleteToast = document.createElement("div");
    deleteToast.innerHTML = `<p>Your note is deleted</p>`;
    deleteToast.setAttribute("class", "deleteToast");
    document.body.append(deleteToast);

    setTimeout(() => deleteToast.remove(), 5000);
}



function themeChanger() {
    const theme = document.querySelector("#theme");
    const addNoteButton = document.querySelector("#addNoteButton");
    const searchbutton = document.querySelector("#searchbutton");
    const emptyNoteAdd = document.querySelector("#emptyNoteAdd");

    document.body.classList.remove("dark", "light");
    document.body.classList.add(localStorage.getItem("userTheme") || "dark");
    addNoteButton.src = localStorage.getItem("addNoteButton") || "images/addNoteLight.svg";
    searchbutton.src = localStorage.getItem("searchbutton") || "images/searchLight.svg";
    emptyNoteAdd.src = localStorage.getItem("emptyNoteAdd") || "images/emptyNoteLight.svg";
    theme.src = localStorage.getItem("theme") || "images/darkMode.svg";


    theme.addEventListener("click", () => {

        const noteEditImg = document.querySelectorAll(".noteEditImg");
        const noteDeleteImg = document.querySelectorAll(".noteDeleteImg");
        const noteSaveImg = document.querySelectorAll(".noteSaveImg");

        if (document.body.classList.contains('dark')) {
            document.body.classList.replace('dark', 'light');
            localStorage.setItem("userTheme", "light");
            addNoteButton.src = "images/addNoteDark.svg";
            localStorage.setItem("addNoteButton", "images/addNoteDark.svg");
            searchbutton.src = "images/searchDark.svg";
            localStorage.setItem("searchbutton", "images/searchDark.svg");
            theme.src = "images/lightMode.svg";
            localStorage.setItem("theme", "images/lightMode.svg");

            if (noteEditImg) {
                noteEditImg.forEach((button) => {
                    button.src = "images/editNoteDark.svg";
                    localStorage.setItem("noteEditImg", "images/editNoteDark.svg");
                });
            }
            if (noteDeleteImg) {
                noteDeleteImg.forEach((button) => {
                    button.src = "images/deleteDark.svg";
                    localStorage.setItem("noteDeleteImg", "images/deleteDark.svg");
                });
            }
            if (noteSaveImg) {
                noteSaveImg.forEach((button) => {
                    button.src = "images/saveDark.svg";
                    localStorage.setItem("noteSaveImg", "images/saveDark.svg");
                });
            }

            if (emptyNoteAdd) {
                emptyNoteAdd.src = "images/emptyNoteDark.svg";
                localStorage.setItem("emptyNoteAdd", "images/emptyNoteDark.svg");
            }

        } else {
            document.body.classList.replace('light', 'dark');
            addNoteButton.src = "images/addNoteLight.svg";
            searchbutton.src = "images/searchLight.svg";
            theme.src = "images/darkMode.svg";
            localStorage.setItem("userTheme", "dark");
            localStorage.setItem("addNoteButton", "images/addNoteLight.svg");
            localStorage.setItem("searchbutton", "images/searchLight.svg");
            localStorage.setItem("theme", "images/darkMode.svg");
            if (noteEditImg) {

                noteEditImg.forEach((button) => {
                    button.src = "images/editNoteLight.svg";
                    localStorage.setItem("noteEditImg", "images/editNoteLight.svg");
                })

            }
            if (noteDeleteImg) {

                noteDeleteImg.forEach((button) => {
                    button.src = "images/deleteLight.svg";
                    localStorage.setItem("noteDeleteImg", "images/deleteLight.svg");
                })

            }
            if (noteSaveImg) {

                noteSaveImg.forEach((button) => {
                    button.src = "images/saveLight.svg";
                    localStorage.setItem("noteSaveImg", "images/saveLight.svg");
                })

            }
            if (emptyNoteAdd) {
                emptyNoteAdd.src = "images/emptyNoteLight.svg";
                localStorage.setItem("emptyNoteAdd", "images/emptyNoteLight.svg");
            }

        };

    });

};