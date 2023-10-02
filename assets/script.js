document.addEventListener("DOMContentLoaded", function () {
  const inputForm = document.getElementById("input-form");
  const listRow = document.getElementById("list-row");
  const messageContainer = document.getElementById("message");

  // Load bookmarks from local storage on page load
  loadBookmarks();

  // Event listener for form submission
  inputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBookmark();
  });

  listRow.addEventListener("click", function (event) {
    if (event.target.classList.contains("ri-delete-bin-6-line")) {
      const index = event.target.dataset.index;
      window.removeBookmark(index);
    }
  });

  function loadBookmarks() {
    try {
      // Retrieve bookmarks from local storage
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
      displayBookmarks(bookmarks);
    } catch (error) {
      showMessage("Error in loading bookmarks", "danger");
      console.error("", error);
    }
  }

  function addBookmark() {
    const urlNameInput = document.getElementById("Url-name");
    const linkInput = document.getElementById("Url-link");

    const urlName = urlNameInput.value.trim();
    const link = linkInput.value.trim();

    if (urlName === "" || link === "") {
      showMessage("Please enter valid values for Name and URL.", "danger");
      clearInputs(urlNameInput, linkInput);
      return;
    }

    // Validate the URL format
    if (!isValidURL(link)) {
      showMessage(
        "Please enter a valid URL in the format 'http://www.example.com'.",
        "danger"
      );
      clearInputs(urlNameInput, linkInput);
      return;
    }

    if (urlName.length > 20) {
      showMessage("Name should be at most 20 characters.", "danger");
      clearInputs(urlNameInput, linkInput);
      return;
    }

    // Create a new bookmark object
    const newBookmark = { urlName, link };

    // Retrieve existing bookmarks from local storage
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    // Check for duplicate bookmarks
    if (isDuplicate(newBookmark, bookmarks)) {
      showMessage("Bookmark already exists.", "danger");
      clearInputs(urlNameInput, linkInput);
      return;
    }

    // Add the new bookmark to the array
    bookmarks.push(newBookmark);

    // Save the updated bookmarks back to local storage
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    // Display the updated bookmarks
    displayBookmarks(bookmarks);
    showMessage("Bookmark added successfully.", "success");

    // Clear the form inputs
    clearInputs(urlNameInput, linkInput);
  }

  function displayBookmarks(bookmarks) {
    // Clear existing bookmarks
    listRow.innerHTML = "";

    // Populate the bookmark list
    bookmarks.forEach((bookmark, index) => {
      const bookmarkItem = createBookmarkItem(bookmark, index);
      listRow.appendChild(bookmarkItem);
    });
  }

  function createBookmarkItem(bookmark, index) {
    const colDiv = document.createElement("div");
    colDiv.classList.add("col-sm-12", "col-md-6", "col-lg-4", "mb-3");

    const linkItem = document.createElement("a");
    linkItem.href = bookmark.link;
    linkItem.target = "_blank";
    linkItem.classList.add("list-group-item", "list-group-item-action", "mb-3");
    linkItem.textContent = bookmark.urlName;

    const deleteIcon = document.createElement("span");
    deleteIcon.innerHTML = `<i class="ri-delete-bin-6-line close" data-index="${index}"></i>`;
    colDiv.appendChild(linkItem);
    colDiv.appendChild(deleteIcon);

    return colDiv;
  }

  // Define removeBookmark in the global scope
  window.removeBookmark = function (index) {
    // Retrieve existing bookmarks from local storage
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    // Remove the bookmark at the specified index
    bookmarks.splice(index, 1);

    // Save the updated bookmarks back to local storage
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    // Display the updated bookmarks
    displayBookmarks(bookmarks);
    showMessage("Bookmark removed successfully.", "success");
  };

  function showMessage(message, type) {
    messageContainer.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
    // Clear the message after 3 seconds
    setTimeout(() => {
      messageContainer.innerHTML = "";
    }, 4000);
  }

  function clearInputs(...inputs) {
    inputs.forEach((input) => (input.value = ""));
  }

  function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  function isDuplicate(newBookmark, bookmarks) {
    // Check if the new bookmark already exists in the array
    return bookmarks.some(
      (bookmark) =>
        bookmark.urlName.toLowerCase() === newBookmark.urlName.toLowerCase() &&
        bookmark.link.toLowerCase() === newBookmark.link.toLowerCase()
    );
  }
});
