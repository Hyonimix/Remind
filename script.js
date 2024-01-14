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
            li.innerHTML = `<span class="remind list-group-item">${task.title} - ${task.datetime}
                                <button class="btn btn-success btn-sm ml-2" onclick="completeTask(${task.id})">완료</button>
                            </span>`;
            remindList.appendChild(li);
        } else {
            const isCompleted = task.completed || (task.datetime && now > taskDatetime);

            li.innerHTML = `<span class="list-group-item d-flex justify-content-between align-items-center ${isCompleted ? 'completed' : ''}">
                              ${task.title} - ${task.datetime || ''}
                              ${isCompleted ? `<button class="btn btn-danger btn-sm ml-2" onclick="deleteTask(${task.id})">削除</button>` : ''}
                              ${!isCompleted ? `<button class="btn btn-success btn-sm ml-2" onclick="completeTask(${task.id})">完了</button>` : ''}
                            </span>`;

            if (isCompleted) {
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
        alert('内容を入力してください。');
        return;
    }

    // 기본값으로 내일 00시 설정
    const defaultDatetime = new Date();
    defaultDatetime.setDate(defaultDatetime.getDate() + 1);
    defaultDatetime.setHours(0, 0, 0, 0);

    const newTask = {
        id: tasks.length + 1,
        title: taskInput.value,
        datetime: datetimeInput.value || defaultDatetime.toISOString(),
        completed: false
    };
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

function toggleCompletedList() {
    const completedList = document.getElementById('completedList');
    completedList.classList.toggle('show');
}

function completeTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = true;
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
    localStorage.clear();
    location.reload();
}

// 초기 렌더링
renderTasks();
