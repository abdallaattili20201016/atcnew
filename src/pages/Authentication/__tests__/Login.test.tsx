import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';
import { getFirebaseBackend } from '../../../helpers/firebase_helper';
import { BrowserRouter as Router } from 'react-router-dom';
import { toast } from 'react-toastify';

// Mock Firebase modules
jest.mock('../../../helpers/firebase_helper', () => ({
  getFirebaseBackend: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

const mockLoginUser = jest.fn();
const mockGetUserDetailsByUid = jest.fn();
const mockLogout = jest.fn();

(getFirebaseBackend as jest.Mock).mockReturnValue({
  loginUser: mockLoginUser,
  getUserDetailsByUid: mockGetUserDetailsByUid,
  logout: mockLogout,
});

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  test('allows user to login successfully', async () => {
    mockLoginUser.mockResolvedValue({ user: { uid: '12345' } });
    mockGetUserDetailsByUid.mockResolvedValue({
      status: 1,
      role: 'trainee',
    });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockGetUserDetailsByUid).toHaveBeenCalledWith('12345');
      expect(toast.success).toHaveBeenCalledWith('Login Successfully');
    });
  });

  test('shows error on login failure', async () => {
    mockLoginUser.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Incorrect Email or Password.');
    });
  });
});
