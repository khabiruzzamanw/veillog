/* ─── Journix — index.js ─────────────────────────────────────── */

// SVG icon strings (inline — no image files needed)
const SVG = {
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  delete: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
};

/* ─── State ──────────────────────────────────────────────────── */
let localDataArray = JSON.parse(localStorage.getItem("key")) || [];

if (localDataArray.length > 0) {
  const warning = document.querySelector("#warning");
  if (warning) warning.style.display = "none";
}

/* ─── Init ───────────────────────────────────────────────────── */
themeChanger();
toggles();
noteCreation();
getData(localDataArray);
searchInit();

/* ─── Note Creation ─────────────────────────────────────────── */
function noteCreation() {
  const addEntry = document.querySelector("#addEntry");
  const emptyNote = document.querySelector("#emptyNoteAdd");

  addEntry.addEventListener("click", typeSelection);
  emptyNote.addEventListener("click", typeSelection);

  function typeSelection() {
    const bluredBg = document.createElement("div");
    bluredBg.setAttribute("class", "bluredBg");

    const container = document.createElement("div");
    container.setAttribute("class", "typeSelectionContainer");

    const head = document.createElement("p");
    head.setAttribute("class", "typeSelectionHead");
    head.textContent = "What would you like to create?";

    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "typeSelectionWrapper");

    ["Note", "Journal", "Todo"].forEach((label) => {
      const btn = document.createElement("div");
      btn.setAttribute("class", `${label.toLowerCase()}Type typeChoice`);
      btn.textContent = label;
      wrapper.append(btn);
    });

    container.append(head, wrapper);
    bluredBg.append(container);
    document.body.append(bluredBg);

    // Close on backdrop click
    bluredBg.addEventListener("click", (e) => {
      if (e.target === bluredBg) bluredBg.remove();
    });

    wrapper.querySelectorAll(".typeChoice").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = btn.textContent.trim().toLowerCase();
        bluredBg.remove();
        switch (t) {
          case "note": formShow("noteInputContainer", "noteInputWrapper", true, "noteTextInput", "note"); break;
          case "journal": formShow("journalInputContainer", "journalInputWrapper", true, "journalTextInput", "journal"); break;
          case "todo": formShow("todoInputContainer", "todoInputWrapper", false, "todoTextInput", "todo"); break;
        }
      });
    });
  }

  function formShow(containerClass, wrapperClass, hasHeading, textClass, type) {
    if (document.querySelector(`.${containerClass}`)) return;

    const overlay = document.createElement("div");
    overlay.setAttribute("class", containerClass);

    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", wrapperClass);

    const headInput = document.createElement("input");
    headInput.setAttribute("class", "headInput");
    headInput.placeholder = `Entry title…`;
    if (!hasHeading) headInput.style.display = "none";

    const textInput = document.createElement("textarea");
    textInput.setAttribute("class", textClass);
    textInput.placeholder = type === "todo"
      ? "Describe your task…"
      : `Write your ${type}…`;

    const btnRow = document.createElement("div");
    btnRow.setAttribute("class", "noteButtons");

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Discard";
    closeBtn.setAttribute("class", "closeButton");

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save entry";
    saveBtn.setAttribute("class", "saveButton");

    btnRow.append(closeBtn, saveBtn);
    wrapper.append(headInput, textInput, btnRow);
    overlay.append(wrapper);
    document.body.append(overlay);

    // Focus first visible input
    setTimeout(() => (hasHeading ? headInput : textInput).focus(), 50);

    // Close on backdrop
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
    closeBtn.addEventListener("click", () => overlay.remove());

    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const text = textInput.value.trim();
      const headingText = hasHeading ? headInput.value.trim() : type;

      if (text === "" || (hasHeading && headingText === "")) {
        toastFunction("Please fill in all fields", "deleteToast");
        return;
      }

      const now = new Date();
      const obj = {
        heading: headingText,
        text: text,
        id: Date.now(),
        date: now.toLocaleDateString("en-GB").replace(/\//g, "."),
        time: now.toLocaleTimeString(),
        catagory: type,
        dateNumber: now.getDate(),
        month: now.toLocaleDateString("en-GB", { month: "long" }),
        day: now.toLocaleDateString("en-GB", { weekday: "long" }),
        todoDueTime: now.toLocaleTimeString(),
      };

      localDataArray.push(obj);
      setData(localDataArray);
      renderEntry(obj);
      toastFunction(`${type} saved`, "addToast");
      overlay.remove();
    });
  }
}

