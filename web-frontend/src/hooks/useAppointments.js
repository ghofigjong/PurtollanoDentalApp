import { useState, useEffect } from 'react';
import { APPOINTMENTS_API } from '../config/api';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(APPOINTMENTS_API);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateAppointment = async (id, updates) => {
    try {
      const response = await fetch(`${APPOINTMENTS_API}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update appointment');
      const updated = await response.json();
      setAppointments(prev => prev.map(appt => appt.id === id ? updated : appt));
      return updated;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return { appointments, loading, error, updateAppointment, refetch: fetchAppointments };
};