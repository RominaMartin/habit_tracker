import "../styles/index.scss";
const CALENDAR = document.getElementById("calendar");

function createCalendarStructure () {
    for(let k = 0; k < 30; k++) {
        let dayContainer = document.createElement("div");
        dayContainer.className = "dayContainer";
        for(let i = 0; i < 5; i++) {
            let task = document.createElement("div");
            let day = document.createElement("div");

            task.className = i !== 4 ? "square" : "circle";
            day.className = "day";
            day.innerText = k < 9 ? `0${k + 1}` : k + 1; 
            task.appendChild(day);
            dayContainer.appendChild(task);
        }
    
        CALENDAR.appendChild(dayContainer);
    }
    // <div class="container">
    //         <div class="task square first"></div>
    //         <div class="task square second"></div>
    //         <div class="task square third"></div>
    //         <div class="task square fourth"></div>
    //         <div class="task circle fifth">
    //             <div class="day">1</div>
    //         </div>
    //     </div>
}

createCalendarStructure();