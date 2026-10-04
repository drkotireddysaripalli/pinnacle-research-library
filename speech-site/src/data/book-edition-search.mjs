// English search/social summaries for native PDF editions. Catalogue facts stay in their source.
const summaries={
 'speech':'LANG PDF guide to everyday communication: gestures, sounds, words, pictures and choices. Preview My Message Matters by Pinnacle Blooms Network.',
 'ot':'LANG Occupational Therapy 101 PDF guide to dressing, washing, play and family roles. Preview I Belong in Everyday Life from Pinnacle Blooms Network.',
 'aba':'LANG ABA parent-education PDF guide to behaviour, comfort, communication and requests for help. Preview Understanding Everyday Behaviour from Pinnacle.',
 'special-education':'LANG Special Education 101 PDF guide to stories, matching, shapes and pretend play. Preview Learning Through Everyday Play from Pinnacle Blooms Network.',
 'speech|ot':'Two LANG PDF parent guides: Speech & Communication 101 and Occupational Therapy 101. Explore communication and everyday participation; preview both books.',
 'speech|aba':'Two LANG PDF parent guides: Speech & Communication 101 and ABA Parent Education 101. Explore choices, communication and behaviour; preview both books.',
 'speech|special-education':'Two LANG PDF parent guides: Speech & Communication 101 and Special Education 101. Explore communication, stories and early learning; preview both books.',
 'ot|aba':'Two LANG PDF parent guides: Occupational Therapy 101 and ABA Parent Education 101. Explore family routines, comfort and behaviour; preview both books.',
 'ot|special-education':'Two LANG PDF parent guides: Occupational Therapy 101 and Special Education 101. Explore everyday participation, play and early learning; preview both books.',
 'aba|special-education':'Two LANG PDF parent guides: ABA Parent Education 101 and Special Education 101. Explore behaviour, communication and accessible learning; preview both books.'
};
export function bookEditionDescription(edition){
 const language={hi:'Hindi',te:'Telugu'}[edition.locale];
 const summary=summaries[edition.included_books.map(book=>book.book_key).join('|')];
 return language&&summary?summary.replace('LANG',language):edition.seo_description;
}
