const { app, BrowserWindow, Tray, Menu } = require('electron');
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

    // 트레이 생성
    tray = new Tray(path.join(__dirname, 'icon.png'));

    // 트레이 클릭 시 윈도우 보이기/숨기기 토글
    tray.on('click', () => {
        win.isVisible() ? win.hide() : win.show();
    });

    // 트레이 컨텍스트 메뉴
    const contextMenu = Menu.buildFromTemplate([
        { label: '開く', click: () => win.show() },
        { label: '終了', click: () => app.quit() }
    ]);

    // 트레이에 컨텍스트 메뉴 설정
    tray.setContextMenu(contextMenu);
}

// 윈도우 생성 명령
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
    if (process.platform === 'win32') {
        app.setAppUserModelId("Remind");
    }
});

// 앱 종료
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
