firebase.auth().onAuthStateChanged(user => {
    if (user) {
        window.location.href = "/admin/";
    }
});

document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("email").value;
    const pass  = document.getElementById("password").value;

    try {
        await firebase.auth().signInWithEmailAndPassword(email, pass);
    } catch (e) {
        document.getElementById("error").innerText = e.message;
    }
};
