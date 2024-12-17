import "./Find.css";
import React, { useState, useEffect } from "react";
import Card from "./card";
import { useNavigate } from 'react-router-dom';


interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number | null;
  created_at: string;
  updated_at: string;
  status: string;
}

const Find: React.FC = () => {
  const [inputvalue, setInputvalue] = useState<string>("");
  const [userData, setUserData] = useState<User | null>(null);
  const [userExist, setUserExist] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();


  const handleButtonClick = async () => {
    const link = `https://api.github.com/users/${inputvalue}`;
    const user_id = localStorage.getItem('user_id')
    try {
      // get the user data
      const response = await fetch(link);
      if (response.status === 404) {
        setUserExist(false);
        setUserData(null);
        setErrorMessage('User not found')
      } else {
        const user = await response.json();
        setUserData(user);
        setUserExist(true);
      }
      // add 1 in amount of searches
      const response2 = await fetch('api/add_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id }),
      });
    } catch (error) {
      console.error("Error fetching the user data:", error);
      setUserExist(false);
    }
  };


  useEffect(() => {
    const name = localStorage.getItem('user_id');
    if (!name) {

      navigate('/profile');
    }
  }, [navigate]);

  return (
    <div className="find">
      <h1>Find an account</h1>
      <input
        className="find-item"
        type="text"
        value={inputvalue}
        onChange={(e) => setInputvalue(e.target.value)}
      />
      <button className="find-item" onClick={handleButtonClick}>
        Submit
      </button>

      {userExist && userData ? (
        <Card user={userData} /> 
      ) : (
        <p>{errorMessage}</p>
      )}
    </div>
  );
};

export default Find;
