// Existing public Mirracles shells retain their content and immutable old assets.
// Upgrade only the reader-client reference; the current client is served by Ask.
export const READER_PROFILE_CLIENT='/ask/reader-profile-client.js?v=20261028';
export function readerProfileShell(reader){
 const previous='/ask/_assets/AskGate.astro_astro_type_script_index_0_lang.DwGnqkgl.js';
 return {...reader,...Object.fromEntries(['head','html'].filter(k=>typeof reader?.[k]==='string').map(k=>[k,reader[k].replaceAll(previous,READER_PROFILE_CLIENT)]))};
}

export const readerProfileResponseHeaders={'Content-Security-Policy':"object-src 'none'; base-uri 'self'; frame-ancestors 'self'; script-src 'self' https://accounts.google.com; connect-src 'self' https://accounts.google.com; frame-src 'self' https://accounts.google.com https://www.youtube-nocookie.com",'Cross-Origin-Opener-Policy':'same-origin-allow-popups','X-Pinnacle-Mirracles-Library':'public-reader-20261008'};
