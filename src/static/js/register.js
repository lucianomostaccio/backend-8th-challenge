// @ts-ignore
const formRegister = document.querySelector("form");

formRegister?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    // @ts-ignore
    body: new URLSearchParams(new FormData(formRegister)),
  });

  if (response.status === 201) {
    // @ts-ignore
    // @ts-ignore
    const { payload: user } = await response.json();
    alert("Registration successful");
    window.location.href = "/login";
  } else {
    const error = await response.json();
    alert(error.message);
  }
});

function previewImage() {
  let preview = document.getElementById("imagePreview");
  let fileInput = document.getElementById("profile_picture");
  let footer = document.getElementById("footer");
  // @ts-ignore
  footer.style.position = "static";
  // @ts-ignore
  footer.style.bottom = " ";
  // @ts-ignore
  let file = fileInput.files[0];

  let reader = new FileReader();

  reader.onloadend = function () {
    // @ts-ignore
    preview.innerHTML =
      '<img id="profile-pic" src="' + reader.result + '" alt="Preview">';
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    // @ts-ignore
    preview.innerHTML = "";
  }
}
