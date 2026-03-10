import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { timetableService } from '../../services/timetableService';

const CRReschedule = () => {
    const { userName } = useOutletContext();
    const [timetableData, setTimetableData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [request, setRequest] = useState({
        courseCode: '',
        currentDay: '',
        currentSlotNumber: '',
        requestedDay: '',
        requestedSlotNumber: '',
        reason: ''
    });
    const [requests, setRequests] = useState([]);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const slots = [
        { number: 1, label: 'Slot 1 (08:00-09:00)' },
        { number: 2, label: 'Slot 2 (09:00-10:00)' },
        { number: 3, label: 'Slot 3 (10:00-11:00)' },
        { number: 4, label: 'Slot 4 (11:00-12:00)' },
        { number: 5, label: 'Lunch Break (12:00-13:00)' },
        { number: 6, label: 'Slot 6 (13:00-14:00)' },
        { number: 7, label: 'Slot 7 (14:00-15:00)' },
        { number: 8, label: 'Slot 8 (15:00-16:00)' },
        { number: 9, label: 'Slot 9 (16:00-17:00)' }
    ];

    useEffect(() => {
        fetchTimetable();
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const requestsRes = await fetch('/api/slot-change-requests', {
                credentials: 'include'
            });
            const requestsData = await requestsRes.json();
            setRequests(Array.isArray(requestsData) ? requestsData : []);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    const fetchTimetable = async () => {
        try {
            setLoading(true);
            const timetableRes = await timetableService.getStudentPersonalTimetable();
            if (timetableRes && timetableRes.success) {
                setTimetableData(timetableRes.timetable);
            }
        } catch (error) {
            console.error("Error fetching timetable:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!timetableData) {
            alert('Timetable not loaded');
            return;
        }

        // Find the slot being moved
        const currentSlot = timetableData.timetableSlots.find(
            s => s.day === request.currentDay && s.slotNumber === parseInt(request.currentSlotNumber)
        );

        if (!currentSlot) {
            alert('Invalid current slot selection');
            return;
        }

        // Find course information
        const course = timetableData.courses.find(c => c.courseCode === request.courseCode);
        if (!course) {
            alert('Course not found');
            return;
        }

        // Identify the faculty responsible for this slot
        // 1. Try to get it from the actual slot first
        let facultyId = null;
        let facultyName = 'TBD';

        if (currentSlot.faculty && currentSlot.faculty.length > 0) {
            facultyId = currentSlot.faculty[0]._id || currentSlot.faculty[0];
            facultyName = currentSlot.faculty[0].name || currentSlot.facultyName || 'TBD';
        }

        // 2. Fallback to course incharge if slot doesn't have it
        if (!facultyId || facultyName === 'TBD') {
            const facultyMember = course.faculty.find(f => f.role === 'Incharge') || course.faculty[0];
            if (facultyMember) {
                facultyId = facultyMember.facultyId?._id || facultyMember.facultyId;
                facultyName = facultyMember.facultyId?.name || 'TBD';
            }
        }

        const requestBody = {
            courseAssignmentId: timetableData._id,
            courseCode: request.courseCode,
            courseName: course.courseName,
            facultyId: facultyId,
            facultyName: facultyName,
            venue: currentSlot.venue,
            currentDay: request.currentDay,
            currentSlotNumber: parseInt(request.currentSlotNumber),
            requestedDay: request.requestedDay,
            requestedSlotNumber: parseInt(request.requestedSlotNumber),
            reason: request.reason
        };

        try {
            setSubmitting(true);
            const res = await fetch('/api/slot-change-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(requestBody)
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || 'Request submitted successfully to Faculty');
                setRequest({
                    courseCode: '',
                    currentDay: '',
                    currentSlotNumber: '',
                    requestedDay: '',
                    requestedSlotNumber: '',
                    reason: ''
                });
                fetchRequests(); // Refresh history
            } else {
                alert(`Error: ${data.message || 'Failed to submit request'}`);
            }
        } catch (error) {
            console.error("Request error:", error);
            alert("Failed to send request. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            Pending_Faculty: { bg: '#fef3c7', color: '#92400e', label: 'Pending Faculty' },
            Pending_Admin: { bg: '#dbeafe', color: '#1e40af', label: 'Pending Admin' },
            Approved: { bg: '#DCFCE7', color: '#15803D', label: 'Approved' },
            Rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' }
        };
        const style = styles[status] || styles.Pending_Faculty;
        return (
            <span style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                backgroundColor: style.bg,
                color: style.color,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                {status === 'Approved' && <CheckCircle size={14} />}
                {status === 'Rejected' && <XCircle size={14} />}
                {(status === 'Pending_Faculty' || status === 'Pending_Admin') && <Clock size={14} />}
                {style.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                <p style={{ color: 'var(--text-muted)' }}>Loading timetable data...</p>
            </div>
        );
    }

    if (!timetableData) {
        return (
            <div style={{ padding: '2rem' }}>
                <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--danger)' }}>
                    <AlertCircle size={32} />
                    <div>
                        <h3 style={{ margin: 0 }}>No Timetable Found</h3>
                        <p style={{ margin: '0.25rem 0 0 0' }}>Unable to load your section's timetable. Please contact admin.</p>
                    </div>
                </div>
            </div>
        );
    }

    const availableCourses = timetableData.courses || [];

    return (
        <div className="dashboard-fade-in">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    Request Class Rescheduling
                </h2>
            </div>

            {/* Submit Request Form */}
            <div className="modern-card" style={{ maxWidth: '700px', margin: '0 auto 2rem', padding: '2rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Select Course</label>
                        <select
                            value={request.courseCode}
                            onChange={e => setRequest({ ...request, courseCode: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem' }}
                            required
                        >
                            <option value="">Select</option>
                            {availableCourses.map(course => (
                                <option key={course.courseCode} value={course.courseCode}>
                                    {course.courseCode} - {course.courseName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Current Slot</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Day</label>
                            <select
                                value={request.currentDay}
                                onChange={e => setRequest({ ...request, currentDay: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem' }}
                                required
                            >
                                <option value="">Select</option>
                                {days.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Slot</label>
                            <select
                                value={request.currentSlotNumber}
                                onChange={e => setRequest({ ...request, currentSlotNumber: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem' }}
                                required
                            >
                                <option value="">Select</option>
                                {slots.filter(s => s.number !== 5).map(slot => (
                                    <option key={slot.number} value={slot.number}>{slot.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>Requested New Slot</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Day</label>
                            <select
                                value={request.requestedDay}
                                onChange={e => setRequest({ ...request, requestedDay: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem' }}
                                required
                            >
                                <option value="">Select</option>
                                {days.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Slot</label>
                            <select
                                value={request.requestedSlotNumber}
                                onChange={e => setRequest({ ...request, requestedSlotNumber: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem' }}
                                required
                            >
                                <option value="">Select</option>
                                {slots.filter(s => s.number !== 5).map(slot => (
                                    <option key={slot.number} value={slot.number}>{slot.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Reason for Rescheduling</label>
                        <textarea
                            rows="3"
                            value={request.reason}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontFamily: 'inherit' }}
                            onChange={e => setRequest({ ...request, reason: e.target.value })}
                            required
                        ></textarea>
                    </div>

                    <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: submitting ? '#9ca3af' : '#2563EB',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#1D4ED8')}
                            onMouseLeave={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#2563EB')}
                        >
                            {submitting && <Loader2 className="animate-spin" size={18} />}
                            {submitting ? 'Submitting...' : 'Submit Request to Faculty'}
                        </button>
                    </div>
                </form>
            </div>

            {/* History Section */}
            <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Your Recent Requests
                </h3>

                {requests.length === 0 ? (
                    <div className="modern-card" style={{ padding: '2rem', textAlign: 'center', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>No requests submitted yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {requests.map(req => (
                            <div key={req._id} className="modern-card" style={{
                                backgroundColor: 'var(--surface)',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-sm)',
                                border: '1px solid var(--border)',
                                borderLeft: `4px solid ${req.status === 'Pending_Faculty' ? '#fbbf24' :
                                    req.status === 'Pending_Admin' ? '#3b82f6' :
                                        req.status === 'Approved' ? '#22C55E' : '#ef4444'
                                    }`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                                            {req.courseCode} - {req.courseName}
                                        </h4>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            Faculty: {req.facultyName}
                                        </p>
                                    </div>
                                    {getStatusBadge(req.status)}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginTop: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Current</div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{req.currentDay}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Slot {req.currentSlotNumber}</div>
                                    </div>
                                    <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>→</div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Requested</div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{req.requestedDay}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Slot {req.requestedSlotNumber}</div>
                                    </div>
                                </div>
                                {req.status === 'Approved' && req.assignedVenue && (
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#DCFCE7', border: '2px solid #22C55E', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <CheckCircle size={20} color="#15803D" />
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#15803D', fontWeight: 600, marginBottom: '0.25rem' }}>
                                                Approved - Classroom Assigned
                                            </div>
                                            <div style={{ fontSize: '1rem', color: '#15803D', fontWeight: 700 }}>
                                                Room: {req.assignedVenue}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {req.reason && (
                                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        <strong style={{ color: 'var(--text-main)' }}>Reason:</strong> {req.reason}
                                    </div>
                                )}
                                {req.adminNote && (
                                    <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: '#92400e' }}>
                                        <strong>Admin Note:</strong> {req.adminNote}
                                    </div>
                                )}
                                <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    Submitted: {new Date(req.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CRReschedule;
