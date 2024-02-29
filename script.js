// 앱 로드 시 실행되는 기능들 (이하 初)
// 初 내가 입력한 데이터를 localStorage에 세이브
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks)); // 할일 목록을 tasks라는 이름으로 로컬 저장소에 저장
}

// 初 localStorage에 저장된 데이터를 로드
function loadTasks() {
    const storedTasks = localStorage.getItem("tasks"); // 로컬 저장소에 저장된 tasks를 가져옴
    if (storedTasks) {
        return JSON.parse(storedTasks);
    } else {
        return [];
    }
}

// 初 초기 할일 목록 로드
const tasks = loadTasks();

// 初 Notification 허가 요청
if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            console.log("Notification 허가됨");
        } else {
            console.log("Notification 거부됨");
        }
    });
}

// 핵심 기능들 (이하 ☆)
// 핵심 기능이 손상되면 해당 앱은 제대로 사용할 수 없음
// ☆ 시간 동기화 기능
setInterval(checkNotifications, 1000);

// ☆ 알림 기능
function checkNotifications() {
    const now = new Date(); // 현재 시간 가져오기

    tasks.forEach((task) => {
        const taskDatetime = new Date(task.datetime);

        if (
            task.datetime &&
            now > taskDatetime &&
            !task.completed &&
            !isTaskInRemindList(task)
        ) {
            showNotification(task.title);
            task.notified = now.getTime(); // 알림 표시 시간 기록
            saveTasks();
            renderTasks();
        }
    });
}

// ☆ 알림 표시 함수
function showNotification(message) {
    if (Notification.permission === "granted") {
        new Notification("リマインド", { body: message });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification("リマインド", { body: message });
            }
        });
    } else {
        alert(`リマインド: ${message}`);
    }
}

// ☆ 알림 목록에 할일이 있는지 확인하는 함수
function isTaskInRemindList(task) {
    const remindList = document.getElementById("remindList");
    const remindItems = remindList.getElementsByClassName("remind");
    for (const item of remindItems) {
        if (item.innerText === task.title) {
            return true;
        }
    }
    return false;
}

// ☆ 할일 목록 렌더링
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

        const formattedDatetime = formatDate(taskDatetime);

        if (task.datetime && now > taskDatetime && !task.completed) {
            li.innerHTML = `
                        <span class="remind list-group-item">${task.title}</span>
                        <span class="remind list-group-item
                            d-flex justify-content-between align-items-center">${formattedDatetime}
                            <div class="d-flex align-items-center">
                                <button class="btn btn-warning btn-sm mr-2"
                                    style="margin-right: 10px;" onclick="snoozeTask(${task.id})">スヌーズ</button>
                                <button class="btn btn-danger btn-sm mr-2"
                                    style="margin-right: 10px;" onclick="deleteTask(${task.id})">削除</button>
                                <button class="btn btn-success btn-sm"
                                onclick="completeTask(${task.id})">完了</button>
                            </div>
                        </span>
                        `;

            remindList.appendChild(li);
        } else {
            const isCompleted =
                task.completed || (task.datetime && now > taskDatetime);

            li.innerHTML = `<span class="list-group-item
                d-flex justify-content-between align-items-center ${isCompleted ? "completed" : ""
                }">
                            <div>
                                ${task.title}
                                ${task.datetime ? `<br>${formattedDatetime}` : ""}
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

// ☆ 할일 추가
function addTask() {
    const taskInput = document.getElementById("taskInput"); // 할일 내용 입력란
    const datetimeInput = document.getElementById("datetimeInput"); // 할일 시간 입력란

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

// ☆ 할일 목록 완료 토글
function toggleCompleted(id) {
    const task = tasks.find((task) => task.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

// 일반 기능들 (이하 N)
// N 날짜 및 시간 형식 지정 함수
function formatDate(date) {
    const now = new Date();
    const diff = date.getDate() - now.getDate();

    if (diff === -2) {
        return "一昨日 " + date.toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit' }).replace(":", "時 ") + "分";
    } else if (diff === -1) {
        return "昨日 " + date.toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit' }).replace(":", "時 ") + "分";
    } else if (diff === 0) {
        return "今日 " + date.toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit' }).replace(":", "時 ") + "分";
    } else if (diff === 1) {
        return "明日 " + date.toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit' }).replace(":", "時 ") + "分";
    } else if (diff === 2) {
        return "明後日 " + date.toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit' }).replace(":", "時 ") + "分";
    } else {
        const options = { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return date.toLocaleDateString("ja-JP", options).replace(/\//g, '/') + " " + date.toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit' }).replace(":", "時 ") + "分";
    }
}

// Re-Remind 기능 (이하 R)
// R 알람 반복 기능 토글
function toggleRepeatAlarm() {
    const repeatAlarm = document.getElementById("repeatAlarm").checked;
    localStorage.setItem("repeatAlarm", repeatAlarm);
}

// R 알람 반복 기능이 켜져있다면, 10분마다 반복해서 알림 표시하도록 설정
window.onload = function () {
    const repeatAlarm = localStorage.getItem("repeatAlarm");
    if (repeatAlarm === "true") {
        setInterval(checkNotifications, 600000);
    }
};

// R 알람 반복 기능 설정 저장값 불러오기
window.onload = function () {
    const repeatAlarm = localStorage.getItem("repeatAlarm");
    if (repeatAlarm !== null) {
        document.getElementById("repeatAlarm").checked = JSON.parse(repeatAlarm);
    }
};

// 목록 접기/펼치기 기능 구현 함수들 (이하 F)
// F リマインド
function toggleRemindList() {
    $('#remindList').slideToggle();
}

// F 予定
function toggleTaskList() {
    $('#taskList').slideToggle();
}

// F 完了済み
function toggleCompletedList() {
    $('#completedList').slideToggle();
}

// 버튼 기능 구현 함수들 (이하 B)
// B 할일 목록 완료
function completeTask(id) {
    const task = tasks.find((task) => task.id === id);
    if (task) {
        task.completed = true;
        renderTasks();
    }
}

// B 할일 목록 스누즈
function snoozeTask(id) {
    const task = tasks.find((task) => task.id === id);
    if (task) {
        const now = new Date();
        const taskDatetime = new Date(task.datetime);
        taskDatetime.setMinutes(now.getMinutes() + 10);
        task.datetime = taskDatetime;
        renderTasks();
    }
}

// B 할일 목록 삭제
function deleteTask(id) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        renderTasks();
    }
}

// 앱 초기화 및 종료 (이하 E)
// E 앱 초기화
function resetApp() {
    localStorage.clear();
    location.reload();
}

// E 앱 종료
function exitApp() {
    window.close();
}

// 초기 렌더링
renderTasks();