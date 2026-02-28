
let localDataArray = JSON.parse(localStorage.getItem("key")) || [];

themeChanger();
noteCreation();
getData(localDataArray);

function noteCreation() {

    const addButton = document.querySelector("#addButton");
    const inputItem = document.querySelector("#inputItem");
    const addNoteButton = document.querySelector("#addNoteButton");
    const doneNoteButton = document.querySelector("#doneNoteButton");

    addNoteButton.addEventListener('click', () => {

        if (inputItem.classList.contains("activeShowUp")) {
            addNoteButton.classList.remove("activeButtonRotate");
            inputItem.classList.remove("activeShowUp");
            inputItem.classList.add("activeShowDown");
            
        } else {
            inputItem.classList.remove("activeShowDown");
            addNoteButton.classList.add("activeButtonRotate");
            inputItem.classList.add("activeShowUp");
        }

    });

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
}


function showJournal(text, headingText, id, date, time) {
    const savedDiary = document.querySelector("#savedDiary");
    const warning = document.querySelector("#warning");
    if (warning) { warning.style.display = "none"; }
    const diaryContainer = document.createElement("div");
    diaryContainer.setAttribute("class", "noteContainer");
    diaryContainer.classList.add("activeShowUp");


    diaryContainer.innerHTML = `
                                    <div class="correction">
                                    <button class="noteEdit"> <img src="images/editNoteLight.svg" class="noteEditImg"></button>
                                    <button class="noteDelete"> <img src="images/deleteLight.svg" class="noteDeleteImg"></button>
                                    <button class="noteSave"> <img src="images/saveLight.svg" class="noteSaveImg"></button>
                                    </div>
                                    <div class="note">
                                    <span class="createdDate">${date}</span>
                                    <h3 class="noteHeading">${headingText}</h3>
                                    <p class="notePara">${text}</p>
                                    <span class="createdTime">${time}</span>
                                    </div>

                                `
    savedDiary.appendChild(diaryContainer);
    const diary = diaryContainer.querySelector(".note");
    const correction = diaryContainer.querySelector(".correction");
    const journalHeading = diaryContainer.querySelector(".noteHeading");
    const journalPara = diaryContainer.querySelector(".notePara");
    const noteEdit = diaryContainer.querySelector(".noteEdit");
    const noteDelete = diaryContainer.querySelector(".noteDelete");
    const noteSave = diaryContainer.querySelector(".noteSave");




    noteDelete.addEventListener("click", () => {
        localDataArray = localDataArray.filter((journal) => {
            return journal.id !== id;
        });

        setData(localDataArray);
        diaryContainer.remove();
        deletedNoteToast();

        if (localDataArray.length === 0) {
            const warning = document.querySelector("#warning");
            if (warning) warning.style.display = "block";
        }
    });


    noteEdit.addEventListener("click", () => {
        const headingEditInput = document.createElement("input");
        headingEditInput.setAttribute("class", "headingEdittng");
        headingEditInput.value = journalHeading.innerText;

        diary.replaceChild(headingEditInput, journalHeading);

        const paraEditInput = document.createElement("textarea");
        paraEditInput.setAttribute("class", "paraEdittng");
        paraEditInput.value = journalPara.innerText;

        diary.replaceChild(paraEditInput, journalPara);

        noteEdit.style.opacity = "0.1";
        noteEdit.disabled = true;
        noteSave.style.opacity = "1";


        noteSave.onclick = () => {

            const editableObject = localDataArray.find((element) => {

                return element.id === id;
            })
            if (editableObject) {

                if (editableObject.heading !== headingEditInput.value || editableObject.innerText !== paraEditInput.value) {

                    editableObject.heading = headingEditInput.value;
                    editableObject.text = paraEditInput.value;

                    journalHeading.innerText = headingEditInput.value;
                    journalPara.innerText = paraEditInput.value;
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
}



function themeChanger() {
    const theme = document.querySelector("#theme");

    theme.addEventListener("mouseover", () => {
        theme.style.cursor = "pointer";
    });

    theme.addEventListener("click", () => {
        const themeData = document.body.classList;
        const addNoteButton = document.querySelector("#addNoteButton");
        const searchbutton = document.querySelector("#searchbutton");
        const noteEditImg = document.querySelectorAll(".noteEditImg");
        const noteDeleteImg = document.querySelectorAll(".noteDeleteImg");
        const noteSaveImg = document.querySelectorAll(".noteSaveImg");

        if (themeData.contains('dark')) {
            themeData.replace('dark', 'light');
            addNoteButton.src = "images/addNoteDark.svg";
            searchbutton.src = "images/searchDark.svg";
            theme.src = "images/lightMode.svg";

            if (noteEditImg) {
                noteEditImg.forEach((button) => {
                    button.src = "images/editNoteDark.svg";
                })
            }
            if (noteDeleteImg) {

                noteDeleteImg.forEach((button) => {
                    button.src = "images/deleteDark.svg";
                })

            }
            if (noteSaveImg) {

                noteSaveImg.forEach((button) => {
                    button.src = "images/saveDark.svg";
                })

            }

        } else {
            themeData.replace('light', 'dark');
            addNoteButton.src = "images/addNoteLight.svg";
            searchbutton.src = "images/searchLight.svg";
            theme.src = "images/darkMode.svg";
            if (noteEditImg) {

                noteEditImg.forEach((button) => {
                    button.src = "images/editNoteLight.svg";
                })

            }
            if (noteDeleteImg) {

                noteDeleteImg.forEach((button) => {
                    button.src = "images/deleteLight.svg";
                })

            }
            if (noteSaveImg) {

                noteSaveImg.forEach((button) => {
                    button.src = "images/saveLight.svg";
                })

            }

        };

    });

};