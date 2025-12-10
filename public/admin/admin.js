/* ============================================================
   admin.js — CHRISCO (VERSION FINALE - MODE 1 : STRICT ADMIN)
   - Requis: firebase-app-compat, firebase-auth-compat,
             firebase-firestore-compat, firebase-storage-compat
   - Assure-toi que firebase-config.js définit window.firebaseConfig
   ============================================================ */

(() => {
  // ---------- sanity check & init ----------
  if (!window.firebaseConfig) {
    alert("firebase-config.js manquant ou window.firebaseConfig non défini. Place firebase-config.js à la racine.");
    console.error("firebase-config missing");
    return;
  }

  try {
    if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
  } catch (e) {
    console.warn("Firebase init warning:", e.message || e);
  }

  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();

  // ---------- UI refs ----------
  const loginPage = document.getElementById("loginPage");
  const adminArea = document.getElementById("adminArea");
  const btnLogin = document.getElementById("btnLogin");
  const inputEmail = document.getElementById("adminEmail");
  const inputPass = document.getElementById("adminPass");
  const togglePwd = document.getElementById("togglePwd");
  const loginMsg = document.getElementById("loginMsg");
  const logoutBtn = document.getElementById("logoutBtn");
  const notifRoot = document.getElementById("notifRoot");

  // sidebar nav
  const navLinks = Array.from(document.querySelectorAll("aside.sidebar nav a[data-view]"));
  const views = Array.from(document.querySelectorAll("main .view"));

  // Dashboard elements
  const statMessages = document.getElementById("statMessages");
  const statUploads = document.getElementById("statUploads");
  const statLastMsg = document.getElementById("statLastMsg");
  const statLastUpload = document.getElementById("statLastUpload");
  const chartCtx = document.getElementById("chartMessages");

  // ABOUT
  const histContent = document.getElementById("histContent");
  const visionContent = document.getElementById("visionContent");
  const objectifsContent = document.getElementById("objectifsContent");
  const moyensContent = document.getElementById("moyensContent");
  const saveApropos = document.getElementById("saveApropos");

  // PROGRAMME
  const programmeContent = document.getElementById("programmeContent");
  const saveProgramme = document.getElementById("saveProgramme");

  // MINISTERES
  const minAddBtn = document.getElementById("min-add");
  const minName = document.getElementById("min-name");
  const minResp = document.getElementById("min-resp");
  const minContact = document.getElementById("min-contact");
  const minTableBody = document.querySelector("#minTable tbody");

  // ORGANIGRAMME
  const orgAddBtn = document.getElementById("org-add");
  const orgTitle = document.getElementById("org-title");
  const orgName = document.getElementById("org-name");
  const orgContact = document.getElementById("org-contact");
  const orgTableBody = document.querySelector("#orgTable tbody");

  // PHOTOS
  const photoFile = document.getElementById("photoFile");
  const photoUrl = document.getElementById("photoUrl");
  const photoAddBtn = document.getElementById("photoAdd");
  const photoGrid = document.getElementById("photoGrid");

  // VIDEOS
  const videoTitle = document.getElementById("videoTitle");
  const videoUrl = document.getElementById("videoUrl");
  const videoAddBtn = document.getElementById("videoAdd");
  const videoGrid = document.getElementById("videoGrid");

  // ECOLE
  const ecoleContent = document.getElementById("ecoleContent");
  const saveEcole = document.getElementById("saveEcole");

  // GROUPES
  const groupesContent = document.getElementById("groupesContent");
  const saveGroupes = document.getElementById("saveGroupes");

  // IMPLANTATIONS
  const impAdd = document.getElementById("impAdd");
  const impName = document.getElementById("imp-name");
  const impAddress = document.getElementById("imp-address");
  const impContact = document.getElementById("imp-contact");
  const impTableBody = document.querySelector("#impTable tbody");

  // CHRISCO TV
  const tvTitleEl = document.getElementById("tvTitle");
  const tvUrlEl = document.getElementById("tvUrl");
  const tvAdd = document.getElementById("tvAdd");
  const tvGrid = document.getElementById("tvGrid");

  // CHAT
  const chatList = document.getElementById("chatList");

  // PARAMS
  const cfgAdminKey = document.getElementById("cfgAdminKey");
  const cfgEmail = document.getElementById("cfgEmail");
  const cfgPass = document.getElementById("cfgPass");
  const cfgSave = document.getElementById("cfgSave");

  // helper: show notification
  function notify(msg, timeout = 2500) {
    if (!notifRoot) return;
    const el = document.createElement("div");
    el.className = "notif";
    el.innerText = msg;
    notifRoot.appendChild(el);
    setTimeout(() => el.remove(), timeout);
  }

  // ---------- AUTH helpers for roles ----------
  // async check for custom claim `admin: true`
  async function isAdminUser() {
    const user = auth.currentUser;
    if (!user) return false;
    // refresh token to be safe (optional):
    // await user.getIdToken(true);
    const token = await user.getIdTokenResult();
    return token.claims && token.claims.admin === true;
  }

  // secureWrite wrapper for all writes
  async function secureWrite(action) {
    if (!(await isAdminUser())) {
      alert("⛔ Vous n'êtes pas autorisé à effectuer cette action.");
      return false;
    }
    await action();
    return true;
  }

  // ---------- AUTH UI ----------
  togglePwd?.addEventListener("click", () => {
    if (!inputPass) return;
    inputPass.type = inputPass.type === "password" ? "text" : "password";
    togglePwd.innerText = inputPass.type === "password" ? "👁️" : "🙈";
  });

 btnLogin?.addEventListener("click", async () => {
    if (loginLocked) {
        loginMsg.innerText = "⛔ Attendez 30 secondes avant de réessayer.";
        return;
    }

    const email = inputEmail.value.trim();
    const pass = inputPass.value;

    if (!email || !pass) {
        loginMsg.innerText = "Email et mot de passe requis.";
        return;
    }

    try {
        loginMsg.innerText = "Connexion…";
        await auth.signInWithEmailAndPassword(email, pass);

        const adminOk = await isAdminUser();
        if (!adminOk) {
            throw new Error("Vous n'êtes pas administrateur.");
        }

        loginAttempts = 0; // reset
        loginMsg.innerText = "";

    } catch (err) {
        loginAttempts++;
        loginMsg.innerText = "Erreur : " + err.message;

        // trop d’essais ?
        if (loginAttempts >= 5) {
            lockLogin();
        }
    }
});

  logoutBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await auth.signOut();
    } catch (err) {
      console.error("Logout error", err);
    }
  });

  // ================================
