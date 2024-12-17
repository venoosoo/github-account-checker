import React, { useState, useEffect } from 'react';
import "./card.css";

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


const Card: React.FC<{user: User}> = ({ user }) => {
  const [heartClick, setHeartClick] = useState<boolean>(false);


    const handleFavourite = async () => {
        const profile_name = user?.login;
        const name = localStorage.getItem('user_id')
        if (!heartClick) {
          try {
            const response = await fetch('api/favourite', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name, profile_name }),
            });
            const data = await response.json();
            if (data.ok) {
              setHeartClick(true)
            }
          } catch (error) {
            console.error("Error uploading product:", error);
          }
        } else {
          try {
            const response = await fetch('api/delete_favourite', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name, profile_name }),
            });
            const data = await response.json();
            if (data.ok) {
              setHeartClick(false)
            }
          } catch (error) {
            console.error("Error uploading product:", error);
          }
        }
      }


      const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      };


      useEffect(() => {
        const profile_name = user?.login;
        const name = localStorage.getItem('user_id')
        const checkLike = async () => {
            let user = localStorage.getItem('user_id')
            try {
                const response = await fetch('/api/check_favourites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, profile_name }),
                });
                const data = await response.json();
                if (data.ok) {
                    setHeartClick(data.like);
                }
            } catch (error) {
                console.error("Error checking favourite:", error);
            }
        };

        checkLike();
    }, [user?.login]);

    return (
        <div className="card">
            <div className="card-name">
                <h2>{user.login}</h2>
                <img src={user.avatar_url} alt="Avatar" width="200" />
            </div>
            <div className="card-text">
                <p>Created at: {formatDate(user.created_at)}</p>
                <p>Bio: {user?.bio ? user.bio : "No Bio"}</p>
                <div className="like-div">
                    <button
                        className="favourite-button"
                        onClick={handleFavourite}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={heartClick ? "pink" : "none"}
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            width="50"
                            height="50"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;