import {
  db,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getStorage,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "./firebase.js";

window.addEventListener("load", pageLoad);
var preloader = document.getElementById("preloader");
async function pageLoad() {
  cardParent.innerHTML = "";
  var userName = document.getElementById("userName");
  var userLoginName = window.localStorage.getItem("user");
  userLoginName = JSON.parse(userLoginName);
  if (!userLoginName) {
    window.location.replace("../index.html");
  }
  userName.innerHTML = userLoginName.name;

  const querySnapshot = await getDocs(collection(db, "blogs"));
  querySnapshot.forEach(function (doc) {
    if (doc.data().isPrivate) {
      if (doc.data().uid == userLoginName.uid) {
        console.log("iam private data", doc.data());
        var createdCard = createCard(
          doc.data().imgUrl,
          doc.data().blogTitle,
          doc.data().blogDes,
          doc.data().uName,
          doc.data().date,
          doc.data().isPrivate,
          doc.id
        );
        cardParent.innerHTML += createdCard;
      }
    } else {
      console.log("iam not private", doc.data());
      var createdCard = createCard(
        doc.data().imgUrl,
        doc.data().blogTitle,
        doc.data().blogDes,
        doc.data().uName,
        doc.data().date,
        doc.data().isPrivate,
        doc.id
      );
      cardParent.innerHTML += createdCard;
    }
  });
  preloader.style.display = "none";
}

function validateAddBlog() {
  var blogTitle = document.getElementById("blogTitle");
  var blogDes = document.getElementById("blogDes");
  var blogImg = document.getElementById("blogImg");

  // console.log(blogImg.files[0]);
  if (blogTitle.value == "" || blogDes.value == "" || blogImg.value == "") {
    // Display an error message or handle validation in your preferred way
    alert("Please fill in all required fields");
  } else {
    addBlog();
  }
}

var exampleModal = new bootstrap.Modal(
  document.getElementById("exampleModal"),
  {
    keyboard: false,
  }
);
var cardParent = document.getElementById("cardParent");
async function addBlog() {
  preloader.style.display = "block";
  preloader.style.opacity = "0.7";

  var myModal = document.getElementById("myModal");
  myModal.disabled = true;

  var blogError = document.getElementById("blogError");
  blogError.innerHTML = "please wait until file is uploading";
  var blogImg = document.getElementById("blogImg");
  console.log(blogImg.files[0]);
  var imgUrl = await imageUpload(blogImg.files[0]);
  var blogTitle = document.getElementById("blogTitle");
  var blogDes = document.getElementById("blogDes");
  var isPrivate = document.getElementById("isPrivate");
  var user = localStorage.getItem("user");
  user = JSON.parse(user);
  var cDate = new Date();

  var blog = {
    imgUrl: imgUrl,
    blogTitle: blogTitle.value,
    blogDes: blogDes.value,
    uid: user.uid,
    uName: user.name,
    date: cDate.toDateString(),
    isPrivate: isPrivate.checked,
  };

  var docRef = await addDoc(collection(db, "blogs"), blog);

  console.log("response", docRef);
  var createdCard = createCard(
    imgUrl,
    blogTitle.value,
    blogDes.value,
    user.name,
    cDate.toDateString(),
    isPrivate.checked,
    docRef.id
  );
  alert("Blog uploaded successfully");
  cardParent.innerHTML += createdCard;
  blogError.innerHTML = "";
  blogTitle.value = "";
  blogDes.value = "";
  blogImg.value = "";
  isPrivate.checked = false;
  myModal.disabled = false;

  // var myModal = document.getElementById("myModal");
  // myModal.setAttribute("data-bs-dismiss", "modal");

  // myModal.hide();
  // $("#myModal").modal("hide");
  exampleModal.hide();
  preloader.style.display = "none";
}

function createCard(imgUrl, blogTitle, blogDes, uName, date, isPrivate, id) {
  var userLoginName = window.localStorage.getItem("user");
  userLoginName = JSON.parse(userLoginName);
  var privateVal = "";
  if (isPrivate) {
    privateVal = ` <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    style="width: 25px; height: 25px"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>`;
  } else {
    privateVal = "";
  }

  var createdCard = `<div class="card cards" style="width: 19rem">
    <img src=${imgUrl} class="card-img-top" style="height: 200px;" alt="..." />
    <div class="card-body d-flex flex-column justify-content-between gap-2">
      <div style="overflow-wrap: anywhere;">
        <div class="d-flex justify-content-between ">
          <h5 class="card-title">${blogTitle}</h5>
          ${privateVal}
        </div>
        <p class="card-text">${blogDes}</p>
      </div>
      <div>
        
        <hr class="m-2" />
        <div class="d-flex justify-content-between">
          <p class="m-0 italic">Created by ${uName}</p>
          <p class="m-0 italic">${date}</p>
        </div>
      </div>
    </div>
  </div>`;

  return createdCard;
}

function logoutFunc() {
  localStorage.clear();
  window.location.replace("../index.html");
}

// function editFunc(ele) {
//   console.log("edit", ele);
// }

// async function deleteFunc(ele) {
//   await deleteDoc(doc(db, "blogs", ele.id));
//   alert("Deleted Successfully");
//   pageLoad();
// }
// window.editFunc = editFunc;
// window.deleteFunc = deleteFunc;

async function imageUpload(file) {
  return new Promise(function (resolve, reject) {
    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: "image/jpeg",
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log("File available at", downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
}

window.addBlog = addBlog;
window.logoutFunc = logoutFunc;
window.validateAddBlog = validateAddBlog;
