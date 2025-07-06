import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function JoinProject(){
    const [code,setCode] =useState("");
    const [error,setError]= useState();
    const navigate = useNavigate();

    const handleJoin = async () => {
  try {
    const sub = JSON.parse(sessionStorage.getItem('dbUser'))?.sub;
    console.log('Joining project with:', { code, sub });

    const res = await fetch(`${API_URL}/api/projects/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, sub })
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to join project');
      return;
    }
    navigate(`/projects/${data.projectId}`);
  } catch (err) {
    setError('An unexpected error occurred');
    console.error(err);
  }
};


    return( <div>
      <h2>Join Project</h2>
      <input
        type="text"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Enter invite code"
      />
      <button onClick={handleJoin}>Join</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}