export default function AdminPanel() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4' }}>
      <h1 style={{ color: '#333' }}>🔐 Safepal Admin Panel</h1>
      <p style={{ color: '#666' }}>Welcome to your dashboard.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>👥 Total Users</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>1,234</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>💰 Transactions</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>5,678</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>📈 Revenue</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>$9,100</p>
        </div>
      </div>

      <button 
        onClick={() => alert('Logout clicked!')} 
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Logout
      </button>
    </div>
  );
}
