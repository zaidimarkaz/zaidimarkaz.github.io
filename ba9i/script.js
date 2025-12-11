    //--------------------------------------------
    // DÉFINIR LES PÉRIODES
    //--------------------------------------------

    // Fin totale de l'année scolaire
    window.onload = function(){

    const FIN_ANNEE = new Date("2026-07-01");

        const EVENTS = [
        // i
        { type: "i", debut: "2025-11-16", fin: "2025-11-28", couleur: "rgba(0, 0, 255, 0.1)" }, // blue transparent
        { type: "i", debut: "2026-01-18", fin: "2026-01-30", couleur: "rgba(0, 0, 255, 0.1)" }, // blue transparent
        { type: "i", debut: "2026-03-02", fin: "2026-03-13", couleur: "rgba(0, 0, 255, 0.1)" }, // blue transparent
        { type: "i", debut: "2026-05-28", fin: "2026-06-12", couleur: "rgba(0, 0, 255, 0.1)" }, // blue transparent

        // g
        { type: "g", debut: "2026-03-22", fin: "2026-04-03", couleur: "rgba(0, 128, 0, 0.1)" }, // green transparent


        // s
        { type: "s", debut: "2026-04-14", fin: "2026-04-24", couleur: "rgba(255, 0, 0, 0.1)" }, // red transparent
         // c
        { type: "c", debut: "2026-04-24", fin: "2026-04-28", couleur: "rgba(230, 255, 0, 0.1)" }, // yelllow transparent
        { type: "v", debut: "2025-12-31", fin: "2026-01-01", couleur: "rgba(240, 0, 255, 0.1)" }, // purple transparent
        { type: "v", debut: "2026-01-10", fin: "2026-01-11", couleur: "rgba(240, 0, 255, 0.1)" }, // purple transparent
        { type: "v", debut: "2026-01-13", fin: "2026-01-14", couleur: "rgba(240, 0, 255, 0.1)" }, // purple transparent
        { type: "v", debut: "2026-03-19", fin: "2026-03-21", couleur: "rgba(240, 0, 255, 0.1)" }, // purple transparent
        { type: "v", debut: "2026-05-26", fin: "2026-05-30", couleur: "rgba(240, 0, 255, 0.1)" }, // purple transparent
        { type: "v", debut: "2026-06-16", fin: "2026-06-17", couleur: "rgba(240, 0, 255, 0.1)" }, // purple transparent

        ];



    //--------------------------------------------
    // COMPTE À REBOURS
    //--------------------------------------------

function countdown(targetDate) {
    const today = new Date();
    today.setHours(0,0,0,0);
    targetDate.setHours(0,0,0,0);

    if (targetDate <= today)
        return `<div class="cd-ended">انتهى</div>`;

    // ---- TOTAL DAYS INCLUDING TODAY ----
    let totalDays = Math.floor((targetDate - today) / (1000*60*60*24));

    // ---- CALCULATE REAL MONTHS ----
    let months = 0;
    let temp = new Date(today);

    while (true) {
        let nextMonth = new Date(temp);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        if (nextMonth <= targetDate) {
            months++;
            temp = new Date(nextMonth);
        } else {
            break;
        }
    }

    // ---- FIXED: REMAINING DAYS INCLUDING TODAY ----
    let remaining = Math.floor((targetDate - temp) / (1000*60*60*24)) +1;

    const weeks = Math.floor(remaining / 7);
    const days = remaining % 7;

    return `
        <div class="res-container">

            <div class="res-top">
                <span class="res-month">${months}</span>
                <span class="label-month">شهر</span>
            </div>

            <div class="res-middle">
                <span class="res-weeks">${weeks}</span>
                <span class="label-weeks">أسابيع</span>

                <span class="res-days">${days}</span>
                <span class="label-days">أيام</span>
            </div>

            <div class="res-bottom">
                <span class="res-total">${totalDays}</span>
                <span class="label-total">يوم</span>
            </div>

        </div>
    `;
}


    //--------------------------------------------
    // RESTANTS
    //--------------------------------------------


function restantInt() {
    const today = new Date();
    today.setHours(0,0,0,0);
    let d = new Date(today);

    let totalDays = 0;

    while (d <= FIN_ANNEE) {

        // Exclure weekend
        if (d.getDay() === 0 || d.getDay() === 6) {
            d.setDate(d.getDate() + 1);
            continue;
        }

        // Exclure les jours événementiels
        const estEvent = EVENTS.some(ev => {
            const debut = new Date(ev.debut);
            const fin = new Date(ev.fin);
            return d >= debut && d <= fin;
        });

        if (!estEvent) totalDays++;

        d.setDate(d.getDate() + 1);
    }
    

    // ---- Conversion propre ----
    const months = Math.floor(totalDays / 30);
    let remaining = totalDays % 30;

    const weeks = Math.floor(remaining / 7);
    const days = remaining % 7;

    return `
        <div class="res-container">

            <div class="res-top">
                <span class="res-month">${months}</span>
                <span class="label-month">شهر</span>
            </div>

            <div class="res-middle">
                <span class="res-weeks">${weeks}</span>
                <span class="label-weeks">أسابيع</span>

                <span class="res-days">${days}</span>
                <span class="label-days">أيام</span>
            </div>

            <div class="res-bottom">
                <span class="res-total">${totalDays}</span>
                <span class="label-total">يوم</span>
            </div>

        </div>
    `;
}







    //--------------------------------------------
    // CALENDRIER COMPLET
    //--------------------------------------------


    const arabicMonths = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","شتنبر","أكتوبر","نوفمبر","ديسمبر"];
    const arabicWeekdays = ["الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت","الأحد"];


    const start = new Date(2024, 8, 1); 
    const end   = new Date(2026, 5, 30);

    function genererCalendrier() {
        const container = document.getElementById("calendarContainer");
        let current = new Date(start.getFullYear(), start.getMonth(), 1);
        const today = new Date();

        while (current <= end) {
            let year = current.getFullYear();
            let month = current.getMonth();

            // Skip past months
            if (year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth())) {
                current.setMonth(current.getMonth() + 1);
                continue; // don't generate this month
            }

            const monthDiv = document.createElement("div");
            monthDiv.className = "month";

            monthDiv.innerHTML = `
                <h2>${arabicMonths[month]} ${year}</h2>
                <div class="weekdays">
                    ${arabicWeekdays.map(d => `<div>${d}</div>`).join("")}
                </div>
                <div class="days" id="days-${year}-${month}"></div>
            `;

            container.appendChild(monthDiv);
            remplirJours(year, month, today); // pass today to mark past days
            current.setMonth(current.getMonth() + 1);
        }
    }



    function remplirJours(year, month, today) {
        today.setHours(0,0,0,0);

        const daysContainer = document.getElementById(`days-${year}-${month}`);
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startWeekDay = (firstDay.getDay() + 6) % 7;

        // empty cells
        for (let i = 0; i < startWeekDay; i++) {
            const empty = document.createElement("div");
            empty.className = "empty";
            daysContainer.appendChild(empty);
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const div = document.createElement("div");
            div.textContent = day;

            const currentDate = new Date(year, month, day);
            currentDate.setHours(0,0,0,0);

            // -------- TODAY --------
            if (currentDate.getTime() === today.getTime()) {
                div.style.background = "1";
                div.style.background = "#97f994";
                div.style.borderRadius = "50%";
                div.style.fontWeight = "700";
            }
            // -------- PAST DAYS --------
            else if (currentDate < today) {
                div.style.opacity = "0.2";
            }
            // -------- FUTURE DAYS --------
            else {
                div.style.opacity = "1";
            }

            // events
            EVENTS.forEach(ev => {
                const debut = new Date(ev.debut);
                const fin = new Date(ev.fin);

                if (currentDate >= debut && currentDate <= fin) {
                    div.style.backgroundColor = ev.couleur;
                    div.title = ev.type;
                }
            });

            daysContainer.appendChild(div);
        }
    }


    //--------------------------------------------
    // LANCEMENT
    //--------------------------------------------
    genererCalendrier();

    setInterval(() => {
        document.getElementById("countdownTotal").innerHTML = countdown(FIN_ANNEE);
        document.getElementById("countdownInt").innerHTML = restantInt();
    }, 1000);
    };
