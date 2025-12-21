/**
 * Start all microservices concurrently
 * Run with: node start-services.js
 * 
 * NOTE: This starts services for LOCAL DEVELOPMENT without Docker.
 * For the full experience with Traefik API Gateway, use:
 *   docker-compose up
 * 
 * Traefik Dashboard: http://localhost:8080
 * API Gateway: http://localhost (port 80)
 */

const { spawn } = require('child_process');
const path = require('path');

const services = [
  { name: 'user-service', port: 3001, dir: 'services/user-service' },
  { name: 'product-service', port: 3002, dir: 'services/product-service' },
  { name: 'cart-service', port: 3003, dir: 'services/cart-service' },
  { name: 'order-service', port: 3004, dir: 'services/order-service' },
  { name: 'payment-service', port: 3005, dir: 'services/payment-service' },
  { name: 'notification-service', port: 3006, dir: 'services/notification-service' },
  // Note: Traefik API Gateway runs via Docker, not here.
  // Use 'docker-compose up traefik' to start the gateway.
];

const processes = [];

console.log('🚀 Starting E-Commerce Microservices Platform...\n');
console.log('💡 TIP: For Traefik API Gateway, run: docker-compose up traefik\n');

services.forEach((service) => {
  const servicePath = path.join(__dirname, service.dir);

  console.log(`📦 Starting ${service.name} on port ${service.port}...`);

  const proc = spawn('npm', ['run', 'dev'], {
    cwd: servicePath,
    shell: true,
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: service.port.toString(),
    },
  });

  processes.push({ name: service.name, process: proc });

  proc.on('error', (error) => {
    console.error(`❌ Error starting ${service.name}:`, error.message);
  });

  proc.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`❌ ${service.name} exited with code ${code}`);
    }
  });
});

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down all services...');
  processes.forEach(({ process: proc }) => {
    proc.kill('SIGINT');
  });
  setTimeout(() => {
    process.exit(0);
  }, 2000);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down all services...');
  processes.forEach(({ process: proc }) => {
    proc.kill('SIGTERM');
  });
  setTimeout(() => {
    process.exit(0);
  }, 2000);
});

console.log('\n✅ All services starting...');
console.log('📝 Press Ctrl+C to stop all services\n');

