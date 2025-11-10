/**
 * Dot Grid Background Effect with Inertia
 * Inspired by React Bits - creates an interactive grid of dots with physics-based motion
 */

class DotGrid {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      dotSize: options.dotSize || 16,
      dotSpacing: options.dotSpacing || 32,
      baseColor: options.baseColor || 'rgba(0, 0, 0, 0.3)',
      activeColor: options.activeColor || 'rgba(0, 0, 0, 0.8)',
      proximity: options.proximity || 150,
      speedTrigger: options.speedTrigger || 100,
      shockRadius: options.shockRadius || 250,
      shockStrength: options.shockStrength || 5,
      maxSpeed: options.maxSpeed || 5000,
      resistance: options.resistance || 750,
      returnDuration: options.returnDuration || 1.5,
      smoothing: options.smoothing || 0.15
    };

    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.dots = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.mouseVX = 0;
    this.mouseVY = 0;
    this.lastTime = 0;
    this.lastAnimTime = 0;
    this.animationFrame = null;

    this.init();
  }

  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.container.appendChild(this.canvas);

    // Get 2D context
    this.ctx = this.canvas.getContext('2d');

    // Setup resize observer
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();

    // Setup mouse tracking
    this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.container.addEventListener('mouseleave', () => this.onMouseLeave());

    // Start animation loop
    this.animate(0);
  }

  createDots() {
    this.dots = [];
    const cell = this.options.dotSize + this.options.dotSpacing;
    const cols = Math.floor((this.width + this.options.dotSpacing) / cell);
    const rows = Math.floor((this.height + this.options.dotSpacing) / cell);
    
    const gridW = cell * cols - this.options.dotSpacing;
    const gridH = cell * rows - this.options.dotSpacing;
    
    const startX = (this.width - gridW) / 2 + this.options.dotSize / 2;
    const startY = (this.height - gridH) / 2 + this.options.dotSize / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cx = startX + col * cell;
        const cy = startY + row * cell;
        
        this.dots.push({
          cx: cx,
          cy: cy,
          x: cx,
          y: cy,
          vx: 0,
          vy: 0,
          returning: false,
          returnProgress: 0
        });
      }
    }
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.width = rect.width;
    this.height = rect.height;
    
    this.ctx.scale(dpr, dpr);
    
    // Recreate dots with new dimensions
    this.createDots();
  }

  onMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    const now = performance.now();
    
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;
    
    // Calculate mouse velocity
    if (this.lastTime > 0) {
      const dt = (now - this.lastTime) / 1000;
      if (dt > 0) {
        this.mouseVX = (newX - this.lastMouseX) / dt;
        this.mouseVY = (newY - this.lastMouseY) / dt;
        
        // Cap max speed
        const speed = Math.sqrt(this.mouseVX * this.mouseVX + this.mouseVY * this.mouseVY);
        if (speed > this.options.maxSpeed) {
          const scale = this.options.maxSpeed / speed;
          this.mouseVX *= scale;
          this.mouseVY *= scale;
        }
        
        // Check if moving fast enough to trigger inertia
        if (speed > this.options.speedTrigger) {
          this.applyInertia(newX, newY, this.mouseVX, this.mouseVY);
        }
      }
    }
    
    this.lastTime = now;
    this.lastMouseX = newX;
    this.lastMouseY = newY;
    this.mouseX = newX;
    this.mouseY = newY;
  }

  onMouseLeave() {
    this.mouseX = null;
    this.mouseY = null;
  }

  applyInertia(mx, my, vx, vy) {
    this.dots.forEach(dot => {
      const dx = dot.cx - mx;
      const dy = dot.cy - my;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.options.proximity && !dot.returning) {
        // Apply inertia push
        const angle = Math.atan2(dy, dx);
        const force = (1 - distance / this.options.proximity);
        dot.vx = Math.cos(angle) * vx * 0.005 * force;
        dot.vy = Math.sin(angle) * vy * 0.005 * force;
      }
    });
  }

  easeOutElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }

  updateDot(dot, deltaTime) {
    // Apply resistance (friction)
    const resistance = 1 - (this.options.resistance * deltaTime / 1000);
    dot.vx *= Math.max(0, resistance);
    dot.vy *= Math.max(0, resistance);
    
    // Update position
    dot.x += dot.vx * deltaTime;
    dot.y += dot.vy * deltaTime;
    
    // Check if velocity is low enough to start returning
    const speed = Math.sqrt(dot.vx * dot.vx + dot.vy * dot.vy);
    if (speed < 10 && !dot.returning && (dot.x !== dot.cx || dot.y !== dot.cy)) {
      dot.returning = true;
      dot.returnProgress = 0;
      dot.vx = 0;
      dot.vy = 0;
    }
    
    // Return to original position with elastic easing
    if (dot.returning) {
      dot.returnProgress += deltaTime / (this.options.returnDuration * 1000);
      
      if (dot.returnProgress >= 1) {
        dot.x = dot.cx;
        dot.y = dot.cy;
        dot.returning = false;
        dot.returnProgress = 0;
      } else {
        const easeProgress = this.easeOutElastic(dot.returnProgress);
        dot.x = dot.cx + (dot.x - dot.cx) * (1 - easeProgress);
        dot.y = dot.cy + (dot.y - dot.cy) * (1 - easeProgress);
      }
    }
  }

  hexToRgb(hex) {
    // Handle both #fff and #ffffff formats
    let r, g, b;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    return { r, g, b };
  }

  parseColor(color) {
    // Parse rgba, rgb, or hex color
    if (color.startsWith('rgba')) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: match[4] ? parseFloat(match[4]) : 1
      };
    } else if (color.startsWith('rgb')) {
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: 1
      };
    } else if (color.startsWith('#')) {
      const rgb = this.hexToRgb(color);
      return { ...rgb, a: 1 };
    }
    return { r: 0, g: 0, b: 0, a: 1 };
  }

  drawDot(dot) {
    // Calculate distance from mouse for color transition
    let color = this.options.baseColor;
    
    if (this.mouseX !== null) {
      const dx = dot.x - this.mouseX;
      const dy = dot.y - this.mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.options.proximity) {
        const t = 1 - (distance / this.options.proximity);
        
        // Parse colors
        const baseColor = this.parseColor(this.options.baseColor);
        const activeColor = this.parseColor(this.options.activeColor);
        
        // Interpolate between base and active color
        const r = Math.round(baseColor.r + (activeColor.r - baseColor.r) * t);
        const g = Math.round(baseColor.g + (activeColor.g - baseColor.g) * t);
        const b = Math.round(baseColor.b + (activeColor.b - baseColor.b) * t);
        const a = baseColor.a + (activeColor.a - baseColor.a) * t;
        
        color = `rgba(${r}, ${g}, ${b}, ${a})`;
      }
    }
    
    this.ctx.beginPath();
    this.ctx.arc(dot.x, dot.y, this.options.dotSize / 2, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  animate(timestamp) {
    this.animationFrame = requestAnimationFrame((ts) => this.animate(ts));
    
    const deltaTime = timestamp - (this.lastAnimTime || timestamp);
    this.lastAnimTime = timestamp;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Update and draw all dots
    this.dots.forEach(dot => {
      this.updateDot(dot, deltaTime);
      this.drawDot(dot);
    });
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
  }
}

// Export for use in other scripts
window.DotGrid = DotGrid;

