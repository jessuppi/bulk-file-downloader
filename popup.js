const scanBtn = document.getElementById("scan");
const resultsDiv = document.getElementById("results");
const downloadBtn = document.getElementById("download");

let files = [];

scanBtn.addEventListener("click", async () => {
  resultsDiv.textContent = "Scanning...";

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: "scan"
    });

    files = response?.files || [];
    renderFiles(files);

  } catch (error) {
    resultsDiv.textContent = "Unable to scan this page.";
  }
});

function renderFiles(fileList) {
  resultsDiv.innerHTML = "";

  if (!fileList.length) {
    resultsDiv.textContent = "No files found.";
    downloadBtn.disabled = true;
    return;
  }

  fileList.forEach((url, index) => {
    const div = document.createElement("div");
    div.className = "file-item";

    div.innerHTML = `
      <input type="checkbox" data-index="${index}">
      ${url}
    `;

    resultsDiv.appendChild(div);
  });

  downloadBtn.disabled = false;
}

downloadBtn.addEventListener("click", () => {
  const selected = document.querySelectorAll("input[type=checkbox]:checked");

  selected.forEach(cb => {
    const url = files[cb.dataset.index];

    chrome.downloads.download({
      url: url,
      saveAs: false
    });
  });
});
