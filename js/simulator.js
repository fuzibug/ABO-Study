// Lens Simulator - Visual ray tracing and lens effects

const Simulator = {
  canvas: null,
  ctx: null,
  
  // Initialize simulator
  init: function(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return false;
    
    this.ctx = this.canvas.getContext('2d');
    return true;
  },
  
  // Draw lens with ray tracing
  drawLens: function(power, diameter = 60, numRays = 5) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    // Draw optical axis
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Calculate lens properties
    const focalLength = power !== 0 ? (1 / power) * 100 : 1000; // in pixels (scaled)
    const isPlus = power > 0;
    const lensHeight = diameter;
    const lensThickness = Math.min(20, Math.abs(power) * 3);
    
    // Draw lens shape
    this.drawLensShape(centerX, centerY, lensHeight, lensThickness, isPlus);
    
    // Draw focal points
    if (Math.abs(focalLength) < width / 2) {
      ctx.fillStyle = '#e74c3c';
      ctx.font = '12px sans-serif';
      
      if (isPlus) {
        // Plus lens - focal point on right
        ctx.beginPath();
        ctx.arc(centerX + focalLength, centerY, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText('F', centerX + focalLength + 8, centerY - 8);
      } else {
        // Minus lens - virtual focal point on left
        ctx.beginPath();
        ctx.arc(centerX + focalLength, centerY, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText('F', centerX + focalLength - 15, centerY - 8);
      }
    }
    
    // Draw incident rays
    const raySpacing = lensHeight / (numRays + 1);
    
    for (let i = 1; i <= numRays; i++) {
      const rayY = centerY - (lensHeight / 2) + (i * raySpacing);
      this.drawRay(centerX, centerY, rayY, power, focalLength, isPlus);
    }
    
    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`${power > 0 ? '+' : ''}${power.toFixed(2)}D Lens`, 10, 25);
    ctx.font = '12px sans-serif';
    ctx.fillText(`Focal Length: ${Math.abs(focalLength / 100).toFixed(1)}m`, 10, 45);
  },
  
  // Draw lens shape
  drawLensShape: function(x, y, height, thickness, isPlus) {
    const ctx = this.ctx;
    
    ctx.fillStyle = 'rgba(100, 149, 237, 0.2)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    
    if (isPlus) {
      // Convex lens (biconvex)
      ctx.beginPath();
      ctx.moveTo(x - thickness / 2, y - height / 2);
      ctx.quadraticCurveTo(x + thickness, y, x - thickness / 2, y + height / 2);
      ctx.lineTo(x - thickness / 2, y - height / 2);
      
      ctx.moveTo(x + thickness / 2, y - height / 2);
      ctx.quadraticCurveTo(x - thickness, y, x + thickness / 2, y + height / 2);
      ctx.lineTo(x + thickness / 2, y - height / 2);
      
      ctx.fill();
      ctx.stroke();
    } else {
      // Concave lens (biconcave)
      ctx.beginPath();
      ctx.moveTo(x - thickness / 2, y - height / 2);
      ctx.quadraticCurveTo(x - thickness * 2, y, x - thickness / 2, y + height / 2);
      ctx.lineTo(x - thickness / 2, y - height / 2);
      
      ctx.moveTo(x + thickness / 2, y - height / 2);
      ctx.quadraticCurveTo(x + thickness * 2, y, x + thickness / 2, y + height / 2);
      ctx.lineTo(x + thickness / 2, y - height / 2);
      
      ctx.fill();
      ctx.stroke();
    }
    
    // Draw center line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - height / 2 - 10);
    ctx.lineTo(x, y + height / 2 + 10);
    ctx.stroke();
  },
  
  // Draw individual ray
  drawRay: function(lensX, centerY, rayY, power, focalLength, isPlus) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    
    // Incident ray (from left)
    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, rayY);
    ctx.lineTo(lensX, rayY);
    ctx.stroke();
    
    // Refracted ray (after lens)
    const heightDiff = rayY - centerY;
    let endX, endY;
    
    if (isPlus) {
      // Plus lens converges rays
      const slope = -heightDiff / Math.abs(focalLength);
      endX = width;
      endY = rayY + slope * (width - lensX);
    } else {
      // Minus lens diverges rays
      const slope = heightDiff / Math.abs(focalLength);
      endX = width;
      endY = rayY + slope * (width - lensX);
    }
    
    ctx.strokeStyle = '#e74c3c';
    ctx.beginPath();
    ctx.moveTo(lensX, rayY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Virtual ray extension for minus lenses
    if (!isPlus && Math.abs(focalLength) < width / 2) {
      ctx.strokeStyle = 'rgba(231, 76, 60, 0.3)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(lensX, rayY);
      
      const virtualSlope = -heightDiff / Math.abs(focalLength);
      const virtualEndY = rayY - virtualSlope * lensX;
      ctx.lineTo(0, virtualEndY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  },
  
  // Demonstrate prism effect
  drawPrismEffect: function(basePower, apexDirection) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    // Draw prism
    const prismSize = 80;
    ctx.fillStyle = 'rgba(100, 149, 237, 0.3)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    
    // Prism shape based on direction
    ctx.beginPath();
    if (apexDirection === 'up') {
      ctx.moveTo(centerX, centerY - prismSize / 2);
      ctx.lineTo(centerX - prismSize / 2, centerY + prismSize / 2);
      ctx.lineTo(centerX + prismSize / 2, centerY + prismSize / 2);
    } else {
      ctx.moveTo(centerX, centerY + prismSize / 2);
      ctx.lineTo(centerX - prismSize / 2, centerY - prismSize / 2);
      ctx.lineTo(centerX + prismSize / 2, centerY - prismSize / 2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw incident rays
    const numRays = 5;
    for (let i = 0; i < numRays; i++) {
      const rayY = (height / (numRays + 1)) * (i + 1);
      
      // Incident ray
      ctx.strokeStyle = '#f39c12';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, rayY);
      ctx.lineTo(centerX - prismSize / 2, rayY);
      ctx.stroke();
      
      // Refracted ray (bent toward base)
      const deviation = basePower * 5; // Scale for visibility
      const endY = apexDirection === 'up' ? rayY + deviation : rayY - deviation;
      
      ctx.strokeStyle = '#e74c3c';
      ctx.beginPath();
      ctx.moveTo(centerX + prismSize / 2, rayY);
      ctx.lineTo(width, endY);
      ctx.stroke();
    }
    
    // Label
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`${basePower}△ Prism (Base ${apexDirection === 'up' ? 'Down' : 'Up'})`, 10, 25);
  },
  
  // Generate UI for simulator
  generateUI: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
      <div class="simulator-tool">
        <h3>🔬 Lens Simulator</h3>
        
        <div class="sim-controls">
          <label>Lens Power (D):
            <input type="range" id="sim-power" min="-10" max="10" step="0.25" value="2">
            <span id="sim-power-display">+2.00D</span>
          </label>
          
          <label>Number of Rays:
            <input type="range" id="sim-rays" min="3" max="9" step="1" value="5">
            <span id="sim-rays-display">5</span>
          </label>
          
          <button onclick="Simulator.updateSimulation()">Update</button>
          <button onclick="Simulator.showPrism()">Show Prism Effect</button>
        </div>
        
        <canvas id="lens-canvas" width="600" height="400"></canvas>
        
        <div class="sim-info">
          <p><strong>Blue lens:</strong> The optical element</p>
          <p><strong>Orange rays:</strong> Incident light</p>
          <p><strong>Red rays:</strong> Refracted light</p>
          <p><strong>Red dot (F):</strong> Focal point</p>
        </div>
      </div>
    `;
    
    // Initialize
    this.init('lens-canvas');
    this.drawLens(2, 60, 5);
    
    // Add event listeners
    document.getElementById('sim-power').addEventListener('input', function(e) {
      const power = parseFloat(e.target.value);
      document.getElementById('sim-power-display').textContent = 
        (power >= 0 ? '+' : '') + power.toFixed(2) + 'D';
    });
    
    document.getElementById('sim-rays').addEventListener('input', function(e) {
      document.getElementById('sim-rays-display').textContent = e.target.value;
    });
  },
  
  // Update simulation with current values
  updateSimulation: function() {
    const power = parseFloat(document.getElementById('sim-power').value);
    const rays = parseInt(document.getElementById('sim-rays').value);
    this.drawLens(power, 60, rays);
  },
  
  // Show prism demonstration
  showPrism: function() {
    this.drawPrismEffect(3, 'up');
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.Simulator = Simulator;
}
