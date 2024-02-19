$(document).ready(function(){
    const notification = $('#notification');
    const message = $('#message');
    const restartButton = $('#restart-button');

    window.ipcRender.send('check_for_update');

    window.ipcRender.receive('check_for_update', (event) => {
      console.log('check_for_update', event);
        // window.ipcRender.removeAllListeners('update_available');
        if(event.status){
          message.text('Đã có bản cập nhật mới. Đang tải xuống ngay bây giờ...');
          notification.removeClass('hidden');
          window.ipcRender.send('download_update');
        }
        
      });
  
      window.ipcRender.receive('download_update', (event) => {
        console.log('download_update', event);
        // window.ipcRenderer.removeAllListeners('update_downloaded');
        if(event.status){
          message.text('Đã tải xuống bản cập nhật. Nó sẽ được cài đặt khi khởi động lại. Khởi động lại bây giờ?');
          restartButton.removeClass('hidden');
          notification.removeClass('hidden');
        }
        
      });
});

function closeNotification() {
    notification.classList.add('hidden');
  }
  function restartApp() {
    window.ipcRender.send('restart_app');
  }