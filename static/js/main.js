$(document).ready(function(){
    const notification = $('#notification');
    const message = $('#message');
    const restartButton = $('#restart-button');

    window.ipcRender.receive('update_available', (event) => {
        // window.ipcRender.removeAllListeners('update_available');
        message.text('Đã có bản cập nhật mới. Đang tải xuống ngay bây giờ...');
        notification.removeClass('hidden');
      });
  
      window.ipcRender.receive('update_downloaded', () => {
        // window.ipcRenderer.removeAllListeners('update_downloaded');
        message.text('Đã tải xuống bản cập nhật. Nó sẽ được cài đặt khi khởi động lại. Khởi động lại bây giờ?');
        restartButton.removeClass('hidden');
        notification.removeClass('hidden');
      });
});

function closeNotification() {
    notification.classList.add('hidden');
  }
  function restartApp() {
    window.ipcRender.send('restart_app');
  }