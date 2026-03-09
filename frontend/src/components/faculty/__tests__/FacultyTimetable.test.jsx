import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FacultyTimetable from '../FacultyTimetable';

describe('FacultyTimetable Basic Tests', () => {
  test('renders the page header and download button', () => {
    render(<FacultyTimetable />);

    expect(screen.getByText(/My Timetable/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export PDF/i })).toBeInTheDocument();
  });

  test('renders all day headers', () => {
    render(<FacultyTimetable />);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    days.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test('renders time slot columns', () => {
    render(<FacultyTimetable />);

    const timeSlots = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00'];
    timeSlots.forEach(slot => {
      expect(screen.getByText(slot)).toBeInTheDocument();
    });
  });

  test('renders course data for specific assigned slots', () => {
    render(<FacultyTimetable />);

    expect(screen.getAllByText(/23CSE312-S5/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ABIII - D103/i).length).toBeGreaterThan(0);
  });
});