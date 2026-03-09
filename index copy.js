let localDataArray = JSON.parse(localStorage.getItem("key")) || [];

if (localDataArray.length > 0) {
    const warning = document.querySelector("#warning");
    if (warning) warning.style.display = "none";
}

themeChanger();
toggles();
noteCreation();
getData(localDataArray);

function noteCreation() {
    const addEntry = document.querySelector("#addEntry");
    const emptyNoteAdd = document.querySelector("#emptyNoteAdd");

    addEntry.addEventListener('click', noteFormShow);
    emptyNoteAdd.addEventListener("click", noteFormShow);

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

        const noteButtons = document.createElement("div");
        noteButtons.setAttribute("class", "noteButtons");

        const saveButton = document.createElement("button");
        saveButton.textContent = 'Save entry';
        saveButton.setAttribute("class", "saveButton");

        const closeButton = document.createElement("button");
        closeButton.textContent = 'Close entry';
        closeButton.setAttribute("class", "closeButton");

        noteInputWrapper.append(headInput);
        noteInputWrapper.append(textInput);
        noteButtons.append(closeButton);
        noteButtons.append(saveButton);
        noteInputWrapper.append(noteButtons);
        noteInputContainer.append(noteInputWrapper);
        document.body.append(noteInputContainer);

        // close on backdrop click
        noteInputContainer.addEventListener("click", (e) => {
            if (e.target === noteInputContainer) noteInputContainer.remove();
        });

        closeButton.addEventListener("click", () => {
            noteInputContainer.remove();
        });

        saveButton.addEventListener("click", (e) => {
            e.preventDefault();

            const text = textInput.value.trim();
            const headingText = headInput.value.trim();

            const timeDateDigit = new Date();
            const timeDigit = timeDateDigit.toLocaleTimeString();
            const dateDigit = timeDateDigit.toLocaleDateString('en-GB').replace(/\//g, ".");

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
                toastFunction("Note is added", "addToast");

                textInput.value = "";
                headInput.value = "";
            }

            noteInputContainer.remove();
        });
    }
}

function setData(localDataArray) {
    localStorage.setItem("key", JSON.stringify(localDataArray));
}

function getData(localDataArray) {
    localDataArray.forEach((element) => {
        showJournal(element.text, element.heading, element.id, element.date, element.time);
    });
}

function showJournal(text, headingText, id, date, time) {
    const contentPage = document.querySelector("#contentPage");

    const warning = document.querySelector("#warning");
    if (warning) warning.style.display = "none";

    const noteContainer = document.createElement("div");
    noteContainer.setAttribute("class", "noteContainer");
    noteContainer.classList.add("activeShowUp");

    const noteEditImageSrc = document.body.classList.contains("dark")
        ? "images/editNoteLight.svg"
        : "images/editNoteDark.svg";

    const noteDeleteImageSrc = document.body.classList.contains("dark")
        ? "images/deleteLight.svg"
        : "images/deleteDark.svg";

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

    note.append(noteHead, dividerLine, notePara);
    createdData.append(createdDateTime);
    correction.append(noteEditImage, noteDeleteImage);
    noteLastSection.append(createdData, correction);
    noteContainer.append(note, noteLastSection);

    const fragment = document.createDocumentFragment();
    fragment.append(noteContainer);
    contentPage.appendChild(fragment);

    noteDeleteImage.addEventListener("click", () => {
        localDataArray = localDataArray.filter((journal) => journal.id !== id);
        setData(localDataArray);
        noteContainer.remove();
        toastFunction("Note is deleted", "deleteToast");

        if (localDataArray.length === 0) {
            const warning = document.querySelector("#warning");
            if (warning) warning.style.display = "flex";
        }
    });

    noteEditImage.onclick = noteEditAndSave;

    function noteEditAndSave() {
        if (document.querySelector(".noteInputContainer")) return;

        const noteInputContainer = document.createElement("div");
        noteInputContainer.setAttribute("class", "noteInputContainer");

        const noteInputWrapper = document.createElement("div");
        noteInputWrapper.setAttribute("class", "noteInputWrapper");

        const headInput = document.createElement("input");
        headInput.setAttribute("class", "headInput");
        headInput.value = noteHead.textContent;

        const textInput = document.createElement("textarea");
        textInput.setAttribute("class", "textInput");
        textInput.value = notePara.textContent;

        const noteButtons = document.createElement("div");
        noteButtons.setAttribute("class", "noteButtons");

        const saveButton = document.createElement("button");
        saveButton.textContent = 'Save entry';
        saveButton.setAttribute("class", "saveButton");

        const closeButton = document.createElement("button");
        closeButton.textContent = 'Close entry';
        closeButton.setAttribute("class", "closeButton");

        noteInputWrapper.append(headInput, textInput);
        noteButtons.append(closeButton, saveButton);
        noteInputWrapper.append(noteButtons);
        noteInputContainer.append(noteInputWrapper);
        document.body.append(noteInputContainer);

        noteInputContainer.addEventListener("click", (e) => {
            if (e.target === noteInputContainer) noteInputContainer.remove();
        });

        closeButton.addEventListener("click", () => noteInputContainer.remove());

        saveButton.addEventListener("click", () => {
            const editableObject = localDataArray.find((element) => element.id === id);

            if (editableObject) {
                if (editableObject.heading !== headInput.value || editableObject.text !== textInput.value) {
                    editableObject.heading = headInput.value;
                    editableObject.text = textInput.value;
                    noteHead.textContent = headInput.value;
                    notePara.textContent = textInput.value;
                }
                setData(localDataArray);
            }

            noteInputContainer.remove();
        });
    }
}

