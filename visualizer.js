const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const audio = document.getElementById('bg-audio');
audio.volume = 0.05;

canvas.width = 200;
canvas.height = 20;
canvas.style.display = 'block';
canvas.style.margin = '0 auto 28px';
canvas.style.opacity = '0';
canvas.style.animation = 'fadeUp 0.9s ease 1s forwards';

let analyser, dataArray, animFrame;
let isPlaying = false;

function initAudio() {
  if (analyser) return;
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64;
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  dataArray = new Uint8Array(analyser.frequencyBinCount);
}

function draw() {
  animFrame = requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);

  

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const barCount = 24;
  const barW = 2;
  const gap = (canvas.width - barCount * barW) / (barCount - 1);

  for (let i = 0; i < barCount; i++) {
  const value = dataArray[Math.floor(i * dataArray.length / barCount)] / 255;
  const h = Math.max(1, value * canvas.height);
  
  // зеркалим: левая половина = правая в обратном порядке
  const mirror = i < barCount / 2 ? i : barCount - 1 - i;
  const freq = dataArray[Math.floor(mirror * dataArray.length / barCount)] / 255;
  const barH = Math.max(1, freq * canvas.height);
  
  const x = i * (barW + gap);
  const y = (canvas.height - barH) / 2;

  ctx.fillStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 6;
  ctx.fillRect(x, y, barW, barH);
}
}


// === SNOW ===
const snowCanvas = document.getElementById('snow');
const sCtx = snowCanvas.getContext('2d');


function resize() {
  snowCanvas.width = window.innerWidth;
  snowCanvas.height = window.innerHeight;
  snowCanvas.style.width = window.innerWidth + 'px';
  snowCanvas.style.height = window.innerHeight + 'px';
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

// === PARALLAX ===
const parallaxImg = document.querySelector('.hero-bg-img');

document.addEventListener('mousemove', (e) => {
  if (!parallaxImg) return;
  
  const x = (e.clientX / window.innerWidth - 0.5) * 2;  // от -1 до 1
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  const moveX = x * 25;
  const moveY = y * 15;
  const rotateZ = x * 3;

  parallaxImg.style.transform = `translateX(calc(-50% + ${moveX}px)) translateY(${moveY}px) rotate(${rotateZ}deg)`;
});

const glockImg = document.querySelector('.hero-bg-img');
const tooltip = document.querySelector('.glock-tooltip');
const lineSvg = document.querySelector('.glock-line-svg');
const line = document.querySelector('.glock-line');
const tooltipText = document.querySelector('.glock-tooltip-text');
const tooltipUnderline = document.querySelector('.glock-tooltip-underline');

const hitCanvas = document.createElement('canvas');
const hitCtx = hitCanvas.getContext('2d');
const hitImage = new Image();
hitImage.crossOrigin = 'anonymous';
hitImage.src = './assets/glock.png';
hitImage.onload = () => {
  hitCanvas.width = hitImage.naturalWidth;
  hitCanvas.height = hitImage.naturalHeight;
  hitCtx.drawImage(hitImage, 0, 0);
};

let tooltipVisible = false;

function showTooltip(mouseX, mouseY) {
  tooltip.style.position = 'fixed';
  tooltip.style.left = (mouseX - 305) + 'px';
  tooltip.style.top = (mouseY + 9) + 'px';

  line.setAttribute('x1', mouseX);
  line.setAttribute('y1', mouseY);
  line.setAttribute('x2', mouseX - 180 + 128);
  line.setAttribute('y2', mouseY + 30);

  if (tooltipVisible) return;
  tooltipVisible = true;

  tooltip.style.opacity = '1';
  lineSvg.style.opacity = '1';

  requestAnimationFrame(() => {
    line.style.strokeDashoffset = '0';
    tooltipUnderline.style.transform = 'scaleX(1)';
    setTimeout(() => flickerText(200), 300);
  });
}

function hideTooltip() {

  if (!tooltipVisible) return;
  tooltipVisible = false;

  line.style.strokeDashoffset = '300';
  tooltipUnderline.style.transform = 'scaleX(0)';
  tooltipText.style.opacity = '0';

  setTimeout(() => {
    tooltip.style.opacity = '0';
    lineSvg.style.opacity = '0';
  }, 300);
}

if (glockImg && tooltip) {

  document.querySelector('.hero').addEventListener('mousemove', (e) => {

    if (!hitImage.complete) return;

    const rect = glockImg.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = Math.floor(x / rect.width * hitImage.naturalWidth);
    const py = Math.floor(y / rect.height * hitImage.naturalHeight);

    let isOpaque = true;

    try {
      const pixel = hitCtx.getImageData(px, py, 1, 1).data;
      isOpaque = pixel[3] > 30;
    } catch {
      isOpaque = true;
    }

    if (isOpaque) showTooltip(e.clientX, e.clientY);
    else hideTooltip();
  });

  glockImg.addEventListener('mouseleave', hideTooltip);
}

function flickerText(duration = 100) {

  tooltipText.style.transition = 'none';

  const start = performance.now();

  let lastSwitch = 0;
  const flickerInterval = 30; 

  function flicker(now) {

    const progress = (now - start) / duration;

    if (progress >= 1) {
      tooltipText.style.transition = 'opacity .55s ease';
      tooltipText.style.opacity = '1';
      tooltipText.style.filter = 'none';
      return;
    }

    if (now - lastSwitch > flickerInterval) {

      const rand = Math.random();

      if (rand > 0.7) {
        tooltipText.style.opacity = '0';
      } else if (rand > 0.4) {
        tooltipText.style.opacity = '0.35';
      } else {
        tooltipText.style.opacity = '1';
      }

      tooltipText.style.filter =
        `brightness(${1 + Math.random()})`;

      lastSwitch = now;
    }

    requestAnimationFrame(flicker);
  }

  requestAnimationFrame(flicker);
}
document.getElementById('music-toggle').addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('clicked! isPlaying:', isPlaying);


  if (isPlaying) {
    audio.pause();
    cancelAnimationFrame(animFrame);
    isPlaying = false;
    document.getElementById('icon-play').style.display = 'block';
    document.getElementById('icon-pause').style.display = 'none';
  } else {
    initAudio();
    audio.play();
    isPlaying = true;
    draw();
    document.getElementById('icon-play').style.display = 'none';
    document.getElementById('icon-pause').style.display = 'block';
  }
});

console.log('button found:', document.getElementById('music-toggle'));

 