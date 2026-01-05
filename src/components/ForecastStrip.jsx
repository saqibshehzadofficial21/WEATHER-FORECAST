import React, { useState, useMemo } from "react";
import sunImg from "../assets/sun.svg";
import partlyImg from "../assets/partly.svg";
import cloudImg from "../assets/cloud.svg";
import rainImg from "../assets/rain.svg";
import snowImg from "../assets/snow.svg";
import thunderImg from "../assets/thunder.svg";

function codeToType(code) {
  if (code === 0) return "clear";
  if ([1, 2, 3].includes(code)) return "partly";
  if ([45, 48].includes(code)) return "fog";
  if (code >= 51 && code <= 67) return "drizzle";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 86) return "showers";
  if (code >= 95) return "thunder";
  return "cloudy";
}

function DayTile({ day, index }) {
  const isToday = index === 0;
  const fmtDate = (d) => {
    if (!d) return null;
    try {
      // ensure YYYY-MM-DD parses as local midnight (avoid browser treating as UTC)
      let ds = d;
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) ds = d + "T00:00:00";
      const dt = new Date(ds);
      return dt.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return d;
    }
  };
  // determine icon image based on weathercode
  const type = codeToType(day.code);
  let img = partlyImg;
  if (day.code === 0) img = sunImg;
  else if (day.code >= 80 && day.code <= 86) img = rainImg;
  else if (day.code >= 51 && day.code <= 67) img = rainImg;
  else if (day.code >= 71 && day.code <= 77) img = snowImg;
  else if (day.code >= 95) img = thunderImg;
  else if ([1, 2, 3].includes(day.code)) img = partlyImg;
  else img = cloudImg;
  const maxDisplay =
    typeof day.max === "number" ? `${Math.round(day.max)}°` : "—";
  const minDisplay =
    typeof day.min === "number" ? `${Math.round(day.min)}°` : "—";
  return (
    <div className={`day-tile card ${isToday ? "today" : ""}`}>
      <div className="dt-header">
        <div>{day.day}</div>
        {day.date && (
          <div className="muted" style={{ fontSize: 12 }}>
            {fmtDate(day.date)}
          </div>
        )}
      </div>
      <div className="dt-icon">
        <img src={img} alt={day.day} width={40} height={40} />
      </div>
      <div className="dt-temp">
        <strong>{maxDisplay}</strong>{" "}
        <span className="muted">{minDisplay}</span>
      </div>
    </div>
  );
}

function ThreeDButton({ children, active, onClick }) {
  return (
    <button
      className={`three-d-btn ${active ? "active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="three-d-inner">{children}</span>
    </button>
  );
}

export default function ForecastStrip({ daily = [] }) {
  const [mode, setMode] = useState("week"); // 'week' or 'month'

  // extended strip for the top small strip
  const extra = 2;
  const extended =
    daily && daily.length ? daily.concat(daily.slice(0, extra)) : daily;

  // derive view arrays
  const weekDays = useMemo(() => {
    if (!daily || !daily.length) return [];
    return daily.slice(0, 7);
  }, [daily]);

  const monthDays = useMemo(() => {
    if (!daily) return [];
    const target = 30;
    const out = [];
    const pad = (n) => n.toString().padStart(2, "0");
    const base = new Date();
    for (let i = 0; i < target; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )}`;
      const found = (daily || []).find((x) => x.date === iso);
      if (found) out.push(found);
      else {
        const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
          d.getDay()
        ];
        out.push({ day: weekday, date: iso, max: null, min: null });
      }
    }
    return out;
  }, [daily]);

  const activeView = mode === "week" ? weekDays : monthDays;

  return (
    <div>
      <div className="forecast-strip">
        {extended.map((d, i) => (
          <DayTile key={i} day={d} index={i} />
        ))}
      </div>

      {/* New container with 3D dynamic buttons and view */}
      <div className="view-panel card" style={{ marginTop: 18 }}>
        <div className="controls" style={{ alignItems: "center" }}>
          <div className="view-toggle" style={{ display: "flex", gap: 12 }}>
            <ThreeDButton
              active={mode === "week"}
              onClick={() => setMode("week")}
            >
              Week
            </ThreeDButton>
            <ThreeDButton
              active={mode === "month"}
              onClick={() => setMode("month")}
            >
              Month
            </ThreeDButton>
          </div>
          <div className="muted" style={{ fontSize: 12 }}>
            {mode === "week" ? "Showing 7 days" : "Showing 30 days"}
          </div>
        </div>

        <div
          className={`days-grid ${mode === "month" ? "month-grid" : ""}`}
          style={{ marginTop: 12 }}
        >
          {activeView.map((d, i) => (
            <div key={i} className="grid-cell">
              <DayTile day={d} index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
