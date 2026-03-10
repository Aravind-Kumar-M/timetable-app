import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FacultyRequests from '../FacultyRequests';

describe('FacultyRequests Basic Tests', () => {

  const mockRequests = [
    { _id: '1', courseCode: '23CSE312', courseName: 'CS Second Year', facultyName: 'Dr. Test', currentDay: 'Monday', currentSlotNumber: 3, requestedDay: 'Tuesday', requestedSlotNumber: 2, reason: 'Free slot', status: 'Pending_Faculty', createdAt: new Date().toISOString() },
    { _id: '2', courseCode: '23IT401', courseName: 'IT Final Year', facultyName: 'Dr. Test', currentDay: 'Wednesday', currentSlotNumber: 1, requestedDay: 'Thursday', requestedSlotNumber: 3, reason: 'Lab conflict', status: 'Pending_Faculty', createdAt: new Date().toISOString() }
  ];

  beforeEach(() => {
    window.alert = jest.fn();
    window.confirm = jest.fn(() => true);
    window.prompt = jest.fn(() => 'Test Reason');
    global.prompt = window.prompt;

    global.fetch = jest.fn().mockImplementation((url, options) => {
      const method = options?.method || 'GET';

      if (method === 'PATCH') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Success' })
        });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(url.includes('/api/slot-change-requests') ? mockRequests : [])
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the page header and initial request cards', async () => {
    render(<FacultyRequests />);

    expect(await screen.findByText(/Rescheduling Requests/i)).toBeInTheDocument();

    expect(await screen.findByText('23CSE312 - CS Second Year')).toBeInTheDocument();
    expect(screen.getByText('23IT401 - IT Final Year')).toBeInTheDocument();
  });

  test('displays correct slot move information', async () => {
    render(<FacultyRequests />);

    expect(await screen.findByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Tuesday')).toBeInTheDocument();
  });

  test('handles "Forward to Admin" action correctly', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => true);
    render(<FacultyRequests />);

    const forwardBtns = await screen.findAllByRole('button', { name: /Accept/i });
    await user.click(forwardBtns[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    }, { timeout: 5000 });
  });

  test('handles "Reject" action correctly', async () => {
    const user = userEvent.setup();
    window.prompt = jest.fn(() => 'Schedule conflict');
    global.prompt = window.prompt;
    render(<FacultyRequests />);

    const rejectBtns = await screen.findAllByRole('button', { name: /Reject/i });
    await user.click(rejectBtns[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    }, { timeout: 5000 });
  });

  test('shows empty state message when no requests exist', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
    render(<FacultyRequests />);

    expect(await screen.findByText('No Requests')).toBeInTheDocument();
  });

});