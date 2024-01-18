import {
  db,
  auth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "./firebase.js";

window.addEventListener("load", pageLoad);

async function pageLoad() {
  var userLoginName = window.localStorage.getItem("user");
  userLoginName = JSON.parse(userLoginName);

  if (userLoginName) {
    window.location.replace("../pages/dashboard.html");
  }
}
var signupBtn = document.getElementById("signupBtn");
function signupFunc() {
  console.log("signupFunc");
  var signName = document.getElementById("signName");
  var currentName = signName.value;
  var email = document.getElementById("uEmail");
  var pass = document.getElementById("pass");
  var uPhone = document.getElementById("uPhone");

  if (
    currentName === "" ||
    email.value === "" ||
    pass.value === "" ||
    uPhone.value === ""
  ) {
    alert("Please fill in all required fields");
  } else {
    console.log("signname before signup", email);
    createUserWithEmailAndPassword(auth, email.value, pass.value)
      .then(async function (success) {
        console.log("signname after singup", currentName);

        alert("Successfully signed up", success.code);
        var userObj = {
          uid: success.user.uid,
          uName: currentName,
          uEmail: email.value,
          uPhone: uPhone.value,
        };
        const docRef = await addDoc(collection(db, "users"), userObj);

        console.log("user created user", docRef);
        signName.value = "";
        email.value = "";
        pass.value = "";
        uPhone.value = "";
      })
      .catch(function (error) {
        alert(error.code);
      });
  }
}

var loginEmail = document.getElementById("loginEmail");
var loginPass = document.getElementById("loginPass");

function loginFunc() {
  if (loginEmail.value === "" || loginPass.value === "") {
    alert("Please fill in all required fields");
  } else {
    var tempArr = [];
    signInWithEmailAndPassword(auth, loginEmail.value, loginPass.value)
      .then(async function (success) {
        const querySnapshot = await getDocs(collection(db, "users"));
        console.log("snapshot", querySnapshot);

        querySnapshot.forEach(function (doc) {
          // alert("Successfully logged-in");
          console.log("logged in");

          tempArr.push({
            name: doc.data().uName,
            uid: doc.data().uid,
          });
        });
        for (var i = 0; i < tempArr.length; i++) {
          if (tempArr[i].uid == success.user.uid) {
            var user = {
              name: tempArr[i].name,
              uid: success.user.uid,
            };
            window.localStorage.setItem("user", JSON.stringify(user));
            console.log(tempArr[i].name);
          }
        }

        loginEmail.value = "";
        loginPass.value = "";

        window.location.replace("../pages/dashboard.html");
      })
      .catch(function (error) {
        console.log(error);
        alert(error.code);
      });
  }
}

// window.pageLoad = pageLoad;

window.loginFunc = loginFunc;
window.signupFunc = signupFunc;
