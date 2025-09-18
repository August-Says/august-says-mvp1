// This script is used to send log messages to the server using the Fetch API or the Beacon API.
// It checks if the Beacon API is available in the browser and uses it if possible, otherwise it falls back to the Fetch API. 
// The log messages are sent as JSON payloads to the "/api/log" endpoint.
window.sendLog = function(message) {
  const payload = JSON.stringify({ message });
  const blob = new Blob([payload], { type: 'application/json' });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/log", new Blob([JSON.stringify({ message })], { type: 'application/json' }));
  } else {
    fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  }
}