const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

const region = "europe-west1";

// Charger config notifications
function getEmailConfig() {
  const cfg = functions.config().notifications || {};
  return {
    email: cfg.email || null,
    pass: cfg.pass || null,
    from: cfg.from || cfg.email || null
  };
}

// === ENVOI EMAIL ==========================
async function sendEmail(subject, html) {
  const cfg = getEmailConfig();
  if (!cfg.email || !cfg.pass) {
    functions.logger.warn("Email non configuré dans Firebase Config");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: cfg.email, pass: cfg.pass }
    });

    await transporter.sendMail({
      from: `"CHRISCO Notifications" <${cfg.from}>`,
      to: cfg.email,
      subject,
      html
    });

    functions.logger.log("Email envoyé ✔");
  } catch (err) {
    functions.logger.error("Erreur email", err);
  }
}

// === TRIGGER MESSAGE ==========================
exports.onNewMessage = functions.region(region).firestore
  .document("chats/{chatId}/messages/{msgId}")
  .onCreate(async (snap) => {
    const d = snap.data() || {};
    const from = d.from || "Visiteur";
    const text = d.text || "";

    await sendEmail(
      "📩 Nouveau message CHRISCO",
      `<p><strong>De :</strong> ${from}<br><strong>Message :</strong><br>${text.replace(/\n/g, "<br>")}</p>`
    );

    await db.collection("stats").doc("global").set({
      total_messages: admin.firestore.FieldValue.increment(1),
      last_message_at: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

// === TRIGGER PHOTO ==========================
exports.onNewPhoto = functions.region(region).firestore
  .document("albums/photos/list/{id}")
  .onCreate(async () => {
    await db.collection("stats").doc("global").set({
      total_uploads: admin.firestore.FieldValue.increment(1),
      last_upload_at: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

// === TRIGGER VIDEO ==========================
exports.onNewVideo = functions.region(region).firestore
  .document("albums/videos/list/{id}")
  .onCreate(async () => {
    await db.collection("stats").doc("global").set({
      total_uploads: admin.firestore.FieldValue.increment(1),
      last_upload_at: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

// === PUBLICATION APPROPOS ==========================
exports.publishContent = functions.region(region).firestore
  .document("apropos/draft")
  .onUpdate(async (change) => {
    await db.collection("apropos").doc("published").set(change.after.data());
  });

// === API STATS (AVEC CLÉ SECRÈTE) ==========================
exports.getStats = functions.region(region).https.onRequest(async (req, res) => {
  const key = functions.config().admin.key;

  if (!req.headers.authorization || req.headers.authorization !== `Bearer ${key}`) {
    return res.status(403).json({ ok: false, error: "Forbidden: Invalid key" });
  }

  try {
    const snap = await db.collection("stats").doc("global").get();
    return res.json({
      ok: true,
      stats: snap.exists ? snap.data() : {
        total_messages: 0,
        total_uploads: 0
      }
    });
  } catch (err) {
    functions.logger.error("Erreur getStats", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// === API PROGRAMME (semaine + événements) ==========================
exports.getProgramme = functions.region(region).https.onRequest(async (req, res) => {
  try {
    const semaineDoc = await db.collection("programme").doc("semaine").get();
    const eventsSnap = await db.collection("programme").doc("evenements").collection("events")
      .orderBy("date", "asc")
      .get();

    const semaine = semaineDoc.exists ? (semaineDoc.data().programmes || []) : [];
    const events = eventsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    res.set("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ semaine, events });

  } catch (err) {
    console.error("Erreur getProgramme:", err);
    return res.status(500).json({ error: err.message });
  }
});
