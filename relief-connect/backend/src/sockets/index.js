export function setupSockets(io) {
  io.on('connection', (socket) => {
    // Optionally authenticate socket
    socket.on('volunteer:location', (payload) => {
      io.emit('volunteer:location', payload);
    });
  });
}
