const params = new URLSearchParams(window.location.search);
const id = params.get('id') || 'johnny-maxwell';

fetch(`./data/${id}.json`)
  .then(r => r.json())
  .then(c => {
    document.title = `REMAIN UNAWARE — ${c.name.toUpperCase()}`;

    document.getElementById('char-art').src = c.art;
    document.getElementById('char-art').alt = c.name;
    document.getElementById('char-file').textContent = `PERSONNEL FILE — #${c.file}`;
    document.getElementById('char-name').innerHTML = c.name_short;
    document.getElementById('char-alias').textContent = `// "${c.alias}"`;
    document.getElementById('char-desc').textContent = c.desc;
    document.getElementById('char-ghost').textContent = c.ghost;
    document.getElementById('char-fullname').innerHTML = c.name_full;
    document.getElementById('char-quote').textContent = `"${c.quote}"`;
    document.querySelector('.char-header-bg').style.backgroundImage = `url('${c.banner}')`;

    document.getElementById('char-tags').innerHTML = c.tags
      .map(t => `<span class="tag">${t}</span>`).join('');

    document.getElementById('char-stats').innerHTML = c.stats
      .map(s => `<div class="stat"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div></div>`).join('');

    document.getElementById('char-palette').innerHTML = c.palette
      .map(hex => `<div class="swatch" style="background:${hex}" data-hex="${hex}"></div>`).join('');

    document.getElementById('char-refs').innerHTML = c.refs
      .map(src => `<div class="ref-item"><img src="${src}" alt="ref"></div>`).join('');
      document.querySelectorAll('.ref-item img').forEach(img => {
  img.addEventListener('click', () => {
    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox').classList.add('active');
  });
});

    const gallery = document.getElementById('gallery');
    gallery.innerHTML = c.gallery
      .map(g => `<div class="gallery-item" data-src="${g.src}"><img src="${g.src}" alt=""><div class="gallery-item-label">${g.label}</div></div>`).join('');

    document.getElementById('char-backstory').innerHTML = c.backstory
      .split('\n\n')
      .map(p => `<p>${p}</p>`)
      .join('');

    document.getElementById('char-personality').innerHTML = c.personality
      .map(p => `
        <div class="personality-row">
          <div class="personality-track">
            <span class="personality-from">${p.from}</span>
            <div class="personality-bar-wrap">
              <div class="personality-label">${p.label}</div>
              <div class="personality-bar">
                <div class="personality-fill" style="width:${p.value}%"></div>
              </div>
            </div>
            <span class="personality-to">${p.to}</span>
          </div>
        </div>
      `).join('');

    gallery.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        document.getElementById('lightbox-img').src = item.dataset.src;
        document.getElementById('lightbox').classList.add('active');
      });
    });
  });

document.getElementById('lightbox-close').addEventListener('click', () => {
  document.getElementById('lightbox').classList.remove('active');
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.getElementById('lightbox').classList.remove('active');
});

document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target === document.getElementById('lightbox')) document.getElementById('lightbox').classList.remove('active');
});
// === SNOW ===
const snowCanvas = document.getElementById('snow');
const sCtx = snowCanvas.getContext('2d');

function resize() {
  snowCanvas.width = window.innerWidth;
  snowCanvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const flakes = Array.from({ length: 80 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.5 + 0.3,
  speed: Math.random() * 0.15 + 0.05,
  drift: Math.random() * 0.3 - 0.15,
  opacity: Math.random() * 0.4 + 0.1,
}));

function drawSnow() {
  requestAnimationFrame(drawSnow);
  sCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

  flakes.forEach(f => {
    f.y += f.speed;
    f.x += f.drift;

    if (f.y > snowCanvas.height) { f.y = -2; f.x = Math.random() * snowCanvas.width; }
    if (f.x > snowCanvas.width) f.x = 0;
    if (f.x < 0) f.x = snowCanvas.width;

    sCtx.beginPath();
    sCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    sCtx.globalAlpha = f.opacity;
    sCtx.fillStyle = 'rgba(255, 255, 255, 1)';
    sCtx.shadowColor = 'white';
    sCtx.shadowBlur = 4;
    sCtx.fill();
  });

  sCtx.globalAlpha = 1;
}

drawSnow();