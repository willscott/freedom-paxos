if (freedom.paxos) { // Main Module
  freedom.on('propose', function(value) {
    freedom.paxos.propose(value);
  });

  var nodes = 0;
  freedom.paxos.on('join', function() {
    nodes += 1;
    freedom.emit('ring', nodes);
  });
  freedom.paxos.on('part', function() {
    nodes -= 1;
    freedom.emit('ring', nodes);
  });
  freedom.paxos.on('learn', function(value) {
    freedom.emit('log', value);
  });

} else { // Rendering
  // Display number active peers.
  freedom.on('ring', function(n) {
    document.getElementById('num_nodes').innerText = n - 1;
  });
  // Display status.

  // Display log.
  freedom.on('log', function(msg) {
    document.getElementById('log').innerText += msg;
  });

  // Accept proposals.
  window.addEventListener('load', function() {
    document.getElementById('new').addEventListener('submit', function(e) {
      freedom.emit('propose', document.getElementById('prop').value);
      e.preventDefault();
      return false;
    }, true);
  }, true);
}
