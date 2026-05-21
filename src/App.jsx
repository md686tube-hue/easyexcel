import React, { useState } from 'react';

const initialSheets = [
  { id: 1, name: 'Student Database', rows: 12, updated: 'Today' },
  { id: 2, name: 'Office Report', rows: 7, updated: 'Yesterday' },
];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [sheets, setSheets] = useState(initialSheets);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [font, setFont] = useState('Arial');
  const [fontSize, setFontSize] = useState('14');
  const [newName, setNewName] = useState('');

  const createSheet = () => {
    if (!newName) return;
    setSheets([...sheets, { id: Date.now(), name: newName, rows: 0, updated: 'Now' }]);
    setNewName('');
    setPage('dashboard');
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f3f4f6', minHeight: '100vh' }}>
      <style>{`
        *{box-sizing:border-box}
        .nav{display:flex;justify-content:space-between;align-items:center;padding:16px 30px;background:linear-gradient(90deg,#2563eb,#4f46e5);color:white;position:sticky;top:0}
        .btn{border:none;padding:10px 18px;border-radius:10px;cursor:pointer;font-weight:600;transition:.3s}
        .btn:hover{transform:translateY(-2px)}
        .white{background:white;color:#2563eb}
        .outline{background:transparent;border:1px solid #d1d5db;color:#111827}
        .container{padding:30px;max-width:1200px;margin:auto}
        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px}
        .card{background:white;padding:22px;border-radius:20px;box-shadow:0 10px 25px rgba(0,0,0,.08);transition:.3s}
        .card:hover{transform:translateY(-4px)}
        table{width:100%;border-collapse:collapse;background:white;border-radius:16px;overflow:hidden}
        th,td{padding:14px;border:1px solid #e5e7eb;text-align:left;background:white;color:#111827}
        input,select{padding:12px;border:1px solid #d1d5db;border-radius:10px;width:100%;margin-top:10px}
      `}</style>

      <div className='nav'>
        <h2>EasyExcel Pro</h2>
        <div style={{display:'flex',gap:'10px'}}>
          <button className='btn white' onClick={() => setPage('dashboard')}>Dashboard</button>
          <button className='btn white' onClick={() => setPage('create')}>Create Excel</button>
        </div>
      </div>

      <div className='container'>
        {page === 'dashboard' && (
          <>
            <h1 style={{marginBottom:'25px'}}>Your Excel Files</h1>
            <div className='grid'>
              {sheets.map(sheet => (
                <div className='card' key={sheet.id}>
                  <h3>{sheet.name}</h3>
                  <p>Total Rows: {sheet.rows}</p>
                  <p>Updated: {sheet.updated}</p>
                  <div style={{display:'flex',gap:'10px',marginTop:'15px'}}>
                    <button className='btn white' onClick={() => {setSelectedSheet(sheet);setPage('editor')}}>Open</button>
                    <button className='btn outline'>Download</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {page === 'create' && (
          <div className='card' style={{maxWidth:'500px',margin:'auto'}}>
            <button className='btn outline' onClick={() => setPage('dashboard')}>← Back</button>
            <h2 style={{marginTop:'20px'}}>Create New Excel</h2>
            <input placeholder='Excel Name' value={newName} onChange={e=>setNewName(e.target.value)} />
            <button className='btn white' style={{marginTop:'15px'}} onClick={createSheet}>Create</button>
          </div>
        )}

        {page === 'editor' && selectedSheet && (
          <div className='card'>
            <button className='btn outline' onClick={() => setPage('dashboard')}>← Back to Dashboard</button>
            <h2 style={{margin:'20px 0'}}>{selectedSheet.name}</h2>

            <div className='grid' style={{marginBottom:'20px'}}>
              <div>
                <label>PDF/Word Font</label>
                <select value={font} onChange={e=>setFont(e.target.value)}>
                  <option>Arial</option>
                  <option>Nikosh</option>
                  <option>SolaimanLipi</option>
                  <option>Noto Sans Bengali</option>
                </select>
              </div>

              <div>
                <label>Font Size</label>
                <select value={fontSize} onChange={e=>setFontSize(e.target.value)}>
                  <option>12</option>
                  <option>14</option>
                  <option>16</option>
                  <option>18</option>
                </select>
              </div>
            </div>

            <table style={{fontFamily:font,fontSize:`${fontSize}px`}}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mahmud</td>
                  <td>demo@email.com</td>
                  <td>01700000000</td>
                </tr>
              </tbody>
            </table>

            <div style={{display:'flex',gap:'10px',marginTop:'20px'}}>
              <button className='btn white'>Download PDF</button>
              <button className='btn white'>Download Word</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
