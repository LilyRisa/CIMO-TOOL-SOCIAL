


$(document).ready(function(){
    $('.sidenav').sidenav();
    

    // tiktok click
    $('#tiktok-navbar').on('click', function(){
        $('.sidenav').sidenav('close');
        renderHtml('#root', 'tiktok.html');
    });


    $(document).on('click','.select-tik-folder', function(e){
        e.preventDefault();
        console.log('open folder');
        window.ipcRender.send('openFolderDialog');
    })
    console.log(window.ipcRender);
    window.ipcRender.receive('ReopenFolderDialog', (event) => {
        $('.path-tik-video').html(`Đường dẫn thư mục: <i>${event.selectedFolder}<i><p> Số video: <i>${event.countvideo}</i>`);
        $('#tik-folder').val(event);
    });


  });

  function renderHtml(element, file){
    $.ajax({
        url: './components/'+ file,
        dataType: 'html',
      }).done(resp => {
        $(element).html(resp);
      });
  }

