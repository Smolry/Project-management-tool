import { useParams,Navigate } from "react-router-dom";
import { useState,useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function AccessRoute({children}){
    const { id }= useParams();
    const [allowed, setAllowed] = useState(null); //null==loading
    

    useEffect(() => {
  const checkAccess = async () => {
    const user = JSON.parse(sessionStorage.getItem('dbUser'));
    if (!user || !id) {
      console.error("Missing user or project ID");
      return setAllowed(false);
    }

    console.log("Checking project ID:", id);

    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`);
      if (!res.ok) return setAllowed(false);

      const project = await res.json();
      const isOwner = project.owner._id === user._id;
      const isMember = project.members.some(m => m._id === user._id);

      setAllowed(isOwner || isMember);
    } catch (err) {
      console.error("Error fetching project:", err);
      setAllowed(false);
    }
  };

  checkAccess();
}, [id]);

    if(allowed==null) return <p>Loading...</p>;
    if(!allowed){
        alert('You are not allowed to view this project');
        //return <Navigate to="/dashboard" />;
    }

    return children
}