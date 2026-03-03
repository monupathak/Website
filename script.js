/* 
   TYPEWRITER ANIMATION
    */
function setupTypewriter() {
  const taglinePrefix = document.getElementById("tagline-prefix");
  const taglineText = document.getElementById("tagline-text");
  const cursor = document.querySelector(".cursor");
  
  if (!taglineText) return;
  
  const plainText = "Turning compute into logic, and stochastic guesses into optimal decisions.";
  const speedText = 40;
  const speedPrefix = 100;
  
  // Define which words should be colored: [startIndex, endIndex, color]
  const coloredRanges = [
    [8, 15, "#A3E635"],      // "compute"
    [56, 78, "#A3E635"]      // "optimal decisions"
  ];
  
  let charIndex = 0;
  let isTyping = true;
  
  // Prefix text
  const prefixText = "AI . LLM . NLP";
  let prefixIndex = 0;
  
  function typePrefix() {
    if (prefixIndex < prefixText.length) {
      taglinePrefix.textContent = prefixText.substring(0, prefixIndex + 1);
      prefixIndex++;
      setTimeout(typePrefix, speedPrefix);
    } else {
      setTimeout(typeMain, 300);
    }
  }
  
  function applyColoring(text) {
    let html = "";
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      let isColored = false;
      
      // Check if current position is in any colored range
      for (let range of coloredRanges) {
        if (i >= range[0] && i < range[1]) {
          if (i === range[0]) {
            html += `<span style="color:${range[2]}">`;
          }
          html += char;
          if (i === range[1] - 1) {
            html += `</span>`;
          }
          isColored = true;
          break;
        }
      }
      
      if (!isColored) {
        html += char;
      }
    }
    return html;
  }
  
  function typeMain() {
    if (charIndex < plainText.length) {
      const currentText = plainText.substring(0, charIndex + 1);
      taglineText.innerHTML = applyColoring(currentText) + '<span class="typing-cursor" style="display: inline-block; width: 2px; height: 1em; background: #9edc2a; margin-left: 4px; animation: blink 0.7s infinite; vertical-align: middle;"></span>';
      charIndex++;
      setTimeout(typeMain, speedText);
    } else {
      isTyping = false;
      // Keep cursor at the end when typing is complete
      const finalHTML = applyColoring(plainText) + '<span class="typing-cursor" style="display: inline-block; width: 2px; height: 1em; background: #9edc2a; margin-left: 4px; animation: blink 0.7s infinite; vertical-align: middle;"></span>';
      taglineText.innerHTML = finalHTML;
    }
  }
  
  // Hide the static cursor element since we're using an inline one
  if (cursor) cursor.style.display = "none";
  
  // Start typing
  typePrefix();
}

document.addEventListener("DOMContentLoaded", setupTypewriter);

/* 
   INTERACTIVE PARTICLE CONSTELLATION
   A beautiful galaxy-like effect with mouse interaction
*/
const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
let shootingStars = [];
let mouse = { x: null, y: null, radius: 150 };

// Configuration
const CONFIG = {
  particleCount: 150,
  connectionDistance: 130,
  particleSpeed: 0.3,
  mouseRepelForce: 0.12,
  flowSpeed: 0.15,
  waveAmplitude: 0.3,
  colors: {
    primary: { r: 158, g: 220, b: 42 },    // Green
    secondary: { r: 0, g: 200, b: 255 },    // Cyan
    tertiary: { r: 163, g: 230, b: 53 }     // Lime
  }
};

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initParticles();
}

