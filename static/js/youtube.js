const {renderHtml} = require('./bundle');
const Swal = require('sweetalert2');



$(document).ready(function(){
    window.ipcRender.send('crontab_yt');

    $('.tooltipped').tooltip();

    // setInterval(()=>{
    //   yt_load_campain();
    // }, 5000);
    loop_call_yt();

    // $('#youtube-reel-navbar').on('click', function(e){
    //     e.preventDefault();
    //     $('.sidenav').sidenav('close');
    //     renderHtml('#root', 'youtube.html', function(){
    //       let elems = $('.fixed-action-btn')
    //       M.FloatingActionButton.init(elems, {
    //         direction: 'left',
    //         hoverEnabled: false
    //       });
    //       let tooltip = $('.tooltipped')
    //       M.Tooltip.init(tooltip, []);
          
    //     });
    // });

    $('#youtube-short-navbar').on('click', function(e){
          e.preventDefault();
          $('.sidenav').sidenav('close');
          renderHtml('#root', 'youtube_list.html', function(){
            let elems = $('.fixed-action-btn')
            M.FloatingActionButton.init(elems, {
              direction: 'left',
              hoverEnabled: false
            });
            let tooltip = $('.tooltipped')
            M.Tooltip.init(tooltip, []);
            
          });
      });

      $(document).on('click', '.back_youtube_list',function(e){
        e.preventDefault();
        $('.sidenav').sidenav('close');
        renderHtml('#root', 'youtube_list.html', function(){
          let elems = $('.fixed-action-btn')
          M.FloatingActionButton.init(elems, {
            direction: 'left',
            hoverEnabled: false
          });
          let tooltip = $('.tooltipped')
          M.Tooltip.init(tooltip, []);
          
        });
    });

      

      $(document).on('click','.youtube_add', function(e){
          e.preventDefault();
          $('.sidenav').sidenav('close');
          renderHtml('#root', 'youtube.html', function(){
            let elems = $('.fixed-action-btn')
            M.FloatingActionButton.init(elems, {
              direction: 'left',
              hoverEnabled: false
            });
            let tooltip = $('.tooltipped')
            M.Tooltip.init(tooltip, []);
            
          });
    });

      



    //yt download file save
  $(document).on('click','#download_save_yt', function(e){
      e.preventDefault();
      let data = {};
      data.folder_video = $('#yt-folder').val();
      data.proxy = $('#proxy_list').val();
      data.cookie = $('#cookie_yt').val();
      data.desc = $('#desc_yt').val();
      data.title = $('#title_yt').val();
      data.page_link = $('input[name=link_page]').val();
      data.crontab = $('#crontab_yt').val();
      data.crontab_status = $('#crontab_yt_status').val();
      data.category = 'yt_auto_upload_video';
      data = JSON.stringify(data);
      window.ipcRender.send('save_yt_file', data);
      window.ipcRender.receive('save_yt_file', (event) => {
        console.log(event);
        M.toast({
            html: "Đã lưu file tại đường dẫn:\n"+event,
            displayLength: 10000
          });
    });
  });

  //yt upload file
  $(document).on('click','#upload_save_yt', function(e){
    window.ipcRender.send('openFile', 'Saveyttok');
    window.ipcRender.receive('openFileSaveyttok', (event) => {
      let data = JSON.parse(event.data);
      if(typeof data.category === 'undefined'){
        M.toast({
          html: "File không hợp lệ",
          displayLength: 10000,
          classes: 'red'
        });
        return;
      }
      if(data.category == 'yt_auto_upload_video'){
        window.ipcRender.send('checkCountVideoInPath', data.folder_video);
        window.ipcRender.receive('checkCountVideoInPath', (event) => {
          $('.path-yt-video').html(`Đường dẫn thư mục: <i>${event.selectedFolder}<i><p> Số video: <i>${event.countvideo}</i>`);
          $('#yt-folder').val(event.selectedFolder);
        })
        $('input[name=link_page]').val(data.page_link);
        $('#proxy_list').val(data.proxy);
        M.textareaAutoResize($('#proxy_list'));
        $('#cookie_yt').val(data.cookie);
        M.textareaAutoResize($('#cookie_yt'));
        $('#crontab_yt').val(data.crontab);
        M.textareaAutoResize($('#crontab_yt'));
        $('#desc_yt').val(data.desc);
        M.textareaAutoResize($('#desc_yt'));
        $('#title_yt').val(data.title);
        M.textareaAutoResize($('#title_yt'));
        $('#crontab_yt_status').val(data.crontab_status);
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

  // open folder
  $(document).on('click','.select-yt-folder', function(e){
        e.preventDefault();
        console.log('open folder');
        window.ipcRender.send('openFolder',{name: 'yt_folder'});
        window.ipcRender.receive('ReopenFolderyt_folder', (event) => {
            $('.path-yt-video').html(`Đường dẫn thư mục: <i>${event.selectedFolder}<i><p> Số video: <i>${event.countvideo}</i>`);
            $('#yt-folder').val(event.selectedFolder);
        });
    });
    

    $(document).on('click', '.select-yt-proxy', function(){
        window.ipcRender.send('openFile','proxy');
        window.ipcRender.receive('openFileproxy', (event) => {
            $('#yt_path_proxy').html(event.filePath);
            $('#proxy_list').val(event.data);
            M.textareaAutoResize($('#proxy_list'));
            // $('#proxy_list').trigger('autoresize');
        });
      });
      $(document).on('click', '.select-yt-desc', function(){
        window.ipcRender.send('openFile','desc');
        window.ipcRender.receive('openFiledesc', (event) => {
            $('#yt_path_desc').html(event.filePath);
            $('#desc_yt').val(event.data);
            M.textareaAutoResize($('#desc_yt'));
            // $('#proxy_list').trigger('autoresize');
        });
      });
      $(document).on('click', '.select-yt-title', function(){
        window.ipcRender.send('openFile','title');
        window.ipcRender.receive('openFiletitle', (event) => {
            $('#yt_path_title').html(event.filePath);
            $('#title_yt').val(event.data);
            M.textareaAutoResize($('#title_yt'));
            // $('#proxy_list').trigger('autoresize');
        });
      });
      $(document).on('click', '.select-yt-cookie', function(){
        window.ipcRender.send('openFile','cookie');
        window.ipcRender.receive('openFilecookie', (event) => {
            $('#yt_path_cookie').html(event.filePath);
            $('#cookie_yt').val(event.data);
            M.textareaAutoResize($('#cookie_yt'));
            // $('#proxy_list').trigger('autoresize');
        });
      });


      // lên lịch
      $(document).on('click', '#yt-submit', function(e){
        e.preventDefault();
        if($('#yt-folder').val().length == 0 || $('#cookie_yt').val().length == 0 || $('#crontab_yt').val().length == 0 || $('#link_page').val().length == 0){
          M.toast({
            html: "Thiếu dữ liệu cần thiết như folder video, cookie, crontab, link page",
            displayLength: 10000,
            classes: 'red'
          });
          return;
  
        }
        let data = {};
        data.folder_video = $('#yt-folder').val();
        data.proxy = $('#proxy_list').val();
        data.cookie = $('#cookie_yt').val();
        data.desc = $('#desc_yt').val();
        data.title = $('#title_yt').val();
        data.page_link = $('input[name=link_page]').val();
        data.crontab = $('#crontab_yt').val();
        data.crontab_status = $('#crontab_yt_status').val();
        data.category = 'yt_auto_upload_video';
        data = JSON.stringify(data);
        window.ipcRender.send('ytStartSaveFile', data);
        window.ipcRender.receive('ytStartSaveFile', (event) => {
          if(event.status){
            M.toast({
              html: "Thực thi thành công",
              classes: 'green'
            });
            window.ipcRender.send('crontab_yt');
            $('.back_youtube_list').click();
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

      $(document).on('click', '.remove_yt_cron', function(){
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
            window.ipcRender.send('remove_campain_yt',{path, uid});
            window.ipcRender.receive('remove_campain_yt', (event) => {
              if(event.status){
                $(this).closest('.yt_cron_result_row').remove();
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

      $(document).on('click', '.editcoookie_yt_edit', function(){
        let path = $(this).attr('data-path');
        console.log(path);
        $('#exampleModal .modal-body input[name=yt_list_path]').val(path);

        window.ipcRender.send('yt_get_cookie_campain_path', path);
        window.ipcRender.receive('yt_get_cookie_campain_path', (data) => {
          console.log(data);
          let cookie = data;
          $('#exampleModal .modal-body input[name=cookie_yt_edit_list]').val(cookie);
          $('#exampleModal').modal('show');

        });      
      });

      $(document).on('click', '.cookie_yt_edit_submit', function(){
        let path = $('input[name=yt_list_path]').val();
        let cookie = $('textarea[name=cookie_yt_edit_list]').val();
        console.log('path', path);
        console.log('cookie', cookie);
        if(path.length == 0 || cookie.length == 0){
          M.toast({
            html: "Thiếu dữ liệu",
            classes: 'red'
          });
          return;
        }
        window.ipcRender.send('yt_set_cookie_campain_path', {path, cookie});
        $('.cookie_yt_edit_close').click();
        Swal.fire({
          title: "Update thành công!",
          text: "Bạn đã cập nhật thành công chiến dịch",
          icon: "success"
        });
      });

  
});

function yt_load_campain(){
  return new Promise((resolve,reject)=>{
    window.ipcRender.send('yt_check_campain');
    window.ipcRender.receive('yt_check_campain', (event) => {
      let temp;
        for(let item of event){
          temp += `
          <tr class="yt_cron_result_row">
            <th scope="row">${item.uid}</th>
            <td>${item.status ? `<span class="d-flex justify-content-center align-items-center"><i class=" material-icons">check</i> Hoàn thành</span>` : `<span class="d-flex justify-content-center align-items-center"><i class=" material-icons">sync</i> Đang chạy</span`}</td>
            <td>Thành công: <b>${item.success}</b> | Lỗi: <b>${item.error}</b></td>
            <td><button class="btn btn-danger remove_yt_cron mx-1 tooltipped" data-position="bottom" data-tooltip="Hủy bỏ chiến dịch" data-path="${item.path}" >Hủy</button><button class="btn btn-danger editcoookie_yt_edit mx-1 tooltipped" data-position="bottom" data-tooltip="Sửa cookie" data-path="${item.path}">Update cookie</button></td>
          </tr>
          `;

        }
        $('.kqResult_yt').html(temp);
        resolve(true);
    });
  });

}

async function loop_call_yt(){
  await yt_load_campain();
  setTimeout(async ()=>{
    await loop_call_yt();
  }, 5000)
}