//  Anti brute-force login
// ================================
let loginAttempts = 0;
let loginLocked = false;

function lockLogin() {
    loginLocked = true;
    loginMsg.innerText = "⛔ Trop de tentatives. Réessayez dans 30 secondes.";
    setTimeout(() => {
        loginAttempts = 0;
        loginLocked = false;
        loginMsg.innerText = "";
    }, 30000);
}


  // ---------- AUTH state + block non-admin ----------
  auth.onAuthStateChanged(async user => {
    if (!user) {
      loginPage.style.display = "block";
      adminArea.style.display = "none";
      return;
        await logAdminLogin();
    }

    // check admin claim
    const admin = await isAdminUser();
    if (!admin) {
      loginMsg.innerText = "⛔ Accès refusé : vous n'êtes pas administrateur.";
      // force sign out to clear session
      try { await auth.signOut(); } catch (e) { /* ignore */ }
      loginPage.style.display = "block";
      adminArea.style.display = "none";
      return;
    }

    // admin => show panel
    loginPage.style.display = "none";
    adminArea.style.display = "flex";

    // load default view
    loadInitial();
  });

  async function logAdminLogin() {
    const user = auth.currentUser;
    if (!user) return;

    await db.collection("admin_logs").add({
        uid: user.uid,
        email: user.email,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent
    });
}


  // ---------- NAV & VIEWS ----------
  function showView(name) {
    navLinks.forEach(a => a.classList.remove("active"));
    const link = navLinks.find(a => a.dataset.view === name);
    if (link) link.classList.add("active");

    views.forEach(v => v.style.display = "none");
    const el = document.getElementById("view-" + name);
    if (el) el.style.display = "block";

    switch (name) {
      case "dashboard": loadDashboard(); break;
      case "apropos": loadApropos(); break;
      case "programme": loadProgramme(); break;
      case "ministeres": loadMinisteres(); break;
      case "organigramme": loadOrganigramme(); break;
      case "photos": loadPhotos(); break;
      case "videos": loadVideos(); break;
      case "ecole": loadEcole(); break;
      case "groupes": loadGroupes(); break;
      case "implantations": loadImplantations(); break;
      case "chrisco-tv": loadChriscoTV(); break;
      case "chat": loadChat(); break;
      case "params": loadParams(); break;
      case "admin-logs": loadAdminLogs(); break;

    }
  }

  navLinks.forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const v = a.dataset.view;
      showView(v);
    });
  });

  function loadInitial() {
    const active = navLinks.find(a => a.classList.contains("active"));
    const view = active ? active.dataset.view : "dashboard";
    showView(view);
  }

  // ---------- DASHBOARD ----------
  let messagesChart = null;
  async function loadDashboard() {
    try {
      const msgsSnap = await db.collection("messages").get().catch(()=>({ empty: true }));
      const msgsCount = msgsSnap && !msgsSnap.empty ? msgsSnap.size : 0;
      statMessages.innerText = msgsCount;

      const photosSnap = await db.collection("albums").doc("photos").collection("list").get().catch(()=>({ empty: true }));
      const videosSnap = await db.collection("albums").doc("videos").collection("list").get().catch(()=>({ empty: true }));
      const uploadsCount = (photosSnap?.size || 0) + (videosSnap?.size || 0);
      statUploads.innerText = uploadsCount;

      const lastMsgSnap = await db.collection("messages").orderBy("createdAt","desc").limit(1).get().catch(()=>({ empty:true }));
      if (!lastMsgSnap || lastMsgSnap.empty) statLastMsg.innerText = "—";
      else {
        const d = lastMsgSnap.docs[0].data();
        statLastMsg.innerText = (d.name || d.email || "visiteur") + " • " + (d.createdAt && d.createdAt.toDate ? d.createdAt.toDate().toLocaleString() : "");
      }

      const lastPhoto = await db.collection("albums").doc("photos").collection("list").orderBy("date","desc").limit(1).get().catch(()=>({ empty:true }));
      const lastVideo = await db.collection("albums").doc("videos").collection("list").orderBy("date","desc").limit(1).get().catch(()=>({ empty:true }));
      let lastUploadText = "—";
      if (lastPhoto && !lastPhoto.empty) {
        const d = lastPhoto.docs[0].data();
        lastUploadText = (d.titre || "photo") + " • " + (d.date && d.date.toDate ? d.date.toDate().toLocaleString() : "");
      } else if (lastVideo && !lastVideo.empty) {
        const d = lastVideo.docs[0].data();
        lastUploadText = (d.titre || "vidéo") + " • " + (d.date && d.date.toDate ? d.date.toDate().toLocaleString() : "");
      }
      statLastUpload.innerText = lastUploadText;

      // chart: messages by day (last 7 days)
      const now = Date.now();
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now - i * 86400000);
        days.push(d);
      }
      const start = new Date(days[0].getFullYear(), days[0].getMonth(), days[0].getDate(), 0,0,0);
      const msgs7 = await db.collection("messages").where("createdAt", ">=", firebase.firestore.Timestamp.fromDate(start)).get().catch(()=>({ empty:true }));
      const counts = Array(7).fill(0);
      if (msgs7 && !msgs7.empty) {
        msgs7.docs.forEach(doc => {
          const d = doc.data().createdAt && doc.data().createdAt.toDate ? doc.data().createdAt.toDate() : null;
          if (!d) return;
          const diff = Math.floor((d - start) / 86400000);
          if (diff >= 0 && diff < 7) counts[diff]++;
        });
      }
      const labels = days.map(d => d.toLocaleDateString());
      if (messagesChart) messagesChart.destroy();
      messagesChart = new Chart(chartCtx, {
        type: 'line',
        data: {
          labels,
          datasets: [{ label: "Messages", data: counts, fill: true, tension: 0.3 }]
        },
        options: { plugins:{ legend:{display:false} }, scales:{ y:{ beginAtZero:true, precision:0 }} }
      });
    } catch (e) {
      console.error("loadDashboard error", e);
    }
  }

  // ---------- A PROPOS ----------
  async function loadApropos() {
    try {
      const doc = await db.collection("apropos").doc("infos").get().catch(()=>({ exists:false }));
      if (!doc || !doc.exists) {
        histContent.value = visionContent.value = objectifsContent.value = moyensContent.value = "";
        return;
      }
      const d = doc.data();
      histContent.value = d.historiqueHtml_fr || d.historiqueHtml || "";
      visionContent.value = d.visionHtml_fr || d.visionHtml || "";
      objectifsContent.value = d.objectifsHtml_fr || d.objectifsHtml || "";
      moyensContent.value = d.moyensHtml_fr || d.moyensHtml || "";
    } catch (e) {
      console.error("loadApropos", e);
    }
  }

  saveApropos?.addEventListener("click", async () => {
    await secureWrite(async () => {
      await db.collection("apropos").doc("infos").set({
        historiqueHtml_fr: histContent.value,
        visionHtml_fr: visionContent.value,
        objectifsHtml_fr: objectifsContent.value,
        moyensHtml_fr: moyensContent.value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      notify("À propos enregistré");
    });
  });
saveProgramme.onclick = async () => {
    await secureWrite(async () => {

        const raw = programmeContent.value.trim();
        const lines = raw.split("\n").filter(l => l.trim() !== "");

        const programmes = lines.map(l => {
            const parts = l.split("|");
            return {
                jour: parts[0]?.trim(),
                heure: parts[1]?.trim(),
                titre: parts[2]?.trim(),
                icon: parts[3]?.trim() || "default"
            };
        });

        await db.collection("programme").doc("semaine").set({
            programmes,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        notify("Programme (semaine) enregistré !");
    });
};

/* === Helpers pour Programme/Events === */
function normalizeHour(h) {
  return (h || "").trim();
}

function renderEvtAdminList(items) {
  const container = document.getElementById("evtAdminList");
  if (!items || items.length === 0) {
    container.innerHTML = "<div class='muted'>Aucun événement spécial</div>";
    return;
  }
  container.innerHTML = items.map(e => `
    <div style="padding:8px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
      <div>
        <strong>${escapeHtml(e.titre)}</strong><br>
        <small>${escapeHtml(e.date)} • ${escapeHtml(e.heure)}</small>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn-gold evt-edit" data-id="${e.id}">✏️</button>
        <button class="btn-danger evt-del" data-id="${e.id}">🗑️</button>
      </div>
    </div>
  `).join("");

  // wire actions
  Array.from(container.querySelectorAll(".evt-del")).forEach(b=>{
    b.addEventListener("click", async ()=> {
      const id = b.dataset.id;
      if (!confirm("Supprimer cet événement ?")) return;
      await secureWrite(async () => {
        await db.collection("programme").doc("evenements").collection("events").doc(id).delete();
      });
      notify("Événement supprimé");
      loadEvenementsAdmin();
      loadCalendarPro(); // refresh calendar
    });
  });

  Array.from(container.querySelectorAll(".evt-edit")).forEach(b=>{
    b.addEventListener("click", async ()=> {
      const id = b.dataset.id;
      const doc = await db.collection("programme").doc("evenements").collection("events").doc(id).get();
      if (!doc.exists) return alert("Document introuvable");
      const d = doc.data();
      document.getElementById("evtTitle").value = d.titre || "";
      document.getElementById("evtDate").value = d.date || "";
      document.getElementById("evtHour").value = d.heure || "";
      document.getElementById("evtIcon").value = d.icon || "";
      // store editing id
      document.getElementById("evtAddBtn").dataset.editing = id;
    });
  });
}
// Ajout ligne unique au tableau 'semaine' (programme.semaine.programmes -> array)
document.getElementById("progAddBtn").addEventListener("click", async () => {
  await secureWrite(async () => {
    const jour = document.getElementById("progDay").value;
    const heure = normalizeHour(document.getElementById("progHour").value);
    const titre = document.getElementById("progTitle").value.trim();
    const icon = document.getElementById("progIcon").value.trim() || "default";
    if (!titre) return alert("Titre requis");

    // push item into array (transaction safe)
    const ref = db.collection("programme").doc("semaine");
    await db.runTransaction(async tx => {
      const snap = await tx.get(ref);
      const data = snap.exists ? (snap.data().programmes || []) : [];
      data.push({ jour, heure, titre, icon });
      tx.set(ref, { programmes: data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
    });

    // clear
    document.getElementById("progHour").value = "";
    document.getElementById("progTitle").value = "";
    notify("Programme ajouté à la semaine");
    loadProgrammeSemaineAdmin(); // refresh UI admin list (below)
    loadProgrammeFront(); // optional: refresh public page if open
  });
});

// clear fields
document.getElementById("progClearBtn").addEventListener("click", ()=> {
  document.getElementById("progHour").value = "";
  document.getElementById("progTitle").value = "";
  document.getElementById("progIcon").value = "";
});
// Add / update event
document.getElementById("evtAddBtn").addEventListener("click", async () => {
  await secureWrite(async () => {
    const titre = document.getElementById("evtTitle").value.trim();
    const date = document.getElementById("evtDate").value;
    const heure = document.getElementById("evtHour").value.trim();
    const icon = document.getElementById("evtIcon").value.trim() || "event";
    if (!titre || !date) return alert("Titre et date requis");

    const editingId = document.getElementById("evtAddBtn").dataset.editing;
    if (editingId) {
      await db.collection("programme").doc("evenements").collection("events").doc(editingId).set({
        titre, date, heure, icon, updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge:true });
      delete document.getElementById("evtAddBtn").dataset.editing;
      notify("Événement mis à jour");
    } else {
      await db.collection("programme").doc("evenements").collection("events").add({
        titre, date, heure, icon, createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      notify("Événement ajouté");
    }
    // clear
    document.getElementById("evtTitle").value = "";
    document.getElementById("evtDate").value = "";
    document.getElementById("evtHour").value = "";
    document.getElementById("evtIcon").value = "";
    loadEvenementsAdmin();
    loadCalendarPro();
  });
});

// list admin events
async function loadEvenementsAdmin() {
  const col = db.collection("programme").doc("evenements").collection("events").orderBy("date","asc");
  const snap = await col.get();
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderEvtAdminList(items);
}



  // ---------- MINISTERES ----------
  async function loadMinisteres() {
    try {
      const snap = await db.collection("ministeres").orderBy("date","desc").get().catch(()=>({ empty:true }));
      if (!snap || snap.empty) { minTableBody.innerHTML = "<tr><td colspan='4'>Aucun ministère</td></tr>"; return; }
      minTableBody.innerHTML = snap.docs.map(doc => {
        const d = doc.data();
        const id = doc.id;
        return `<tr data-id="${id}">
          <td>${escapeHtml(d.nom||"")}</td>
          <td>${escapeHtml(d.responsable||"")}</td>
          <td>${escapeHtml(d.contact||"")}</td>
          <td>
            <button class="min-delete" data-id="${id}">Supprimer</button>
          </td>
        </tr>`;
      }).join("");
      Array.from(minTableBody.querySelectorAll(".min-delete")).forEach(b => {
        b.addEventListener("click", async () => {
          const id = b.dataset.id;
          await secureWrite(async () => {
            if (!confirm("Supprimer ce ministère ?")) return;
            await db.collection("ministeres").doc(id).delete();
            notify("Ministère supprimé");
            loadMinisteres();
          });
        });
      });
    } catch (e) { console.error("loadMinisteres", e); minTableBody.innerHTML = "<tr><td colspan='4'>Erreur</td></tr>"; }
  }

  minAddBtn?.addEventListener("click", async () => {
    await secureWrite(async () => {
      const nom = minName.value.trim();
      if (!nom) return alert("Nom requis");
      await db.collection("ministeres").add({ nom, responsable: minResp.value.trim(), contact: minContact.value.trim(), date: firebase.firestore.FieldValue.serverTimestamp() });
      minName.value = minResp.value = minContact.value = "";
      notify("Ministère ajouté");
      loadMinisteres();
    });
  });

  // ---------- ORGANIGRAMME ----------
  async function loadOrganigramme() {
    try {
      const snap = await db.collection("organigramme").orderBy("date","desc").get().catch(()=>({ empty:true }));
      if (!snap || snap.empty) { orgTableBody.innerHTML = "<tr><td colspan='4'>Vide</td></tr>"; return; }
      orgTableBody.innerHTML = snap.docs.map(doc => {
        const d = doc.data(); const id = doc.id;
        return `<tr data-id="${id}">
          <td>${escapeHtml(d.poste||"")}</td>
          <td>${escapeHtml(d.nom||"")}</td>
          <td>${escapeHtml(d.contact||"")}</td>
          <td><button class="org-delete" data-id="${id}">Supprimer</button></td>
        </tr>`;
      }).join("");
      Array.from(orgTableBody.querySelectorAll(".org-delete")).forEach(b => {
        b.addEventListener("click", async () => {
          await secureWrite(async () => {
            if (!confirm("Supprimer cet élément ?")) return;
            await db.collection("organigramme").doc(b.dataset.id).delete();
            notify("Suppression effectuée");
            loadOrganigramme();
          });
        });
      });
    } catch (e) { console.error("loadOrganigramme", e); orgTableBody.innerHTML = "<tr><td colspan='4'>Erreur</td></tr>"; }
  }

  orgAddBtn?.addEventListener("click", async () => {
    await secureWrite(async () => {
      const poste = orgTitle.value.trim();
      if (!poste) return alert("Poste requis");
      await db.collection("organigramme").add({ poste, nom: orgName.value.trim(), contact: orgContact.value.trim(), date: firebase.firestore.FieldValue.serverTimestamp() });
      orgTitle.value = orgName.value = orgContact.value = "";
      notify("Poste ajouté");
      loadOrganigramme();
    });
  });

  // ---------- PHOTOS ----------
  async function loadPhotos() {
    try {
      const snap = await db.collection('albums').doc('photos').collection('list').orderBy('date','desc').get().catch(()=>({ empty:true }));
      if (!snap || snap.empty) { photoGrid.innerHTML = "<p>Aucune photo</p>"; return; }
      photoGrid.innerHTML = snap.docs.map(doc => {
        const d = doc.data(); const id = doc.id;
        return `<div class="photo-card" data-id="${id}" style="display:inline-block;margin:6px">
          <img src="${escapeHtml(d.url)}" style="width:150px;height:100px;object-fit:cover;border-radius:8px"><br>
          <small>${escapeHtml(d.titre||'')}</small><br>
          <button class="photo-delete" data-id="${id}">Supprimer</button>
        </div>`;
      }).join("");
      Array.from(photoGrid.querySelectorAll(".photo-delete")).forEach(b => {
        b.addEventListener("click", async () => {
          const id = b.dataset.id;
          await secureWrite(async () => {
            if (!confirm("Supprimer la photo (doc Firestore uniquement) ?")) return;
            await db.collection('albums').doc('photos').collection('list').doc(id).delete();
            notify("Photo supprimée (Firestore)");
            loadPhotos();
          });
        });
      });
    } catch (e) { console.error("loadPhotos", e); photoGrid.innerHTML = "<p>Erreur</p>"; }
  }

  photoAddBtn?.addEventListener("click", async () => {
    await secureWrite(async () => {
      const file = photoFile.files && photoFile.files[0];
      const urlDirect = photoUrl.value.trim();
      if (!file && !urlDirect) return alert("Choisir un fichier ou coller une URL");
      if (file) {
        const path = `albums/photos/${Date.now()}_${file.name.replace(/\s+/g,'_')}`;
        const ref = storage.ref(path);
        const snap = await ref.put(file);
        const url = await snap.ref.getDownloadURL();
        await db.collection('albums').doc('photos').collection('list').add({ url, titre: file.name, date: firebase.firestore.FieldValue.serverTimestamp() });
      } else {
        await db.collection('albums').doc('photos').collection('list').add({ url: urlDirect, titre: urlDirect.split("/").pop(), date: firebase.firestore.FieldValue.serverTimestamp() });
      }
      photoFile.value = "";
      photoUrl.value = "";
      loadPhotos();
      notify("Photo ajoutée");
    });
  });

  // ---------- VIDEOS ----------
  async function loadVideos() {
    try {
      const snap = await db.collection('albums').doc('videos').collection('list').orderBy('date','desc').get().catch(()=>({ empty:true }));
      if (!snap || snap.empty) { videoGrid.innerHTML = "<p>Aucune vidéo</p>"; return; }
      videoGrid.innerHTML = snap.docs.map(doc => {
        const d = doc.data(); const id = doc.id;
        const embed = convertToEmbed(d.url || d.rawUrl || "");
        return `<div style="display:inline-block;width:320px;margin:8px">
          <iframe src="${embed}" style="width:100%;height:180px;border-radius:8px" allowfullscreen></iframe>
          <div><small>${escapeHtml(d.titre||"")}</small></div>
          <button class="video-delete" data-id="${id}">Supprimer</button>
        </div>`;
      }).join("");
      Array.from(videoGrid.querySelectorAll(".video-delete")).forEach(b => {
        b.addEventListener("click", async () => {
          const id = b.dataset.id;
          await secureWrite(async () => {
            if (!confirm("Supprimer la vidéo ?")) return;
            await db.collection('albums').doc('videos').collection('list').doc(id).delete();
            notify("Vidéo supprimée");
            loadVideos();
          });
        });
      });
    } catch (e) { console.error("loadVideos", e); videoGrid.innerHTML = "<p>Erreur</p>"; }
  }

  videoAddBtn?.addEventListener("click", async () => {
    await secureWrite(async () => {
      const titre = videoTitle.value.trim(); const url = videoUrl.value.trim();
      if (!url) return alert("URL requise");
      await db.collection('albums').doc('videos').collection('list').add({ titre, url, date: firebase.firestore.FieldValue.serverTimestamp() });
      videoTitle.value = videoUrl.value = "";
      loadVideos();
      notify("Vidéo ajoutée");
    });
  });

  // ---------- ECOLE BIBLIQUE ----------
  async function loadEcole() {
    try {
      const snap = await db.collection("ecole_biblique").doc("infos").get().catch(()=>({ exists:false }));
      ecoleContent.value = snap && snap.exists ? (snap.data().text || "") : "";
    } catch (e) { console.error("loadEcole", e); }
  }

  saveEcole?.addEventListener("click", async () => {
    await secureWrite(async () => {
      await db.collection("ecole_biblique").doc("infos").set({ text: ecoleContent.value, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge:true });
      notify("École biblique enregistrée");
    });
  });

  // ---------- GROUPES ----------
  async function loadGroupes() {
    try {
      const snap = await db.collection("groupes").doc("infos").get().catch(()=>({ exists:false }));
      groupesContent.value = snap && snap.exists ? (snap.data().text || "") : "";
    } catch (e) { console.error("loadGroupes", e); }
  }

  saveGroupes?.addEventListener("click", async () => {
    await secureWrite(async () => {
      await db.collection("groupes").doc("infos").set({ text: groupesContent.value, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge:true });
      notify("Groupes enregistrés");
    });
  });

  // ---------- IMPLANTATIONS ----------
  async function loadImplantations() {
    try {
      const snap = await db.collection("implantations").orderBy("date","desc").get();
      if (!snap || snap.empty) { impTableBody.innerHTML = "<tr><td colspan='4'>Aucune implantation</td></tr>"; return; }
      impTableBody.innerHTML = snap.docs.map(doc => {
        const d = doc.data(); const id = doc.id;
        return `<tr data-id="${id}">
          <td>${escapeHtml(d.nom||"")}</td>
          <td>${escapeHtml(d.adresse||"")}</td>
          <td>${escapeHtml(d.contact||"")}</td>
          <td><button class="imp-delete" data-id="${id}">Supprimer</button></td>
        </tr>`;
      }).join("");
      Array.from(impTableBody.querySelectorAll(".imp-delete")).forEach(b => {
        b.addEventListener("click", async () => {
          const id = b.dataset.id;
          await secureWrite(async () => {
            if (!confirm("Supprimer cette implantation ?")) return;
            await db.collection("implantations").doc(id).delete();
            notify("Supprimé");
            loadImplantations();
          });
        });
      });
    } catch (e) { console.error("loadImplantations", e); impTableBody.innerHTML = "<tr><td colspan='4'>Erreur</td></tr>"; }
  }

  impAdd?.addEventListener("click", async () => {
    await secureWrite(async () => {
      const nom = impName.value.trim();
      if (!nom) return alert("Nom requis");
      await db.collection("implantations").add({ nom, adresse: impAddress.value.trim(), contact: impContact.value.trim(), date: firebase.firestore.FieldValue.serverTimestamp() });
      impName.value = impAddress.value = impContact.value = "";
      notify("Implantation ajoutée");
      loadImplantations();
    });
  });

  // ---------- CHRISCO TV ----------
  async function loadChriscoTV() {
    try {
      const snap = await db.collection("chrisco_tv").orderBy("date","desc").get();
      if (!snap || snap.empty) { tvGrid.innerHTML = "<p>Aucune émission</p>"; return; }
      tvGrid.innerHTML = snap.docs.map(doc => {
        const d = doc.data(); const id = doc.id;
        return `<div style="display:inline-block;width:320px;margin:8px">
          <iframe src="${convertToEmbed(d.url||'')}" style="width:100%;height:180px;border-radius:8px" allowfullscreen></iframe>
          <div><small>${escapeHtml(d.title||'')}</small></div>
          <button class="tv-delete" data-id="${id}">Supprimer</button>
        </div>`;
      }).join("");
      Array.from(tvGrid.querySelectorAll(".tv-delete")).forEach(b => {
        b.addEventListener("click", async () => {
          const id = b.dataset.id;
          await secureWrite(async () => {
            if (!confirm("Supprimer cet item TV ?")) return;
            await db.collection("chrisco_tv").doc(id).delete();
            notify("Supprimé");
            loadChriscoTV();
          });
        });
      });
    } catch (e) { console.error("loadChriscoTV", e); tvGrid.innerHTML = "<p>Erreur</p>"; }
  }

  tvAdd?.addEventListener("click", async () => {
    await secureWrite(async () => {
      if (!tvUrlEl.value.trim()) return alert("URL requise");
      await db.collection("chrisco_tv").add({ title: tvTitleEl.value.trim(), url: tvUrlEl.value.trim(), date: firebase.firestore.FieldValue.serverTimestamp() });
      tvTitleEl.value = tvUrlEl.value = "";
      notify("CHRISCO TV ajouté");
      loadChriscoTV();
    });
  });

  // ---------- CHAT / MESSAGES (read only for admin in panel) ----------
  async function loadChat() {
    try {
      db.collection("chat").orderBy("createdAt","desc").limit(50).onSnapshot(snap => {
        if (!snap || snap.empty) { chatList.innerHTML = "<p>Aucun message</p>"; return; }
        chatList.innerHTML = snap.docs.map(doc => {
          const d = doc.data();
          const when = d.createdAt && d.createdAt.toDate ? d.createdAt.toDate().toLocaleString() : "";
          return `<div class="chat-item" style="padding:8px;border-bottom:1px solid #eee">
            <strong>${escapeHtml(d.name || d.email || "Anonyme")}</strong> <small>${when}</small>
            <div>${escapeHtml(d.text||"")}</div>
          </div>`;
        }).join("");
      });
    } catch (e) { console.error("loadChat", e); chatList.innerHTML = "<p>Erreur</p>"; }
  }

  // ---------- PARAMS ----------
  function loadParams() {
    cfgAdminKey.value = localStorage.getItem("cfgAdminKey") || "";
    cfgEmail.value = localStorage.getItem("cfgEmail") || "";
    cfgPass.value = "";
  }
  cfgSave?.addEventListener("click", () => {
    localStorage.setItem("cfgAdminKey", cfgAdminKey.value.trim());
    localStorage.setItem("cfgEmail", cfgEmail.value.trim());
    notify("Paramètres sauvegardés localement");
  });

  // ---------- UTIL helpers ----------
  function escapeHtml(s) { return (s||'').toString().replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
  function convertToEmbed(url) {
    try {
      if (!url) return "";
      if (url.includes("youtube.com/watch")) return "https://www.youtube.com/embed/" + new URL(url).searchParams.get("v");
      if (url.includes("youtu.be/")) return "https://www.youtube.com/embed/" + url.split("youtu.be/")[1].split(/[?&]/)[0];
      return url;
    } catch (e) { return url; }
  }

  // auto-refresh visible views occasionally
  setInterval(() => {
    const dash = document.getElementById("view-dashboard");
    if (dash && dash.style.display !== "none") loadDashboard();
    const photos = document.getElementById("view-photos");
    if (photos && photos.style.display !== "none") loadPhotos();
    const vids = document.getElementById("view-videos");
    if (vids && vids.style.display !== "none") loadVideos();
  }, 60000);

  // expose debug functions
  window.__chrisco_admin = {
    isAdminUser, secureWrite, loadDashboard, loadApropos, loadProgramme,
    loadMinisteres, loadOrganigramme, loadPhotos, loadVideos, loadEcole,
    loadGroupes, loadImplantations, loadChriscoTV, loadChat
  };

})();
const resetAdminPassword = document.getElementById("resetAdminPassword");
resetAdminPassword.addEventListener("click", async () => {
    await secureWrite(async () => {
        const email = auth.currentUser.email;

        if (!email) {
            alert("Impossible de récupérer votre email admin.");
            return;
        }

        try {
            await auth.sendPasswordResetEmail(email);
            notify("✔ Email de réinitialisation envoyé à : " + email);
        } catch (err) {
            console.error(err);
            alert("Erreur : " + err.message);
        }
    });
});

async function loadAdminLogs() {
    const logsDiv = document.getElementById("adminLogs");
    const snap = await db.collection("admin_logs").orderBy("date", "desc").limit(50).get();

    if (snap.empty) {
        logsDiv.innerHTML = "<p>Aucune connexion enregistrée.</p>";
        return;
    }

    logsDiv.innerHTML = snap.docs.map(doc => {
        const d = doc.data();
        return `
            <div style="border-bottom:1px solid #eee;padding:8px;">
                <strong>${d.email}</strong> — ${d.date.toDate().toLocaleString()}
                <br><span style="font-size:12px;color:#666">${d.userAgent}</span>
            </div>
        `;
    }).join("");
}

// ---------------------------
//  INBOX PRO CHRISCO
// ---------------------------



// LISTE DES UTILISATEURS
db.collection("chat").onSnapshot((snapshot) => {
  const users = [];
  snapshot.forEach((doc) => {
    users.push(doc.id);
  });

  displayUsers(users);
});

function displayUsers(users) {
  const container = document.getElementById("usersList");
  container.innerHTML = "";

  users.forEach((u) => {
    const btn = document.createElement("div");
    btn.className = "user-btn";
    btn.innerHTML = `
      <div style="padding:10px; border-bottom:1px solid #eee; cursor:pointer">
        <strong>${u}</strong><br>
        <small style="opacity:0.6">Voir messages</small>
      </div>
    `;
    btn.onclick = () => loadConversation(u);
    container.appendChild(btn);
  });
}
// -----------------------------
//  INBOX PRO — CHRISCO ADMIN
// -----------------------------

let selectedUser = null;

// LISTE DES CONVERSATIONS
db.collection("chat").onSnapshot(async (snap) => {
  const users = [];

  for (let doc of snap.docs) {
    const userId = doc.id;

    // Récup dernier message
    const msgSnap = await db.collection("chat")
      .doc(userId)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .limit(1)
      .get();

    const lastMsg = msgSnap.empty ? null : msgSnap.docs[0].data();

    users.push({
      userId,
      lastMsgText: lastMsg?.text || "",
      lastMsgTime: lastMsg?.timestamp?.toDate() || null,
      unread: lastMsg?.sender === "user" && !lastMsg.read
    });
  }

  // Trie par dernier message récent
  users.sort((a, b) => (b.lastMsgTime || 0) - (a.lastMsgTime || 0));

  displayUserList(users);
});

// AFFICHAGE LISTE UTILISATEURS
function displayUserList(list) {
  const container = document.getElementById("usersList");
  container.innerHTML = "";

  list.forEach((u) => {
    const row = document.createElement("div");
    row.className = "user-row";

    row.innerHTML = `
      <div class="user-avatar">${u.userId[5] || "?"}</div>
      <div class="user-info">
        <div class="user-name">${u.userId}</div>
        <div class="user-last">${u.lastMsgText.slice(0, 25)}...</div>
      </div>
      ${u.unread ? `<span class="badge-new">Nouveau</span>` : ""}
    `;

    row.onclick = () => openConversation(u.userId);
    container.appendChild(row);
  });
}

// OUVRIR UNE CONVERSATION
function openConversation(userId) {
  selectedUser = userId;
  document.getElementById("chatHeader").textContent = "Utilisateur : " + userId;

  db.collection("chat")
    .doc(userId)
    .collection("messages")
    .orderBy("timestamp", "asc")
    .onSnapshot((snap) => {
      const msgs = [];
      snap.forEach((m) => msgs.push(m.data()));
      displayMessages(msgs, userId);
    });

  // Marquer comme lu :
  db.collection("chat").doc(userId).update({
    lastSeen: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// AFFICHAGE MESSAGES
function displayMessages(msgs) {
  const box = document.getElementById("messagesList");
  box.innerHTML = "";

  msgs.forEach((m) => {
    const msg = document.createElement("div");
    msg.className = "msg-item " + (m.sender === "admin" ? "msg-admin" : "msg-user");
    msg.textContent = m.text;
    box.appendChild(msg);
  });

  box.scrollTop = box.scrollHeight;
}

// ENVOI ADMIN
document.getElementById("sendAdminMsg").onclick = async () => {
  const text = document.getElementById("adminMsg").value.trim();
  if (!text || !selectedUser) return;

  await db.collection("chat")
    .doc(selectedUser)
    .collection("messages")
    .add({
      sender: "admin",
      text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      read: true
    });

  document.getElementById("adminMsg").value = "";
};
