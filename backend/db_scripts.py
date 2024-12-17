import sqlite3
from datetime import datetime
import bcrypt
import os

# Define the path to your SQLite database
PATH = os.path.dirname(__file__) + os.sep
db_name = 'db.db'

# Database connection functions
def execute_query(query, *params):
    with sqlite3.connect(PATH + db_name) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(query, params)
        return cursor.fetchall()

def execute_query_single(query, *params):
    with sqlite3.connect(PATH + db_name) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(query, params)
        return cursor.fetchone()

def execute_query_commit(query, *params):
    with sqlite3.connect(PATH + db_name) as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
        return cursor.lastrowid

# Function to validate user data
def validate_user_data(user_data):
    if not user_data.get('login') or len(user_data['login']) < 4:
        raise ValueError("Login must be at least 4 characters.")
    if not user_data.get('password') or len(user_data['password']) < 8:
        raise ValueError("Password must be at least 8 characters.")

def register_user(user_data):
    query1 = "SELECT * FROM user WHERE login = ?"
    if execute_query_single(query1, user_data['login']) is not None:
        return {"success": False, "message": "Login already in use."}, 409
    
    salt = bcrypt.gensalt()
    user_data['password'] = bcrypt.hashpw(user_data['password'].encode('utf-8'), salt)
    user_data['created_at'] = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')

    query2 = 'INSERT INTO user (login, password, created_at, searches) VALUES (?, ?, ?, ?)'
    try:
        some_id = execute_query_commit(query2, user_data['login'], user_data['password'], user_data['created_at'], 0)
        return {"ok": True, "message": "User registered successfully.", "user_id": some_id}, 200
    except sqlite3.IntegrityError as e:
        return {"ok": False, "message": f"Database error: {e}"}, 500


def add_search(data):
    query = "UPDATE user SET search = search + 1 WHERE user_id = ?;"
    try:
        something = execute_query_commit(query, data['user_id'])
        return {'ok':True}, 200
    except:
        return {'ok':False}, 500


def get_search(data):
    query= "SELECT search FROM user WHERE user_id = ?"
    try:
        something = execute_query_single(query, data['user_id'])
        print()
        return {'ok':True, "number": dict(something)}, 200
    except sqlite3.Error as e:
        print(f"Error updating search count: {e}")
        return {'ok': False, 'message': str(e)}, 500

def add_favourite(data):
    query1 = 'INSERT INTO favourite (user_id, profile_name) VALUES (?, ?)'
    try:
        something = execute_query_commit(query1, data['name'], data['profile_name'])
        return {"ok":True}, 200
    except:
        return {"ok":False}, 500


def check_favourites(data):
    query = 'SELECT 1 FROM favourite WHERE user_id = ? AND profile_name = ? LIMIT 1'
    try:
        result = execute_query_single(query, data['name'], data['profile_name'])
        return {"ok": True, "like": result is not None}, 200
    except:
        return {"ok":False}, 500

def delete_favourite(data):
    query = "DELETE FROM favourite WHERE user_id = ? AND profile_name = ?"
    try:
        result = execute_query_single(query, data['name'], data['profile_name'])
        return {'ok':True}, 200
    except:
        return {"ok":False}, 500   


def get_all_favourites(data):
    query = "SELECT * FROM favourite WHERE user_id = ?"
    try:
        result = execute_query(query, data['name'])
        return {'ok': True, 'data': [dict(row) for row in result]}, 200
    except Exception as e:
        print(f"Error: {e}")
        return {'ok': False}, 500


def get_user_by_login(login):
    query = "SELECT * FROM user WHERE login = ?"
    return execute_query_single(query, login)