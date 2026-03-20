// CURSOR
var cur  = document.getElementById('cur');
var ring = document.getElementById('cur-ring');
var mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', function(e) {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
(function trail() {
  tx += (mx - tx) * 0.1; ty += (my - ty) * 0.1;
  ring.style.left = tx + 'px'; ring.style.top = ty + 'px';
  requestAnimationFrame(trail);
})();
document.querySelectorAll('a,button,.tc,.vc,.pc,.soc-item,.si-item,.course-img-link').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    cur.style.transform = 'translate(-50%,-50%) scale(0.5)';
    cur.style.background = '#06b6d4';
    ring.style.width = '52px'; ring.style.height = '52px';
    ring.style.borderColor = 'rgba(6,182,212,0.4)';
  });
  el.addEventListener('mouseleave', function() {
    cur.style.transform = 'translate(-50%,-50%) scale(1)';
    cur.style.background = '#3b82f6';
    ring.style.width = '34px'; ring.style.height = '34px';
    ring.style.borderColor = 'rgba(59,130,246,0.4)';
  });
});

// SPOTLIGHT
var spotlight = document.getElementById('spotlight');
document.addEventListener('mousemove', function(e) {
  spotlight.style.left = e.clientX + 'px';
  spotlight.style.top  = e.clientY + 'px';
});

// NAVBAR
var nav = document.getElementById('nav');
window.addEventListener('scroll', function() {
  nav.classList.toggle('solid', window.scrollY > 60);
  updateNav();
});
function updateNav() {
  var secs = document.querySelectorAll('section');
  var curr = '';
  secs.forEach(function(s) { if (window.scrollY >= s.offsetTop - 140) curr = s.id; });
  document.querySelectorAll('.nl').forEach(function(l) {
    l.classList.toggle('active', l.getAttribute('href') === '#' + curr);
  });
}
function toggleMenu() {
  document.getElementById('mob-menu').classList.toggle('open');
}

// SCROLL REVEAL
function reveal() {
  document.querySelectorAll('.ani').forEach(function(el) {
    if (el.getBoundingClientRect().top < window.innerHeight - 60)
      el.classList.add('show');
  });
}
window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);
setTimeout(reveal, 100);
setTimeout(reveal, 600);

// SKILL BARS
var barObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.tc-fill').forEach(function(b) { b.style.width = b.dataset.w + '%'; });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.tc').forEach(function(c) { barObs.observe(c); });

// WORK FILTER
function filterWork(cat, btn) {
  document.querySelectorAll('.wf').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  document.querySelectorAll('.vc').forEach(function(card) {
    card.classList.toggle('hidden', cat !== 'all' && card.dataset.cat !== cat);
  });
}

// VIDEO MODAL — smooth open/close
function openModal(src, title) {
  var modal = document.getElementById('modal');
  document.getElementById('modal-iframe').src = src;
  document.getElementById('modal-title').textContent = title;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  var modal = document.getElementById('modal');
  modal.classList.remove('open');
  setTimeout(function() {
    document.getElementById('modal-iframe').src = '';
  }, 350);
  document.body.style.overflow = '';
}
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

// FORMSPREE CONTACT FORM — AJAX submit + thankyou page
var form = document.getElementById('cform');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var note = document.getElementById('cf-note');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    var data = new FormData(form);
    fetch('https://formspree.io/f/mvzwygwb', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(function(res) {
      if (res.ok) {
        form.reset();
        showThankyou();
      } else {
        note.style.color = '#ef4444';
        note.textContent = 'Something went wrong. Please try again.';
      }
    }).catch(function() {
      note.style.color = '#ef4444';
      note.textContent = 'Network error. Please try again.';
    }).finally(function() {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    });
  });
}

