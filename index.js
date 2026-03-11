


let localDataArray = JSON.parse(localStorage.getItem("key")) || [];

if (localDataArray.length > 0) {
  const warning = document.querySelector("#warning");
  if (warning) warning.style.display = "none";
}

themeChanger();
toggles();
noteCreation();
getData(localDataArray);
exportImport();

function noteCreation() {
  const addEntry = document.querySelector("#addEntry");
  const emptyNoteAdd = document.querySelector("#emptyNoteAdd");

  addEntry.addEventListener('click', typeSelection);
  emptyNoteAdd.addEventListener("click", typeSelection);

  function typeSelection() {
    const bluredBg = document.createElement("div");
    bluredBg.setAttribute("class", "bluredBg");
    const typeSelectionContainer = document.createElement("div");
    typeSelectionContainer.setAttribute("class", "typeSelectionContainer");
    const typeSelectionHead = document.createElement("p");
    typeSelectionHead.setAttribute("class", "typeSelectionHead");
    typeSelectionHead.textContent = "Select what you wanna do";
    const typeSelectionWrapper = document.createElement("div");
    typeSelectionWrapper.setAttribute("class", "typeSelectionWrapper");
    const noteType = document.createElement("div");
    noteType.setAttribute("class", "noteType  typeChoice");
    noteType.textContent = "Note";
    const journalType = document.createElement("div");
    journalType.setAttribute("class", "journalType  typeChoice");
    journalType.textContent = "Journal";
    const todoType = document.createElement("div");
    todoType.setAttribute("class", "todoType  typeChoice");
    todoType.textContent = "Todo";

    typeSelectionWrapper.append(noteType);
    typeSelectionWrapper.append(journalType);
    typeSelectionWrapper.append(todoType);
    typeSelectionContainer.append(typeSelectionHead);
    typeSelectionContainer.append(typeSelectionWrapper);
    bluredBg.append(typeSelectionContainer);
    document.body.append(bluredBg);

    document.querySelectorAll(".typeChoice").forEach((button) => {

      button.addEventListener("click", () => {

        switch (button.textContent.trim().toLowerCase()) {
          case "note":
            formShow("noteInputContainer", "noteInputWrapper", true, "noteTextInput", "note");

            break;
          case "journal":
            formShow("journalInputContainer", "journalInputWrapper", true, "journalTextInput", "journal");

            break;
          case "todo":
            formShow("todoInputContainer", "todoInputWrapper", false, "todoTextInput", "todo");
            break;

          default:
            formShow("noteInputContainer", "noteInputWrapper", true, "noteTextInput", "note");
            break;
        }
        bluredBg.remove();
      });
    });
  }

  function formShow(containerName, wrapperName, value, textName, type) {

    if (document.querySelector(`.${containerName}`)) {
      return;
    }

    const container = document.createElement("div");
    container.setAttribute("class", `${containerName}`);

    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", `${wrapperName}`);

    const textInput = document.createElement("textarea");
    textInput.setAttribute("class", `${textName}`);
    textInput.placeholder = `Your ${type} context`;

    const noteButtons = document.createElement("div");
    noteButtons.setAttribute("class", "noteButtons");

    const saveButton = document.createElement("button");
    saveButton.textContent = 'Save entry';
    saveButton.setAttribute("class", "saveButton");

    const closeButton = document.createElement("button");
    closeButton.textContent = 'Close entry';
    closeButton.setAttribute("class", "closeButton");

    const headInput = document.createElement("input");
    headInput.setAttribute("class", "headInput");
    headInput.placeholder = `Write your ${type} heading`;
    if (value === false) {
      headInput.style.display = "none";
    }

    wrapper.append(headInput);
    wrapper.append(textInput);
    noteButtons.append(closeButton);
    noteButtons.append(saveButton);
    wrapper.append(noteButtons);

    container.append(wrapper);
    document.body.append(container);

    closeButton.addEventListener("click", () => {
      container.remove();
    });

    saveButton.addEventListener("click", (e) => {
      e.preventDefault();

      const text = textInput.value.trim();
      let headingText;
      if (value === true) {
        headingText = headInput.value.trim();
      } else {
        headingText = type;
      }

      const timeDateDigit = new Date();
      const timeDigit = timeDateDigit.toLocaleTimeString();
      const dateDigit = timeDateDigit.toLocaleDateString('en-GB').replace(/\//g, ".");
      const numberedDate = timeDateDigit.getDate();
      const monthText = timeDateDigit.toLocaleDateString('en-GB', { month: 'long' });
      const dayText = timeDateDigit.toLocaleDateString('en-GB', { weekday: 'long' });

      let todoTime = timeDateDigit.toLocaleTimeString();

      if (text === '' || headingText === '') {
        toastFunction("You need to fill both 🙂", "deleteToast");
      } else {
        const obj = {
          heading: headingText,
          text: text,
          id: Date.now(),
          date: dateDigit,
          time: timeDigit,
          catagory: type,
          dateNumber: numberedDate,
          month: monthText,
          day: dayText,
          todoDueTime: todoTime
        };

        localDataArray.push(obj);

        setData(localDataArray);

        switch (obj.catagory) {
          case "note":
            noteUI(obj.text, obj.heading, obj.id, obj.date, obj.time, obj.catagory);
            break;
          case "journal":
            journalUI(obj.heading, obj.text, obj.day, obj.month, obj.dateNumber, obj.date, obj.time, obj.id, obj.catagory);
            break;
          case "todo":
            todoUI(obj.text, obj.date, obj.time, obj.todoDueTime, obj.id, obj.catagory);
            break;

          default:
            noteUI(obj.text, obj.heading, obj.id, obj.date, obj.time, obj.catagory);
            break;
        }
        toastFunction(`${type} is added`, "addToast");

        textInput.value = "";
        headInput.value = "";
      }

      container.remove();

    });

  };
};


function setData(localDataArray) {
  localStorage.setItem("key", JSON.stringify(localDataArray));
};


function getData(localDataArray) {
  localDataArray.forEach((element, index) => {
    switch (element.catagory) {

      case "note":
        noteUI(element.text, element.heading, element.id, element.date, element.time, element.catagory);
        break;
      case "journal":
        journalUI(element.heading, element.text, element.day, element.month, element.dateNumber, element.date, element.time, element.id, element.catagory);
        break;
      case "todo":

        todoUI(element.text, element.date, element.time, element.todoDueTime, element.id, element.catagory);
        break;

      default:
        noteUI(element.text, element.heading, element.id, element.date, element.time, element.catagory);
        break;

    }
  });
};


function journalUI(headingText, text, day, month, dateNumber, date, time, id, type) {
  const contentPage = document.querySelector("#contentPage");
  const warning = document.querySelector("#warning");
  if (warning) { warning.style.display = "none" };

  const journalContainer = document.createElement("div");
  journalContainer.setAttribute("class", "journalContainer");
  journalContainer.classList.add("activeShowUp");

  const journalDateWrapper = document.createElement("div");
  journalDateWrapper.setAttribute("class", "journalDateWrapper");
  const journalDate = document.createElement("p");
  journalDate.setAttribute("class", "journalDate");

  const journal = document.createElement("div");
  journal.setAttribute("class", "journal");

  const journalHead = document.createElement("h3");
  journalHead.setAttribute("class", "journalHead");

  const journalPara = document.createElement("p");
  journalPara.setAttribute("class", "journalPara");

  const journalLastSection = document.createElement("div");
  journalLastSection.setAttribute("class", "journalLastSection");

  const createdData = document.createElement("div");
  createdData.setAttribute("class", "createdData");

  const correction = document.createElement("div");
  correction.setAttribute("class", "correction");

  const createdDateTime = document.createElement("p");
  createdDateTime.setAttribute("class", "createdDateTime");

  const journalEditImage = document.createElement("img");
  journalEditImage.setAttribute("class", "journalEditImage");

  const journalDeleteImage = document.createElement("img");
  journalDeleteImage.setAttribute("class", "journalDeleteImage");

  let journalEditImageSrc;
  let journalDeleteImageSrc;

  if (document.body.classList.contains("dark")) {

    journalEditImageSrc = "images/editNoteLight.svg";
    journalDeleteImageSrc = "images/deleteLight.svg";
  } else {
    journalEditImageSrc = "images/editNoteDark.svg";
    journalDeleteImageSrc = "images/deleteDark.svg";
  }
  journalEditImage.src = journalEditImageSrc;
  journalDeleteImage.src = journalDeleteImageSrc;


  journalHead.textContent = headingText;
  journalPara.textContent = text;
  journalDate.textContent = `${day} ,${month} ${dateNumber}`;
  createdDateTime.textContent = `${date} | ${time}`;



  journalDateWrapper.append(journalDate);
  journal.append(journalDateWrapper);
  journal.append(journalHead);
  journal.append(journalPara);
  createdData.append(createdDateTime);
  correction.append(journalEditImage);
  correction.append(journalDeleteImage);
  journalLastSection.append(createdData);
  journalLastSection.append(correction);
  journalContainer.append(journal);
  journalContainer.append(journalLastSection);


  const fragment = document.createDocumentFragment();
  fragment.append(journalContainer);
  contentPage.appendChild(fragment);

  journalDeleteImage.addEventListener("click", () => {
    localDataArray = localDataArray.filter((journal) => {
      return journal.id !== id;
    });

    setData(localDataArray);
    journalContainer.remove();
    toastFunction(`${type} is deleted`, "deleteToast");

    if (localDataArray.length === 0) {
      const warning = document.querySelector("#warning");
      if (warning) warning.style.display = "flex";
    }
  });


  journalEditImage.onclick = noteEditAndSave;
  function noteEditAndSave() {

    if (document.querySelector(`.${type}InputContainer`)) {
      return;
    }

    const container = document.createElement("div");
    container.setAttribute("class", `${type}InputContainer`);

    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", `${type}InputWrapper`);

    const headInput = document.createElement("input");
    headInput.setAttribute("class", "headInput");
    headInput.value = journalHead.textContent;
    const textInput = document.createElement("textarea");
    textInput.setAttribute("class", `${type}TextInput`);
    textInput.value = journalPara.textContent;

    const noteButtons = document.createElement("div");
    noteButtons.setAttribute("class", "noteButtons");

    const saveButton = document.createElement("button");
    saveButton.textContent = 'Save entry';
    saveButton.setAttribute("class", "saveButton");

    const closeButton = document.createElement("button");
    closeButton.textContent = 'Close entry';
    closeButton.setAttribute("class", "closeButton");


    wrapper.append(headInput);
    wrapper.append(textInput);
    noteButtons.append(closeButton);
    noteButtons.append(saveButton);
    wrapper.append(noteButtons);

    container.append(wrapper);
    document.body.append(container);

    closeButton.addEventListener("click", () => {
      container.remove();
    });

    saveButton.addEventListener("click", () => {
      const editableObject = localDataArray.find((element) => {

        return element.id === id;
      })
      if (editableObject) {

        if (editableObject.heading !== headInput.value || editableObject.text !== textInput.value) {

          editableObject.heading = headInput.value;
          editableObject.text = textInput.value;

          journalHead.textContent = headInput.value;
          journalPara.textContent = textInput.value;
        }

        setData(localDataArray);

      };

      container.remove();
    });

  };
};


function todoUI(text, date, time, todoDueTime, id, type) {

  const contentPage = document.querySelector("#contentPage");
  const warning = document.querySelector("#warning");
  if (warning) { warning.style.display = "none" };

  const todoContainer = document.createElement("div");
  todoContainer.setAttribute("class", "todoContainer");
  todoContainer.classList.add("activeShowUp");

  const todo = document.createElement("div");
  todo.setAttribute("class", "todo");

  const dueTime = document.createElement("div");
  dueTime.setAttribute("class", "dueTime");

  const dueTimeText = document.createElement("p");
  dueTimeText.setAttribute("class", "dueTimeText");

  const todoTime = document.createElement("p");
  todoTime.setAttribute("class", "todoTime");

  const todoPara = document.createElement("p");
  todoPara.setAttribute("class", "todoPara");

  const todoCreatedDateTime = document.createElement("p");
  todoCreatedDateTime.setAttribute("class", "todoCreatedDateTime");

  const todoCorrection = document.createElement("div");
  todoCorrection.setAttribute("class", "todoCorrection");

  const todoEditImage = document.createElement("img");
  todoEditImage.setAttribute("class", "todoEditImage");

  const todoDeleteImage = document.createElement("img");
  todoDeleteImage.setAttribute("class", "todoDeleteImage");


  todoPara.textContent = text;
  todoCreatedDateTime.textContent = `${date} | ${time}`;
  todoTime.textContent = todoDueTime;
  dueTimeText.textContent = `Todo is due to`

  let todoEditImageSrc;
  let todoDeleteImageSrc;

  if (document.body.classList.contains("dark")) {

    todoEditImageSrc = "images/editNoteLight.svg";
    todoDeleteImageSrc = "images/deleteLight.svg";
  } else {
    todoEditImageSrc = "images/editNoteDark.svg";
    todoDeleteImageSrc = "images/deleteDark.svg";
  }
  todoEditImage.src = todoEditImageSrc;
  todoDeleteImage.src = todoDeleteImageSrc;

  todo.append(todoPara);
  todo.append(todoCreatedDateTime);
  todoCorrection.append(todoEditImage);
  todoCorrection.append(todoDeleteImage);
  dueTime.append(dueTimeText);
  dueTime.append(todoTime);
  todoContainer.append(todo);
  todoContainer.append(dueTime);
  todoContainer.append(todoCorrection);
  const fragment = document.createDocumentFragment();
  fragment.append(todoContainer);
  contentPage.appendChild(fragment);


  todoDeleteImage.addEventListener("click", () => {
    localDataArray = localDataArray.filter((todo) => {
      return todo.id !== id;
    });

    setData(localDataArray);
    todoContainer.remove();
    toastFunction(`${type} is deleted`, "deleteToast");

    if (localDataArray.length === 0) {
      const warning = document.querySelector("#warning");
      if (warning) warning.style.display = "flex";
    }
  });


  todoEditImage.onclick = noteEditAndSave;
  function noteEditAndSave() {

    if (document.querySelector(`.${type}InputContainer`)) {
      return;
    }

    const container = document.createElement("div");
    container.setAttribute("class", `${type}InputContainer`);

    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", `${type}InputWrapper`);

    const textInput = document.createElement("textarea");
    textInput.setAttribute("class", `${type}TextInput`);
    textInput.value = todoPara.textContent;

    const noteButtons = document.createElement("div");
    noteButtons.setAttribute("class", "noteButtons");

    const saveButton = document.createElement("button");
    saveButton.textContent = 'Save entry';
    saveButton.setAttribute("class", "saveButton");

    const closeButton = document.createElement("button");
    closeButton.textContent = 'Close entry';
    closeButton.setAttribute("class", "closeButton");

    wrapper.append(textInput);
    noteButtons.append(closeButton);
    noteButtons.append(saveButton);
    wrapper.append(noteButtons);

    container.append(wrapper);
    document.body.append(container);

    closeButton.addEventListener("click", () => {
      container.remove();
    });

    saveButton.addEventListener("click", () => {
      const editableObject = localDataArray.find((element) => {

        return element.id === id;
      })
      if (editableObject) {

        if (editableObject.text !== textInput.value) {

          editableObject.text = textInput.value;

          todoPara.textContent = textInput.value;
        }

        setData(localDataArray);

      };

      container.remove();
    });

  };
};


function noteUI(text, headingText, id, date, time, type) {
  const contentPage = document.querySelector("#contentPage");


  const warning = document.querySelector("#warning");
  if (warning) { warning.style.display = "none" };

  const noteContainer = document.createElement("div");
  noteContainer.setAttribute("class", "noteContainer");
  noteContainer.classList.add("activeShowUp");

  let noteEditImageSrc;
  let noteDeleteImageSrc;

  if (document.body.classList.contains("dark")) {

    noteEditImageSrc = "images/editNoteLight.svg";
    noteDeleteImageSrc = "images/deleteLight.svg";
  } else {
    noteEditImageSrc = "images/editNoteDark.svg";
    noteDeleteImageSrc = "images/deleteDark.svg";
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
    toastFunction(`${type} is deleted`, "deleteToast");

    if (localDataArray.length === 0) {
      const warning = document.querySelector("#warning");
      if (warning) warning.style.display = "flex";
    }
  });


  noteEditImage.onclick = noteEditAndSave;
  function noteEditAndSave() {

    if (document.querySelector(`.${type}InputContainer`)) {
      return;
    }

    const container = document.createElement("div");
    container.setAttribute("class", `${type}InputContainer`);

    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", `${type}InputWrapper`);

    const headInput = document.createElement("input");
    headInput.setAttribute("class", "headInput");
    headInput.value = noteHead.textContent;
    const textInput = document.createElement("textarea");
    textInput.setAttribute("class", `${type}TextInput`);
    textInput.value = notePara.textContent;

    const noteButtons = document.createElement("div");
    noteButtons.setAttribute("class", "noteButtons");

    const saveButton = document.createElement("button");
    saveButton.textContent = 'Save entry';
    saveButton.setAttribute("class", "saveButton");

    const closeButton = document.createElement("button");
    closeButton.textContent = 'Close entry';
    closeButton.setAttribute("class", "closeButton");

    wrapper.append(headInput);
    wrapper.append(textInput);
    noteButtons.append(closeButton);
    noteButtons.append(saveButton);
    wrapper.append(noteButtons);

    container.append(wrapper);
    document.body.append(container);

    closeButton.addEventListener("click", () => {
      container.remove();
    });

    saveButton.addEventListener("click", () => {
      const editableObject = localDataArray.find((element) => {

        return element.id === id;
      })
      if (editableObject) {

        if (editableObject.heading !== headInput.value || editableObject.text !== textInput.value) {

          editableObject.heading = headInput.value;
          editableObject.text = textInput.value;

          noteHead.textContent = headInput.value;
          notePara.textContent = textInput.value;
        }

        setData(localDataArray);

      };

      container.remove();
    });

  };

};


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
    const journalEditImage = document.querySelectorAll(".journalEditImage");
    const journalDeleteImage = document.querySelectorAll(".journalDeleteImage");
    const todoEditImage = document.querySelectorAll(".todoEditImage");
    const todoDeleteImage = document.querySelectorAll(".todoDeleteImage");

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

      if (noteEditImage) {
        noteEditImage.forEach((button) => {
          button.src = "images/editNoteDark.svg";
          localStorage.setItem("noteEditImage", "images/editNoteDark.svg");
        });
      }
      if (noteDeleteImage) {
        noteDeleteImage.forEach((button) => {
          button.src = "images/deleteDark.svg";
          localStorage.setItem("noteDeleteImage", "images/deleteDark.svg");
        });
      }
      if (journalEditImage) {
        journalEditImage.forEach((button) => {
          button.src = "images/editNoteDark.svg";
          localStorage.setItem("journalEditImage", "images/editNoteDark.svg");
        });
      }
      if (journalDeleteImage) {
        journalDeleteImage.forEach((button) => {
          button.src = "images/deleteDark.svg";
          localStorage.setItem("journalDeleteImage", "images/deleteDark.svg");
        });
      }
      if (todoEditImage) {
        todoEditImage.forEach((button) => {
          button.src = "images/editNoteDark.svg";
          localStorage.setItem("todoEditImage", "images/editNoteDark.svg");
        });
      }
      if (todoDeleteImage) {
        todoDeleteImage.forEach((button) => {
          button.src = "images/deleteDark.svg";
          localStorage.setItem("todoDeleteImage", "images/deleteDark.svg");
        });
      }
      if (emptyNoteAdd) {
        emptyNoteAdd.src = "images/emptyNoteDark.svg";
        localStorage.setItem("emptyNoteAdd", "images/emptyNoteDark.svg");
      }

    } else {
      document.body.classList.replace('light', 'dark');
      addEntryImage.src = "images/addNoteLight.svg";
      searchbutton.src = "images/searchLight.svg";
      theme.src = "images/darkMode.svg";
      localStorage.setItem("userTheme", "dark");
      localStorage.setItem("addEntryImage", "images/addNoteLight.svg");
      localStorage.setItem("searchbutton", "images/searchLight.svg");
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

      if (noteEditImage) {
        noteEditImage.forEach((button) => {
          button.src = "images/editNoteLight.svg";
          localStorage.setItem("noteEditImage", "images/editNoteLight.svg");
        })
      }
      if (noteDeleteImage) {
        noteDeleteImage.forEach((button) => {
          button.src = "images/deleteLight.svg";
          localStorage.setItem("noteDeleteImage", "images/deleteLight.svg");
        })
      }
      if (journalEditImage) {
        journalEditImage.forEach((button) => {
          button.src = "images/editNoteLight.svg";
          localStorage.setItem("journalEditImage", "images/editNoteLight.svg");
        })
      }
      if (journalDeleteImage) {
        journalDeleteImage.forEach((button) => {
          button.src = "images/deleteLight.svg";
          localStorage.setItem("journalDeleteImage", "images/deleteLight.svg");
        })
      }
      if (todoEditImage) {
        todoEditImage.forEach((button) => {
          button.src = "images/editNoteLight.svg";
          localStorage.setItem("todoEditImage", "images/editNoteLight.svg");
        })
      }
      if (todoDeleteImage) {
        todoDeleteImage.forEach((button) => {
          button.src = "images/deleteLight.svg";
          localStorage.setItem("todoDeleteImage", "images/deleteLight.svg");
        })
      }
      if (emptyNoteAdd) {
        emptyNoteAdd.src = "images/emptyNoteLight.svg";
        localStorage.setItem("emptyNoteAdd", "images/emptyNoteLight.svg");
      }

    };

  });

};


const typeSelector = document.querySelectorAll(".typeSelection").forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.textContent.trim().toLowerCase();
    // console.log(type);
    typeFunctionHandler(type);
  });

});


function typeFunctionHandler(type) {

  let presentableObject;

  if (type === 'all') {
    presentableObject = localDataArray;
  } else {
    presentableObject = localDataArray.filter((el) => {
      return el.catagory === type;
    });
  }

  const card = document.querySelectorAll(".noteContainer,.todoContainer,.journalContainer");
  const warning = document.querySelector("#warning");

  card.forEach((element) => {
    element.remove();
  });


  if (presentableObject.length === 0) {
    if (warning) warning.style.display = "flex";
  }
  else {
    if (warning) warning.style.display = "none";

  }

  presentableObject.forEach((element) => {

    switch (element.catagory) {

      case "note":
        noteUI(element.text, element.heading, element.id, element.date, element.time, element.catagory);
        break;
      case "journal":
        journalUI(element.heading, element.text, element.day, element.month, element.dateNumber, element.date, element.time, element.id, element.catagory);
        break;
      case "todo":

        todoUI(element.text, element.date, element.time, element.todoDueTime, element.id, element.catagory);
        break;

    };
  });
}
