chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "scan") {

    const extensions = [
      ".jpg", ".jpeg", ".png", ".gif",
      ".webp", ".mp4", ".mp3",
      ".pdf", ".zip", ".rar",
      ".doc", ".docx"
    ];

    const links = Array.from(document.querySelectorAll("a[href]"));

    const found = links
      .map(link => link.href)
      .filter(href =>
        extensions.some(ext =>
          href.toLowerCase().includes(ext)
        )
      );

    const unique = [...new Set(found)];

    sendResponse({ files: unique });
  }

  return true;
});
