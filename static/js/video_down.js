// const {renderHtml} = require('./bundle')

// $(document).ready(function(){

    

//     $('#down_video_result').hide();

//     // video_downing  click
//     $('#video-down-navbar').on('click', function(e){
   

//         e.preventDefault();
//         $('.sidenav').sidenav('close');
//         renderHtml('#root', 'video_down.html', function(){
//         let elems = $('.fixed-action-btn')
//         M.FloatingActionButton.init(elems, {
//             direction: 'left',
//             hoverEnabled: false
//         });
//         let tooltip = $('.tooltipped')
//         M.Tooltip.init(tooltip, []);
//         });
//     });

//     $(document).on('click', '#video_file_selected', function(e){
//         e.preventDefault();
//         window.ipcRender.send('openFile', 'down');
//         window.ipcRender.receive('openFiledown', (event) => {
       
//             $('#video_file_selected').closest('.file_selected').find('.file_result').html(event.count+" link");
//             $('#file_video_down_selected_input').val(event.filePath);
            
//             // $('#proxy_list').trigger('autoresize');
//         });
//     });

//     $(document).on('click', '#video_folder_down_saved', function(e){
//         e.preventDefault();
//         window.ipcRender.send('openFolder', {type: 'video', name : 'videosave'});
//         window.ipcRender.receive('ReopenFoldervideosave', (event) => {
//             console.log(event);
       
//             $('#video_folder_down_saved').closest('.folder_selected_down_save').find('.folder_down_result').html(event.selectedFolder);
//             $('#folder_video_down_saved_input').val(event.selectedFolder);
            
//             // $('#proxy_list').trigger('autoresize');
//         });
//     });


//     $(document). on('click', '#exec_video_down', function(){
//         $('.down_video_result').show();
//         $('#exec_video').attr('disabled','');
//         // $('#exec_video').attr('class','mbuton default');
//         $('#exec_video_down').html(`Thực thi <img class="ml-1" src="./static/images/loading.svg" width="40px" height="40px">`);
//         $('.down_video_result .video_down_result_text').html(`Đang khởi động...`);
//         let args = {}

//         args.file = $('#file_video_down_selected_input').val(); 
//         args.save_video = $('#folder_video_down_saved_input').val();
        
//         console.log(args);

//         window.ipcRender.send('downvideo', args);

//     });


//     window.ipcRender.receive('downvideo_reply', (event) => {
//        console.log('downvideo_reply', event);

//        $('.down_video_result #process_bar_video_down').attr('aria-valuenow', event.phantram * 100);
//        $('.down_video_result .video_down_result_text').html(`
//         <p> Thực thi file: <b>${event.path}</b> (${event.phantram * 100}%)
//        `);
//        $('.folder_selected_save').find('.file_result').html(event.count);
       
//     });
//     window.ipcRender.receive('downvideo_reply_done', (event) => {
//         console.log('downvideo_reply_done', event);
//         $('.down_video_result .video_down_result_text').html(``);
//         $('#exec_video').find('img').remove(); 
//         $('#exec_video').removeAttr('disabled');
//         M.toast({
//             html: "Đã hoàn thành",
//             displayLength: 10000,
//             classes: 'green'
//           });
//      });
//      window.ipcRender.send('downvideodebugging');
//      window.ipcRender.receive('downvideodebugging', (event) => {
//         console.log(event);
//      });

// });