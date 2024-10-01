document.addEventListener("DOMContentLoaded", () => {});
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", function (e) {
    e.preventDefault();

    tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
    tabContents.forEach((content) => (content.style.display = "none"));

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
  const iframe = document.getElementById("videoFrame");
  iframe.src = `https://www.youtube.com/embed/${videoID}`;
}

document
  .getElementById("contactForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(this);

    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    try {
      const response = await fetch("/api/send_mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const result = await response.json();

      if (response.ok) {
        document.getElementById("responseMessage").textContent =
          "Your message was sent successfully!";
        document.getElementById("responseMessage").style.color = "green";
        document.getElementById("contactForm").reset(); // Clear the form fields after submission
      } else {
        document.getElementById(
          "responseMessage"
        ).textContent = `Error: ${result.error}`;
        document.getElementById("responseMessage").style.color = "red";
      }
    } catch (error) {
      document.getElementById("responseMessage").textContent =
        "An error occurred while sending the message.";
      document.getElementById("responseMessage").style.color = "red";
    }
  });
