import React, { useState, useEffect } from 'react';
import { Download, Maximize2, Minimize2, Clock, MapPin, Users } from 'lucide-react';
import '../admin/AmritaTimetable.css';

const FacultyTimetable = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const slots = [
        { number: 1, start: '08:00', end: '09:00' },
        { number: 2, start: '09:00', end: '10:00' },
        { number: 3, start: '10:00', end: '11:00' },
        { number: 4, start: '11:00', end: '12:00' },
        { number: 5, start: '12:00', end: '13:00' }, // Lunch
        { number: 6, start: '13:00', end: '14:00' },
        { number: 7, start: '14:00', end: '15:00' },
        { number: 8, start: '15:00', end: '16:00' },
        { number: 9, start: '16:00', end: '17:00' }
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const facultyDetails = {
        name: 'Dr. Priya Sharma',
        department: 'Computer Science and Engineering',
        designation: 'Assistant Professor'
    };

    const timetableData = {
        slots: [
            { day: 'Monday', slotNumber: 1, courseCode: '23CSE312-S5', sessionType: 'Theory', venue: 'ABIII - D103', department: 'CSE', section: 'A' },
            { day: 'Monday', slotNumber: 2, courseCode: '23CSE313-S5', sessionType: 'Lab', venue: 'ABIII - CP LAB 1', department: 'CSE', section: 'B', spanSlots: 2 },
            { day: 'Monday', slotNumber: 3, isSpanContinuation: true },
            { day: 'Tuesday', slotNumber: 2, courseCode: '23CSE313-S5', sessionType: 'Lab', venue: 'ABIII - CP LAB 1', department: 'CSE', section: 'A', spanSlots: 2 },
            { day: 'Tuesday', slotNumber: 3, isSpanContinuation: true },
            { day: 'Tuesday', slotNumber: 7, courseCode: '23CSE313-S5', sessionType: 'Theory', venue: 'ABIII - CP LAB 1', department: 'CSE', section: 'A' },
            { day: 'Thursday', slotNumber: 2, courseCode: '23CSE312-S5', sessionType: 'Theory', venue: 'ABIII - D103', department: 'CSE', section: 'B' },
            { day: 'Thursday', slotNumber: 8, courseCode: '23CSE312-S5', sessionType: 'Theory', venue: 'ABIII - D103', department: 'CSE', section: 'A' },
            { day: 'Friday', slotNumber: 4, courseCode: '23CSE312-S5', sessionType: 'Theory', venue: 'ABIII - D102', department: 'CSE', section: 'C' }
        ]
    };

    const getSlotData = (day, slotNumber) => {
        return timetableData.slots.find(
            s => s.day === day && s.slotNumber === slotNumber && !s.isSpanContinuation
        ) || null;
    };

    const getSlotColor = (sessionType) => {
        const colors = {
            'Theory': '#e0f7fa',
            'Lab': '#00bcd4',
            'Project': '#fff9c4',
            'CIR': '#ffccbc',
            'Elective': '#e1bee7',
            'Occupied': '#f5f5f5',
            'Discussion': '#c8e6c9',
        };
        return colors[sessionType] || '#ffffff';
    };

    // Prepare courses summary split by Theory and Lab
    const theoryCourses = {};
    const labCourses = {};

    timetableData.slots.forEach(s => {
        if (!s.isSpanContinuation) {
            const key = `${s.courseCode}-${s.department}-${s.section}`;
            const targetMap = s.sessionType === 'Lab' ? labCourses : theoryCourses;

            if (!targetMap[key]) {
                targetMap[key] = {
                    courseCode: s.courseCode,
                    department: s.department,
                    section: s.section,
                    sessionType: s.sessionType || 'Theory',
                    venue: s.venue,
                    sessions: 0
                };
            }
            targetMap[key].sessions += 1;
        }
    });

    const theoryList = Object.values(theoryCourses);
    const labList = Object.values(labCourses);

    return (
        <div className="dashboard-fade-in amrita-timetable-container" style={{ width: '100%', paddingBottom: '2rem' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>My Timetable</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>View your weekly teaching schedule</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 500, transition: 'var(--transition)', boxShadow: 'var(--shadow-sm)' }}
                    >
                        <Download size={16} />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="timetable-header">
                <h2>FACULTY TIME TABLE</h2>
            </div>

            {/* Config Banner */}
            <div className="timetable-config">
                <div className="config-row">
                    <div className="config-item">
                        <label>Faculty:</label>
                        <span style={{ fontWeight: '600' }}>{facultyDetails.name}</span>
                    </div>
                    <div className="config-item">
                        <label>Department:</label>
                        <span>{facultyDetails.department}</span>
                    </div>
                    <div className="config-item">
                        <label>Designation:</label>
                        <span>{facultyDetails.designation}</span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="timetable-grid-wrapper">
                <table className="timetable-grid">
                    <thead>
                        <tr>
                            <th rowSpan="2">Time/Day</th>
                            {slots.map(s => <th key={s.number}>Slot {s.number}</th>)}
                        </tr>
                        <tr>
                            {slots.map(s => (
                                <th key={`t-${s.number}`} className="time-header">
                                    {s.start} - {s.end}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {days.map(day => (
                            <tr key={day}>
                                <td className="day-cell">{day}</td>
                                {slots.map(slot => {
                                    if (slot.number === 5) {
                                        if (day === 'Monday') {
                                            return (
                                                <React.Fragment key={`${day}-5`}>
                                                    <td rowSpan={days.length} className="lunch-break-cell">
                                                        Lunch Break
                                                    </td>
                                                </React.Fragment>
                                            );
                                        }
                                        return null;
                                    }
                                    const slotData = getSlotData(day, slot.number);
                                    return (
                                        <td
                                            key={`${day}-${slot.number}`}
                                            className="timetable-cell"
                                            style={{ backgroundColor: getSlotColor(slotData?.sessionType) }}
                                        >
                                            {slotData && (
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                                                        {slotData.courseCode}
                                                        {slotData.sessionType && slotData.sessionType !== 'Theory' && (
                                                            <span style={{ color: '#805ad5', fontWeight: '600', marginLeft: '0.25rem', fontSize: '0.75rem' }}>
                                                                ({slotData.sessionType})
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: '0.72rem', color: '#1a6b3a', fontWeight: '600', marginTop: '2px' }}>
                                                        {slotData.department}-{slotData.section}
                                                    </div>
                                                    {slotData.venue && (
                                                        <div style={{ fontSize: '0.7rem', color: '#555' }}>
                                                            {slotData.venue}
                                                        </div>
                                                    )}
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

            {/* Split Schedule Summary into Theory and Labs */}
            <div className="course-tables">
                {/* Core/Theory Courses */}
                {theoryList.length > 0 && (
                    <div className="course-table-section">
                        <h3>Theory Classes</h3>
                        <table className="course-info-table">
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Class</th>
                                    <th>Venue</th>
                                    <th>Sessions / Week</th>
                                </tr>
                            </thead>
                            <tbody>
                                {theoryList.map((c, i) => (
                                    <tr key={i}>
                                        <td>{c.courseCode}</td>
                                        <td>{c.department} - {c.section}</td>
                                        <td>{c.venue || 'TBD'}</td>
                                        <td>{c.sessions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Lab Courses */}
                {labList.length > 0 && (
                    <div className="course-table-section">
                        <h3>Component Lab</h3>
                        <table className="course-info-table">
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Class</th>
                                    <th>Venue</th>
                                    <th>Sessions / Week</th>
                                </tr>
                            </thead>
                            <tbody>
                                {labList.map((c, i) => (
                                    <tr key={i}>
                                        <td>{c.courseCode}</td>
                                        <td>{c.department} - {c.section}</td>
                                        <td>{c.venue || 'TBD'}</td>
                                        <td>{c.sessions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacultyTimetable;