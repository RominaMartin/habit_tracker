import "../styles/index.scss";
/*** CONSTANTS ***/
const CALENDAR = document.getElementById("calendar");
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const CURRENT_DATE = new Date();

function init() {
    console.log(getDaysFromCurrentMonth());
    console.log(getMonthDayStart());
    createCalendarStructure();
}
/*** UTILS ***/
var getDaysFromCurrentMonth = () => new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth() + 1, 0).getDate();
var getMonthDayStart = () => {
    let startDay = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth(), 1).getDay();
    return startDay === 0 ? 6 : (startDay - 1);
}

var createCalendarStructure = () => {
    const days = getDaysFromCurrentMonth();
    const startDay = getMonthDayStart();

    for(let i = 0; i < (days + startDay); i++) {
        let dayContainer = document.createElement("div");
        dayContainer.className = "dayContainer";
        if(i < startDay) {
            // Add class to empty start
        } else {
            let dayNumber = i - startDay;
            for(let j = 0; j < 5; j++) {
                let task = document.createElement("div");
                let day = document.createElement("div");
    
                task.className = j !== 4 ? "square" : "circle";
                day.className = "day";
                day.innerText = dayNumber < 9 ? `0${dayNumber + 1}` : dayNumber + 1; 
                task.appendChild(day);
                dayContainer.appendChild(task);
            }
        }
    
        CALENDAR.appendChild(dayContainer);
    }
}

init();