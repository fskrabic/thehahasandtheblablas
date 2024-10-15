document.addEventListener("DOMContentLoaded", () => {
  loadLyrics("./lyrics/andy.txt");
  setupTabs();
  setupInteractiveTables();
  setupContactForm();
  loadConcerts("past", true);
  loadConcerts("upcoming", false);
  logVisits();
});

function setupTabs() {
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
}

function setupInteractiveTables() {
  document.querySelectorAll("table.interactive").forEach((table) => {
    table.addEventListener("click", (event) => {
      const row = event.target.closest("tr");
      if (row) {
        row.classList.toggle("highlighted");
      }
    });
  });
}

const hoverContainer = document.querySelector(".hover-container");
const hoverImage = document.querySelector(".hover-image");

hoverContainer.addEventListener("touchstart", () =>
  hoverImage.classList.add("active")
);
hoverContainer.addEventListener("touchend", () =>
  hoverImage.classList.remove("active")
);

function changeVideo(videoID) {
  const iframe = document.getElementById("videoFrame");
  iframe.src = `https://www.youtube.com/embed/${videoID}`;
}

function loadLyrics(fileName) {
  const lyricsContainer = document.getElementById("lyricsContainer");

  fetch(fileName)
    .then((response) => response.text())
    .then((data) => {
      lyricsContainer.textContent = data;
    })
    .catch((error) => {
      lyricsContainer.textContent = "Error loading lyrics. Please try again.";
      console.error("Error fetching lyrics:", error);
    });

  document.querySelectorAll(".lyrics-buttons button").forEach((button) => {
    button.classList.remove("active");
  });
  const activeButton = document.querySelector(
    `button[onclick="loadLyrics('${fileName}')"]`
  );
  activeButton?.classList.add("active");
}

function setupContactForm() {
  document
    .getElementById("contactForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      const formObject = Object.fromEntries(formData.entries());

      try {
        const response = await fetch("/api/send_mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formObject),
        });

        const result = await response.json();
        const messageElement = document.getElementById("responseMessage");

        if (response.ok) {
          messageElement.textContent = "Your message was sent successfully!";
          messageElement.style.color = "green";
          this.reset();
        } else {
          messageElement.textContent = `Error: ${result.error}`;
          messageElement.style.color = "red";
        }
      } catch (error) {
        const messageElement = document.getElementById("responseMessage");
        messageElement.textContent =
          "An error occurred while sending the message.";
        messageElement.style.color = "red";
      }
    });
}

async function logVisits() {
  try {
    const response = await fetch("/api/visit-counter");
    const data = await response.json();
    document.getElementById(
      "visit-count"
    ).textContent = `you're the ${data.visits}. visitor! congratz!`;
  } catch (error) {
    console.error("Error fetching visit count:", error);
  }
}

function loadConcerts(type, reverseOrder) {
  fetch(`./shows/${type}.json`)
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector(`#${type}Gigs tbody`);
      let concerts = data.concerts;

      if (reverseOrder) concerts.reverse();

      concerts.forEach((concert) => {
        const row = document.createElement("tr");

        const dateCell = document.createElement("td");
        dateCell.textContent = concert.date;
        row.appendChild(dateCell);

        const locationCell = document.createElement("td");
        locationCell.textContent = concert.location;
        row.appendChild(locationCell);

        const bandsCell = document.createElement("td");
        bandsCell.textContent = concert.bands;
        row.appendChild(bandsCell);

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error(`Error loading the ${type} concerts:`, error);
    });
}
