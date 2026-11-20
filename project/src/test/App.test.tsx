import { describe, it, expect } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';

function roomButton(name: string) {
  return screen.getByRole('button', { name: new RegExp(name) });
}

function queryRoomButton(name: string) {
  return screen.queryByRole('button', { name: new RegExp(name) });
}

function setTimeRange(start: string, end: string) {
  fireEvent.change(screen.getByLabelText('Start time'), { target: { value: start } });
  fireEvent.change(screen.getByLabelText('End time'), { target: { value: end } });
}

function checkButton() {
  return screen.getByRole('button', { name: 'Check Availability' });
}

describe('room selection and availability workflow', () => {
  it('reports A-101 unavailable for 10:00-11:00 because of its own booking', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(roomButton('Study Room A-101'));
    setTimeRange('10:00', '11:00');
    await user.click(checkButton());

    const status = screen.getByRole('status');
    expect(within(status).getByText('Unavailable')).toBeInTheDocument();
    expect(within(status).getByText(/Overlaps an existing booking \(10:00–11:00\)/)).toBeInTheDocument();
  });

  it('reports B-202 available for the same interval after switching rooms', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(roomButton('Study Room A-101'));
    setTimeRange('10:00', '11:00');
    await user.click(checkButton());
    expect(within(screen.getByRole('status')).getByText('Unavailable')).toBeInTheDocument();

    await user.click(roomButton('Study Room B-202'));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    await user.click(checkButton());
    const status = screen.getByRole('status');
    expect(within(status).getByText('Available')).toBeInTheDocument();
    expect(
      within(status).getByText('Study Room B-202 is available from 10:00 to 11:00 (60 min).'),
    ).toBeInTheDocument();
  });

  it('shows the selected room details and that room only bookings', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(roomButton('Study Room B-202'));
    expect(screen.getByRole('heading', { level: 2, name: 'Study Room B-202' })).toBeInTheDocument();
    expect(screen.getByText('12:00–13:00')).toBeInTheDocument();
    expect(screen.queryByText('10:00–11:00')).not.toBeInTheDocument();

    await user.click(roomButton('Study Room A-101'));
    expect(screen.getByRole('heading', { level: 2, name: 'Study Room A-101' })).toBeInTheDocument();
    expect(screen.getByText('10:00–11:00')).toBeInTheDocument();
    expect(screen.queryByText('12:00–13:00')).not.toBeInTheDocument();
  });

  it('touching booking endpoints is allowed in the UI', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(roomButton('Study Room A-101'));
    setTimeRange('11:00', '12:00');
    await user.click(checkButton());

    expect(within(screen.getByRole('status')).getByText('Available')).toBeInTheDocument();
  });

  it('keeps the booking list unchanged after a check', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(roomButton('Study Room A-101'));
    setTimeRange('10:00', '11:00');
    await user.click(checkButton());
    await user.click(checkButton());

    expect(screen.getByText('10:00–11:00')).toBeInTheDocument();
  });

  it('clears the previous result when the time changes', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(roomButton('Study Room A-101'));
    setTimeRange('10:00', '11:00');
    await user.click(checkButton());
    expect(screen.getByRole('status')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Start time'), { target: { value: '12:00' } });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('clears and rechecks availability after changing only End time', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(roomButton('Study Room A-101'));
    setTimeRange('11:00', '12:00');
    await user.click(checkButton());
    expect(
      within(screen.getByRole('status')).getByText('Study Room A-101 is available from 11:00 to 12:00 (60 min).'),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('End time'), { target: { value: '12:30' } });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    await user.click(checkButton());
    expect(
      within(screen.getByRole('status')).getByText('Study Room A-101 is available from 11:00 to 12:30 (90 min).'),
    ).toBeInTheDocument();
  });

  it('clears and rechecks availability after enabling Until 24:00', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(roomButton('Study Room A-101'));
    setTimeRange('22:30', '23:00');
    await user.click(checkButton());
    expect(
      within(screen.getByRole('status')).getByText('Study Room A-101 is available from 22:30 to 23:00 (30 min).'),
    ).toBeInTheDocument();

    const endTime = screen.getByLabelText('End time');
    const untilMidnight = screen.getByRole('checkbox', { name: 'Until 24:00' });
    expect(endTime).toBeEnabled();
    await user.click(untilMidnight);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(untilMidnight).toBeChecked();
    expect(endTime).toBeDisabled();
    expect(endTime).toHaveValue('23:00');
    expect(screen.getByText('1440 min — 24:00')).toBeInTheDocument();

    await user.click(checkButton());
    expect(
      within(screen.getByRole('status')).getByText('Study Room A-101 is available from 22:30 to 24:00 (90 min).'),
    ).toBeInTheDocument();
  });

  it('shows a blocked room as blocked and unavailable', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(within(roomButton('Study Room C-303')).getByText('Blocked')).toBeInTheDocument();
    await user.click(roomButton('Study Room C-303'));
    setTimeRange('13:00', '14:00');
    await user.click(checkButton());

    const status = screen.getByRole('status');
    expect(within(status).getByText('Unavailable')).toBeInTheDocument();
    expect(within(status).getByText(/currently blocked/)).toBeInTheDocument();
  });
});

describe('filters', () => {
  it('shows the empty state when attendee count is 13', async () => {
    const user = userEvent.setup();
    render(<App />);

    const attendees = screen.getByLabelText('Number of attendees');
    await user.clear(attendees);
    await user.type(attendees, '13');

    expect(screen.getByText('No rooms match your requirements.')).toBeInTheDocument();
    expect(queryRoomButton('Study Room')).not.toBeInTheDocument();
  });

  it('requires all selected equipment', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByLabelText('Projector'));
    expect(roomButton('Study Room A-101')).toBeInTheDocument();
    expect(roomButton('Study Room B-202')).toBeInTheDocument();
    expect(roomButton('Study Room D-404')).toBeInTheDocument();
    expect(queryRoomButton('Study Room C-303')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Whiteboard'));
    expect(roomButton('Study Room A-101')).toBeInTheDocument();
    expect(roomButton('Study Room D-404')).toBeInTheDocument();
    expect(queryRoomButton('Study Room B-202')).not.toBeInTheDocument();
  });

  it('clears the selected room and result when a filter removes it', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(roomButton('Study Room A-101'));
    setTimeRange('10:00', '11:00');
    await user.click(checkButton());
    expect(screen.getByRole('status')).toBeInTheDocument();

    const attendees = screen.getByLabelText('Number of attendees');
    await user.clear(attendees);
    await user.type(attendees, '5');

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(queryRoomButton('Study Room A-101')).not.toBeInTheDocument();
  });

  it('shows no room results for an invalid attendee count', async () => {
    const user = userEvent.setup();
    render(<App />);

    const attendees = screen.getByLabelText('Number of attendees');
    await user.clear(attendees);

    expect(screen.getByText('Enter a valid number of attendees to see matching rooms.')).toBeInTheDocument();
    expect(queryRoomButton('Study Room')).not.toBeInTheDocument();
    expect(screen.queryByText('No rooms match your requirements.')).not.toBeInTheDocument();
  });
});
