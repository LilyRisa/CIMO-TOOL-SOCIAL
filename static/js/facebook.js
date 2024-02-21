const {renderHtml} = require('./bundle')
const Swal = require('sweetalert2')


$(document).ready(function(){
    window.ipcRender.send('crontab_fb');

    $('.tooltipped').tooltip();

    setInterval(()=>{
      fb_load_campain();
    }, 5000);

    // $('#facebook-reel-navbar').on('click', function(e){
    //     e.preventDefault();
    //     $('.sidenav').sidenav('close');
    //     renderHtml('#root', 'facebook.html', function(){
    //       let elems = $('.fixed-action-btn')
    //       M.FloatingActionButton.init(elems, {
    //         direction: 'left',
    //         hoverEnabled: false
    //       });
    //       let tooltip = $('.tooltipped')
    //       M.Tooltip.init(tooltip, []);
          
    //     });
    // });

    $('#facebook-reel-navbar').on('click', function(e){
          e.preventDefault();
          $('.sidenav').sidenav('close');
          renderHtml('#root', 'facebook_list.html', function(){
            let elems = $('.fixed-action-btn')
            M.FloatingActionButton.init(elems, {
              direction: 'left',
              hoverEnabled: false
            });
            let tooltip = $('.tooltipped')
            M.Tooltip.init(tooltip, []);
            
          });
      });

      $(document).on('click', '.back_facebook_list',function(e){
        e.preventDefault();
        $('.sidenav').sidenav('close');
        renderHtml('#root', 'facebook_list.html', function(){
          let elems = $('.fixed-action-btn')
          M.FloatingActionButton.init(elems, {
            direction: 'left',
            hoverEnabled: false
          });
          let tooltip = $('.tooltipped')
          M.Tooltip.init(tooltip, []);
          
        });
    });

      

      $(document).on('click','.facebook_add', function(e){
          e.preventDefault();
          $('.sidenav').sidenav('close');
          renderHtml('#root', 'facebook.html', function(){
            let elems = $('.fixed-action-btn')
            M.FloatingActionButton.init(elems, {
              direction: 'left',
              hoverEnabled: false
            });
            let tooltip = $('.tooltipped')
            M.Tooltip.init(tooltip, []);
            
          });
    });

      



    //fb download file save
  $(document).on('click','#download_save_fb', function(e){
      e.preventDefault();
      let data = {};
      data.folder_video = $('#fb-folder').val();
      data.proxy = $('#proxy_list').val();
      data.cookie = $('#cookie_fb').val();
      data.desc = $('#desc_fb').val();
      data.page_link = $('input[name=link_page]').val();
      data.crontab = $('#crontab_fb').val();
      data.crontab_status = $('#crontab_fb_status').val();
      data.category = 'fb_auto_upload_video';
      data = JSON.stringify(data);
      window.ipcRender.send('save_fb_file', data);
      window.ipcRender.receive('save_fb_file', (event) => {
        console.log(event);
        M.toast({
            html: "Đã lưu file tại đường dẫn:\n"+event,
            displayLength: 10000
          });
    });
  });

  //fb upload file
  $(document).on('click','#upload_save_fb', function(e){
    window.ipcRender.send('openFile', 'Savefbtok');
    window.ipcRender.receive('openFileSavefbtok', (event) => {
      let data = JSON.parse(event.data);
      if(typeof data.category === 'undefined'){
        M.toast({
          html: "File không hợp lệ",
          displayLength: 10000,
          classes: 'red'
        });
        return;
      }
      if(data.category == 'fb_auto_upload_video'){
        window.ipcRender.send('checkCountVideoInPath', data.folder_video);
        window.ipcRender.receive('checkCountVideoInPath', (event) => {
          $('.path-fb-video').html(`Đường dẫn thư mục: <i>${event.selectedFolder}<i><p> Số video: <i>${event.countvideo}</i>`);
          $('#fb-folder').val(event.selectedFolder);
        })
        $('input[name=link_page]').val(data.page_link);
        $('#proxy_list').val(data.proxy);
        M.textareaAutoResize($('#proxy_list'));
        $('#cookie_fb').val(data.cookie);
        M.textareaAutoResize($('#cookie_fb'));
        $('#crontab_fb').val(data.crontab);
        M.textareaAutoResize($('#crontab_fb'));
        $('#desc_fb').val(data.desc);
        M.textareaAutoResize($('#desc_fb'));
        $('#crontab_fb_status').val(data.crontab_status);
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
  $(document).on('click','.select-fb-folder', function(e){
        e.preventDefault();
        console.log('open folder');
        window.ipcRender.send('openFolder',{name: 'fb_folder'});
        window.ipcRender.receive('ReopenFolderfb_folder', (event) => {
            $('.path-fb-video').html(`Đường dẫn thư mục: <i>${event.selectedFolder}<i><p> Số video: <i>${event.countvideo}</i>`);
            $('#fb-folder').val(event.selectedFolder);
        });
    });
    

    $(document).on('click', '.select-fb-proxy', function(){
        window.ipcRender.send('openFile','proxy');
        window.ipcRender.receive('openFileproxy', (event) => {
            $('#fb_path_proxy').html(event.filePath);
            $('#proxy_list').val(event.data);
            M.textareaAutoResize($('#proxy_list'));
            // $('#proxy_list').trigger('autoresize');
        });
      });
      $(document).on('click', '.select-fb-desc', function(){
        window.ipcRender.send('openFile','desc');
        window.ipcRender.receive('openFiledesc', (event) => {
            $('#fb_path_desc').html(event.filePath);
            $('#desc_fb').val(event.data);
            M.textareaAutoResize($('#desc_fb'));
            // $('#proxy_list').trigger('autoresize');
        });
      });
      $(document).on('click', '.select-fb-cookie', function(){
        window.ipcRender.send('openFile','cookie');
        window.ipcRender.receive('openFilecookie', (event) => {
            $('#fb_path_cookie').html(event.filePath);
            $('#cookie_fb').val(event.data);
            M.textareaAutoResize($('#cookie_fb'));
            // $('#proxy_list').trigger('autoresize');
        });
      });


      // lên lịch
      $(document).on('click', '#fb-submit', function(e){
        e.preventDefault();
        if($('#fb-folder').val().length == 0 || $('#cookie_fb').val().length == 0 || $('#crontab_fb').val().length == 0 || $('#link_page').val().length == 0){
          M.toast({
            html: "Thiếu dữ liệu cần thiết như folder video, cookie, crontab, link page",
            displayLength: 10000,
            classes: 'red'
          });
          return;
  
        }
        let data = {};
        data.folder_video = $('#fb-folder').val();
        data.proxy = $('#proxy_list').val();
        data.cookie = $('#cookie_fb').val();
        data.desc = $('#desc_fb').val();
        data.page_link = $('input[name=link_page]').val();
        data.crontab = $('#crontab_fb').val();
        data.crontab_status = $('#crontab_fb_status').val();
        data.category = 'fb_auto_upload_video';
        data = JSON.stringify(data);
        window.ipcRender.send('fbStartSaveFile', data);
        window.ipcRender.receive('fbStartSaveFile', (event) => {
          if(event.status){
            M.toast({
              html: "Thực thi thành công",
              classes: 'green'
            });
            window.ipcRender.send('crontab_fb');
            $('.back_facebook_list').click();
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

      $(document).on('click', '.remove_fb_cron', function(){
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
            window.ipcRender.send('remove_campain_fb',{path, uid});
            window.ipcRender.receive('remove_campain_fb', (event) => {
              if(event.status){
                $(this).closest('.fb_cron_result_row').remove();
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


  
});

function fb_load_campain(){
  window.ipcRender.send('fb_check_campain');
  window.ipcRender.receive('fb_check_campain', (event) => {
    let temp;
      for(let item of event){
        temp += `
        <tr class="fb_cron_result_row">
          <th scope="row">${item.uid}</th>
          <td>${item.status ? `<span class="d-flex justify-content-center align-items-center"><i class=" material-icons">check</i> Hoàn thành</span>` : `<span class="d-flex justify-content-center align-items-center"><i class=" material-icons">sync</i> Đang chạy</span`}</td>
          <td>Thành công: <b>${item.success}</b> | Lỗi: <b>${item.error}</b></td>
          <td><button class="btn btn-danger remove_fb_cron mx-1 tooltipped" data-position="bottom" data-tooltip="Hủy bỏ chiến dịch" data-path="${item.path}" >Hủy</button><button class="btn btn-danger remove_fb_edit mx-1 tooltipped" data-position="bottom" data-tooltip="Sửa cookie" data-path="${item.path}">Update cookie</button></td>
        </tr>
        `;

      }
      $('.kqResult_fb').html(temp);
  });

  $('.kqResult_fb')
}