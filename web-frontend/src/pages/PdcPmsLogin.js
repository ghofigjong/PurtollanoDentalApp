import React from 'react';
const API_URL = 'https://purtollano-dental-app.vercel.app/users/login';
export default function PdcPmsLogin() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password })
      });
      if (!res.ok) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }
      localStorage.setItem('isAdmin', 'true');
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('adminUsername', email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('adminUsername');
      }
      window.location.href = '/pdc_pms/dashboard';
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #8e54e9 0%, #4776e6 100%)',
    }}>
      <div style={{
        background: 'linear-gradient(120deg, #43cea2 0%, #185a9d 100%)',
        borderRadius: '80px 0 0 0',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        padding: '48px 40px 32px 40px',
        width: '100%',
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{
          color: '#fff',
          fontSize: 36,
          fontWeight: 700,
          marginBottom: 32,
          letterSpacing: 1,
          textAlign: 'center',
        }}>sign in</h2>
        <form style={{ width: '100%' }} onSubmit={handleSubmit}>
          {error && <div style={{ color: '#ff1744', fontSize: 14, marginBottom: 12, textAlign: 'center' }}>{error}</div>}
          <div style={{ marginBottom: 24 }}>
            <input
              type="text"
              placeholder="Username"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 18px',
                border: '2px solid #222',
                borderRadius: 40,
                fontSize: 18,
                marginBottom: 18,
                outline: 'none',
                background: 'rgba(255,255,255,0.95)',
                color: '#222',
                fontWeight: 500,
                boxSizing: 'border-box',
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 18px',
                border: '2px solid #222',
                borderRadius: 40,
                fontSize: 18,
                outline: 'none',
                background: 'rgba(255,255,255,0.95)',
                color: '#222',
                fontWeight: 500,
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <label htmlFor="rememberMe" style={{ color: '#fff', fontSize: 16, fontWeight: 500 }}>Remember me</label>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 0',
              background: '#222',
              color: '#43cea2',
              fontWeight: 700,
              fontSize: 28,
              border: 'none',
              borderRadius: 40,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: 16,
              letterSpacing: 2,
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}

