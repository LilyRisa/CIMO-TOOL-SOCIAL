
$(document).ready(function(){
    const notification = $('#notification');
    const message = $('#message');
    const restartButton = $('#restart-button');

    window.ipcRender.send('check_for_update');
    console.log('check_for_update');

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

      $('#home').on('click', function(e){
        e.preventDefault();
        $('.sidenav').sidenav('close');
        renderHtml('#root', 'home.html', function(){
          let elems = $('.fixed-action-btn')
          M.FloatingActionButton.init(elems, {
            direction: 'left',
            hoverEnabled: false
          });
          let tooltip = $('.tooltipped')
          M.Tooltip.init(tooltip, []);
          
        });
    });
    renderHtml('#root', 'home.html', function(){
      let elems = $('.fixed-action-btn')
      M.FloatingActionButton.init(elems, {
        direction: 'left',
        hoverEnabled: false
      });
      let tooltip = $('.tooltipped')
      M.Tooltip.init(tooltip, []);
      
    });

      // $(document).on('click', '#home', function(e){
      //   window.ipcRender.send('home_click');
      // });
      
});

window.ipcRender.receive('app_version', (event) => {
  console.log('app_version', event);
});

function closeNotification() {
  $('#notification').classList.add('hidden');
}
function restartApp() {
  window.ipcRender.send('restart_app');
}

function renderHtml(element, file, func = null){
  $.ajax({
      url: './components/'+ file,
      dataType: 'html',
    }).done(resp => {
      $(element).html(resp);
      if(func != null){
        func();
      }
      
    });
}

