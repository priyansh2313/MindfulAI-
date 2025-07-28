import { Calendar, Mail, Phone, Smile, User } from 'lucide-react';
import React, { useRef, useState } from 'react';

export default function ElderProfile() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [user, setUser] = useState({
    name: storedUser.name || '',
    email: storedUser.email || '',
    phone: storedUser.phone || '',
    age: storedUser.age || '',
    dob: storedUser.dob || '',
    photo: storedUser.photo || '',
  });
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState(user.photo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setUser(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!user.name || !user.email) {
      setError('Name and Email are required.');
      return;
    }
    setError('');
    localStorage.setItem('user', JSON.stringify(user));
    setEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleCancel = () => {
    setUser({
      name: storedUser.name || '',
      email: storedUser.email || '',
      phone: storedUser.phone || '',
      age: storedUser.age || '',
      dob: storedUser.dob || '',
      photo: storedUser.photo || '',
    });
    setPhotoPreview(storedUser.photo || '');
    setEditing(false);
    setError('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 transition-all duration-500">
      <div className="bg-white rounded-2xl border-4 border-blue-400 p-8 shadow-2xl max-w-xl w-full animate-fadeIn">
        <div className="mb-4 text-3xl font-bold text-center flex items-center justify-center gap-2">
          <Smile className="text-blue-500" size={32} />
          Welcome, <span className="text-blue-700">{user.name || 'Elder User'}</span>!
        </div>
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <img
              src={photoPreview || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'Elder User') + '&background=8ecae6&color=023047&size=128'}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-300 object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            {editing && (
              <button
                className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                type="button"
                title="Change Photo"
              >
                <User size={20} />
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
              disabled={!editing}
            />
          </div>
        </div>
        {success && <div className="mb-4 text-green-700 font-semibold text-center animate-fadeIn">Profile updated successfully!</div>}
        {error && <div className="mb-4 text-red-600 font-semibold text-center animate-fadeIn">{error}</div>}
        <form className="flex flex-col gap-4">
          <label className="text-lg font-semibold flex items-center gap-2">
            <User size={20} className="text-blue-400" /> Full Name
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              disabled={!editing}
              className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none bg-gray-50 disabled:bg-gray-100 transition-all"
            />
          </label>
          <label className="text-lg font-semibold flex items-center gap-2">
            <Mail size={20} className="text-blue-400" /> Email
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled={!editing}
              className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none bg-gray-50 disabled:bg-gray-100 transition-all"
            />
          </label>
          <label className="text-lg font-semibold flex items-center gap-2">
            <Phone size={20} className="text-blue-400" /> Phone
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              disabled={!editing}
              className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none bg-gray-50 disabled:bg-gray-100 transition-all"
            />
          </label>
          <label className="text-lg font-semibold flex items-center gap-2">
            <span className="text-blue-400 font-bold">🎂</span> Age
            <input
              type="number"
              name="age"
              value={user.age}
              onChange={handleChange}
              disabled={!editing}
              className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none bg-gray-50 disabled:bg-gray-100 transition-all"
            />
          </label>
          <label className="text-lg font-semibold flex items-center gap-2">
            <Calendar size={20} className="text-blue-400" /> Date of Birth
            <input
              type="date"
              name="dob"
              value={user.dob}
              onChange={handleChange}
              disabled={!editing}
              className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none bg-gray-50 disabled:bg-gray-100 transition-all"
            />
          </label>
        </form>
        <div className="flex justify-center gap-4 mt-8">
          {!editing ? (
            <button
              className="py-2 px-8 bg-black text-white rounded-xl font-bold text-lg border-2 border-gray-800 hover:bg-gray-900 transition-colors shadow-md"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                className="py-2 px-8 bg-blue-700 text-white rounded-xl font-bold text-lg border-2 border-blue-800 hover:bg-blue-900 transition-colors shadow-md"
                onClick={handleSave}
                type="button"
              >
                Save
              </button>
              <button
                className="py-2 px-8 bg-gray-200 text-black rounded-xl font-bold text-lg border-2 border-gray-400 hover:bg-gray-300 transition-colors shadow-md"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.7s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: translateY(0);} }
      `}</style>
    </div>
  );
} 