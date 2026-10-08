// Only an explicit user activation creates the external player.
document.addEventListener('click', event => {
  const button = event.target.closest?.('[data-mirracles-player]');
  if (!button) return;
  let url;
  try { url = new URL(button.dataset.mirraclesPlayer); } catch { return; }
  if (url.origin !== 'https://www.youtube-nocookie.com' || !/^\/embed\/[\w-]{11}$/.test(url.pathname)) return;
  const frame = document.createElement('iframe');
  frame.src = url.href;
  frame.title = button.dataset.videoTitle || 'Published Pinnacle video';
  frame.allow = 'autoplay; encrypted-media; picture-in-picture';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'no-referrer';
  frame.tabIndex = 0;
  button.replaceWith(frame);
  frame.focus();
});
