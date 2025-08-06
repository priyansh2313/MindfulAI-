import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper to convert input to 24h
function to24H(hour: number, min: number, ampm: "AM" | "PM") {
  if (ampm === "AM") return hour === 12 ? 0 * 60 + min : hour * 60 + min;
  return hour === 12 ? 12 * 60 + min : (hour + 12) * 60 + min;
}

export default function SleepTrackerPage() {
  const navigate = useNavigate();
  const [bedHour, setBedHour] = useState(10);
  const [bedMin, setBedMin] = useState(0);
  const [bedAMPM, setBedAMPM] = useState<"AM" | "PM">("PM");
  const [wakeHour, setWakeHour] = useState(7);
  const [wakeMin, setWakeMin] = useState(0);
  const [wakeAMPM, setWakeAMPM] = useState<"AM" | "PM">("AM");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Calculate total sleep in minutes
    const bed = to24H(bedHour, bedMin, bedAMPM);
    const wake = to24H(wakeHour, wakeMin, wakeAMPM);
    let duration = wake - bed;
    if (duration <= 0) duration += 24 * 60;
    // Pass all data to insights page
    navigate("/sleep-insights", {
      state: {
        totalMinutes: duration,
        bedHour, bedMin, bedAMPM, wakeHour, wakeMin, wakeAMPM
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          Sleep Cycle Tracker
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700 mb-2">What time did you go to bed?</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={1} max={12}
                value={bedHour}
                onChange={e => setBedHour(Number(e.target.value))}
                className="w-16 p-2 border rounded"
                required
              />
              <span>:</span>
              <input
                type="number"
                min={0} max={59}
                value={bedMin}
                onChange={e => setBedMin(Number(e.target.value))}
                className="w-16 p-2 border rounded"
                required
              />
              <select value={bedAMPM} onChange={e => setBedAMPM(e.target.value as "AM" | "PM")} className="p-2 border rounded">
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">What time did you wake up?</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={1} max={12}
                value={wakeHour}
                onChange={e => setWakeHour(Number(e.target.value))}
                className="w-16 p-2 border rounded"
                required
              />
              <span>:</span>
              <input
                type="number"
                min={0} max={59}
                value={wakeMin}
                onChange={e => setWakeMin(Number(e.target.value))}
                className="w-16 p-2 border rounded"
                required
              />
              <select value={wakeAMPM} onChange={e => setWakeAMPM(e.target.value as "AM" | "PM")} className="p-2 border rounded">
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-lg mt-6">
            Get Insights
          </button>
        </form>
      </div>
    </div>
  );
}
