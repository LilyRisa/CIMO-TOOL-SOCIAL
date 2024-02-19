const {renderHtml} = require('./bundle')


document.addEventListener('keyup', ({ key, ctrlKey, shiftKey, metaKey, altKey }) => {
    if (
        key === 'F12' ||
        (ctrlKey && shiftKey && key === 'I') ||
        (metaKey && altKey && key === 'i')
    ) {
        window.ipcRender.send('open_devtool');
    }
});

$(document).ready(function(){
    $('.sidenav').sidenav();
    window.ipcRender.send('crontab_tiktok');

  //tiktok download file save
  $(document).on('click','#download_save_tik', function(e){
    e.preventDefault();
    let data = {};
    data.folder_video = $('#tik-folder').val();
    data.proxy = $('#proxy_list').val();
    data.cookie = $('#cookie_tik').val();
    data.desc = $('#desc_tik').val();
    data.crontab = $('#crontab_tik').val();
    data.crontab_status = $('#crontab_tik_status').val();
    data.category = 'tiktok_auto_upload_video';
    data = JSON.stringify(data);
    window.ipcRender.send('save_tik_file', data);
    window.ipcRender.receive('save_tik_file', (event) => {
      console.log(event);
      M.toast({
          html: "Đã lưu file tại đường dẫn:\n"+event,
          displayLength: 10000
        });
  });
  })

  $(document).on('click', '.select-tik-proxy', function(){
    window.ipcRender.send('openFile','proxy');
    window.ipcRender.receive('openFileproxy', (event) => {
        $('#tik_path_proxy').html(event.filePath);
        $('#proxy_list').val(event.data);
        M.textareaAutoResize($('#proxy_list'));
        // $('#proxy_list').trigger('autoresize');
    });
  });
  $(document).on('click', '.select-tik-desc', function(){
    window.ipcRender.send('openFile','desc');
    window.ipcRender.receive('openFiledesc', (event) => {
        $('#tik_path_desc').html(event.filePath);
        $('#desc_tik').val(event.data);
        M.textareaAutoResize($('#desc_tik'));
        // $('#proxy_list').trigger('autoresize');
    });
  });
  $(document).on('click', '.select-tik-cookie', function(){
    window.ipcRender.send('openFile','cookie');
    window.ipcRender.receive('openFilecookie', (event) => {
        $('#tik_path_cookie').html(event.filePath);
        $('#cookie_tik').val(event.data);
        M.textareaAutoResize($('#cookie_tik'));
        // $('#proxy_list').trigger('autoresize');
    });
  })
    

    // tiktok click
    $('#tiktok-navbar').on('click', function(){
        $('.sidenav').sidenav('close');
        renderHtml('#root', 'tiktok.html', function(){
          let elems = $('.fixed-action-btn')
          M.FloatingActionButton.init(elems, {
            direction: 'left',
            hoverEnabled: false
          });
          let tooltip = $('.tooltipped')
          M.Tooltip.init(tooltip, []);
        });
    });


    $(document).on('click','.select-tik-folder', function(e){
        e.preventDefault();
        console.log('open folder');
        window.ipcRender.send('openFolderDialog');
    })
    console.log(window.ipcRender);
    window.ipcRender.receive('ReopenFolderDialog', (event) => {
        $('.path-tik-video').html(`Đường dẫn thư mục: <i>${event.selectedFolder}<i><p> Số video: <i>${event.countvideo}</i>`);
        $('#tik-folder').val(event.selectedFolder);
    });

    $(document).on('click','#upload_save_tik', function(e){
      window.ipcRender.send('openFile', 'SaveTiktok');
      window.ipcRender.receive('openFileSaveTiktok', (event) => {
        let data = JSON.parse(event.data);
        if(typeof data.category === 'undefined'){
          M.toast({
            html: "File không hợp lệ",
            displayLength: 10000,
            classes: 'red'
          });
          return;
        }
        if(data.category == 'tiktok_auto_upload_video'){
          window.ipcRender.send('checkCountVideoInPath', data.folder_video);
          window.ipcRender.receive('checkCountVideoInPath', (event) => {
            $('.path-tik-video').html(`Đường dẫn thư mục: <i>${event.selectedFolder}<i><p> Số video: <i>${event.countvideo}</i>`);
            $('#tik-folder').val(event.selectedFolder);
          })
          // $('#tik-folder').val(data.folder_video);
          $('#proxy_list').val(data.proxy);
          M.textareaAutoResize($('#proxy_list'));
          $('#cookie_tik').val(data.cookie);
          M.textareaAutoResize($('#cookie_tik'));
          $('#crontab_tik').val(data.crontab);
          M.textareaAutoResize($('#crontab_tik'));
          $('#desc_tik').val(data.desc);
          M.textareaAutoResize($('#desc_tik'));
          $('#crontab_tik_status').val(data.crontab_status);
          M.toast({
            html: "Load thành công file:\n"+event.filePath,
            displayLength: 10000,
            classes: 'green'
          });
        }else{
          M.toast({
            html: "File không hợp lệ",
            displayLength: 10000,
            classes: 'red'
          });
        }

    });
    });

    $(document).on('click', '#tik-submit', function(e){
      e.preventDefault();
      if($('#tik-folder').val().length == 0 || $('#cookie_tik').val().length == 0 || $('#crontab_tik').val().length == 0){
        M.toast({
          html: "Thiếu dữ liệu cần thiết như folder video, cookie, crontab",
          displayLength: 10000,
          classes: 'red'
        });
        return;

      }
      let data = {};
      data.folder_video = $('#tik-folder').val();
      data.proxy = $('#proxy_list').val();
      data.cookie = $('#cookie_tik').val();
      data.desc = $('#desc_tik').val();
      data.crontab = $('#crontab_tik').val();
      data.crontab_status = $('#crontab_tik_status').val();
      data.category = 'tiktok_auto_upload_video';
      data = JSON.stringify(data);
      window.ipcRender.send('tiktokStartSaveFile', data);
      window.ipcRender.receive('tiktokStartSaveFile', (event) => {
        if(event.status){
          M.toast({
            html: "Thực thi thành công",
            classes: 'green'
          });
          window.ipcRender.send('crontab_tiktok');
          
          return;
        }
        if(!event.status && event.type == 'license'){
          M.toast({
            html: "Mua gói pro để thực thi nhiều chiến dịch",
            classes: 'red'
          });
          return;
        }
        if(!event.status && event.type == 'crontab'){
          M.toast({
            html: "Crontab không đúng định dạng",
            classes: 'red'
          });
          return;
        }
        M.toast({
          html: "Lỗi không xác định:\n"+event.type,
          classes: 'red'
        });
      })

    })


  });