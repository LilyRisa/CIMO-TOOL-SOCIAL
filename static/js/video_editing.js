const {renderHtml} = require('./bundle')

$(document).ready(function(){
    // video_editing  click
    $('#video-edit-navbar').on('click', function(e){
        e.preventDefault();
        $('.sidenav').sidenav('close');
        renderHtml('#root', 'video_editing.html', function(){
        let elems = $('.fixed-action-btn')
        M.FloatingActionButton.init(elems, {
            direction: 'left',
            hoverEnabled: false
        });
        let tooltip = $('.tooltipped')
        M.Tooltip.init(tooltip, []);
        });
    });

    $(document).on('click', '#video_folder_selected', function(e){
        e.preventDefault();
        window.ipcRender.send('openFolder', {type: 'video', name : 'videoselect'});
        window.ipcRender.receive('ReopenFoldervideoselect', (event) => {
            console.log(event);
       
            $('#video_folder_selected').closest('.folder_selected').find('.folder_result').html(event.selectedFolder);
            $('#video_folder_selected').closest('.folder_selected').find('.file_result').html(event.countvideo);
            $('#folder_video_selected_input').val(event.selectedFolder);
            
            // $('#proxy_list').trigger('autoresize');
        });
    });

    $(document).on('click', '#video_folder_saved', function(e){
        e.preventDefault();
        window.ipcRender.send('openFolder', {type: 'video', name : 'videosave'});
        window.ipcRender.receive('ReopenFoldervideosave', (event) => {
            console.log(event);
       
            $('#video_folder_saved').closest('.folder_selected_save').find('.folder_result').html(event.selectedFolder);
            $('#video_folder_saved').closest('.folder_selected_save').find('.file_result').html('0');
            $('#folder_video_saved_input').val(event.selectedFolder);
            
            // $('#proxy_list').trigger('autoresize');
        });
    });

    $(document).on('click', '#audio_edit_selected', function(e){
        e.preventDefault();
        window.ipcRender.send('openFolder', {type: 'audio', name : 'audioselect'});
        window.ipcRender.receive('ReopenFolderaudioselect', (event) => {
            $('#audio_path_save').val(event.selectedFolder);
            $('.video_edit_audio .result').html(`Chọn thư mục <i class="d-inline text-blue">${event.selectedFolder}</i> có tổng số <b>${event.countvideo} file</b>`);
        });

    });

    $(document). on('click', '#exec_video', function(){
        $('#exec_video').attr('disabled','');
        $('#exec_video').attr('class','mbuton default');
        $('#exec_video').html(`Thực thi <img class="ml-1" src="./static/images/loading.svg" width="40px" height="40px">`);

        let args = {}

        args.path_video = $('#folder_video_selected_input').val(); 
        args.save_video = $('#folder_video_saved_input').val();
        if ($("input[name=flip]").is(":checked")) {
            args.flip = true;
        }
        if ($("input[name=mute]").is(":checked")) {
            args.mute = true;
        }
        if ($("#audio_path_save").val().length > 0) {
            args.audio = $("#audio_path_save").val();
        }else{
            args.audio = null;
        }
        console.log(args);

        window.ipcRender.send('editvideo', args);

    });

    window.ipcRender.receive('editvideo_reply', (event) => {
       console.log('editvideo_reply'+ event);
    });

});