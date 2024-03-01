const { app, BrowserWindow, screen, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow;
let tray;

// 윈도우 크기 계산
function calculateWindowSize() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const aspectRatio = 9 / 16;
    let windowWidth, windowHeight;
    windowWidth = Math.min(width * 0.8, height * 0.8 * aspectRatio);
    windowHeight = windowWidth / aspectRatio;

    return { width: windowWidth, height: windowHeight };
}

// 윈도우 생성 시 기본 옵션
function createWindow() {
    const { width, height } = calculateWindowSize();
    mainWindow = new BrowserWindow({
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

    mainWindow.loadFile('index.html');

    // 창을 닫을 때 트레이로 최소화
    mainWindow.on('close', (event) => {
        event.preventDefault();
        mainWindow.hide();
    });
}

// 앱이 준비되면 윈도우를 생성
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // 트레이 생성
    tray = new Tray(path.join(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: '開く', click: () => mainWindow.show() },
        { label: '隠す', role: 'quit' },
        { label: '終了', click: () => mainWindow.close()}
    ]);
    tray.setToolTip('リマインド');
    tray.setContextMenu(contextMenu);
});

// 모든 창이 닫히면 애플리케이션 종료
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});