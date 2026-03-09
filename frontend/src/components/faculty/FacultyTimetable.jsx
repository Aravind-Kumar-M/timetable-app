import React, { useState, useEffect } from 'react';
import { Download, Maximize2, Minimize2, Clock, MapPin, Users } from 'lucide-react';

const FacultyTimetable = () => {
    const [isCompact, setIsCompact] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const timetableStructure = [
        { type: 'slot', id: 1, label: 'Slot 1', time: '08:00 - 08:50' },
        { type: 'slot', id: 2, label: 'Slot 2', time: '08:50 - 09:40' },
        { type: 'slot', id: 3, label: 'Slot 3', time: '09:40 - 10:30' },
        { type: 'slot', id: 4, label: 'Slot 4', time: '10:45 - 11:35' },
        { type: 'slot', id: 5, label: 'Slot 5', time: '11:35 - 12:25' },
        { type: 'slot', id: 6, label: 'Slot 6', time: '12:25 - 13:15' },
        { type: 'lunch', id: 'lb', label: 'Lunch Break', time: '13:15 - 14:05' },
        { type: 'slot', id: 7, label: 'Slot 7', time: '14:05 - 14:55' },
        { type: 'slot', id: 8, label: 'Slot 8', time: '14:55 - 15:45' },
        { type: 'slot', id: 9, label: 'Slot 9', time: '15:45 - 16:35' },
        { type: 'slot', id: 10, label: 'Slot 10', time: '16:35 - 17:25' }
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const SCHEDULE_DATA = {
        'Monday': { 1: { code: 'CS201', type: 'Lecture', room: 'Room 301', class: 'B.Tech IT - 2A' }, 2: { code: 'CS201', type: 'Lecture', room: 'Room 301', class: 'B.Tech IT - 2A' }, 4: { code: 'CS204', type: 'Lab', room: 'Lab 2', class: 'B.Tech CSE - 3B' }, 5: { code: 'CS204', type: 'Lab', room: 'Lab 2', class: 'B.Tech CSE - 3B' } },
        'Tuesday': { 2: { code: 'CS202', type: 'Lecture', room: 'Room 202', class: 'B.Tech CSE - 1A' }, 3: { code: 'CS203', type: 'Lecture', room: 'Room 205', class: 'B.Tech ECE - 2C' }, 8: { code: 'CS205', type: 'Lab', room: 'Lab 1', class: 'B.Tech IT - 4A' }, 9: { code: 'CS205', type: 'Lab', room: 'Lab 1', class: 'B.Tech IT - 4A' } },
        'Wednesday': { 1: { code: 'CS203', type: 'Lecture', room: 'Room 205', class: 'B.Tech ECE - 2C' }, 4: { code: 'CS201', type: 'Lecture', room: 'Room 301', class: 'B.Tech IT - 2A' }, 7: { code: 'CS206', type: 'Lecture', room: 'Room 101', class: 'B.Tech CSE - 4B' } },
        'Thursday': { 3: { code: 'CS202', type: 'Lecture', room: 'Room 202', class: 'B.Tech CSE - 1A' }, 5: { code: 'CS206', type: 'Lecture', room: 'Room 101', class: 'B.Tech CSE - 4B' }, 8: { code: 'CS204', type: 'Lecture', room: 'Room 304', class: 'B.Tech CSE - 3B' } },
        'Friday': { 2: { code: 'CS205', type: 'Lecture', room: 'Room 205', class: 'B.Tech IT - 4A' }, 6: { code: 'CS203', type: 'Lecture', room: 'Room 205', class: 'B.Tech ECE - 2C' }, 9: { code: 'CS201', type: 'Lab', room: 'Lab 3', class: 'B.Tech IT - 2A' }, 10: { code: 'CS201', type: 'Lab', room: 'Lab 3', class: 'B.Tech IT - 2A' } }
    };

    const isSlotActive = (timeRange, dayIdx) => {
        const currentDay = currentTime.getDay();
        if (currentDay === 0 || currentDay === 6 || currentDay - 1 !== dayIdx) return false;
        const [start, end] = timeRange.split(' - ');
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        const nowH = currentTime.getHours();
        const nowM = currentTime.getMinutes();
        const currentTotal = nowH * 60 + nowM;
        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;
        return currentTotal >= startTotal && currentTotal < endTotal;
    };

    return (
        <div className="dashboard-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Class Timetable</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>View your weekly teaching schedule</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={() => setIsCompact(!isCompact)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 500, transition: 'var(--transition)' }}
                    >
                        {isCompact ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                        {isCompact ? 'Expanded View' : 'Compact View'}
                    </button>
                    <button
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 500, transition: 'var(--transition)', boxShadow: 'var(--shadow-sm)' }}
                    >
                        <Download size={16} />
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="timetable-wrapper" style={{ width: '100%', overflow: 'hidden', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', position: 'relative' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
                    <thead>
                        <tr>
                            <th style={{ position: 'sticky', top: 0, left: 0, zIndex: 20, background: '#60a550', padding: isCompact ? '0.5rem' : '0.75rem', borderBottom: '2px solid var(--border)', borderRight: '2px solid var(--border)', width: '70px', color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>
                                Time / Day
                            </th>
                            {timetableStructure.map((item) => {
                                const isLunch = item.type === 'lunch';
                                return (
                                    <th key={item.id} style={{ position: 'sticky', top: 0, zIndex: 10, background: isLunch ? '#19a7b3' : '#60a550', padding: isLunch ? '0.5rem 0.1rem' : (isCompact ? '0.25rem' : '0.5rem'), borderBottom: '2px solid var(--border)', borderRight: '1px solid var(--border)', color: 'white', width: isLunch ? '30px' : 'auto' }}>
                                        <div style={{ fontWeight: 600, fontSize: isCompact ? '0.75rem' : '0.8rem', color: 'white', ...(isLunch && { writingMode: 'vertical-lr', transform: 'rotate(180deg)', margin: 'auto' }) }}>{item.label}</div>
                                        {!isLunch && <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.9)', marginTop: '0.2rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}><Clock size={10} /> {item.time}</div>}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {days.map((day, dayIdx) => (
                            <tr key={day} style={{ transition: 'var(--transition)' }}>
                                <td style={{ position: 'sticky', left: 0, zIndex: 15, padding: isCompact ? '0.5rem' : '0.75rem', background: '#fee8a4', borderBottom: '1px solid var(--border)', borderRight: '2px solid var(--border)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', textAlign: 'center' }}>
                                    {day}
                                </td>

                                {timetableStructure.map((item) => {
                                    if (item.type === 'lunch') {
                                        if (dayIdx === 0) {
                                            return (
                                                <td key={item.id} rowSpan={days.length} style={{ background: '#19a7b3', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', textAlign: 'center', color: 'white', fontWeight: 600, padding: 0 }}>
                                                    <div style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', margin: 'auto', letterSpacing: '4px' }}>LUNCH BREAK</div>
                                                </td>
                                            );
                                        }
                                        return null;
                                    }

                                    const classInfo = SCHEDULE_DATA[day]?.[item.id];
                                    const active = isSlotActive(item.time, dayIdx);

                                    return (
                                        <td
                                            key={item.id}
                                            className="timetable-cell"
                                            style={{ position: 'relative', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', padding: isCompact ? '0.35rem' : '0.5rem', height: isCompact ? '70px' : '100px', background: active ? 'rgba(37, 99, 235, 0.1)' : 'transparent', transition: 'var(--transition)' }}
                                        >
                                            {classInfo ? (
                                                <div className="class-block" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#d1f0fa', borderRadius: 'var(--radius-sm)', padding: '0.15rem', cursor: 'pointer', border: active ? '2px solid var(--primary)' : '1px solid transparent', boxShadow: 'none', position: 'relative' }}>
                                                    <span style={{ fontWeight: 600, fontSize: isCompact ? '0.75rem' : '0.8rem', color: '#1f2937' }}>{classInfo.code}</span>
                                                    <span style={{ fontSize: '0.65rem', color: '#4b5563', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.15rem', whiteSpace: 'nowrap' }}>
                                                        {classInfo.room}
                                                    </span>
                                                    {!isCompact && (
                                                        <span style={{ fontSize: '0.65rem', color: '#4b5563', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.15rem', whiteSpace: 'nowrap' }}>
                                                            {classInfo.class || classInfo.type}
                                                        </span>
                                                    )}

                                                    <div className="class-popover">
                                                        <div style={{ fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem' }}>{classInfo.code} - {classInfo.type}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={12} /> {classInfo.room}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={12} /> {classInfo.class}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={12} /> {item.time}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ color: 'transparent' }}>-</span>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FacultyTimetable;