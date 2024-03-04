const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

// 윈도우 크기 계산
function calculateWindowSize() {
    const aspectRatio = 9 / 21;
    const targetWidth = 320; // 고정 픽셀 가로 크기
    const targetHeight = targetWidth / aspectRatio; // 세로 크기 계산

    return { width: targetWidth, height: targetHeight };
}

// 윈도우 생성 시 기본 옵션
function createWindow() {
    const { width, height } = calculateWindowSize();
    const win = new BrowserWindow({
        width: width,
        height: height,
        resizable: false,
        frame: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
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
