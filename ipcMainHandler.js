const { ipcMain, dialog } = require('electron');

const {countVideosInDirectory} = require('./helper/video')

function setupIPCMainHandlers(mainWindow) {
  ipcMain.on('openFolderDialog', (event, args) => {
    dialog.showOpenDialog(mainWindow, {
      title: 'Chọn Thư Mục',
      properties: ['openDirectory']
    }).then(result => {
      if (!result.canceled) {
        const selectedFolder = result.filePaths[0];
        const countvideo = countVideosInDirectory(selectedFolder);
        event.reply('ReopenFolderDialog', {selectedFolder, countvideo});
      }
    }).catch(err => {
      console.error(err);
    });
  });


}

module.exports = { setupIPCMainHandlers };