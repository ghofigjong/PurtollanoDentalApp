import React, { useEffect, useState } from 'react';

const APPOINTMENTS_API = 'https://purtollano-dental-app.vercel.app/appointments';
// const USERS_API = 'https://purtollano-dental-app.vercel.app/users';
const PATIENTS_API = 'https://purtollano-dental-app.vercel.app/patients';

export default function PdcPmsDashboard() {
  const [appointments, setAppointments] = useState([]);
  // const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [apptRes, patientRes] = await Promise.all([
          fetch(APPOINTMENTS_API),
          fetch(PATIENTS_API)
        ]);
        const apptData = await apptRes.json();
        const patientData = await patientRes.json();
        setAppointments(apptData);
        setPatients(patientData);
      } catch (err) {
        // fallback to empty
        setAppointments([]);
  // setUsers([]);
        setPatients([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Dummy stats using fetched data
  const stats = [
    { label: 'Appointments', value: appointments.length, color: '#20a8d8' },
  // { label: 'Users', value: users.length, color: '#63c2de' },
    { label: 'Patients', value: patients.length, color: '#4dbd74' },
    { label: 'Upcoming', value: appointments.filter(a => new Date(a.date) > new Date()).length, color: '#f8cb00' },
    { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, color: '#f86c6b' },
  ];

  const metrics = [
    { label: 'Total Appointments', value: appointments.length },
  // { label: 'Total Users', value: users.length },
    { label: 'Total Patients', value: patients.length },
    { label: 'Active Appointments', value: appointments.filter(a => a.status === 'active').length },
  ];

  // Example user card from first user
  // const user = users[0] || { name: 'Admin', role: 'Administrator', tweets: 0, following: 0, followers: 0, location: '' };

  // Traffic dummy
  const traffic = {
    visits: appointments.length * 10,
  unique: patients.length,
    pageviews: appointments.length * 20,
    newUsers: patients.filter(p => {
      const created = p.createdAt ? new Date(p.createdAt) : (p.created_date ? new Date(p.created_date) : null);
      return created && (new Date() - created < 30 * 24 * 60 * 60 * 1000);
    }).length,
    bounceRate: '40.15%',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f4f7' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#222', color: '#fff', padding: '24px 0', minHeight: '100vh', boxShadow: '2px 0 8px rgba(0,0,0,0.04)' }}>
        <div style={{ fontWeight: 700, fontSize: 16, textAlign: 'center', marginBottom: 32 }}>Puertollano Dental - PMS</div>
        <nav>
          <div
            style={{ padding: '8px 32px', fontWeight: 600, fontSize: 16, background: activeMenu === 'Dashboard' ? '#333' : '#222', color: '#fff', cursor: 'pointer' }}
            onClick={() => setActiveMenu('Dashboard')}
          >Dashboard</div>
          <div
            style={{ padding: '8px 32px', color: activeMenu === 'Patients' ? '#fff' : '#bbb', fontSize: 15, background: activeMenu === 'Patients' ? '#333' : '#222', cursor: 'pointer' }}
            onClick={() => setActiveMenu('Patients')}
          >Patients</div>
          <div style={{ padding: '8px 32px', color: '#bbb', fontSize: 15 }}>Icons</div>
          <div style={{ padding: '8px 32px', color: '#bbb', fontSize: 15 }}>Extras</div>
          <button
            style={{
              margin: '24px 32px 0 32px',
              padding: '10px 0',
              width: 'calc(100% - 64px)',
              background: '#f86c6b',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
            onClick={() => {
              localStorage.removeItem('isAdmin');
              localStorage.removeItem('rememberMe');
              localStorage.removeItem('adminUsername');
              window.location.href = '/pdc_pms';
            }}
          >
            Logout
          </button>
        </nav>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px 40px', minWidth: 0 }}>
        {activeMenu === 'Dashboard' && (
          <>
            {/* Alert */}
            <div style={{ background: '#d4edda', color: '#155724', padding: '12px 24px', borderRadius: 6, marginBottom: 24, fontWeight: 500, fontSize: 16 }}>
              <span style={{ background: '#28a745', color: '#fff', borderRadius: 4, padding: '2px 10px', marginRight: 12, fontWeight: 700, fontSize: 14 }}>Success</span>
              You successfully read this important alert message.
            </div>
            {/* Top Stats */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ flex: 1, background: stat.color, color: '#fff', borderRadius: 8, padding: '18px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{stat.value}</div>
                  <div style={{ fontSize: 15, marginTop: 6 }}>{stat.label}</div>
                  <div style={{ height: 40, marginTop: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}></div>
                </div>
              ))}
            </div>
            {/* Socials (static) */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
              <div style={{ flex: 1, background: '#3b5998', color: '#fff', borderRadius: 8, padding: '18px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>Facebook</div>
                <div style={{ fontSize: 14, marginTop: 6 }}>40K FRIENDS</div>
                <div style={{ fontSize: 13, marginTop: 2 }}>450 FEEDS</div>
              </div>
              <div style={{ flex: 1, background: '#1da1f2', color: '#fff', borderRadius: 8, padding: '18px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>Twitter</div>
                <div style={{ fontSize: 14, marginTop: 6 }}>30K FRIENDS</div>
                <div style={{ fontSize: 13, marginTop: 2 }}>450 TWEETS</div>
              </div>
              <div style={{ flex: 1, background: '#0077b5', color: '#fff', borderRadius: 8, padding: '18px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>LinkedIn</div>
                <div style={{ fontSize: 14, marginTop: 6 }}>40+ CONTACTS</div>
                <div style={{ fontSize: 13, marginTop: 2 }}>250 FEEDS</div>
              </div>
              <div style={{ flex: 1, background: '#dd4b39', color: '#fff', borderRadius: 8, padding: '18px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>Google+</div>
                <div style={{ fontSize: 14, marginTop: 6 }}>94K FOLLOWERS</div>
                <div style={{ fontSize: 13, marginTop: 2 }}>92 CIRCLES</div>
              </div>
            </div>
            {/* Traffic Chart (dummy) */}
            <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Traffic</div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <button style={{ padding: '6px 18px', borderRadius: 4, border: '1px solid #bbb', background: '#f8f9fa', fontWeight: 500 }}>Day</button>
                <button style={{ padding: '6px 18px', borderRadius: 4, border: '1px solid #bbb', background: '#e9ecef', fontWeight: 700 }}>Month</button>
                <button style={{ padding: '6px 18px', borderRadius: 4, border: '1px solid #bbb', background: '#f8f9fa', fontWeight: 500 }}>Year</button>
              </div>
              <div style={{ height: 120, background: 'linear-gradient(90deg, #e3e3e3 0%, #f8f9fa 100%)', borderRadius: 6, marginBottom: 12 }}></div>
              <div style={{ display: 'flex', gap: 24, fontSize: 15, color: '#555', marginTop: 8 }}>
                <div>Visits <span style={{ color: '#28a745', fontWeight: 700 }}>{traffic.visits} Users (40%)</span></div>
                <div>Unique <span style={{ color: '#20a8d8', fontWeight: 700 }}>{traffic.unique} Users (20%)</span></div>
                <div>Pageviews <span style={{ color: '#f86c6b', fontWeight: 700 }}>{traffic.pageviews} Views (60%)</span></div>
                <div>New Users <span style={{ color: '#f8cb00', fontWeight: 700 }}>{traffic.newUsers} Users (80%)</span></div>
                <div>Bounce Rate <span style={{ color: '#222', fontWeight: 700 }}>{traffic.bounceRate}</span></div>
              </div>
            </div>
            {/* User Card & Metrics */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
              {metrics.map((m, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '18px 24px', fontSize: 16, fontWeight: 700, color: '#222', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ background: '#eee', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{m.label[0]}</span>
                  <span>{m.label}</span>
                  <span style={{ marginLeft: 'auto', color: '#009688', fontWeight: 700 }}>{m.value}</span>
                </div>
              ))}
            </div>
            {/* World Map (dummy) */}
            <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>World</div>
              <div style={{ height: 180, background: 'linear-gradient(90deg, #b2dfdb 0%, #e0f7fa 100%)', borderRadius: 6 }}></div>
            </div>
            {loading && <div style={{ textAlign: 'center', color: '#888', fontSize: 16 }}>Loading data...</div>}
          </>
        )}
        {activeMenu === 'Patients' && (
          <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Patients</div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
              style={{ marginBottom: 18, padding: '8px 14px', fontSize: 15, borderRadius: 6, border: '1px solid #bbb', width: '100%' }}
            />
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <thead>
                <tr style={{ background: '#f1f4f7' }}>
                  <th style={{ padding: '10px 8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '10px 8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '10px 8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '10px 8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>Phone</th>
                  <th style={{ padding: '10px 8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(patients) && patients.length > 0 ? patients
                  .filter(p => {
                    const name = (p.name || `${p.last_name || ''}, ${p.first_name || ''}`).toLowerCase();
                    const email = (p.email || p.email_address || '').toLowerCase();
                    const phone = (p.phone || p.contact_number || '').toLowerCase();
                    const q = search.toLowerCase();
                    return name.includes(q) || email.includes(q) || phone.includes(q);
                  })
                  .map(p => (
                    <tr key={p.id || p.patient_id}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{p.id || p.patient_id}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{p.name || `${p.last_name || ''}, ${p.first_name || ''}`}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{p.email || p.email_address}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{p.phone || p.contact_number}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : (p.created_date ? new Date(p.created_date).toLocaleDateString() : '')}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: '16px' }}>No patients found.</td></tr>
                  )}
              </tbody>
            </table>
            {loading && <div style={{ textAlign: 'center', color: '#888', fontSize: 16, marginTop: 18 }}>Loading patients...</div>}
          </div>
        )}
      </main>
    </div>
  );
}

