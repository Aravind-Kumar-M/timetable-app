import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Loader2, BookOpen, Clock, Calendar } from 'lucide-react';

const StudentAllTimetables = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('CSE');
    const [selectedSemester, setSelectedSemester] = useState('3');
    const [selectedSection, setSelectedSection] = useState('A');
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-2025');
    const [timetableData, setTimetableData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'AIDS'];
    const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const sections = ['A', 'B', 'C'];
    const academicYears = ['2024-2025', '2023-2024'];

    const times = ['08:00 - 08:50', '08:50 - 09:40', '09:40 - 10:30', '10:45 - 11:35', '11:35 - 12:25', '12:25 - 13:15', '13:15 - 14:05', '14:05 - 14:55', '14:55 - 15:45', '15:45 - 16:35', '16:35 - 17:25'];
    const timetableStructure = [1, 2, 3, 4, 5, 6, 'lb', 7, 8, 9, 10].map((id, index) => ({
        type: id === 'lb' ? 'lunch' : 'slot',
        id: id,
        label: id === 'lb' ? 'Lunch Break' : `Slot ${id}`,
        time: times[index]
    }));

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
        const rooms = ['101', '102', '103', '104', '105', '201', '202'];
        const slots = [];

        days.forEach((day, dIdx) => {
            timetableStructure.forEach((item, sIdx) => {
                if (item.type === 'slot') {
                    const hash = (dIdx * 10) + sIdx;
                    if (hash % 3 !== 0) {
                        slots.push({
                            day: day,
                            slotNumber: item.id,
                            courseCode: subjects[hash % subjects.length],
                            roomNumber: `Room ${rooms[hash % rooms.length]}`,
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
            setIsLoading(true);
            try {
                const response = await axios.get('/api/timetable/find', {
                    params: { department: selectedDepartment, semester: selectedSemester, section: selectedSection, academicYear: selectedAcademicYear },
                    withCredentials: true
                });
                if (response.data?.timetableSlots?.length > 0) {
                    setTimetableData(response.data);
                } else {
                    setTimetableData(generateRandomTimetable(selectedDepartment));
                }
            } catch (error) {
                console.error("Error fetching timetable", error);
                setTimetableData(generateRandomTimetable(selectedDepartment));
            } finally {
                setIsLoading(false);
            }
        };
        fetchTimetable();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDepartment, selectedSemester, selectedSection, selectedAcademicYear]);

    const getSlotContent = (day, slotId) => {
        return timetableData?.timetableSlots?.find(s => s.day === day && s.slotNumber === slotId);
    };

    const metrics = useMemo(() => {
        if (!timetableData?.timetableSlots) return { totalHours: 0, distinctSubjects: 0 };
        const subjects = new Set();
        timetableData.timetableSlots.forEach(s => subjects.add(s.courseCode || s.subject));
        return { totalHours: timetableData.timetableSlots.length, distinctSubjects: subjects.size };
    }, [timetableData]);

    return (
        <div className="dashboard-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', paddingBottom: '2rem' }}>
            <div className="page-header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>University Timetable Grid</h2>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>View global institutional timetables instantly</p>
                    </div>
                    <div className="modern-card" style={{ display: 'flex', gap: '1.5rem', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={16} color="var(--primary)" />
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{metrics.totalHours} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>Class Hrs</span></span>
                        </div>
                        <div style={{ width: '1px', background: 'var(--border)' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <BookOpen size={16} color="var(--student-theme)" />
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{metrics.distinctSubjects} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>Subjects</span></span>
                        </div>
                    </div>
                </div>

                <div className="modern-card filter-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '200px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem' }}>
                        <Search size={18} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Search code or term..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <select value={selectedAcademicYear} onChange={(e) => setSelectedAcademicYear(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}>
                            {academicYears.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}>
                            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                        </select>
                        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}>
                            {semesters.map(sem => <option key={sem} value={sem}>Sem {sem}</option>)}
                        </select>
                        <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}>
                            {sections.map(section => <option key={section} value={section}>Sec {section}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="timetable-wrapper" style={{ width: '100%', overflow: 'hidden', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', position: 'relative' }}>
                {isLoading && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                        <Loader2 className="spinner" size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                )}

                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
                    <thead>
                        <tr>
                            <th style={{ position: 'sticky', top: 0, left: 0, zIndex: 20, background: '#60a550', padding: '0.75rem', borderBottom: '2px solid var(--border)', borderRight: '2px solid var(--border)', width: '70px', color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                    <Calendar size={14} /> Day/Time
                                </div>
                            </th>
                            {timetableStructure.map((item) => {
                                const isLunch = item.type === 'lunch';
                                return (
                                    <th key={item.id} style={{ position: 'sticky', top: 0, zIndex: 10, background: isLunch ? '#19a7b3' : '#60a550', padding: isLunch ? '0.5rem 0.1rem' : '0.5rem', borderBottom: '2px solid var(--border)', borderRight: '1px solid var(--border)', color: 'white', width: isLunch ? '30px' : 'auto' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'white', ...(isLunch && { writingMode: 'vertical-lr', transform: 'rotate(180deg)', margin: 'auto' }) }}>{item.label}</div>
                                        {!isLunch && <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.9)', marginTop: '0.2rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}><Clock size={10} /> {item.time}</div>}
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
                                    let match = false;

                                    if (slotData && debouncedQuery) {
                                        const sq = debouncedQuery.toLowerCase();
                                        match = (slotData.courseCode?.toLowerCase().includes(sq)) || (slotData.subject?.toLowerCase().includes(sq)) || ((slotData.facultyName || slotData.faculty)?.toLowerCase().includes(sq));
                                    }

                                    return (
                                        <td key={item.id} className="timetable-cell" style={{ position: 'relative', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', padding: '0.35rem', height: '80px', background: 'transparent', transition: 'var(--transition)' }}>
                                            {slotData ? (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: (debouncedQuery && !match) ? 'var(--surface)' : '#d1f0fa', borderRadius: 'var(--radius-sm)', padding: '0.25rem', border: match ? '2px solid var(--primary)' : '1px solid transparent', opacity: (debouncedQuery && !match) ? 0.3 : 1, transition: 'var(--transition)' }}>
                                                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: match ? 'var(--primary)' : '#1f2937' }}>{slotData.courseCode || slotData.subject || 'N/A'}</span>
                                                    <span style={{ fontSize: '0.7rem', color: '#4b5563', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>{slotData.venue || slotData.room || slotData.roomNumber || 'Room N/A'}</span>
                                                    {slotData.faculty && <span style={{ fontSize: '0.65rem', background: 'rgba(0,0,0,0.05)', color: '#4b5563', padding: '2px 6px', borderRadius: '10px', marginTop: '0.25rem', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slotData.faculty}</span>}
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
        </div>
    );
};

export default StudentAllTimetables;
