import { collection, getDocs, db } from "./firebase.js";

window.addEventListener("load", pageLoad());

async function pageLoad() {
  preloader.style.display = "block";

  var userLoginName = window.localStorage.getItem("user");
  userLoginName = JSON.parse(userLoginName);

  if (!userLoginName) {
    window.location.replace("../index.html");
  }

  console.log("page loaded");
  var user = localStorage.getItem("user");

  var uPicture = document.getElementById("uPicture");
  var uName = document.getElementById("uName");
  var uEmail = document.getElementById("uEmail");
  var uPhone = document.getElementById("uPhone");
  var UserId = document.getElementById("UserId");

  console.log(uPicture);
  console.log(uName);
  console.log(uEmail);
  console.log(uPhone);
  console.log(UserId);

  //   return;
  user = JSON.parse(user);
  const querySnapshot = await getDocs(collection(db, "users"));

  querySnapshot.forEach(function (doc) {
    console.log(doc.data());

    if (user.uid == doc.data().uid) {
      uPicture.setAttribute("src", "https://picsum.photos/100/50");
      uName.innerHTML += " " + doc.data().uName;
      uEmail.innerHTML += " " + doc.data().uEmail;
      uPhone.innerHTML += " " + doc.data().uPhone;
      UserId.innerHTML += " " + doc.data().uid;
    }
  });
  preloader.style.display = "none";
}

function logoutFunc() {
  localStorage.clear();
  window.location.replace("../index.html");
}
window.logoutFunc = logoutFunc;
