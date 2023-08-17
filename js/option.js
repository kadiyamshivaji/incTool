let buttonNames = [
  "Severity",
  "Description",
  "AccountName",
  "WFI",
  "FTS",
  "Priority",
  "Platform",
  "SME",
];
const refresh = () => {
  renderButtons(buttonNames);
};
document.getElementById("submit").addEventListener("click", function () {
  const SelectedOptions = [];
  const arr = document.getElementsByClassName("option-item");
  for (let a = 0; a < arr.length; a++) {
    if (arr[a].checked) {
      SelectedOptions.push(arr[a].getAttribute("value"));
    }
  }
  chrome.storage.sync.set({ optionKey: SelectedOptions.toString() });
  buttonNames = SelectedOptions;
  refresh();
  placeHolder.textContent = constructPlaceHolder(buttonNames);
});

document.getElementById("reset").addEventListener("click", function () {
  buttonNames = [
    "Severity",
    "Description",
    "AccountName",
    "WFI",
    "FTS",
    "Priority",
    "Platform",
    "SME",
  ];
  chrome.storage.sync.set({ optionKey: buttonNames.toString() });
  renderButtons(buttonNames);
  placeHolder.textContent = constructPlaceHolder(buttonNames);
});

const constructPlaceHolder = (options) => {
  let temp = "";
  options.map((item) => {
    if (temp) {
      temp = temp + ` || ${item}`;
    } else {
      temp = temp + item;
    }
  });
  return temp;
};

const buttonList = document.getElementById("buttonList");
const placeHolder = document.getElementById("opions_placeholder");
let draggedButton = null;

function renderButtons(buttonNames) {
  buttonList.innerHTML = "";
  buttonNames.forEach((name) => {
    const button = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type == "check-box";
    button.appendChild(checkbox);
    button.className = "drag-item";
    button.draggable = true;
    button.innerHTML = `<input type="checkbox" id="${name.toLowerCase()}" checked  value="${name}" class="option-item"/> <label for="${name}">${name}</label>`;
    buttonList.appendChild(button);
  });
}

chrome.storage.sync.get("optionKey", function (data) {
  let savedOptions = [];
  savedOptions = (data.optionKey && data.optionKey.split(",")) || [];
  buttonNames = savedOptions.length > 0 ? savedOptions : buttonNames;
  renderButtons(buttonNames);
  placeHolder.textContent = constructPlaceHolder(buttonNames);
});

buttonList.addEventListener("dragstart", (e) => {
  draggedButton = e.target;
});

buttonList.addEventListener("dragover", (e) => {
  e.preventDefault();
});

buttonList.addEventListener("drop", (e) => {
  e.preventDefault();
  if (draggedButton !== null) {
    const targetButton = e.target;
    if (
      targetButton &&
      targetButton !== draggedButton &&
      targetButton.classList.contains("drag-item")
    ) {
      const buttons = Array.from(
        buttonList.getElementsByClassName("drag-item")
      );
      const draggedIndex = buttons.indexOf(draggedButton);
      const targetIndex = buttons.indexOf(targetButton);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        buttonList.removeChild(draggedButton);
        if (draggedIndex < targetIndex) {
          buttonList.insertBefore(draggedButton, targetButton.nextSibling);
        } else {
          buttonList.insertBefore(draggedButton, targetButton);
        }

        // Update array to reflect the new order
        const [removedButton] = buttonNames.splice(draggedIndex, 1);
        buttonNames.splice(targetIndex, 0, removedButton);
        placeHolder.textContent = constructPlaceHolder(buttonNames);
        draggedButton = null;
      }
    }
  }
});

document
  .getElementById("saveOwnerShipNote")
  .addEventListener("click", function () {
    const note = document.getElementById("ownerShipNote").value;
    chrome.storage.sync.set({ ownershipNote: note });
  });

// ****************    Function to add new template in the table   *************************

document
  .getElementById("create-new-template-btn")
  .addEventListener("click", function () {
    const tableHTMLNode = document.getElementById("template-table");

    // create a row with sample data
    const row = tableHTMLNode.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = "Sample Template Name";
    cell2.innerHTML = "Sample Template Content";
    cell3.innerHTML = `<button class="btn btn-secondary">Update</button>
              <button class="btn btn-danger" id="delete-template-btn" >Delete</button>`;

    // TODO - save the data in chrome storage
  });

// ******************* Function to delete the template from the row ***********************

document
  .getElementById("delete-template-btn")
  .addEventListener("click", function (r) {
    const i = r.target.parentNode.parentNode.rowIndex;
    document.getElementById("template-table").deleteRow(i);

    // TODO - update the data in chrome storage
  });
