import "../styles/index.scss";
/*** CONSTANTS ***/
const CALENDAR = document.getElementById("calendar");
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const CURRENT_DATE = new Date();

// let TASKS = {
//     0: {color: "#d11141", label: "15 minutes exercise"},
//     1: {color: "#00b159", label: "make bed"},
//     2: {color: "#00aedb", label: "dinner before 23:00"},
//     3: {color: "#f37735", label: "15 minutes reading"},
//     4: {color: "#ffc425", label: "prepare next day food"}
// }

function init() {
    checkLocalStorage();
    createDateInfo();
    createCalendarStructure();
    createInfoStructure();
}

var checkLocalStorage = () => {

    if(window.localStorage.currentMonth === undefined || window.localStorage.data === undefined) {
        localStorage.setItem("currentMonth", CURRENT_DATE.getMonth());
        let currentData = {[CURRENT_DATE.getMonth()]: {tasks: {}, data: {}}};
        localStorage.setItem("data", JSON.stringify(currentData));
        
    } else if(window.localStorage.currentMonth !== undefined && window.localStorage.currentMonth != CURRENT_DATE.getMonth()) {
        if(getCurrentLocalStorageData() === undefined) {
            localStorage.setItem("currentMonth", CURRENT_DATE.getMonth());
            let previousData = JSON.parse(window.localStorage.data);
            let currentData = {...previousData, [CURRENT_DATE.getMonth()]: {tasks: {}, data: {}}};

            localStorage.setItem("data", JSON.stringify(currentData));
        }
        // alert("Month changed!");
        // SHOW MONTH CHANGED!
    }
}

var createCalendarStructure = () => {
    const days = getDaysFromCurrentMonth();
    const startDay = getMonthDayStart();
    let currentData = getCurrentLocalStorageData().data;

    for(let i = 0; i < (days + startDay); i++) {
        let dayContainer = document.createElement("div");
        dayContainer.className = "dayContainer";
        if(i < startDay) {
            dayContainer.className += " emptyDay";
            // Add class to empty start
        } else {
            let dayNumber = i - startDay;

            if(currentData[dayNumber] === undefined)
                currentData[dayNumber] = {};

            for(let j = 0; j < 5; j++) {
                if(Object.keys(currentData[dayNumber]).length < 5) {
                    currentData[dayNumber][j] = false;
                }

                let task = document.createElement("div");
                let day = document.createElement("div");
    
                task.className = j !== 4 ? "square" : "circle";
                day.className = "day";
                day.innerText = task.className === "circle" ? (dayNumber < 9 ? `0${dayNumber + 1}` : dayNumber + 1) : "";
                
                setColorTaskBackground(task, j, currentData[dayNumber][j]);

                task.onclick = () => {toggleTaskActive(dayNumber, j, task)};
                task.appendChild(day);
                dayContainer.appendChild(task);
            }
        }

        let thisMonthData = {[CURRENT_DATE.getMonth()]: {tasks: getCurrentLocalStorageData().tasks, data: currentData}};
        let data = {...JSON.parse(window.localStorage.data), ...thisMonthData};
        localStorage.setItem("data", JSON.stringify(data));

        CALENDAR.appendChild(dayContainer);
    }
}

var createDateInfo = () => {
    DAY_NAMES.forEach(day => {
        let dayLabel = document.createElement("span");
        dayLabel.textContent = day;
        document.getElementById("daysLabels").appendChild(dayLabel);
    });
    document.getElementById("monthLabel").innerText = MONTH_NAMES[CURRENT_DATE.getMonth()];
}

var createInfoStructure = () => {    
    let loadedTasks = getCurrentLocalStorageData().tasks;

    for(let i = 0; i < 5; i++) {
        let label = document.createElement("li");
        let input = document.createElement("input");
        let labelSquare = document.createElement("span");


        let task = document.createElement("div");
        let day = document.createElement("div");
        
        task.className = i !== 4 ? "square" : "circle";
        day.className = "day";
        
        
        if(loadedTasks[i] !== undefined) {
            input.value = loadedTasks[i].label;
            labelSquare.style.background = loadedTasks[i].color;
            task.style.background = loadedTasks[i].color;
        }
        // input.value = TASKS[i].label;
        // labelSquare.style.background = TASKS[i].color;
        // task.style.background = TASKS[i].color;

        input.onchange = (inputData) => {taskNameChanged(i, inputData)};

        
        label.appendChild(labelSquare);
        label.appendChild(input);
        document.getElementById("taskLabels").appendChild(label);

        task.appendChild(day);
        document.getElementById("taskExample").appendChild(task);
    }
}

var taskNameChanged = (task, inputData) => {
    let value = inputData.target.value;
    let colorContainers = getTaskSquares();

    let current = getCurrentLocalStorageData();
    let currentTasks = current.tasks;

    currentTasks = {...currentTasks, [task]: {color: colorContainers[task].style.background, label: value}};

    let thisMonthData = {[CURRENT_DATE.getMonth()]: {tasks: currentTasks, data: current.data}};
    let data = {...JSON.parse(window.localStorage.data), ...thisMonthData};
    localStorage.setItem("data", JSON.stringify(data));
}

var getTaskStatus = (day, task) => {
    let currentData = getCurrentLocalStorageData().data;
    return currentData[day][task];
}

var setTaskStatus = (day, task, status) => {
    let currentData = getCurrentLocalStorageData().data;
    currentData[day][task] = status;

    let thisMonthData = {[CURRENT_DATE.getMonth()]: {tasks: getCurrentLocalStorageData().tasks, data: currentData}};
    let data = {...JSON.parse(window.localStorage.data), ...thisMonthData};
    localStorage.setItem("data", JSON.stringify(data));
}

var setColorTaskBackground = (element, task, completed) => {
    let currentTasks = getCurrentLocalStorageData().tasks;
    if(currentTasks[task] !== undefined)
        element.style.background = completed ? currentTasks[task].color : "";
    // element.style.background = completed ? TASKS[task].color : "";
}

var toggleTaskActive = (day, task, element) => {
    let completed = getTaskStatus(day, task);

    setTaskStatus(day, task, !completed);
    setColorTaskBackground(element, task, !completed);
}

/*** UTILS ***/
var getDaysFromCurrentMonth = () => new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth() + 1, 0).getDate();
var getMonthDayStart = () => {
    let startDay = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth(), 1).getDay();
    return startDay === 0 ? 6 : (startDay - 1);
}

var getCurrentLocalStorageData = () => JSON.parse(window.localStorage.data)[CURRENT_DATE.getMonth()];

var getTaskSquares = () => document.querySelectorAll("#taskLabels > li span");

init();