/* ─── Render dispatcher ─────────────────────────────────────── */
function renderEntry(el) {
  switch (el.catagory) {
    case "note": noteUI(el.text, el.heading, el.id, el.date, el.time, el.catagory); break;
    case "journal": journalUI(el.heading, el.text, el.day, el.month, el.dateNumber, el.date, el.time, el.id, el.catagory); break;
    case "todo": todoUI(el.text, el.date, el.time, el.todoDueTime, el.id, el.catagory); break;
    default: noteUI(el.text, el.heading, el.id, el.date, el.time, el.catagory);
  }
}

/* ─── Storage ───────────────────────────────────────────────── */
function setData(arr) { localStorage.setItem("key", JSON.stringify(arr)); }

function getData(arr) { arr.forEach(renderEntry); }

/* ─── Shared: build action buttons ─────────────────────────── */
function buildActionBtn(svgStr, extraClass) {
  const btn = document.createElement("button");
  btn.setAttribute("class", `iconBtn ${extraClass}`);
  btn.innerHTML = svgStr;
  btn.style.cssText = `
    background: transparent;
    border: none;
    padding: 0.375rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.3;
    transition: opacity 0.2s, background 0.2s;
    color: var(--text);
  `;
  btn.addEventListener("mouseenter", () => { btn.style.opacity = "0.85"; btn.style.background = "var(--surface-hover)"; });
  btn.addEventListener("mouseleave", () => { btn.style.opacity = "0.3"; btn.style.background = "transparent"; });
  return btn;
}

/* ─── Delete helper ─────────────────────────────────────────── */
function deleteEntry(id, type, cardEl) {
  localDataArray = localDataArray.filter((e) => e.id !== id);
  setData(localDataArray);
  cardEl.style.transition = "opacity 0.25s, transform 0.25s";
  cardEl.style.opacity = "0";
  cardEl.style.transform = "translateY(4px)";
  setTimeout(() => cardEl.remove(), 250);
  toastFunction(`${type} deleted`, "deleteToast");
  if (localDataArray.length === 0) {
    const w = document.querySelector("#warning");
    if (w) w.style.display = "flex";
  }
}

/* ─── Edit modal helper ─────────────────────────────────────── */
function openEditModal(type, hasHeading, currentHead, currentText, onSave) {
  if (document.querySelector(`.${type}InputContainer`)) return;

  const overlay = document.createElement("div");
  overlay.setAttribute("class", `${type}InputContainer`);

  const wrapper = document.createElement("div");
  wrapper.setAttribute("class", `${type}InputWrapper`);

  const headInput = document.createElement("input");
  headInput.setAttribute("class", "headInput");
  headInput.value = currentHead;
  if (!hasHeading) headInput.style.display = "none";

  const textInput = document.createElement("textarea");
  textInput.setAttribute("class", `${type}TextInput`);
  textInput.value = currentText;

  const btnRow = document.createElement("div");
  btnRow.setAttribute("class", "noteButtons");

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Discard";
  closeBtn.setAttribute("class", "closeButton");

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save changes";
  saveBtn.setAttribute("class", "saveButton");

  btnRow.append(closeBtn, saveBtn);
  wrapper.append(headInput, textInput, btnRow);
  overlay.append(wrapper);
  document.body.append(overlay);

  setTimeout(() => (hasHeading ? headInput : textInput).focus(), 50);

  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  closeBtn.addEventListener("click", () => overlay.remove());
  saveBtn.addEventListener("click", () => {
    onSave(headInput.value, textInput.value);
    overlay.remove();
  });
}

/* ─── Note UI ───────────────────────────────────────────────── */
function noteUI(text, headingText, id, date, time, type) {
  const contentPage = document.querySelector("#contentPage");
  const warning = document.querySelector("#warning");
  if (warning) warning.style.display = "none";

  const card = document.createElement("div");
  card.setAttribute("class", "noteContainer activeShowUp");

  const note = document.createElement("div");
  note.setAttribute("class", "note");

  const noteHead = document.createElement("h3");
  noteHead.setAttribute("class", "noteHead");
  noteHead.textContent = headingText;

  const divider = document.createElement("span");
  divider.setAttribute("class", "dividerLine");

  const notePara = document.createElement("p");
  notePara.setAttribute("class", "notePara");
  notePara.textContent = text;

  note.append(noteHead, divider, notePara);

  const footer = document.createElement("div");
  footer.setAttribute("class", "noteLastSection");

  const createdData = document.createElement("div");
  createdData.setAttribute("class", "createdData");
  const dt = document.createElement("p");
  dt.setAttribute("class", "createdDateTime");
  dt.textContent = `${date} · ${time}`;
  createdData.append(dt);

  const correction = document.createElement("div");
  correction.setAttribute("class", "correction");

  const editBtn = buildActionBtn(SVG.edit, "noteEditImage");
  const deleteBtn = buildActionBtn(SVG.delete, "noteDeleteImage");

  correction.append(editBtn, deleteBtn);
  footer.append(createdData, correction);
  card.append(note, footer);
  contentPage.appendChild(card);

  deleteBtn.addEventListener("click", () => deleteEntry(id, type, card));

  editBtn.addEventListener("click", () => {
    openEditModal(type, true, noteHead.textContent, notePara.textContent, (h, t) => {
      const obj = localDataArray.find((e) => e.id === id);
      if (obj) {
        obj.heading = h; obj.text = t;
        noteHead.textContent = h;
        notePara.textContent = t;
        setData(localDataArray);
      }
    });
  });
}

