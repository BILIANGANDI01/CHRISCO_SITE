import { useEffect, useState } from 'react';
import { auth } from '../../lib/firebaseClient';
import { getIdTokenResult } from "firebase/auth";

export default function Admin(){
  const [allowed, setAllowed] = useState(false);

  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(async u => {
      if(!u) { setAllowed(false); return; }
      const token = await getIdTokenResult(u, true);
      if(token.claims && token.claims.admin) setAllowed(true);
      else {
        alert('Accès admin requis');
        auth.signOut();
        setAllowed(false);
      }
    });
    return ()=> unsub();
  },[]);

  if(!allowed) return <div className="container card">Connexion requise en tant qu'admin.</div>;
  return (
    <div className="container card">
      <h1>Administration</h1>
      <p>Accès admin confirmé — intègre ici ton admin React (édition contenu, uploads, etc.).</p>
    </div>
  );
}
