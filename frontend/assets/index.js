// const { post } = require("../../backend/routes/user.route");

appFunction();

function appFunction() {
  let localDataArray = [];
  fetchDataFromDB();

  async function fetchDataFromDB() {
    try {
      const dataResponseJson = await fetch("/api/entries");

      const dataResponse = await dataResponseJson.json();

      localDataArray = dataResponse;
      console.log(localDataArray);
    } catch (error) {
      console.log(error);
    }
  }

  if (localDataArray.length > 0) {
    const warning = document.querySelector("#warning");
    if (warning) warning.style.display = "none";
  }

  themeChanger();
  toggles();
  daySelection();
  typeSelectionFunction();
  noteCreation();
  getData(localDataArray);

  function noteCreation() {
    const addEntry = document.querySelector("#addEntry");
    const emptyNoteAdd = document.querySelector("#emptyNoteAdd");

    addEntry.addEventListener("click", typeSelection);
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
              formShow(true, "note");

              break;
            case "journal":
              formShow(true, "journal");

              break;
            case "todo":
              formShow(false, "todo");
              break;

            default:
              formShow(true, "note");
              break;
          }

          bluredBg.remove();
        });
      });
    }

    function formShow(value, type) {
      if (document.querySelector(`.${type}InputContainer`)) {
        return;
      }

      const container = document.createElement("div");
      container.setAttribute("class", `${type}InputContainer`);

      const wrapper = document.createElement("div");
      wrapper.setAttribute("class", `${type}InputWrapper`);

      const textInput = document.createElement("textarea");
      textInput.setAttribute("class", `${type}TextInput`);
      textInput.placeholder = `Your ${type} context`;

      const logButtons = document.createElement("div");
      logButtons.setAttribute("class", "logButtons");

      const saveButton = document.createElement("button");
      saveButton.textContent = "Save entry";
      saveButton.setAttribute("class", "saveButton");

      const closeButton = document.createElement("button");
      closeButton.textContent = "Discard";
      closeButton.setAttribute("class", "closeButton");

      const headInput = document.createElement("input");
      headInput.setAttribute("class", "headInput");
      headInput.placeholder = `Write your ${type} heading`;

      let timepicker;
      if (value === false) {
        headInput.style.display = "none";
        timepicker = document.createElement("input");
        timepicker.setAttribute("type", "time");
        timepicker.setAttribute("class", "timepicker");
        wrapper.append(timepicker);
      }

      wrapper.append(headInput);
      wrapper.append(textInput);
      logButtons.append(closeButton);
      logButtons.append(saveButton);
      wrapper.append(logButtons);

      container.append(wrapper);
      document.body.append(container);

      closeButton.addEventListener("click", () => {
        container.remove();
      });

      saveButton.addEventListener("click", (e) => {
        e.preventDefault();

        const text = textInput.value.trim();
        let headingText;
        let pickedTime;
        if (value === true) {
          headingText = headInput.value.trim();
        } else {
          pickedTime = timepicker.value;
        }

        const timeDateDigit = new Date();
        const timeDigit = timeDateDigit.toLocaleTimeString();
        const dateDigit = timeDateDigit
          .toLocaleDateString("en-GB")
          .replace(/\//g, ".");
        const numberedDate = timeDateDigit.getDate();
        const monthText = timeDateDigit.toLocaleDateString("en-GB", {
          month: "long",
        });
        const dayText = timeDateDigit.toLocaleDateString("en-GB", {
          weekday: "long",
        });

        let todoTime = pickedTime || timeDateDigit.toLocaleTimeString();

        if (type === "todo" && text === "") {
          return toastFunction("You need to put a task 🙂", "deleteToast");
        }

        if (type !== "todo") {
          if (text === "" || headingText === "") {
            return toastFunction("You need to fill both 🙂", "deleteToast");
          }
        }

        const obj = {
          heading: headingText,
          text: text,
          category: type,
          date: dateDigit,
          time: timeDigit,
          dateNumber: numberedDate,
          month: monthText,
          day: dayText,
          todoDueTime: todoTime,
        };

        async function setTypeDataToDB() {
          try {
            const response = await fetch(`/api/${type}s`, {
              method: "POST",
              body: JSON.stringify(obj),
            });

            const saved = await response.json();
            obj._id = saved._id;
          } catch (error) {
            console.log(error);
          }
        }

        setTypeDataToDB();
        localDataArray.push(obj);

        switch (obj.category) {
          case "note":
            renderUI(obj, false);
            break;
          case "journal":
            renderUI(obj, false);
            break;
          case "todo":
            renderUI(obj, true);
            break;
        }
        toastFunction(`${obj.category} is added`, "addToast");

        textInput.value = "";
        headInput.value = "";

        container.remove();
      });
    }
  }

  // function setData(localDataArray) {
  //   localStorage.setItem("key", JSON.stringify(localDataArray));
  // };

  function getData(localDataArray) {
    localDataArray.forEach((element, index) => {
      switch (element.category) {
        case "note":
          renderUI(element, false);
          break;
        case "journal":
          renderUI(element, false);
          break;
        case "todo":
          renderUI(element, true);
          break;
      }
    });
  }

  function renderUI(dataObject, value) {
    const contentPage = document.querySelector("#contentPage");
    const warning = document.querySelector("#warning");
    if (warning) {
      warning.style.display = "none";
    }

    const theType = dataObject.category;

    const logContainer = document.createElement("div");
    logContainer.setAttribute("class", `${theType}Container`);
    logContainer.classList.add("activeShowUp");

    let editImageSrc;
    let deleteImageSrc;

    if (document.body.classList.contains("dark")) {
      editImageSrc = "svgs/editLight.svg";
      deleteImageSrc = "svgs/deleteLight.svg";
    } else {
      editImageSrc = "svgs/editDark.svg";
      deleteImageSrc = "svgs/deleteDark.svg";
    }

    const log = document.createElement("div");
    log.setAttribute("class", `${theType}`);

    const logHead = document.createElement("h3");
    logHead.setAttribute("class", `${theType}Head`);

    const logPara = document.createElement("p");
    logPara.setAttribute("class", `${theType}Para`);

    const dividerLine = document.createElement("span");
    dividerLine.setAttribute("class", "dividerLine");

    const logLastSection = document.createElement("div");
    logLastSection.setAttribute("class", `${theType}LastSection`);

    let todoCreatedData;
    let todoCorrection;

    let journalDateWrapper;
    let journalDate;

    if (theType === "todo") {
      todoCreatedData = document.createElement("div");
      todoCreatedData.setAttribute("class", `${theType}CreatedData`);

      todoCorrection = document.createElement("div");
      todoCorrection.setAttribute("class", `${theType}Correction`);
    }

    if (theType === "journal") {
      journalDateWrapper = document.createElement("div");
      journalDateWrapper.setAttribute("class", "journalDateWrapper");

      journalDate = document.createElement("p");
      journalDate.setAttribute("class", "journalDate");

      journalDate.textContent = `${dataObject.date} ,${dataObject.month} ${dataObject.dateNumber}`;
    }

    const createdData = document.createElement("div");
    createdData.setAttribute("class", "createdData");

    const correction = document.createElement("div");
    correction.setAttribute("class", "correction");

    const createdDateTime = document.createElement("p");
    createdDateTime.setAttribute("class", "createdDateTime");

    const logEditImage = document.createElement("img");
    logEditImage.setAttribute("class", `${theType}EditImage icon`);

    const logDeleteImage = document.createElement("img");
    logDeleteImage.setAttribute("class", `${theType}DeleteImage icon`);

    createdDateTime.textContent = `${dataObject.date} | ${dataObject.time}`;
    logHead.textContent = dataObject.heading;
    logPara.textContent = dataObject.text;

    logEditImage.src = editImageSrc;
    logDeleteImage.src = deleteImageSrc;

    if (theType === "journal") {
      journalDateWrapper.append(journalDate);
      log.append(journalDateWrapper);
    }

    log.append(logHead);
    if (theType !== "todo" && theType !== "journal") {
      log.append(dividerLine);
    }

    log.append(logPara);

    if (theType !== "todo") {
      createdData.append(createdDateTime);
      logLastSection.append(createdData);
      logLastSection.append(correction);
      correction.append(logEditImage);
      correction.append(logDeleteImage);
    } else {
      todoCreatedData.append(createdDateTime);
      log.append(todoCreatedData);
      logLastSection.append(todoCorrection);
      todoCorrection.append(logEditImage);
      todoCorrection.append(logDeleteImage);
    }

    logContainer.append(log);

    if (value === true) {
      const dueTime = document.createElement("div");
      dueTime.setAttribute("class", "dueTime");

      const dueTimeText = document.createElement("p");
      dueTimeText.setAttribute("class", "dueTimeText");

      const todoTime = document.createElement("p");
      todoTime.setAttribute("class", "todoTime");

      todoTime.textContent = dataObject.todoDueTime;
      dueTimeText.textContent = `Todo is due to`;

      dueTime.append(dueTimeText);
      dueTime.append(todoTime);
      logContainer.append(dueTime);
    }

    logContainer.append(logLastSection);

    const fragment = document.createDocumentFragment();
    fragment.append(logContainer);
    contentPage.appendChild(fragment);

    logDeleteImage.addEventListener("click", () => {
      localDataArray = localDataArray.filter((el) => {
        return el.id !== dataObject.id;
      });

      setData(localDataArray);
      logContainer.remove();
      toastFunction(`${theType} is deleted`, "deleteToast");

      if (localDataArray.length === 0) {
        const warning = document.querySelector("#warning");
        if (warning) warning.style.display = "flex";
      }
    });

    logEditImage.onclick = logEditAndSave;
    function logEditAndSave() {
      if (document.querySelector(`.${theType}InputContainer`)) {
        return;
      }

      const container = document.createElement("div");
      container.setAttribute("class", `${theType}InputContainer`);

      const wrapper = document.createElement("div");
      wrapper.setAttribute("class", `${theType}InputWrapper`);
      let headInput;
      if (theType !== "todo") {
        headInput = document.createElement("input");
        headInput.setAttribute("class", "headInput");
        headInput.value = logHead.textContent;
      }

      const textInput = document.createElement("textarea");
      textInput.setAttribute("class", `${theType}TextInput`);
      textInput.value = logPara.textContent;

      const logButtons = document.createElement("div");
      logButtons.setAttribute("class", "logButtons");

      const saveButton = document.createElement("button");
      saveButton.textContent = "Save entry";
      saveButton.setAttribute("class", "saveButton");

      const closeButton = document.createElement("button");
      closeButton.textContent = "Discard";
      closeButton.setAttribute("class", "closeButton");

      if (theType !== "todo") {
        wrapper.append(headInput);
      }
      wrapper.append(textInput);
      logButtons.append(closeButton);
      logButtons.append(saveButton);
      wrapper.append(logButtons);

      container.append(wrapper);
      document.body.append(container);

      closeButton.addEventListener("click", () => {
        container.remove();
      });

      saveButton.addEventListener("click", () => {
        const editableObject = localDataArray.find((element) => {
          return element.id === dataObject.id;
        });
        if (editableObject) {
          if (editableObject.text !== textInput.value) {
            editableObject.text = textInput.value;
            logPara.textContent = textInput.value;
          }

          if (theType !== "todo") {
            if (editableObject.heading !== headInput.value) {
              editableObject.heading = headInput.value;
              logHead.textContent = headInput.value;
            }
          }

          setData(localDataArray);
        }

        container.remove();
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
    const searchbutton = document.querySelector(".searchbutton");
    const search = document.querySelector(".search");
    const dropDownToggler = document.querySelectorAll(".dropDownToggler");

    menu.addEventListener("click", sideBarToggle);
    searchbutton.addEventListener("click", () => {
      sideBarToggle();
    });

    search.addEventListener("input", () => {
      search.value.trim().toLowerCase();

      let searchedItems = localDataArray.filter((element) => {
        return (
          (element.heading || "")
            .toLowerCase()
            .includes(search.value.trim().toLowerCase()) ||
          element.text.toLowerCase().includes(search.value.trim().toLowerCase())
        );
      });

      const card = document.querySelectorAll(
        ".noteContainer,.todoContainer,.journalContainer",
      );
      const warning = document.querySelector("#warning");

      card.forEach((element) => {
        element.remove();
      });

      if (searchedItems.length === 0) {
        if (warning) warning.style.display = "flex";
      } else {
        if (warning) warning.style.display = "none";
      }

      searchedItems.forEach((element) => {
        switch (element.category) {
          case "note":
            renderUI(element, false);
            break;
          case "journal":
            renderUI(element, false);
            break;
          case "todo":
            renderUI(element, true);
            break;
        }
      });
    });

    function sideBarToggle() {
      if (sideBar.classList.contains("hide")) {
        sideBar.classList.remove("hide");
        menu.classList.remove("dropDownOpen");
      } else {
        dropDownClose();
        sideBar.classList.add("hide");
        menu.classList.add("dropDownOpen");
      }
    }

    dropDownToggler.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const dropDown = toggle.parentElement.querySelector(".dropDown");
        const dropDownIcon =
          toggle.parentElement.querySelector(".dropDownIcon");

        if (dropDown.classList.contains("toggled")) {
          dropDown.classList.remove("toggled");
          dropDownIcon.classList.remove("dropDownOpen");
        } else {
          sideBar.classList.remove("hide");
          menu.classList.remove("dropDownOpen");
          dropDown.classList.add("toggled");
          dropDownIcon.classList.add("dropDownOpen");
        }
      });
    });

    function dropDownClose() {
      dropDownToggler.forEach((toggle) => {
        const dropDown = toggle.parentElement.querySelector(".dropDown");
        const dropDownIcon =
          toggle.parentElement.querySelector(".dropDownIcon");
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
    const categorySelectImage = document.querySelector(".categorySelectImage");
    const dropDownIcon = document.querySelectorAll(".dropDownIcon");

    const imageIcons = {
      light: {
        addNoteIcon: "svgs/addDark.svg",
        editIcon: "svgs/editDark.svg",
        emptyNoteIcon: "svgs/emptyDark.svg",
        themeIcon: "svgs/lightMode.svg",
        categoryIcon: "svgs/categoryDark.svg",
        daySelectionIcon: "svgs/daySelectionDark.svg",
        deleteIcon: "svgs/deleteDark.svg",
        dropDownIcon: "svgs/dropDownDark.svg",
        menuIcon: "svgs/menuDark.svg",
        sideBarIcon: "svgs/sideBarDark.svg",
        searchIcon: "svgs/searchDark.svg",
      },

      dark: {
        addNoteIcon: "svgs/addLight.svg",
        editIcon: "svgs/editLight.svg",
        emptyNoteIcon: "svgs/emptyLight.svg",
        themeIcon: "svgs/darkMode.svg",
        categoryIcon: "svgs/categoryLight.svg",
        daySelectionIcon: "svgs/daySelectionLight.svg",
        deleteIcon: "svgs/deleteLight.svg",
        dropDownIcon: "svgs/dropDownLight.svg",
        menuIcon: "svgs/menuLight.svg",
        sideBarIcon: "svgs/sideBarLight.svg",
        searchIcon: "svgs/searchLight.svg",
      },
    };

    const themeInfo = localStorage.getItem("userTheme") || "dark";
    document.body.classList.remove("dark", "light");
    document.body.classList.add(themeInfo);

    setIcons(themeInfo);

    theme.addEventListener("click", () => {
      const darkThemed = document.body.classList.contains("dark");

      if (!darkThemed) {
        document.body.classList.replace("light", "dark");
        setIcons("dark");
        localStorage.setItem("userTheme", "dark");
      } else {
        document.body.classList.replace("dark", "light");
        setIcons("light");
        localStorage.setItem("userTheme", "light");
      }
    });

    function setIcons(themeKey) {
      addEntryImage.src = imageIcons[themeKey].addNoteIcon;
      searchbutton.src = imageIcons[themeKey].searchIcon;
      emptyNoteAdd.src = imageIcons[themeKey].emptyNoteIcon;
      menu.src = imageIcons[themeKey].menuIcon;
      daySelectImage.src = imageIcons[themeKey].daySelectionIcon;
      categorySelectImage.src = imageIcons[themeKey].categoryIcon;
      theme.src = imageIcons[themeKey].themeIcon;
      dropDownIcon.forEach((icon) => {
        icon.src = imageIcons[themeKey].dropDownIcon;
      });

      document
        .querySelectorAll(".noteEditImage,.journalEditImage,.todoEditImage")
        .forEach((icon) => {
          icon.src = imageIcons[themeKey].editIcon;
        });
      document
        .querySelectorAll(
          ".noteDeleteImage,.journalDeleteImage,.todoDeleteImage",
        )
        .forEach((icon) => {
          icon.src = imageIcons[themeKey].deleteIcon;
        });
    }
  }

  function typeSelectionFunction() {
    const typeSelector = document
      .querySelectorAll(".typeSelection")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const type = button.textContent.trim().toLowerCase();
          typeFunctionHandler(type);
        });
      });

    function typeFunctionHandler(type) {
      let presentableObject;

      if (type === "all") {
        presentableObject = localDataArray;
      } else {
        presentableObject = localDataArray.filter((el) => {
          return el.category === type;
        });
      }

      const card = document.querySelectorAll(
        ".noteContainer,.todoContainer,.journalContainer",
      );
      const warning = document.querySelector("#warning");

      card.forEach((element) => {
        element.remove();
      });

      if (presentableObject.length === 0) {
        if (warning) warning.style.display = "flex";
      } else {
        if (warning) warning.style.display = "none";
      }

      presentableObject.forEach((element) => {
        switch (element.category) {
          case "note":
            renderUI(element, false);
            break;
          case "journal":
            renderUI(element, false);
            break;
          case "todo":
            renderUI(element, true);
            break;
        }
      });
    }
  }

  function daySelection() {
    document.querySelectorAll(".daySelectGrid li").forEach((day) => {
      day.addEventListener("click", () => {
        const selectedDay = day.textContent;

        const gotDate = new Date();
        const todayYearOld = gotDate
          .toLocaleDateString("en-GB")
          .replace(/\//g, ".");
        const yesterdayDate = new Date();
        yesterdayDate.setDate(gotDate.getDate() - 1);
        const oneYearOld = yesterdayDate
          .toLocaleDateString("en-GB")
          .replace(/\//g, ".");

        let selectedDaydata;

        switch (selectedDay) {
          case "Alltime":
            selectedDaydata = localDataArray;
            break;

          case "Today":
            selectedDaydata = localDataArray.filter((el) => {
              return el.date === todayYearOld;
            });
            break;
          case "Yesterday":
            selectedDaydata = localDataArray.filter((el) => {
              return el.date === oneYearOld;
            });
            break;
          case "Over a week":
            selectedDaydata = localDataArray.filter((el) => {
              return el.id < Date.now() - 7 * 86400000;
            });
            break;
          case "Over a month":
            selectedDaydata = localDataArray.filter((el) => {
              return el.id < Date.now() - 30 * 86400000;
            });
            break;

          default:
            selectedDaydata = localDataArray;
            break;
        }

        const card = document.querySelectorAll(
          ".noteContainer,.todoContainer,.journalContainer",
        );
        const warning = document.querySelector("#warning");

        card.forEach((element) => {
          element.remove();
        });

        if (selectedDaydata.length === 0) {
          if (warning) warning.style.display = "flex";
        } else {
          if (warning) warning.style.display = "none";
        }

        selectedDaydata.forEach((element) => {
          switch (element.category) {
            case "note":
              renderUI(element, false);
              break;
            case "journal":
              renderUI(element, false);
              break;
            case "todo":
              renderUI(element, true);
              break;
          }
        });
      });
    });
  }
}
