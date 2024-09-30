document.addEventListener("DOMContentLoaded", () => {});
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", function (e) {
    e.preventDefault();

    // Remove active state from all tabs and hide all content
    tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
    tabContents.forEach((content) => (content.style.display = "none"));

    // Activate clicked tab and show corresponding content
    const target = this.getAttribute("data-tab");
    document.getElementById(target).style.display = "block";
    this.setAttribute("aria-selected", "true");
  });
});

document.querySelectorAll("table.interactive").forEach((element) => {
  element.addEventListener("click", (event) => {
    const row =
      event.target.parentElement.tagName === "TR"
        ? event.target.parentElement
        : null;
    if (row) {
      row.classList.toggle("highlighted");
    }
  });
});

function changeVideo(videoID) {
  // Set the src of the iframe to the new video ID
  const iframe = document.getElementById("videoFrame");
  iframe.src = `https://www.youtube.com/embed/${videoID}`;
}
