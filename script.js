const SITE_URL = 'https://sonicremedy03.vercel.app';

const DEFAULT_SPOTIFY = 'https://open.spotify.com/artist/4RReG7ft4gOWl2pNr5F8sF';
const DEFAULT_APPLE = 'https://music.apple.com/au/artist/soozhee/1569245776';
const DEFAULT_AMAZON = 'https://amazon.com/music/player/artists/B0967ZGMRT/soozhee';

const PLAYLIST = [
  { num: 1, title: "If Tomorrow Never Comes", full: "If Tomorrow Never Comes", cover: 'assets/covers/af3-cover-01.png', track: 'assets/tracks/af3-01.mp3', page: 'https://iftomorrownevercomes.vercel.app' },
  { num: 2, title: "Be Ready For It All", full: "Be Ready For It All", cover: 'assets/covers/af3-cover-02.png', track: 'assets/tracks/af3-02.mp3', page: 'https://bereadyforitall.vercel.app' },
  { num: 3, title: "The World Beyond", full: "The World Beyond", cover: 'assets/covers/af3-cover-03.png', track: 'assets/tracks/af3-03.mp3', page: 'https://theworldbeyond.vercel.app' },
  { num: 4, title: "Make It Worth Your While", full: "Make It Worth Your While", cover: 'assets/covers/af3-cover-04.png', track: 'assets/tracks/af3-04.mp3', page: 'https://makeitworthyourwhile.vercel.app' },
  { num: 5, title: "How You Treat a Dog", full: "How You Treat a Dog", cover: 'assets/covers/af3-cover-05.png', track: 'assets/tracks/af3-05.mp3', page: 'https://howyoutreatadog.vercel.app' },
  { num: 6, title: "The Crescendo", full: "The Crescendo", cover: 'assets/covers/af3-cover-06.png', track: 'assets/tracks/af3-06.mp3', page: 'https://thecrescendo.vercel.app' },
  { num: 7, title: "Be the Light", full: "Be the Light", cover: 'assets/covers/af3-cover-07.png', track: 'assets/tracks/af3-07.mp3', page: 'https://bethelight.vercel.app' },
  { num: 8, title: "You Do You", full: "You Do You", cover: 'assets/covers/af3-cover-08.png', track: 'assets/tracks/af3-08.mp3', page: 'https://youdoyou.vercel.app' }
].map((track) => ({ ...track, spotify: DEFAULT_SPOTIFY, apple: DEFAULT_APPLE, amazon: DEFAULT_AMAZON }));

let currentIndex = 0;
let isPlaying = false;

const audio = new Audio();
audio.preload = 'metadata';

function $(id) { return document.getElementById(id); }

function formatTime(s) {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

function loadTrack(index, autoplay = false) {
  currentIndex = index;
  const t = PLAYLIST[index];
  audio.src = t.track;
  $('playerCover').src = t.cover;
  $('playerCover').alt = t.title + ' cover art';
  $('nowPlayingNum').textContent = 'Track ' + String(t.num).padStart(2, '0') + ' of ' + PLAYLIST.length;
  $('nowPlayingTitle').textContent = t.title;
  document.querySelectorAll('.playlist-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
  if (autoplay) {
    audio.play().then(() => {
      isPlaying = true;
      updatePlayIcon();
    }).catch(() => {});
  }
}

function updatePlayIcon() {
  const playIcon = $('playIcon');
  const pauseIcon = $('pauseIcon');
  if (isPlaying) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  } else {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play().then(() => { isPlaying = true; }).catch(() => {});
  }
  updatePlayIcon();
}

function prevTrack() {
  const next = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
  loadTrack(next, true);
}

function nextTrack() {
  const next = (currentIndex + 1) % PLAYLIST.length;
  loadTrack(next, true);
}

function buildPlaylist() {
  const list = $('playlistList');
  list.innerHTML = '';
  PLAYLIST.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'playlist-item' + (i === 0 ? ' active' : '');
    item.innerHTML = `
      <span class="num">${String(t.num).padStart(2, '0')}</span>
      <div class="meta"><div class="title">${t.title}</div></div>
      <span class="duration">–:––</span>
    `;
    item.addEventListener('click', () => loadTrack(i, true));
    list.appendChild(item);
  });
}