function showThankyou() {
  document.getElementById('thankyou').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeThankyou() {
  document.getElementById('thankyou').classList.remove('show');
  document.body.style.overflow = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── ENHANCED PARTICLES ──────────────────────────────────────────────
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var W, H;
function resizeCanvas() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

// Particle types: dot, cross, ring
function Particle() { this.reset(true); }
Particle.prototype.reset = function(init) {
  this.x    = Math.random() * W;
  this.y    = init ? Math.random() * H : H + 10;
  this.vx   = (Math.random() - 0.5) * 0.6;
  this.vy   = -(Math.random() * 0.6 + 0.15);
  this.r    = Math.random() * 2 + 0.4;
  this.life = Math.random() * 0.8 + 0.2;
  this.maxLife = this.life;
  this.decay = 0.0018 + Math.random() * 0.001;
  this.type  = Math.floor(Math.random() * 4); // 0=dot,1=ring,2=cross,3=square
  this.rot   = Math.random() * Math.PI * 2;
  this.rotV  = (Math.random() - 0.5) * 0.02;
  this.colorIdx = Math.floor(Math.random() * 3);
};
Particle.prototype.update = function() {
  this.x   += this.vx;
  this.y   += this.vy;
  this.life -= this.decay;
  this.rot  += this.rotV;
  if (this.life <= 0 || this.y < -10) this.reset(false);
};

var COLORS = ['59,130,246','6,182,212','99,102,241'];

Particle.prototype.draw = function() {
  var a   = (this.life / this.maxLife) * 0.55;
  var col = 'rgba(' + COLORS[this.colorIdx] + ',' + a + ')';
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.rot);
  ctx.strokeStyle = col;
  ctx.fillStyle   = col;
  ctx.lineWidth   = 0.8;

  if (this.type === 0) {
    // filled dot
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.fill();
  } else if (this.type === 1) {
    // ring
    ctx.beginPath();
    ctx.arc(0, 0, this.r * 1.8, 0, Math.PI * 2);
    ctx.stroke();
  } else if (this.type === 2) {
    // tiny cross / plus
    var s = this.r * 2.2;
    ctx.beginPath();
    ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
    ctx.moveTo(0, -s); ctx.lineTo(0, s);
    ctx.stroke();
  } else {
    // tiny square
    var h = this.r * 1.5;
    ctx.strokeRect(-h, -h, h * 2, h * 2);
  }
  ctx.restore();
};

// Draw connecting lines between nearby particles
function drawLines(pts) {
  for (var i = 0; i < pts.length; i++) {
    for (var j = i + 1; j < pts.length; j++) {
      var dx = pts[i].x - pts[j].x;
      var dy = pts[i].y - pts[j].y;
      var d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 150) {
        var a = 0.08 * (1 - d / 150)
          * Math.min(pts[i].life / pts[i].maxLife, pts[j].life / pts[j].maxLife);
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = 'rgba(59,130,246,' + a + ')';
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
}

// Mouse repulsion burst
var mouseX = -999, mouseY = -999;
document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX; mouseY = e.clientY;
  particles.forEach(function(p) {
    var dx = p.x - mouseX, dy = p.y - mouseY;
    var d  = Math.sqrt(dx * dx + dy * dy);
    if (d < 100 && d > 0) {
      p.vx += (dx / d) * 0.35;
      p.vy += (dy / d) * 0.35;
    }
  });
});

// Spawn burst on click
document.addEventListener('click', function(e) {
  for (var i = 0; i < 8; i++) {
    var p = new Particle();
    p.x = e.clientX; p.y = e.clientY;
    p.vx = (Math.random() - 0.5) * 3;
    p.vy = (Math.random() - 0.5) * 3;
    p.life = p.maxLife = 0.6;
    particles.push(p);
  }
  // Remove extras to keep count stable
  while (particles.length > PARTICLE_COUNT + 30) particles.shift();
});

var PARTICLE_COUNT = 110;
var particles = [];
function initParticles() {
  particles = [];
  for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
}

function loop() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(function(p) { p.update(); p.draw(); });
  drawLines(particles);
  requestAnimationFrame(loop);
}

window.addEventListener('resize', function() { resizeCanvas(); initParticles(); });
resizeCanvas();
initParticles();
loop();

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});