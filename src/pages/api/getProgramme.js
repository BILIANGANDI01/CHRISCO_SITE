import { db } from '../../lib/firebaseAdmin';

export default async function handler(req,res){
  try{
    const semaineDoc = await db.collection('programme').doc('semaine').get();
    const eventsSnap = await db.collection('programme').doc('evenements').collection('events').orderBy('date','asc').get();
    const semaine = semaineDoc.exists ? semaineDoc.data().programmes || [] : [];
    const events = eventsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.setHeader('Access-Control-Allow-Origin','*');
    res.status(200).json({ semaine, events });
  } catch(e){
    console.error(e);
    res.status(500).json({error: e.message});
  }
}
