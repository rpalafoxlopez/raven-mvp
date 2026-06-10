// Generate random room code
export function generateRoomCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Format date
export function formatDate(date) {
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Calculate progress percentage
export function calculateProgress(completed, total) {
  if (!total) return 0;
  return Math.round((completed / total) * 100);
}

// Get archetype color
export function getArchetypeColor(archetype) {
  const colors = {
    presence: '#e11d48',    // Red
    creativity: '#f59e0b',  // Amber
    resilience: '#10b981',  // Emerald
    charisma: '#8b5cf6',    // Violet
    discipline: '#3b82f6',  // Blue
    intuition: '#06b6d4',   // Cyan
    rebellion: '#ef4444',   // Red
    vision: '#f97316'       // Orange
  };
  return colors[archetype] || '#6b7280';
}

// Validate email
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Sanitize string
export function sanitize(str) {
  return str?.trim().replace(/[<>]/g, '') || '';
}