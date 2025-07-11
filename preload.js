const contextBridge = require('electron').contextBridge;
const ipcRenderer = require('electron').ipcRenderer;


// Exposed protected methods in the render process
contextBridge.exposeInMainWorld(
    // Allowed 'ipcRenderer' methods
    'ipcRender', {
        // From render to main
        send: (channel, args) => {
            ipcRenderer.send(channel, args);
        },
        // From main to render
        receive: (channel, listener) => {
            ipcRenderer.on(channel, (event, ...args) => listener(...args));
        },
        // From render to main and back again
        invoke: (channel, args) => {
            return ipcRenderer.invoke(channel, args);
        }
    }
);

/**
 * Render --> Main
 * ---------------
 * Render:  window.ipcRender.send('channel', data); // Data is optional.
 * Main:    electronIpcMain.on('channel', (event, data) => { methodName(data); })
 *
 * Main --> Render
 * ---------------
 * Main:    windowName.webContents.send('channel', data); // Data is optional.
 * Render:  window.ipcRender.receive('channel', (data) => { methodName(data); });
 *
 * Render --> Main (Value) --> Render
 * ----------------------------------
 * Render:  window.ipcRender.invoke('channel', data).then((result) => { methodName(result); });
 * Main:    electronIpcMain.handle('channel', (event, data) => { return someMethod(data); });
 *
 * Render --> Main (Promise) --> Render
 * ------------------------------------
 * Render:  window.ipcRender.invoke('channel', data).then((result) => { methodName(result); });
 * Main:    electronIpcMain.handle('channel', async (event, data) => {
 *              return await promiseName(data)
 *                  .then(() => { return result; })
 *          });
 */