/* ─── Journal UI ────────────────────────────────────────────── */
function journalUI(headingText, text, day, month, dateNumber, date, time, id, type) {
  const contentPage = document.querySelector("#contentPage");
  const warning = document.querySelector("#warning");
  if (warning) warning.style.display = "none";

  const card = document.createElement("div");
  card.setAttribute("class", "journalContainer activeShowUp");

  const journal = document.createElement("div");
  journal.setAttribute("class", "journal");

  const dateWrap = document.createElement("div");
  dateWrap.setAttribute("class", "journalDateWrapper");
  const journalDate = document.createElement("p");
  journalDate.setAttribute("class", "journalDate");
  journalDate.textContent = `${day}, ${month} ${dateNumber}`;
  dateWrap.append(journalDate);

  const journalHead = document.createElement("h3");
  journalHead.setAttribute("class", "journalHead");
  journalHead.textContent = headingText;

  const journalPara = document.createElement("p");
  journalPara.setAttribute("class", "journalPara");
  journalPara.textContent = text;

  journal.append(dateWrap, journalHead, journalPara);

  const footer = document.createElement("div");
  footer.setAttribute("class", "journalLastSection");

  const createdData = document.createElement("div");
  createdData.setAttribute("class", "createdData");
  const dt = document.createElement("p");
  dt.setAttribute("class", "createdDateTime");
  dt.textContent = `${date} · ${time}`;
  createdData.append(dt);

  const correction = document.createElement("div");
  correction.setAttribute("class", "correction");

  const editBtn = buildActionBtn(SVG.edit, "journalEditImage");
  const deleteBtn = buildActionBtn(SVG.delete, "journalDeleteImage");

  correction.append(editBtn, deleteBtn);
  footer.append(createdData, correction);
  card.append(journal, footer);
  contentPage.appendChild(card);

  deleteBtn.addEventListener("click", () => deleteEntry(id, type, card));

  editBtn.addEventListener("click", () => {
    openEditModal(type, true, journalHead.textContent, journalPara.textContent, (h, t) => {
      const obj = localDataArray.find((e) => e.id === id);
      if (obj) {
        obj.heading = h; obj.text = t;
        journalHead.textContent = h;
        journalPara.textContent = t;
        setData(localDataArray);
      }
    });
  });
}

/* ─── Todo UI ───────────────────────────────────────────────── */
function todoUI(text, date, time, todoDueTime, id, type) {
  const contentPage = document.querySelector("#contentPage");
  const warning = document.querySelector("#warning");
  if (warning) warning.style.display = "none";

  const card = document.createElement("div");
  card.setAttribute("class", "todoContainer activeShowUp");

  const todo = document.createElement("div");
  todo.setAttribute("class", "todo");

  const todoPara = document.createElement("p");
  todoPara.setAttribute("class", "todoPara");
  todoPara.textContent = text;

  const todoCreatedDT = document.createElement("p");
  todoCreatedDT.setAttribute("class", "todoCreatedDateTime");
  todoCreatedDT.textContent = `${date} · ${time}`;

  todo.append(todoPara, todoCreatedDT);

  const dueTime = document.createElement("div");
  dueTime.setAttribute("class", "dueTime");

  const dueLabel = document.createElement("p");
  dueLabel.setAttribute("class", "dueTimeText");
  dueLabel.textContent = "Due";

  const todoTime = document.createElement("p");
  todoTime.setAttribute("class", "todoTime");
  todoTime.textContent = todoDueTime;

  dueTime.append(dueLabel, todoTime);

  const correction = document.createElement("div");
  correction.setAttribute("class", "todoCorrection");

  const editBtn = buildActionBtn(SVG.edit, "todoEditImage");
  const deleteBtn = buildActionBtn(SVG.delete, "todoDeleteImage");

  correction.append(editBtn, deleteBtn);
  card.append(todo, dueTime, correction);
  contentPage.appendChild(card);

  deleteBtn.addEventListener("click", () => deleteEntry(id, type, card));

  editBtn.addEventListener("click", () => {
    openEditModal(type, false, "", todoPara.textContent, (_, t) => {
      const obj = localDataArray.find((e) => e.id === id);
      if (obj) {
        obj.text = t;
        todoPara.textContent = t;
        setData(localDataArray);
      }
    });
  });
}

