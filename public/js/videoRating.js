const likeBtn = document.getElementById("like");
const dislikeBtn = document.getElementById("dislike");
const url = location.search.split("=");

window.onload = () => {
  fetch(`/views/${url[1]}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((res) => {
      document.getElementById("views").innerText = res;
    });
};
const likesUpdate = (e) => {
  fetch(`/${e.target.id}/${url[1]}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((res) => {
      document.getElementById(`${e.target.id}_label`).innerText = res;
      likeBtn.removeEventListener("click", likesUpdate);
      dislikeBtn.removeEventListener("click", likesUpdate);
    });
};

likeBtn.addEventListener("click", likesUpdate);
dislikeBtn.addEventListener("click", likesUpdate);
