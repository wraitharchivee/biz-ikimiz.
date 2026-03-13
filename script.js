const firebaseConfig = {
  apiKey: "AIzaSyCPGow-3OQWOMpAN1X3O8OyKxP-ldFwjCA",
  authDomain: "mokmok-s.firebaseapp.com",
  databaseURL: "https://mokmok-s-default-rtdb.firebaseio.com",
  projectId: "mokmok-s",
  storageBucket: "mokmok-s.firebasestorage.app",
  messagingSenderId: "133265891997",
  appId: "1:133265891997:web:cbcc57323e368eecd36a74"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

let currentUser = "";
const passwords = { MokmokBey: "3091", Mokmokella: "1326" };

function selectUser(user) {
  currentUser = user;
  document.getElementById("userSelection").classList.add("hidden");
  document.getElementById("passwordArea").classList.remove("hidden");
  document.getElementById("selectedUserLabel").innerText =
    "Mokmoklan bakiiyimm.... " + user;
  document.getElementById("passInput").focus();
}

function checkPassword() {
  const input = document.getElementById("passInput").value;
  if (input === passwords[currentUser]) {
    document.getElementById("loginOverlay").style.display = "none";
    loadMessages();
  } else {
    const card = document.getElementById("loginCard");
    card.classList.add("shake");
    document.getElementById("errorMsg").classList.remove("hidden");
    setTimeout(() => {
      card.classList.remove("shake");
      document.getElementById("passInput").value = "";
    }, 400);
  }
}

function showPage(pageId, btn) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active-page"));
  document.getElementById(pageId).classList.add("active-page");
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active-nav"));
  btn.classList.add("active-nav");
}

function saveNote() {
  const input = document.getElementById("noteInput");
  const text = input.value.trim();
  if (!text) return;
  database.ref("notlar").push().set({
    sender: currentUser,
    icerik: text,
    tarih: Date.now()
  });
  input.value = "";
}

function loadMessages() {
  database.ref("notlar").on("value", (snapshot) => {
    const notesList = document.getElementById("notesList");
    const data = snapshot.val();
    if (data) {
      notesList.innerHTML = Object.values(data)
        .map((n) => {
          const isMe = n.sender === currentUser;
          return `
                    <div class="message ${isMe ? "sent" : "received"}">
                        <div class="text-[9px] font-bold mb-1 opacity-70">${
                          n.sender
                        }</div>
                        <div class="font-medium">${n.icerik}</div>
                    </div>
                `;
        })
        .join("");
      notesList.scrollTop = notesList.scrollHeight;
    }
  });
}

function rollMeal() {
  const yemekler = [
    " Pizza , Pizza , Pizza ",
    " Börgırrr Kinnggg",
    "Kremalı Mokmok Makarnası",
    "Lamacunnn",
    " Şuşhhhi",
    " Mokmok Döneerri",
    "Köfte Patateshhhhh"
  ];
  const display = document.getElementById("mealDisplay");
  display.innerText = "Hmmm mokmoklanıyorum... 🤔";
  setTimeout(() => {
    display.innerText = yemekler[Math.floor(Math.random() * yemekler.length)];
  }, 600);
}

document.getElementById("passInput").onkeypress = (e) => {
  if (e.key === "Enter") checkPassword();
};
document.getElementById("noteInput").onkeypress = (e) => {
  if (e.key === "Enter") saveNote();
};