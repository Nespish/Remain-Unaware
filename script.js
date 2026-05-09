async function translatePage(lang) {
  const res = await fetch(`./lang/${lang}.json`);
  const translations = await res.json();

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    // Ищем значение в JSON (поддерживает вложенность типа hero.tag)
    const text = key.split('.').reduce((obj, i) => obj[i], translations);
    if (text) el.innerText = text;
  });
}

// Запускаем при старте
translatePage('ru');



// === DATABASE OVERLAY ===
document.getElementById('nav-characters-link').addEventListener('click', (e) => {
  e.preventDefault();
  const ov = document.getElementById('dbOverlay');
  const dbTag = document.getElementById('dbTag');
  const dbTitle = document.getElementById('dbTitle');
  const dbSub = document.getElementById('dbSub');
  const dbScan = document.getElementById('dbScanline');
  const dbFill = document.getElementById('dbBarFill');
  const dbStatus = document.getElementById('dbStatus');

  dbTag.style.opacity = '0'; dbTitle.style.opacity = '0'; dbSub.style.opacity = '0';
  dbStatus.textContent = 'ACCESSING DATABASE...';
  dbFill.style.transition = 'none'; dbFill.style.width = '0%';
  dbScan.style.animation = 'none'; dbScan.style.height = '0'; dbScan.style.opacity = '0';

  ov.style.display = 'flex'; ov.style.opacity = '0'; ov.style.transition = 'opacity 0.3s ease';
  requestAnimationFrame(() => { ov.style.opacity = '1'; });

  setTimeout(() => { dbTag.style.opacity = '1'; }, 200);
  setTimeout(() => {
    const s = performance.now(); let last = 0;
    function flk(now) {
      if (now - s > 320) { dbTitle.style.opacity = '1'; dbTitle.style.filter = 'none'; return; }
      if (now - last > 38) {
        const r = Math.random();
        dbTitle.style.opacity = r > 0.6 ? '0' : r > 0.3 ? '0.5' : '1';
        dbTitle.style.filter = `brightness(${1 + Math.random()})`;
        last = now;
      }
      requestAnimationFrame(flk);
    }
    requestAnimationFrame(flk);
  }, 420);
  setTimeout(() => { dbScan.style.animation = 'dbscan 0.85s ease forwards'; }, 700);
  setTimeout(() => {
    dbSub.style.opacity = '1';
    dbFill.style.transition = 'width 0.85s cubic-bezier(0.4,0,0.2,1)';
    dbFill.style.width = '100%';
  }, 820);
  setTimeout(() => { dbStatus.textContent = 'LOADING ENTRIES...'; }, 1100);
  setTimeout(() => { dbStatus.textContent = 'ACCESS GRANTED'; }, 1620);
  setTimeout(() => {
    ov.style.transition = 'opacity 0.5s ease'; ov.style.opacity = '0';
    setTimeout(() => {
      ov.style.display = 'none';
      const sec = document.getElementById('characters');
      sec.style.display = 'block';
      sec.scrollIntoView({ behavior: 'smooth' });
      document.querySelectorAll('.char-card').forEach((c, i) => {
        setTimeout(() => c.classList.add('char-card--visible'), i * 85);
      });
    }, 500);
  }, 2150);
});

document.querySelectorAll('.chars-tag-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.chars-tag-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.char-card').forEach(card => {
      const match = f === 'all' || card.dataset.category === f;
      card.style.opacity = match ? '1' : '0.12';
      card.style.pointerEvents = match ? 'auto' : 'none';
    });
  });
});

document.querySelectorAll('.char-card').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.querySelector('.char-card-name').textContent;
    const id = name.toLowerCase().replace(/\s+/g, '-');
    window.location.href = `./character/character.html?id=${id}`;
  });
});