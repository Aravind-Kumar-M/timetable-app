import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import FacultyHome from '../FacultyHome';


const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  useOutletContext: jest.fn(() => ({ userName: 'Faculty' }))
}));

describe('FacultyHome Basic Tests', () => {

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    );
  });

  const setup = () => {
    return render(
      <MemoryRouter>
        <FacultyHome />
      </MemoryRouter>
    );
  };

  test('renders the welcome header', async () => {
    setup();
    expect(await screen.findByText(/Dashboard Overview/i)).toBeInTheDocument();
    expect(await screen.findByText(/Welcome back, Faculty/i)).toBeInTheDocument();
  });

  test('displays weekly workload card with correct value', async () => {
    setup();
    expect(await screen.findByText(/Weekly Workload/i)).toBeInTheDocument();
    expect(await screen.findByText(/16/i)).toBeInTheDocument();
    expect(await screen.findByText(/4 Theory/i)).toBeInTheDocument();
  });

});