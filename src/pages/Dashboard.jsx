import React from 'react';

export default function Dashboard(){
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>My Excel Dashboard</h1>
        <button className="btn btn-primary">+ Create New Excel</button>
      </div>

      <div className="dashboard-grid">
        {[1,2,3].map((item)=>(
          <div className="dashboard-card" key={item}>
            <h3>Excel File {item}</h3>
            <p>Manage rows, export PDF/Word and download files.</p>
            <div style={{display:'flex',gap:'10px',marginTop:'14px'}}>
              <button className="btn btn-outline">Open</button>
              <button className="btn btn-success">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
