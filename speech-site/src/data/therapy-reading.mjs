import books from './book-catalog.json' with {type:'json'};
import editions from './book-locales.json' with {type:'json'};

export const therapyReading={
 speech:{path:'/top-speech-therapy-center-india-proven-improvement-rate',anchor:'whole-child-support',heading:'Explore everyday communication together.',copy:'Gestures, words, pictures and choices all have a place in family life. Our illustrated guide offers a way to explore those everyday moments together and bring useful questions to your child’s speech professional.'},
 occupational:{path:'/best-occupational-therapy-center-india-proven-improvement-rate',anchor:'evidence',heading:'Bring everyday possibilities into your next OT conversation.',copy:'Play, dressing and familiar routines can open up useful conversations about participation. Explore our illustrated guide, notice what feels comfortable and relevant for your child, and discuss it with your occupational therapist.'}
};
for(const [kind,item]of Object.entries(therapyReading)){
 const book=books.find(b=>b.bookKey===kind&&!b.bundle&&!b.physical);
 if(!book)throw Error('Missing single PDF edition: '+kind);
 item.book={title:book.title,path:book.path,front:book.front,coverAlt:book.coverAlt,discipline:book.discipline};
 item.languages=[{lang:'en',label:'English',path:book.path},...['hi','te'].map(lang=>{
  const edition=editions.find(e=>e.locale===lang&&e.englishPath===book.path);
  if(!edition||edition.bookCount!==1)throw Error('Missing matching native edition: '+kind+'/'+lang);
  return {lang,label:lang==='hi'?'हिन्दी':'తెలుగు',path:edition.path};
 })];
 item.note='Free samples are available; the complete books are sold separately. Use the ideas with your professional team—they support discussion and do not replace individual care.';
}