/* ─── Toast ─────────────────────────────────────────────────── */
function toastFunction(message, name) {
  const toast = document.createElement("div");
  toast.setAttribute("class", name);
  toast.innerHTML = `<p>${message}</p>`;
  document.body.append(toast);
  setTimeout(() => toast.remove(), 5000);
}

/* ─── Toggles (sidebar + dropdowns) ────────────────────────── */
function toggles() {
  const menu = document.querySelector("#menu");
  const sideBar = document.querySelector(".sideBar");
  const togglers = document.querySelectorAll(".dropDownToggler");

  menu.addEventListener("click", () => {
    const isHidden = sideBar.classList.contains("hide");
    if (isHidden) {
      sideBar.classList.remove("hide");
      menu.classList.remove("dropDownOpen");
    } else {
      closeAllDropDowns();
      sideBar.classList.add("hide");
      menu.classList.add("dropDownOpen");
    }
  });

  togglers.forEach((tog) => {
    tog.addEventListener("click", () => {
      const dd = tog.parentElement.querySelector(".dropDown");
      const icon = tog.querySelector(".dropDownIcon");
      const open = dd.classList.contains("toggled");

      closeAllDropDowns();

      if (!open) {
        sideBar.classList.remove("hide");
        menu.classList.remove("dropDownOpen");
        dd.classList.add("toggled");
        if (icon) icon.classList.add("dropDownOpen");
      }
    });
  });

  function closeAllDropDowns() {
    togglers.forEach((tog) => {
      const dd = tog.parentElement.querySelector(".dropDown");
      const icon = tog.querySelector(".dropDownIcon");
      if (dd) dd.classList.remove("toggled");
      if (icon) icon.classList.remove("dropDownOpen");
    });
  }
}

/* ─── Theme ─────────────────────────────────────────────────── */
function themeChanger() {
  const themeBtn = document.querySelector("#theme");

  // Moon SVG (for dark mode — click to go light)
  const moonSVG = `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>`;
  // Sun SVG (for light mode — click to go dark)
  const sunSVG = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;

  const savedTheme = localStorage.getItem("userTheme") || "dark";
  document.body.classList.remove("dark", "light");
  document.body.classList.add(savedTheme);
  themeBtn.innerHTML = savedTheme === "dark" ? moonSVG : sunSVG;

  themeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");
    document.body.classList.replace(isDark ? "dark" : "light", isDark ? "light" : "dark");
    localStorage.setItem("userTheme", isDark ? "light" : "dark");
    themeBtn.innerHTML = isDark ? sunSVG : moonSVG;
  });
}

/* ─── Category filter ───────────────────────────────────────── */
document.querySelectorAll(".typeSelection").forEach((btn) => {
  btn.addEventListener("click", () => {
    typeFunctionHandler(btn.textContent.trim().toLowerCase());
  });
});

function typeFunctionHandler(type) {
  const filtered = type === "all"
    ? localDataArray
    : localDataArray.filter((el) => el.catagory === type);

  document.querySelectorAll(".noteContainer,.todoContainer,.journalContainer")
    .forEach((el) => el.remove());

  const warning = document.querySelector("#warning");
  if (filtered.length === 0) {
    if (warning) warning.style.display = "flex";
  } else {
    if (warning) warning.style.display = "none";
    filtered.forEach(renderEntry);
  }
}

/* ─── Search ────────────────────────────────────────────────── */
function searchInit() {
  const searchInput = document.querySelector("#search");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    document.querySelectorAll(".noteContainer,.todoContainer,.journalContainer")
      .forEach((el) => el.remove());

    const warning = document.querySelector("#warning");
    const results = query === ""
      ? localDataArray
      : localDataArray.filter((el) =>
        (el.heading || "").toLowerCase().includes(query) ||
        (el.text || "").toLowerCase().includes(query)
      );

    if (results.length === 0) {
      if (warning) warning.style.display = "flex";
    } else {
      if (warning) warning.style.display = "none";
      results.forEach(renderEntry);
    }
  });
}

/* ─── Card show-up animation ────────────────────────────────── */
const style = document.createElement("style");
style.textContent = `
  .activeShowUp {
    animation: cardIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);