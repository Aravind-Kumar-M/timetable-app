import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useOutletContext } from 'react-router-dom';
import '@testing-library/jest-dom';
import StudentHome from '../StudentHome';


const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  useOutletContext: jest.fn(),
}));

// Mock Date for consistent tests (Monday 9 AM)
const RealDate = global.Date;
const mockDate = new Date('2026-03-09T09:00:00Z');

const setupDateMock = () => {
  global.Date = class extends RealDate {
    constructor(date) {
      if (date) return new RealDate(date);
      return mockDate;
    }
    static now() {
      return mockDate.getTime();
    }
  };
};

describe('StudentHome Basic Tests', () => {

  beforeEach(() => {
    setupDateMock();
    jest.clearAllMocks();
    global.fetch = jest.fn((url) => {
      // Mock for notifications
      if (url.includes('/api/notifications')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });
  });

  afterEach(() => {
    global.Date = RealDate;
  });

  test('renders standard welcome message for normal students', () => {
    // Mock context for a standard student
    useOutletContext.mockReturnValue({ isCR: false, userName: 'John Doe' });

    render(
      <MemoryRouter>
        <StudentHome />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByText('Attendance')).toBeInTheDocument();
    expect(screen.getByText(/Request Stats/i)).toBeInTheDocument();
  });

  test('renders CR specific header and stats card', () => {
    // Mock context for a Class Representative
    useOutletContext.mockReturnValue({ isCR: true, userName: 'Jane CR' });

    render(
      <MemoryRouter>
        <StudentHome />
      </MemoryRouter>
    );

    expect(screen.getByText('CR Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Request Stats')).toBeInTheDocument();
    expect(screen.getAllByText(/3/)[0]).toBeInTheDocument();
    expect(screen.getByText(/Total Requests/)).toBeInTheDocument();
  });

  test('navigates to reschedule page when CR clicks the request card', () => {
    useOutletContext.mockReturnValue({ isCR: true, userName: 'Jane CR' });

    render(
      <MemoryRouter>
        <StudentHome />
      </MemoryRouter>
    );

    const requestCard = screen.getByText('Request Stats').closest('.modern-card');
    fireEvent.click(requestCard);

    expect(mockedUsedNavigate).toHaveBeenCalledWith('/student/reschedule');
  });

  test('displays correct attendance value', async () => {
    useOutletContext.mockReturnValue({ isCR: false, userName: 'John' });

    render(
      <MemoryRouter>
        <StudentHome />
      </MemoryRouter>
    );

    await waitFor(async () => {
      expect(await screen.findByText('78%')).toBeInTheDocument();
    });
  });
});