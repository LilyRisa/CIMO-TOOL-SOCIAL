$(document).ready(function(){
    const notification = $('#notification');
    const message = $('#message');
    const restartButton = $('#restart-button');

    window.ipcRenderer.on('update_available', () => {
        window.ipcRenderer.removeAllListeners('update_available');
        message.text('A new update is available. Downloading now...');
        notification.removeClass('hidden');
      });
  
      window.ipcRenderer.on('update_downloaded', () => {
        window.ipcRenderer.removeAllListeners('update_downloaded');
        message.text('Update Downloaded. It will be installed on restart. Restart now?');
        restartButton.removeClass('hidden');
        notification.removeClass('hidden');
      });
});

function closeNotification() {
    notification.classList.add('hidden');
  }
  function restartApp() {
    window.ipcRenderer.send('restart_app');
  }