// Particle class
class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2.5 + 0.5;
    this.baseSpeedX = (Math.random() - 0.5) * CONFIG.particleSpeed;
    this.baseSpeedY = (Math.random() - 0.5) * CONFIG.particleSpeed;
    this.speedX = this.baseSpeedX;
    this.speedY = this.baseSpeedY;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.pulseSpeed = Math.random() * 0.02 + 0.01;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.waveOffset = Math.random() * Math.PI * 2;
    this.depth = Math.random(); // For parallax effect
    
    // Assign color based on position
    const colorMix = Math.random();
    if (colorMix < 0.6) {
      this.color = CONFIG.colors.primary;
    } else if (colorMix < 0.85) {
      this.color = CONFIG.colors.secondary;
    } else {
      this.color = CONFIG.colors.tertiary;
    }
  }
  
  update(time) {
    // Pulse effect
    this.pulsePhase += this.pulseSpeed;
    const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
    this.currentOpacity = this.opacity * pulse;
    this.currentSize = this.size * (0.8 + pulse * 0.4);
    
    // Continuous flowing motion - wave pattern
    const waveX = Math.sin(time * 0.001 + this.waveOffset) * CONFIG.waveAmplitude;
    const waveY = Math.cos(time * 0.0008 + this.waveOffset * 1.3) * CONFIG.waveAmplitude;
    
    // Add flow direction (diagonal drift)
    const flowX = CONFIG.flowSpeed * (0.3 + this.depth * 0.4);
    const flowY = CONFIG.flowSpeed * (0.2 + this.depth * 0.3);
    
    // Mouse interaction - particles flow away from cursor
    let mouseForceX = 0;
    let mouseForceY = 0;
    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        mouseForceX = Math.cos(angle) * force * CONFIG.mouseRepelForce * 3;
        mouseForceY = Math.sin(angle) * force * CONFIG.mouseRepelForce * 3;
      }
    }
    
    // Combine all movement
    this.speedX = this.baseSpeedX + waveX + flowX + mouseForceX;
    this.speedY = this.baseSpeedY + waveY + flowY + mouseForceY;
    
    // Apply velocity
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Wrap around edges smoothly
    if (this.x < -50) this.x = width + 50;
    if (this.x > width + 50) this.x = -50;
    if (this.y < -50) this.y = height + 50;
    if (this.y > height + 50) this.y = -50;
  }
  
  draw() {
    const { r, g, b } = this.color;
    
    // Outer glow
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.currentSize * 4
    );
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.currentOpacity * 0.4})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.currentSize * 4, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Core
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.currentOpacity})`;
    ctx.fill();
  }
}

// Shooting star class
class ShootingStar {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * width * 1.5;
    this.y = -10;
    this.length = Math.random() * 80 + 40;
    this.speed = Math.random() * 8 + 6;
    this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    this.opacity = 1;
    this.active = false;
    this.trail = [];
  }
  
  activate() {
    this.active = true;
    this.x = Math.random() * width;
    this.y = -10;
    this.opacity = 1;
    this.trail = [];
  }
  
  update() {
    if (!this.active) return;
    
    this.trail.unshift({ x: this.x, y: this.y });
    if (this.trail.length > 20) this.trail.pop();
    
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    
    if (this.y > height + 50 || this.x > width + 50) {
      this.active = false;
    }
  }
  
  draw() {
    if (!this.active || this.trail.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(this.trail[0].x, this.trail[0].y);
    
    for (let i = 1; i < this.trail.length; i++) {
      ctx.lineTo(this.trail[i].x, this.trail[i].y);
    }
    
    const gradient = ctx.createLinearGradient(
      this.trail[0].x, this.trail[0].y,
      this.trail[this.trail.length - 1].x, this.trail[this.trail.length - 1].y
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    gradient.addColorStop(0.3, "rgba(158, 220, 42, 0.6)");
    gradient.addColorStop(1, "rgba(158, 220, 42, 0)");
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
    
    // Bright head
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < CONFIG.particleCount; i++) {
    particles.push(new Particle());
  }
  
  shootingStars = [];
  for (let i = 0; i < 3; i++) {
    shootingStars.push(new ShootingStar());
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < CONFIG.connectionDistance) {
        const opacity = (1 - distance / CONFIG.connectionDistance) * 0.15;
        
        // Gradient line between two particles
        const gradient = ctx.createLinearGradient(
          particles[i].x, particles[i].y,
          particles[j].x, particles[j].y
        );
        
        const c1 = particles[i].color;
        const c2 = particles[j].color;
        gradient.addColorStop(0, `rgba(${c1.r}, ${c1.g}, ${c1.b}, ${opacity})`);
        gradient.addColorStop(1, `rgba(${c2.r}, ${c2.g}, ${c2.b}, ${opacity})`);
        
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

// Draw ambient gradient orbs in background
function drawAmbientOrbs() {
  const time = Date.now() * 0.0005;
  
  // Large floating orb 1
  const orb1X = width * 0.3 + Math.sin(time) * 100;
  const orb1Y = height * 0.4 + Math.cos(time * 0.7) * 80;
  const gradient1 = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, 300);
  gradient1.addColorStop(0, "rgba(118, 185, 0, 0.03)");
  gradient1.addColorStop(1, "rgba(118, 185, 0, 0)");
  ctx.fillStyle = gradient1;
  ctx.fillRect(0, 0, width, height);
  
  // Large floating orb 2
  const orb2X = width * 0.7 + Math.cos(time * 0.8) * 120;
  const orb2Y = height * 0.6 + Math.sin(time * 0.6) * 100;
  const gradient2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, 250);
  gradient2.addColorStop(0, "rgba(0, 200, 255, 0.025)");
  gradient2.addColorStop(1, "rgba(0, 200, 255, 0)");
  ctx.fillStyle = gradient2;
  ctx.fillRect(0, 0, width, height);
}

function animate(timestamp) {
  ctx.clearRect(0, 0, width, height);
  
  const time = timestamp || Date.now();
  
  // Draw ambient background orbs
  drawAmbientOrbs();
  
  // Update and draw connections
  drawConnections();
  
  // Update and draw particles with time for wave motion
  particles.forEach(particle => {
    particle.update(time);
    particle.draw();
  });
  
  // Handle shooting stars
  shootingStars.forEach(star => {
    star.update();
    star.draw();
  });
  
  // Randomly trigger shooting stars (more frequent)
  if (Math.random() < 0.004) {
    const inactiveStar = shootingStars.find(s => !s.active);
    if (inactiveStar) {
      inactiveStar.activate();
    }
  }
  
  requestAnimationFrame(animate);
}

// Mouse tracking
canvas.addEventListener("mousemove", function(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener("mouseleave", function() {
  mouse.x = null;
  mouse.y = null;
});

// Touch support
canvas.addEventListener("touchmove", function(e) {
  if (e.touches.length > 0) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
});

canvas.addEventListener("touchend", function() {
  mouse.x = null;
  mouse.y = null;
});

// Initialize
resize();
window.addEventListener("resize", resize);
animate();


/* 
   SCROLL REVEALS
    */
function setupReveals() {
  var els = document.querySelectorAll(".reveal");
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add("show"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function(el) { obs.observe(el); });

  // Ladder rungs animation
  var rungs = document.querySelectorAll(".ladder-rung");
  var rungObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { 
        e.target.classList.add("show"); 
        rungObs.unobserve(e.target); 
      }
    });
  }, { threshold: 0.15 });
  rungs.forEach(function(rung) { rungObs.observe(rung); });
}



/* 
   PROJECT GRID — Expandable cards
   Click "See More" to expand card and show full details.
*/
function setupProjectGrid() {
  var cards = document.querySelectorAll(".project-card");
  
  cards.forEach(function(card) {
    var btn = card.querySelector(".project-expand-btn");
    if (!btn) return;
    
    btn.addEventListener("click", function() {
      var isExpanded = card.classList.contains("expanded");
      
      // Close all other cards
      cards.forEach(function(c) {
        if (c !== card) c.classList.remove("expanded");
        var otherBtn = c.querySelector(".project-expand-btn");
        if (otherBtn) otherBtn.textContent = "See More";
      });
      
      // Toggle this card
      card.classList.toggle("expanded");
      btn.textContent = card.classList.contains("expanded") ? "See Less" : "See More";
    });
  });
}


/* 
   ENDORSEMENT AUTO-CAROUSEL
    */
function setupEndorsements() {
  var cards = document.querySelectorAll(".endorsement-card");
  if (cards.length === 0) return;

  var current = 0;
  cards[0].classList.add("active");

  setInterval(function() {
    var prev = current;
    current = (current + 1) % cards.length;
    cards[prev].classList.remove("active");
    cards[prev].classList.add("exit-left");
    cards[current].classList.add("active");

    setTimeout(function() { cards[prev].classList.remove("exit-left"); }, 700);
  }, 9000);
}


/* 
   INIT
    */
setupReveals();
setupProjectGrid();
setupEndorsements();

/* 
   PAGE LOADER
    */
window.addEventListener("load", function() {
  var loader = document.getElementById("page-loader");
  if (loader) {
    setTimeout(function() {
      loader.classList.add("hidden");
    }, 500);
  }
});

/* 
   SCROLL PROGRESS BAR
    */
function setupScrollProgress() {
  var progressBar = document.getElementById("scroll-progress");
  if (!progressBar) return;
  
  window.addEventListener("scroll", function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + "%";
  });
}
setupScrollProgress();

/* 
   ANIMATED STATS COUNTER
    */
function setupStatsCounter() {
  var statNumbers = document.querySelectorAll(".stat-number");
  if (statNumbers.length === 0) return;
  
  var animated = false;
  
  function animateNumbers() {
    if (animated) return;
    
    statNumbers.forEach(function(stat) {
      var target = parseInt(stat.getAttribute("data-target"));
      var duration = 2000;
      var step = target / (duration / 16);
      var current = 0;
      
      function updateNumber() {
        current += step;
        if (current < target) {
          stat.textContent = Math.floor(current) + "+";
          requestAnimationFrame(updateNumber);
        } else {
          stat.textContent = target + "+";
        }
      }
      
      updateNumber();
    });
    
    animated = true;
  }
  
  // Trigger when stats section comes into view
  var statsSection = document.querySelector(".stats-grid");
  if (statsSection) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          animateNumbers();
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(statsSection);
  }
}
setupStatsCounter();

/* 
   SMOOTH NAVBAR BACKGROUND ON SCROLL
    */
function setupNavbarScroll() {
  var header = document.querySelector(".site-header");
  if (!header) return;
  
  window.addEventListener("scroll", function() {
    if (window.scrollY > 100) {
      header.style.background = "rgba(15, 21, 28, 0.85)";
      header.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.3)";
    } else {
      header.style.background = "rgba(15, 21, 28, 0.35)";
      header.style.boxShadow = "none";
    }
  });
}
setupNavbarScroll();

/* 
   SKILL BADGES STAGGER ANIMATION
    */
function setupSkillBadges() {
  var badges = document.querySelectorAll(".skill-badge");
  badges.forEach(function(badge, index) {
    badge.style.opacity = "0";
    badge.style.transform = "translateY(10px)";
    badge.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    badge.style.transitionDelay = (index * 50) + "ms";
  });
  
  var skillsSection = document.getElementById("skills");
  if (skillsSection) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          badges.forEach(function(badge) {
            badge.style.opacity = "1";
            badge.style.transform = "translateY(0)";
          });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(skillsSection);
  }
}
setupSkillBadges();