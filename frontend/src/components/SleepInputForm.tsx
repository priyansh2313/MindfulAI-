import React, { useState } from "react";

export default function SleepInputForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [sleepHour, setSleepHour] = useState("");
  const [sleepMin, setSleepMin] = useState("");
  const [sleepPeriod, setSleepPeriod] = useState("PM");
  const [wakeHour, setWakeHour] = useState("");
  const [wakeMin, setWakeMin] = useState("");
  const [wakePeriod, setWakePeriod] = useState("AM");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      sleep: { hour: sleepHour, min: sleepMin, period: sleepPeriod },
      wake: { hour: wakeHour, min: wakeMin, period: wakePeriod }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">Log Your Sleep</h2>
      <div>
        <label className="block mb-1 font-semibold">Time you slept</label>
        <div className="flex gap-2">
          <input type="number" min="1" max="12" required placeholder="HH" value={sleepHour} onChange={e => setSleepHour(e.target.value)} className="input w-16 border px-2 py-1 rounded" />
          <span>:</span>
          <input type="number" min="0" max="59" required placeholder="MM" value={sleepMin} onChange={e => setSleepMin(e.target.value)} className="input w-16 border px-2 py-1 rounded" />
          <select value={sleepPeriod} onChange={e => setSleepPeriod(e.target.value)} className="input w-20 border px-2 py-1 rounded">
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block mb-1 font-semibold">Time you woke up</label>
        <div className="flex gap-2">
          <input type="number" min="1" max="12" required placeholder="HH" value={wakeHour} onChange={e => setWakeHour(e.target.value)} className="input w-16 border px-2 py-1 rounded" />
          <span>:</span>
          <input type="number" min="0" max="59" required placeholder="MM" value={wakeMin} onChange={e => setWakeMin(e.target.value)} className="input w-16 border px-2 py-1 rounded" />
          <select value={wakePeriod} onChange={e => setWakePeriod(e.target.value)} className="input w-20 border px-2 py-1 rounded">
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>
      </div>
      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg font-semibold w-full mt-4">Get Insights</button>
    </form>
  );
}
