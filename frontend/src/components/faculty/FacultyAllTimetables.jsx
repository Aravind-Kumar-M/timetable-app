import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacultyAllTimetables = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('CSE');
    const [selectedSemester, setSelectedSemester] = useState('3');
    const [selectedSection, setSelectedSection] = useState('A');
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-2025');
    const [timetableData, setTimetableData] = useState(null);

    const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'AIDS'];
    const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const sections = ['A', 'B', 'C'];
    const academicYears = ['2024-2025', '2023-2024'];

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

    const generateRandomTimetable = (department) => {
        const deptSubjects = {
            'CSE': ['CS201', 'CS202', 'CS203', 'CS204', 'MA201', 'HS201'],
            'ECE': ['EC201', 'EC202', 'EC203', 'EC204', 'MA201', 'HS201'],
            'MECH': ['ME201', 'ME202', 'ME203', 'ME204', 'MA201', 'HS201'],
            'CIVIL': ['CE201', 'CE202', 'CE203', 'CE204', 'MA201', 'HS201'],
            'AIDS': ['AI201', 'AI202', 'AI203', 'AI204', 'MA201', 'HS201']
        };

        const subjects = deptSubjects[department] || deptSubjects['CSE'];
        const rooms = ['101', '102', '103', '104', '105', '201', '202', '203'];
        const slots = [];

        days.forEach(day => {
            timetableStructure.forEach(item => {
                if (item.type === 'slot') {
                    // 70% chance of having a class
                    if (Math.random() > 0.3) {
                        slots.push({
                            day: day,
                            slotNumber: item.id,
                            courseCode: subjects[Math.floor(Math.random() * subjects.length)],
                            roomNumber: `Room ${rooms[Math.floor(Math.random() * rooms.length)]}`,
                            faculty: 'Staff Name'
                        });
                    }
                }
            });
        });
        return { timetableSlots: slots };
    };

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const response = await axios.get('/api/timetable/find', {
                    params: {
                        department: selectedDepartment,
                        semester: selectedSemester,
                        section: selectedSection,
                        academicYear: selectedAcademicYear
                    },
                    withCredentials: true
                });

                if (response.data && response.data.timetableSlots && response.data.timetableSlots.length > 0) {
                    setTimetableData(response.data);
                } else {
                    // Generate random data if response is empty
                    setTimetableData(generateRandomTimetable(selectedDepartment));
                }
            } catch (error) {
                console.error("Error fetching timetable", error);
                // Generate random data on error
                setTimetableData(generateRandomTimetable(selectedDepartment));
            }
        };
        fetchTimetable();
    }, [selectedDepartment, selectedSemester, selectedSection, selectedAcademicYear]);

    const getSlotContent = (day, slotId) => {
        if (!timetableData || !timetableData.timetableSlots) return null;
        return timetableData.timetableSlots.find(slot => slot.day === day && slot.slotNumber === slotId);
    };

    return (
        <div className="dashboard-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>All Class Timetables</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>View and filter all department schedules</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label htmlFor="academicYearSelect" style={{ fontWeight: '600' }}>Year:</label>
                        <select
                            id="academicYearSelect"
                            value={selectedAcademicYear}
                            onChange={(e) => setSelectedAcademicYear(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                        >
                            {academicYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label htmlFor="deptSelect" style={{ fontWeight: '600' }}>Dept:</label>
                        <select
                            id="deptSelect"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label htmlFor="semSelect" style={{ fontWeight: '600' }}>Sem:</label>
                        <select
                            id="semSelect"
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                        >
                            {semesters.map(sem => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label htmlFor="sectionSelect" style={{ fontWeight: '600' }}>Sec:</label>
                        <select
                            id="sectionSelect"
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                        >
                            {sections.map(section => (
                                <option key={section} value={section}>{section}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="timetable-wrapper" style={{ width: '100%', overflow: 'hidden', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', position: 'relative' }}>
                <h3 style={{ margin: '1rem', color: 'var(--text-main)' }}>Timetable for {selectedDepartment} - Sem {selectedSemester} - Section {selectedSection} ({selectedAcademicYear})</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
                    <thead>
                        <tr>
                            <th style={{ position: 'sticky', top: 0, left: 0, zIndex: 20, background: '#60a550', padding: '0.75rem', borderBottom: '2px solid var(--border)', borderRight: '2px solid var(--border)', width: '70px', color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                    Time/Day
                                </div>
                            </th>
                            {timetableStructure.map((item) => {
                                const isLunch = item.type === 'lunch';
                                return (
                                    <th key={item.id} style={{ position: 'sticky', top: 0, zIndex: 10, background: isLunch ? '#19a7b3' : '#60a550', padding: isLunch ? '0.5rem 0.1rem' : '0.5rem', borderBottom: '2px solid var(--border)', borderRight: '1px solid var(--border)', color: 'white', width: isLunch ? '30px' : 'auto' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'white', ...(isLunch && { writingMode: 'vertical-lr', transform: 'rotate(180deg)', margin: 'auto' }) }}>{item.label}</div>
                                        {!isLunch && <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.9)', marginTop: '0.2rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>{item.time}</div>}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {days.map((day, dayIdx) => (
                            <tr key={day} style={{ transition: 'var(--transition)' }}>
                                <td style={{ position: 'sticky', left: 0, zIndex: 15, padding: '0.75rem', background: '#fee8a4', borderBottom: '1px solid var(--border)', borderRight: '2px solid var(--border)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', textAlign: 'center' }}>
                                    {day}
                                </td>

                                {timetableStructure.map((item) => {
                                    if (item.type === 'lunch') {
                                        if (dayIdx === 0) return <td key={item.id} rowSpan={days.length} style={{ background: '#19a7b3', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', textAlign: 'center', color: 'white', fontWeight: 600, padding: 0 }}><div style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', margin: 'auto', letterSpacing: '4px' }}>LUNCH BREAK</div></td>;
                                        return null;
                                    }

                                    const slotData = getSlotContent(day, item.id);

                                    return (
                                        <td key={item.id} className="timetable-cell" style={{ position: 'relative', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', padding: '0.35rem', height: '80px', background: 'transparent', transition: 'var(--transition)' }}>
                                            {slotData ? (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#d1f0fa', borderRadius: 'var(--radius-sm)', padding: '0.25rem', border: '1px solid transparent', transition: 'var(--transition)' }}>
                                                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1f2937' }}>{slotData.courseCode || slotData.subject || 'N/A'}</span>
                                                    <span style={{ fontSize: '0.7rem', color: '#4b5563', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>{slotData.venue || slotData.room || slotData.roomNumber || 'Room N/A'}</span>
                                                    {slotData.facultyName && <span style={{ fontSize: '0.65rem', background: 'rgba(0,0,0,0.05)', color: '#4b5563', padding: '2px 6px', borderRadius: '10px', marginTop: '0.25rem', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slotData.facultyName.split(' ')[0]}</span>}
                                                </div>
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: 'transparent' }}>-</span></div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default FacultyAllTimetables;
