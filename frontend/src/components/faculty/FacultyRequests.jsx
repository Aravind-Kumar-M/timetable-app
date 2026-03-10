import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Loader2, Send } from 'lucide-react';

const FacultyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [filter, setFilter] = useState('Pending_Faculty');

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const url = filter === 'All'
                ? '/api/slot-change-requests'
                : `/api/slot-change-requests?status=${filter}`;

            const res = await fetch(url, {
                credentials: 'include'
            });
            const data = await res.json();
            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        if (!window.confirm('Forward this request to Admin for final approval?')) {
            return;
        }

        try {
            setProcessing(requestId);
            const res = await fetch(`/api/slot-change-requests/${requestId}/faculty-approve`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: 'Approved' })
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || 'Request forwarded to Admin');
                fetchRequests();
            } else {
                alert(`Error: ${data.message || 'Failed to approve request'}`);
            }
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Failed to process request. Please try again.');
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (requestId) => {
        const message = prompt('Enter reason for rejection:');
        if (!message) return;

        try {
            setProcessing(requestId);
            const res = await fetch(`/api/slot-change-requests/${requestId}/faculty-approve`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: 'Rejected', message })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Request rejected');
                fetchRequests();
            } else {
                alert(`Error: ${data.message || 'Failed to reject request'}`);
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Failed to process request. Please try again.');
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                <p style={{ color: 'var(--text-muted)' }}>Loading requests...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    {['All', 'Approved', 'Rejected'].includes(filter) ? 'Request History' : 'Rescheduling Requests'}
                </h2>
                <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                    {['All', 'Approved', 'Rejected'].includes(filter)
                        ? 'View past and processed slot change requests'
                        : 'Review and forward pending slot change requests to Admin'}
                </p>
            </div>

            <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto 2rem auto' }}>
                {['Pending_Faculty', 'Pending_Admin', 'Approved', 'Rejected', 'All'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: filter === status ? 'var(--primary)' : 'var(--surface)',
                            color: filter === status ? 'white' : 'var(--text-main)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        {status === 'All' ? 'History' : status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                {requests.length === 0 ? (
                    <div className="modern-card" style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                        <AlertCircle size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>No Requests</h3>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>No requests found for the selected filter.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {requests.map(req => (
                            <div key={req._id} className="modern-card" style={{
                                backgroundColor: 'var(--surface)',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-md)',
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
                                            Requested by: {req.requestedBy?.name || 'Student'}
                                        </p>
                                    </div>

                                    {(() => {
                                        const styles = {
                                            Pending_Faculty: { bg: '#fef3c7', color: '#92400e', label: 'Pending Faculty', icon: Clock },
                                            Pending_Admin: { bg: '#dbeafe', color: '#1e40af', label: 'Pending Admin', icon: Clock },
                                            Approved: { bg: '#DCFCE7', color: '#15803D', label: 'Approved', icon: CheckCircle },
                                            Rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected', icon: XCircle }
                                        };
                                        const style = styles[req.status] || styles.Pending_Faculty;
                                        const Icon = style.icon;
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
                                                <Icon size={14} />
                                                {style.label}
                                            </span>
                                        );
                                    })()}
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

                                {req.status === 'Pending_Faculty' && (
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                        <button
                                            onClick={() => handleApprove(req._id)}
                                            disabled={processing === req._id}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                backgroundColor: processing === req._id ? '#9ca3af' : '#22C55E',
                                                color: '#FFFFFF',
                                                border: 'none',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                cursor: processing === req._id ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => processing !== req._id && (e.currentTarget.style.backgroundColor = '#15803D')}
                                            onMouseLeave={(e) => processing !== req._id && (e.currentTarget.style.backgroundColor = '#22C55E')}
                                        >
                                            {processing === req._id ? (
                                                <Loader2 className="animate-spin" size={18} />
                                            ) : (
                                                <>
                                                    <CheckCircle size={18} />
                                                    Accept
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleReject(req._id)}
                                            disabled={processing === req._id}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                backgroundColor: processing === req._id ? '#9ca3af' : '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                cursor: processing === req._id ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                transition: 'var(--transition)'
                                            }}
                                        >
                                            <XCircle size={18} />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacultyRequests;
