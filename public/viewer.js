const db = firebase.firestore();

db.collection("site").doc("home").onSnapshot(doc => {
    if (!doc.exists) return;

    const data = doc.data();

    document.getElementById("titre").innerText = data.titre;
    document.getElementById("description").innerText = data.description;
    document.getElementById("hero").src = data.imageHero;

    const programmeList = document.getElementById("programme");
    programmeList.innerHTML = "";
    
    if (Array.isArray(data.programme)) {
        data.programme.forEach(item => {
            const li = document.createElement("li");
            li.innerText = item;
            programmeList.appendChild(li);
        });
    }
});
