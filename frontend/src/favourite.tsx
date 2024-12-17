import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./favourite.css";
import Card from './card';

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

const Favourite: React.FC = () => {
  const navigate = useNavigate();
  const [favouriteNames, setFavouriteNames] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const getFavourites = async () => {
    const name = localStorage.getItem('user_id');
    if (!name) {
      navigate('/profile'); // Redirect to /profile if user_id is not found
      return;
    }
    try {
      const response = await fetch('api/get_favourite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      console.log(data);
      if (data.ok && data.data) {
        setFavouriteNames(data.data); // Assuming `data.data` contains the list of names
      }
    } catch (error) {
      console.error("Error fetching favourites:", error);
    }
  };

  type Name = {
    profile_name: string;
  };

  const get_user = async (name: Name): Promise<User | null> => {
    console.log(name);
    const link = `https://api.github.com/users/${name.profile_name}`;
    try {
      const response = await fetch(link);
      if (response.status === 404) {
        console.warn(`User not found: ${name}`);
        return null; // Return null for 404 cases
      }
      const user: User = await response.json();
      return user;
    } catch (error) {
      console.error("Error fetching the user data:", error);
      return null; // Return null for error cases
    }
  };

  useEffect(() => {
    getFavourites();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedUsers = await Promise.all(
        favouriteNames.map(async (name) => {
          const user = await get_user(name);
          return user; // `null` will be ignored in the filtering step
        })
      );
      setUsers(fetchedUsers.filter((user): user is User => user !== null)); // Remove `null` values
    };

    if (favouriteNames.length > 0) {
      fetchUserData();
    }
  }, [favouriteNames]);

  return (
    <div className='favourite'>
      <div className='favourite-list'>
        <p className='favourite-text'>Your favourite profiles:</p>
        <div className="user-cards">
          {users.map((user) => (
            <Card key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favourite;