function toastFunction(message, name) {
    const toast = document.createElement("div");
    toast.innerHTML = `<p>${message}</p>`;
    toast.setAttribute("class", name);
    document.body.append(toast);
    setTimeout(() => toast.remove(), 5000);
}

function toggles() {
    const menu = document.querySelector(".menu");
    const sideBar = document.querySelector(".sideBar");
    const dropDownToggler = document.querySelectorAll(".dropDownToggler");
    const isMobile = () => window.innerWidth <= 768;

    // Create overlay element
    const overlay = document.createElement("div");
    overlay.setAttribute("class", "sideBarOverlay hidden");
    document.body.append(overlay);

    overlay.addEventListener("click", closeMobileSidebar);

    function openMobileSidebar() {
        sideBar.classList.add("mobileOpen");
        sideBar.classList.remove("hide");
        overlay.classList.remove("hidden");
    }

    function closeMobileSidebar() {
        sideBar.classList.remove("mobileOpen");
        overlay.classList.add("hidden");
    }

    menu.addEventListener("click", () => {
        if (isMobile()) {
            if (sideBar.classList.contains("mobileOpen")) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
            return;
        }

        // Desktop collapse behaviour
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
            } else {
                if (!isMobile()) {
                    sideBar.classList.remove("hide");
                    menu.classList.remove("dropDownOpen");
                }
                dropDown.classList.add("toggled");
                dropDownIcon.classList.add("dropDownOpen");
            }
        });
    });

    // Close mobile sidebar on resize to desktop
    window.addEventListener("resize", () => {
        if (!isMobile()) {
            closeMobileSidebar();
            overlay.classList.add("hidden");
        }
    });

    function dropDownClose() {
        dropDownToggler.forEach((toggle) => {
            const dropDown = toggle.parentElement.querySelector(".dropDown");
            const dropDownIcon = toggle.parentElement.querySelector(".dropDownIcon");
            dropDown.classList.remove("toggled");
            dropDownIcon.classList.remove("dropDownOpen");
        });
    }
}

