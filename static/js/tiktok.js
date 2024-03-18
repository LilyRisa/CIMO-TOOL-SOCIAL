const {renderHtml} = require('./bundle')
const Swal = require('sweetalert2');

$(document).ready(function(){
    $('.sidenav').sidenav();
    window.ipcRender.send('crontab_tiktok');


    $('.tooltipped').tooltip();

    // tiktok_load_campain();

    // setInterval(()=>{
    //   console.log('setInterval tiktok');
    //   tiktok_load_campain();
    // }, 5000);
    loop_call_tiktok();


    $('#tiktok-navbar').on('click', function(e){
      e.preventDefault();
      $('.sidenav').sidenav('close');
      renderHtml('#root', 'tiktok_list.html', function(){
        let elems = $('.fixed-action-btn')
        M.FloatingActionButton.init(elems, {
          direction: 'left',
          hoverEnabled: false
        });
        let tooltip = $('.tooltipped')
        M.Tooltip.init(tooltip, []);
        
      });
  });

  $(document).on('click','.tiktok_add', function(e){
    e.preventDefault();
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

$(document).on('click', '.back_tiktok_list',function(e){
  e.preventDefault();
  $('.sidenav').sidenav('close');
  renderHtml('#root', 'tiktok_list.html', function(){
    let elems = $('.fixed-action-btn')
    M.FloatingActionButton.init(elems, {
      direction: 'left',
      hoverEnabled: false
    });
    let tooltip = $('.tooltipped')
    M.Tooltip.init(tooltip, []);
    
  });
});

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
    // $('#tiktok-navbar').on('click', function(){
    //     $('.sidenav').sidenav('close');
    //     renderHtml('#root', 'tiktok.html', function(){
    //       let elems = $('.fixed-action-btn')
    //       M.FloatingActionButton.init(elems, {
    //         direction: 'left',
    //         hoverEnabled: false
    //       });
    //       let tooltip = $('.tooltipped')
    //       M.Tooltip.init(tooltip, []);
    //     });
    // });


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
          $('.back_tiktok_list').click();
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

    });


    $(document).on('click', '.remove_tiktok_cron', function(){
      Swal.fire({
        title: "Hủy chiến dịch?",
        text: "Thao tác này sẽ không thể hoàn tác",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa"
      }).then((result) => {
        if (result.isConfirmed) {
          let path = $(this).attr('data-path');
          let uid = $(this).attr('data-uid');
          window.ipcRender.send('remove_campain_tiktok',{path, uid});
          window.ipcRender.receive('remove_campain_tiktok', (event) => {
            if(event.status){
              $(this).closest('.tiktok_cron_result_row').remove();
            }else{
              M.toast({
                html: "Lỗi không xác định:\n"+event.error,
                classes: 'red'
              });
            }
          });
          Swal.fire({
            title: "Xóa thành công!",
            text: "Bạn đã xóa thành công chiến dịch",
            icon: "success"
          });
        }
      });
      
    });

    $(document).on('click', '.editcoookie_tiktok_edit', function(){
      let path = $(this).attr('data-path');
      console.log(path);
      $('#exampleModal .modal-body input[name=tiktok_list_path]').val(path);

      window.ipcRender.send('tiktok_get_cookie_campain_path', path);
      window.ipcRender.receive('tiktok_get_cookie_campain_path', (data) => {
        console.log(data);
        let cookie = data;
        $('#exampleModal .modal-body input[name=cookie_tiktok_edit_list]').val(cookie);
        $('#exampleModal').modal('show');

      });      
    });

    $(document).on('click', '.cookie_tiktok_edit_submit', function(){
      let path = $('input[name=tiktok_list_path]').val();
      let cookie = $('textarea[name=cookie_tiktok_edit_list]').val();
      console.log('path', path);
      console.log('cookie', cookie);
      if(path.length == 0 || cookie.length == 0){
        M.toast({
          html: "Thiếu dữ liệu",
          classes: 'red'
        });
        return;
      }
      window.ipcRender.send('tiktok_set_cookie_campain_path', {path, cookie});
      $('.cookie_tiktok_edit_close').click();
      Swal.fire({
        title: "Update thành công!",
        text: "Bạn đã cập nhật thành công chiến dịch",
        icon: "success"
      });
    });


  });

  function tiktok_load_campain(){
    return new Promise((resolve,reject)=>{
      window.ipcRender.send('tiktok_check_campain');
      window.ipcRender.receive('tiktok_check_campain', (event) => {
        let temp;
          for(let item of event){
            temp += `
            <tr class="tiktok_cron_result_row">
              <th scope="row">${item.uid}</th>
              <td>${item.status ? `<span class="d-flex justify-content-center align-items-center"><i class=" material-icons">check</i> Hoàn thành</span>` : `<span class="d-flex justify-content-center align-items-center"><i class=" material-icons">sync</i> Đang chạy</span`}</td>
              <td>Thành công: <b>${item.success}</b> | Lỗi: <b>${item.error}</b></td>
              <td><button class="btn btn-danger remove_tiktok_cron mx-1 tooltipped" data-position="bottom" data-tooltip="Hủy bỏ chiến dịch" data-path="${item.path}" >Hủy</button><button class="btn btn-danger editcoookie_tiktok_edit mx-1 tooltipped" data-position="bottom" data-tooltip="Sửa cookie" data-path="${item.path}">Update cookie</button></td>
            </tr>
            `;
    
          }
          $('.kqResult_tiktok').html(temp);
          resolve(true);
      });
    });
  
  }

  async function loop_call_tiktok(){
    await tiktok_load_campain();
    setTimeout(async ()=>{
      await loop_call_tiktok();
    }, 5000)
  }