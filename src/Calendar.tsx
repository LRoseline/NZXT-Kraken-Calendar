import { useEffect, useState } from "react";
import { MonitoringData } from "@nzxt/web-integrations-types/v1";

import "./assets/Calendar.css";

export default function App () {
    const [date, setDate] = useState(new Date());
    const [calendarHtml, setCalendarHtml] = useState("");
    const [month, setMonth] = useState<String>("");
    const [monthNum, setMonthNum] = useState(0);

    useEffect(() => {
        const months = [
            "NONE","January","February","March","April","May","June",
            "July","August","September","October","November","December",
        ];

        const currentMonth = date.getMonth() + 1;
        setMonthNum(currentMonth);
        setMonth(months[currentMonth]);

        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const lastDate = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();

        let html = "<tr>";

        for (let i = 0; i < firstDay; i++) {
            html += "<td></td>";
        }

        for (let d = 1; d <= lastDate; d++) {
            const dayOfWeek = (firstDay + d - 1) % 7;
            const isToday = d === date.getDate();

            if (isToday) {
                html += `<td class="today">${d}</td>`;
            } else {
                if (dayOfWeek === 0) {
                    html += `<td class="rest">${d}</td>`;
                } else if (dayOfWeek === 6) {
                    html += `<td class="Saturday">${d}</td>`;
                } else {
                    html += `<td>${d}</td>`;
                }
            }

            if (dayOfWeek === 6 && d !== lastDate) {
                html += "</tr><tr>";
            }
        }

        const remaining = (7 - (firstDay + lastDate) % 7) % 7;

        for (let i = 0; i < remaining; i++) {
            html += "<td></td>";
        }

        html += "</tr>";
        setCalendarHtml(html);

    }, [date]);

    const rows = calendarHtml.split("<tr>").length - 1; 

    const [cpu, setCpu] = useState("100");
    const [gpu, setGpu] = useState("100");
    const [ram, setRam] = useState("100");
    const [liquid, setLiquid] = useState("100");

    useEffect(() => {
        window.nzxt = {
            v1: {
                onMonitoringDataUpdate: (data: MonitoringData) => {
                    const { cpus, gpus, ram, kraken } = data;

                    setCpu(JSON.stringify(cpus));
                    setGpu(JSON.stringify(gpus));
                    setRam(JSON.stringify(ram));
                    setLiquid(JSON.stringify(kraken.liquidTemperature));
                },
                width: 0,
                height: 0,
                shape: "circle",
                targetFps: 0
            }
        }
    }, []);

    return (
        <div>
            <div className="kraken-main">
                <table>
                    {rows <= 5 ?
                        <thead>
                            <tr className="day-of">
                                <th className="rest">S</th>
                                <th>M</th>
                                <th>T</th>
                                <th>W</th>
                                <th>T</th>
                                <th>F</th>
                                <th className="Saturday">S</th>
                            </tr>
                        </thead>:null
                    }
                    <tbody dangerouslySetInnerHTML={{ __html: calendarHtml }} />
                </table>
            </div>
            <div className="month">
                <div className="number">{monthNum}</div>
                <div className="script">{month}</div>
            </div>
            <div className="info">
                <div>{liquid}</div>
            </div>
            {/* <div className="circle"></div> */}
        </div>
    );
}