function themeChanger() {
    const theme = document.querySelector("#theme");
    const addEntryImage = document.querySelector(".addEntryImage");
    const searchbutton = document.querySelector(".searchbutton");
    const emptyNoteAdd = document.querySelector(".emptyNoteAdd");
    const menu = document.querySelector(".menu");
    const daySelectImage = document.querySelector(".daySelectImage");
    const catagorySelectImage = document.querySelector(".catagorySelectImage");
    const dropDownIcon = document.querySelectorAll(".dropDownIcon");

    document.body.classList.remove("dark", "light");
    document.body.classList.add(localStorage.getItem("userTheme") || "dark");
    addEntryImage.src = localStorage.getItem("addEntryImage") || "images/addNoteLight.svg";
    searchbutton.src = localStorage.getItem("searchbutton") || "images/searchLight.svg";
    emptyNoteAdd.src = localStorage.getItem("emptyNoteAdd") || "images/emptyNoteLight.svg";
    menu.src = localStorage.getItem("menu") || "images/menuLight.svg";
    daySelectImage.src = localStorage.getItem("daySelectImage") || "images/daySelectionLight.svg";
    catagorySelectImage.src = localStorage.getItem("catagorySelectImage") || "images/catagoryIconLight.svg";
    theme.src = localStorage.getItem("theme") || "images/darkMode.svg";
    dropDownIcon.forEach((icon) => {
        icon.src = localStorage.getItem("dropDownIcon") || "images/dropDownLight.svg";
    });

    theme.addEventListener("click", () => {
        const noteEditImage = document.querySelectorAll(".noteEditImage");
        const noteDeleteImage = document.querySelectorAll(".noteDeleteImage");

        if (document.body.classList.contains('dark')) {
            document.body.classList.replace('dark', 'light');
            localStorage.setItem("userTheme", "light");
            addEntryImage.src = "images/addNoteDark.svg";
            localStorage.setItem("addEntryImage", "images/addNoteDark.svg");
            searchbutton.src = "images/searchDark.svg";
            localStorage.setItem("searchbutton", "images/searchDark.svg");
            theme.src = "images/lightMode.svg";
            localStorage.setItem("theme", "images/lightMode.svg");
            menu.src = "images/menuDark.svg";
            localStorage.setItem("menu", "images/menuDark.svg");
            daySelectImage.src = "images/daySelectionDark.svg";
            localStorage.setItem("daySelectImage", "images/daySelectionDark.svg");
            catagorySelectImage.src = "images/catagoryIconDark.svg";
            localStorage.setItem("catagorySelectImage", "images/catagoryIconDark.svg");
            dropDownIcon.forEach((icon) => {
                icon.src = "images/dropDownDark.svg";
                localStorage.setItem("dropDownIcon", "images/dropDownDark.svg");
            });
            noteEditImage.forEach((btn) => {
                btn.src = "images/editNoteDark.svg";
                localStorage.setItem("noteEditImage", "images/editNoteDark.svg");
            });
            noteDeleteImage.forEach((btn) => {
                btn.src = "images/deleteDark.svg";
                localStorage.setItem("noteDeleteImage", "images/deleteDark.svg");
            });
            if (emptyNoteAdd) {
                emptyNoteAdd.src = "images/emptyNoteDark.svg";
                localStorage.setItem("emptyNoteAdd", "images/emptyNoteDark.svg");
            }

        } else {
            document.body.classList.replace('light', 'dark');
            localStorage.setItem("userTheme", "dark");
            addEntryImage.src = "images/addNoteLight.svg";
            localStorage.setItem("addEntryImage", "images/addNoteLight.svg");
            searchbutton.src = "images/searchLight.svg";
            localStorage.setItem("searchbutton", "images/searchLight.svg");
            theme.src = "images/darkMode.svg";
            localStorage.setItem("theme", "images/darkMode.svg");
            menu.src = "images/menuLight.svg";
            localStorage.setItem("menu", "images/menuLight.svg");
            daySelectImage.src = "images/daySelectionLight.svg";
            localStorage.setItem("daySelectImage", "images/daySelectionLight.svg");
            catagorySelectImage.src = "images/catagoryIconLight.svg";
            localStorage.setItem("catagorySelectImage", "images/catagoryIconLight.svg");
            dropDownIcon.forEach((icon) => {
                icon.src = "images/dropDownLight.svg";
                localStorage.setItem("dropDownIcon", "images/dropDownLight.svg");
            });
            noteEditImage.forEach((btn) => {
                btn.src = "images/editNoteLight.svg";
                localStorage.setItem("noteEditImage", "images/editNoteLight.svg");
            });
            noteDeleteImage.forEach((btn) => {
                btn.src = "images/deleteLight.svg";
                localStorage.setItem("noteDeleteImage", "images/deleteLight.svg");
            });
            if (emptyNoteAdd) {
                emptyNoteAdd.src = "images/emptyNoteLight.svg";
                localStorage.setItem("emptyNoteAdd", "images/emptyNoteLight.svg");
            }
        }
    });
}