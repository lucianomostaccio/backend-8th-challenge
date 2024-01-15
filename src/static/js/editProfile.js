// @ts-ignore
const formEditProfile = document.querySelector("#form-edit-profile");
const inputs = document.querySelectorAll('input')

window.addEventListener('load', async event => {
  const response = await fetch('/api/users/current')
  if (response.status === 403) {
    alert('You need to be logged in to modify your profile')
    return (window.location.href = '/login')
  }

  const result = await response.json()
  const user = result.payload

  inputs[0].value = user.first_name
  inputs[1].value = user.last_name
  inputs[2].value = user.email
})


formEditProfile?.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  // @ts-ignore
  const formData = new FormData(formEditProfile);
  formData.append('email', inputs[2].value)

  // @ts-ignore
  const body = new URLSearchParams(formData)

  const response = await fetch("/api/users/edit", {
    method: "PUT",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (response.status === 200) {
    alert("Profile updated successfully");
    window.location.href = "/profile";
  } else {
    const error = await response.json();
    alert(error.message);
  }
});