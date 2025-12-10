/* home.js — loads dynamic content for the index page */
/* Assumes firebase has been initialized via firebase-config.js */
try { firebase.initializeApp(window.firebaseConfig); } catch(e){}
const db = firebase.firestore();

/* Load banner (latest presentation) */
db.collection("presentation").orderBy("date","desc").limit(1)
  .onSnapshot(snap => {
    if(!snap.empty) {
      document.getElementById("bannerImage").src = snap.docs[0].data().url;
    }
  });

/* Load apropos (FR) */
db.collection('apropos').doc('infos').get().then(snap=>{
  if(!snap.exists) return;
  const d = snap.data(), lang = 'fr';
  document.getElementById('hist_content').innerHTML = d['historique_'+lang] || '—';
  document.getElementById('vision_content').innerHTML = d['vision_'+lang] || '—';
  document.getElementById('objectifs_content').innerHTML = d['objectifs_'+lang] || '—';
  document.getElementById('moyens_content').innerHTML = d['moyens_'+lang] || '—';
});

/* Load photos (home preview) */
db.collection('albums').doc('photos').collection('list').orderBy('date','desc').limit(8)
  .onSnapshot(snap=>{
    const out = [];
    snap.forEach(d=>{
      out.push(`<img src="${d.data().url}" style="width:100%;height:160px;border-radius:10px;object-fit:cover">`);
    });
    document.getElementById('homePhotos').innerHTML = out.join('');
  });

/* Load videos */
db.collection('albums').doc('videos').collection('list').orderBy('date','desc').limit(6)
  .onSnapshot(snap=>{
    const out = [];
    snap.forEach(d=>{
      out.push(`<iframe src="${d.data().url}" style="width:100%;height:180px;border-radius:12px;border:none"></iframe>`);
    });
    document.getElementById('homeVideos').innerHTML = out.join('');
  });

/* Slider (same photos) */
const slider = document.getElementById('slider');
let slideIndex = 0;
let slideCount = 0;

db.collection('albums').doc('photos').collection('list').orderBy('date','desc').limit(8)
  .get().then(snap=>{
    if(snap.empty){ slider.innerHTML = "<p style='color:#666'>Aucune image</p>"; return; }
    slider.innerHTML = snap.docs.map(d=>`<img src="${d.data().url}" class="slide" style="flex:0 0 100%;width:100%">`).join('');
    slideCount = snap.docs.length;
    if(slideCount > 1){
      setInterval(()=>{ slideIndex = (slideIndex + 1) % slideCount; slider.style.transform = `translateX(-${slideIndex * 100}%)`; }, 4000);
    }
  });

document.getElementById('slidePrev').onclick = ()=> { if(slideCount===0) return; slideIndex = (slideIndex - 1 + slideCount) % slideCount; slider.style.transform = `translateX(-${slideIndex * 100}%)`; };
document.getElementById('slideNext').onclick = ()=> { if(slideCount===0) return; slideIndex = (slideIndex + 1) % slideCount; slider.style.transform = `translateX(-${slideIndex * 100}%)`; };

/* Mobile menu toggle */
document.getElementById('btnMenu').onclick = ()=>{
  const nav = document.getElementById('mobileNav');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
};
