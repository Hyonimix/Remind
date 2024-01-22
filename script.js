// 내가 입력한 데이터를 디바이스 로컬 저장소에 세이브 및 로드
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        return JSON.parse(storedTasks);
    } else {
        return [];
    }
}

// 초기 할일 목록 로드
const tasks = loadTasks();

// 알림 기능
function checkNotifications() {
    tasks.forEach((task) => {
        const now = new Date();
        const taskDatetime = new Date(task.datetime);

        if (
            task.datetime &&
            now > taskDatetime &&
            !task.completed &&
            !task.notified &&
            !isTaskInRemindList(task)
        ) {
            alert(`リマインド: ${task.title}`);
            task.notified = true; // 알림을 한 번만 보이도록 플래그 설정
            location.reload(); // 페이지 새로고침
        }
    });
}
// 디바이스와 시간 동기화를 위해 setInterval 함수로 10초마다 checkNotifications 함수를 실행
setInterval(checkNotifications, 10000);

function isTaskInRemindList(task) {
    const remindList = document.getElementById("remindList");
    const remindItems = remindList.getElementsByClassName("remind");
    for (const item of remindItems) {
        if (item.innerText.includes(task.title)) {
            return true;
        }
    }
    return false;
}

function renderTasks() {
    const taskList = document.getElementById("taskList");
    const remindList = document.getElementById("remindList");
    const completedList = document.getElementById("completedList");
    taskList.innerHTML = "";
    remindList.innerHTML = "";
    completedList.innerHTML = "";

    tasks.forEach((task) => {
        const li = document.createElement("li");
        const now = new Date();
        const taskDatetime = new Date(task.datetime);

        if (task.datetime && now > taskDatetime && !task.completed) {
            li.innerHTML = `<span class="remind list-group-item">${task.title}</span>
                            <span class="remind list-group-item">${task.datetime}
                                <button class="btn btn-success btn-sm ml-2" onclick="completeTask(${task.id})">完了</button>
                            </span>`;
            remindList.appendChild(li);
        } else {
            const isCompleted =
                task.completed || (task.datetime && now > taskDatetime);

            li.innerHTML = `<span class="list-group-item d-flex justify-content-between align-items-center ${isCompleted ? "completed" : ""
                }">
                              <div>
                                ${task.title}
                                ${task.datetime ? `<br>${task.datetime}` : ""}
                              </div>
                              <div>
                                ${isCompleted
                    ? `<button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">削除</button>`
                    : ""
                }
                                ${!isCompleted
                    ? `<button class="btn btn-success btn-sm ml-2" onclick="completeTask(${task.id})">完了</button>`
                    : ""
                }
                              </div>
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
    const taskInput = document.getElementById("taskInput");
    const datetimeInput = document.getElementById("datetimeInput");

    // 할일 내용 또는 시간이 입력되지 않았을 경우 추가되지 않도록 함
    if (!taskInput.value && !datetimeInput.value) {
        alert("内容と予定時間を入力してください。");
    } else if (!taskInput.value) {
        alert("内容を入力してください。");
    } else if (!datetimeInput.value) {
        alert("下のテキストボックスをタップして日付と時間を入力してください。");
    } else {
        const newTask = {
            id: tasks.length + 1,
            title: taskInput.value,
            datetime: datetimeInput.value,
            completed: false,
        };
        tasks.push(newTask);
        renderTasks();
        taskInput.value = "";
        datetimeInput.value = "";
    }
}

function toggleCompleted(id) {
    const task = tasks.find((task) => task.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

function toggleCompletedList() {
    const completedList = document.getElementById("completedList");
    completedList.classList.toggle("show");
}

function completeTask(id) {
    const task = tasks.find((task) => task.id === id);
    if (task) {
        task.completed = true;
        renderTasks();
    }
}

function deleteTask(id) {
    const index = tasks.findIndex((task) => task.id === id);
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
