import "./Dashboard.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


const Dashboard: React.FC = () => {
  const [searchAmount, setSearchAmount] = useState<number>(0)
  const navigate = useNavigate();
  const get_search = async () => {
    const name = localStorage.getItem('user_id');
    if (!name) {
      navigate('/profile');
      return
    }
    const user_id = localStorage.getItem('user_id')
    try {
      const response = await fetch('api/get_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id }),
      });
      const data = await response.json();
      if (data.ok) {
        setSearchAmount(data.number.search)
      }
    } catch (error) {
      console.error("Error fetching the user data:", error);
    }
  };


  useEffect(() => { 
    get_search();
  }, []);

  return (
    <div className="dashboard">
        <p className="dashboard-text">Your dashboard</p>    
        <div className="stats">
            <p className="dashboard-text">Amount of searches: {searchAmount}</p>
        </div>
    </div>
  );
};

export default Dashboard;