function buildSongCards() {
  const grid = $('songsGrid');
  grid.innerHTML = '';
  PLAYLIST.forEach((t) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.title = t.full;
    card.dataset.text = t.title + ' by Soozhee | Sonic Remedy : Audiosensory Resonance | ' + t.page;
    card.dataset.img = t.cover;
    card.innerHTML = `
      <div class="card-img-wrap">
        <span class="card-num">${String(t.num).padStart(2, '0')}</span>
        <a href="${t.cover}" data-page="${t.page}">
          <img class="card-img" src="${t.cover}" alt="${t.title} cover art" loading="lazy" />
        </a>
      </div>
      <div class="card-body">
        <h3>${t.title}</h3>
        <div class="remedy">Remedy ${String(t.num).padStart(2, '0')} · No Regret</div>
        <a class="song-link" href="${t.page}" target="_blank" rel="noopener">Open song page →</a>
        <div class="stream-mini">
          <a href="${t.spotify}" target="_blank" rel="noopener">Spotify</a>
          <a href="${t.apple}" target="_blank" rel="noopener">Apple</a>
          <a href="${t.amazon}" target="_blank" rel="noopener">Amazon</a>
        </div>
        <div class="share-bar">
          <button class="share-btn primary" onclick="shareCard(this)">Share</button>
          <a class="share-btn" href="#" onclick="shareTo('x', this); return false;">𝕏</a>
          <a class="share-btn" href="#" onclick="shareTo('fb', this); return false;">Facebook</a>
          <a class="share-btn" href="#" onclick="shareTo('li', this); return false;">LinkedIn</a>
          <button class="share-btn" onclick="copyLink(this)">Copy</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function getCardData(el) {
  const card = el.closest('.card');
  return {
    title: card.dataset.title,
    text: card.dataset.text,
    img: card.dataset.img
  };
}

function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

async function shareCard(btn) {
  const data = getCardData(btn);
  if (navigator.share) {
    try {
      await navigator.share({ title: data.title, text: data.text, url: SITE_URL });
      return;
    } catch (e) {}
  }
  await navigator.clipboard.writeText(data.text + '\n\n' + SITE_URL);
  showToast('Copied — paste anywhere');
}

function shareTo(platform, el) {
  const data = getCardData(el);
  const text = encodeURIComponent(data.text);
  const url = encodeURIComponent(SITE_URL);
  let link = '';
  if (platform === 'x') link = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  else if (platform === 'fb') link = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
  else if (platform === 'li') link = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  else if (platform === 'email') link = `mailto:?subject=${encodeURIComponent(data.title)}&body=${text}%0A%0A${url}`;
  if (link) window.open(link, '_blank', 'noopener,noreferrer,width=600,height=500');
}

async function copyLink(el) {
  await navigator.clipboard.writeText(SITE_URL);
  showToast('Link copied');
}

async function sharePage() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Audiosensory Formula 03: No Regret — Sonic Remedy',
        text: 'Press play from the beginning — or choose the song that jumps out at you today.',
        url: SITE_URL
      });
      return;
    } catch (e) {}
  }
  await navigator.clipboard.writeText(SITE_URL);
  showToast('Link copied');
}

async function copyPageLink() {
  await navigator.clipboard.writeText(SITE_URL);
  showToast('Link copied');
}

function toggleFormulaMenu() {
  const trigger = $('formulaTrigger');
  const menu = $('formulaMenu');
  const willOpen = menu.hidden;
  menu.hidden = !willOpen;
  trigger.setAttribute('aria-expanded', String(willOpen));
}
function closeFormulaMenu() {
  const trigger = $('formulaTrigger');
  const menu = $('formulaMenu');
  if (menu) menu.hidden = true;
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function toggleMobileMenu() {
  $('mobileNav').classList.toggle('open');
}

function closeMobileMenu() {
  $('mobileNav').classList.remove('open');
}

/* Lightbox */
function openLightbox(src, pageUrl) {
  const lb = $('lightbox');
  $('lightboxImg').src = src;
  $('lightboxActions').innerHTML = `<a class="share-btn primary" href="${pageUrl}" target="_blank" rel="noopener">Open song page</a>
    <button class="share-btn" onclick="closeLightbox()">Back to playlist</button>`;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  $('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('click', function (e) {
  const link = e.target.closest('.card-img-wrap a');
  if (link) {
    e.preventDefault();
    openLightbox(link.getAttribute('href'), link.dataset.page);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const lb = $('lightbox');
  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox-close')) {
        closeLightbox();
      }
    });
  }

  buildPlaylist();
  buildSongCards();
  loadTrack(0, false);

  $('playBtn').addEventListener('click', togglePlay);
  $('prevBtn').addEventListener('click', prevTrack);
  $('nextBtn').addEventListener('click', nextTrack);

  audio.addEventListener('loadedmetadata', () => {
    $('duration').textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    const pct = (audio.currentTime / audio.duration) * 100 || 0;
    $('progressFill').style.width = pct + '%';
    $('currentTime').textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('ended', () => {
    nextTrack();
  });

  $('progressBar').addEventListener('click', (e) => {
    const rect = $('progressBar').getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeLightbox();
});
