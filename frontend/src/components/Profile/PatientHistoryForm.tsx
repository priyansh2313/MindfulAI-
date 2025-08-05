import React, { useState } from "react";

interface PatientHistoryData {
  name: string;
  age: string;
  gender: string;
  address: string;
  conditions: string;
  medications: string;
  allergies: string;
  surgeries: string;
  emergencyContact: string;
  doctor: string;
}

const defaultData: PatientHistoryData = {
  name: "",
  age: "",
  gender: "",
  address: "",
  conditions: "",
  medications: "",
  allergies: "",
  surgeries: "",
  emergencyContact: "",
  doctor: "",
};

export default function PatientHistoryForm({ onSave, initialData }: {
  onSave: (data: PatientHistoryData) => void,
  initialData?: PatientHistoryData
}) {
  const [form, setForm] = useState<PatientHistoryData>(initialData || defaultData);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold mb-2">Patient History</h2>
      <div>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="input" required />
      </div>
      <div>
        <label>Age</label>
        <input name="age" value={form.age} onChange={handleChange} className="input" type="number" min={0} required />
      </div>
      <div>
        <label>Gender</label>
        <select name="gender" value={form.gender} onChange={handleChange} className="input" required>
          <option value="">Select</option>
          <option>Female</option>
          <option>Male</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label>Address</label>
        <input name="address" value={form.address} onChange={handleChange} className="input" />
      </div>
      <div>
        <label>Known Medical Conditions</label>
        <textarea name="conditions" value={form.conditions} onChange={handleChange} className="input" />
      </div>
      <div>
        <label>Medications</label>
        <textarea name="medications" value={form.medications} onChange={handleChange} className="input" />
      </div>
      <div>
        <label>Allergies</label>
        <textarea name="allergies" value={form.allergies} onChange={handleChange} className="input" />
      </div>
      <div>
        <label>Previous Surgeries</label>
        <textarea name="surgeries" value={form.surgeries} onChange={handleChange} className="input" />
      </div>
      <div>
        <label>Emergency Contact (Name, Relation, Number)</label>
        <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} className="input" />
      </div>
      <div>
        <label>Family Doctor (Name, Contact)</label>
        <input name="doctor" value={form.doctor} onChange={handleChange} className="input" />
      </div>
      <button type="submit" className="btn btn-primary w-full mt-2">Save History</button>
    </form>
  );
}
