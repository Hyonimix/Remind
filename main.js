const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

// 윈도우 생성 시 기본 옵션
function createWindow() {
    const win = new BrowserWindow({
        width: 360,
        height: 640,
        resizable: false,
        frame: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            // offscreen: true
        },
        // movable: true
    });

    win.loadFile('index.html');
}

// 윈도우 생성 명령
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// 앱 종료
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
