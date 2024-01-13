// Local Storage에서 할일 목록을 불러오는 함수
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        return JSON.parse(storedTasks);
    } else {
        return [];
    }
}

// Local Storage에 할일 목록을 저장하는 함수
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 초기 할일 목록 로드
const tasks = loadTasks();

const remindTasks = [];
const completedTasks = [];

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const remindList = document.getElementById('remindList');
    const completedList = document.getElementById('completedList');
    taskList.innerHTML = '';
    remindList.innerHTML = '';
    completedList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        const now = new Date();
        const taskDatetime = new Date(task.datetime);

        if (task.datetime && now > taskDatetime && !task.completed) {
            li.innerHTML = `<span class="remind">${task.title} - ${task.datetime}</span>`;
            remindList.appendChild(li);
        } else {
            const isCompleted = task.completed || (task.datetime && now > taskDatetime);

            li.innerHTML = `<span onclick="toggleCompleted(${task.id})" class="${isCompleted ? 'completed' : ''}">${task.title} - ${task.datetime}</span>`;

            if (isCompleted) {
                // 완료된 항목에 삭제 버튼 추가
                const deleteButton = document.createElement('button');
                deleteButton.innerText = '삭제';
                deleteButton.onclick = () => deleteTask(task.id);
                li.appendChild(deleteButton);
                completedList.appendChild(li);
            } else {
                taskList.appendChild(li);
            }
        }
    });

    // 변경된 할일 목록을 저장
    saveTasks();
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const datetimeInput = document.getElementById('datetimeInput');

    // 할일 내용이 입력되지 않았을 경우 추가되지 않도록 함
    if (!taskInput.value) {
        alert('할일 내용을 입력하세요.');
        return;
    }

    const newTask = { id: tasks.length + 1, title: taskInput.value, datetime: datetimeInput.value, completed: false };
    tasks.push(newTask);
    renderTasks();
    taskInput.value = '';
    datetimeInput.value = '';
}

function toggleCompleted(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

function deleteTask(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        renderTasks();
    }
}

function resetApp() {
    // Local Storage 비우기
    localStorage.clear();

    // 초기 할일 목록 로드
    tasks.length = 0;
    const loadedTasks = loadTasks();
    tasks.push(...loadedTasks);

    // 초기 렌더링
    renderTasks();
}

function openSettings() {
    const settingsMenu = document.querySelector('.settings-menu');
    settingsMenu.classList.toggle('show');
}

// 초기 렌더링
renderTasks();

// 다크 모드 토글
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        activateDarkMode();
    } else {
        deactivateDarkMode();
    }
});

// 항상 다크 모드 활성화
function activateDarkMode() {
    document.body.classList.add('dark-mode');
    document.querySelector('.navbar').classList.add('dark-mode');
}

// 다크 모드 비활성화
function deactivateDarkMode() {
    document.body.classList.remove('dark-mode');
    document.querySelector('.navbar').classList.remove('dark-mode');
}

// 다크 모드 옵션 토글
function toggleDarkMode(option) {
    if (option === 'auto') {
        // 자동 모드
        deactivateDarkMode();
    } else if (option === 'always') {
        // 항상 활성화 모드
        activateDarkMode();
    }
}

// 앱 초기화
function resetApp() {
    // 초기화 로직 추가
}

// 앱 종료
function exitApp() {
    // 종료 로직 추가
}
