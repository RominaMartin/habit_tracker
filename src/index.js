import "../styles/index.scss";
/*** CONSTANTS ***/
const CALENDAR = document.getElementById("calendar");
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const CURRENT_DATE = new Date();

let testData = {  0: {0: true, 1: false, 2: true, 3: false, 4: true},
                  1: {0: false, 1: true, 2: true, 3: true, 4: true}
               };

let TASKS = {
    0: {color: "#f0f", label: "15 minutes exercise"},
    1: {color: "#f00", label: "15 minutes reading"},
    2: {color: "#0f0", label: "prepare next day food"},
    3: {color: "#ccc", label: "make bed"},
    4: {color: "#f2f", label: "dinner before 23:00"}
}

function init() {
    checkLocalStorage();
    createCalendarStructure();
}

var checkLocalStorage = () => {

    if(window.localStorage.currentMonth === undefined || window.localStorage.data === undefined) {
        localStorage.setItem("currentMonth", CURRENT_DATE.getMonth());
        let currentData = {[CURRENT_DATE.getMonth()]: {}};
        localStorage.setItem("data", JSON.stringify(currentData));
        
    } else if(window.localStorage.currentMonth !== undefined && window.localStorage.currentMonth != CURRENT_DATE.getMonth()) {
        localStorage.setItem("currentMonth", CURRENT_DATE.getMonth());
        let previousData = JSON.parse(window.localStorage.data);
        let currentData = {...previousData, [CURRENT_DATE.getMonth()]: {}};
        localStorage.setItem("data", JSON.stringify(currentData));

        // SHOW MONTH CHANGED!
    }
}

var createCalendarStructure = () => {
    const days = getDaysFromCurrentMonth();
    const startDay = getMonthDayStart();
    let currentData = getCurrentLocalStorageData();

    for(let i = 0; i < (days + startDay); i++) {
        let dayContainer = document.createElement("div");
        dayContainer.className = "dayContainer";
        if(i < startDay) {
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
                day.innerText = dayNumber < 9 ? `0${dayNumber + 1}` : dayNumber + 1;
                
                setColorTaskBackground(task, j, currentData[dayNumber][j]);

                task.onclick = () => {toggleTaskActive(dayNumber, j, task)};
                task.appendChild(day);
                dayContainer.appendChild(task);
            }
        }

        let data = {[CURRENT_DATE.getMonth()]: {...JSON.parse(window.localStorage.data), ...currentData}};
        localStorage.setItem("data", JSON.stringify(data));

        CALENDAR.appendChild(dayContainer);
    }
}

var getTaskStatus = (day, task) => {
    let currentData = getCurrentLocalStorageData();
    return currentData[day][task];
}
var setTaskStatus = (day, task, status) => {
    let currentData = getCurrentLocalStorageData();
    currentData[day][task] = status;

    let data = {[CURRENT_DATE.getMonth()]: {...JSON.parse(window.localStorage.data), ...currentData}};

    localStorage.setItem("data", JSON.stringify(data));
    // testData[day][task] = status;
}

var setColorTaskBackground = (element, task, completed) => {
    element.style.background = completed ? TASKS[task].color : "";
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

init();