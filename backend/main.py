from flask import Flask, request, jsonify, session, redirect
from flask_cors import CORS  # Add this import
from db_scripts import *
import bcrypt
import os

app = Flask(__name__)

# Enable CORS to allow frontend requests from React
CORS(app)

# Configure the secret key for session management
app.config['SECRET_KEY'] = 'YOUWILLNOTFORGETTHISDEVILPOWER'

# Register route
@app.route('/api/register', methods=['POST'])
def reg_user():
    try:
        data = request.json
        validate_user_data(data)  # Validate user data
        response, status = register_user(data)
        print(response)
        return response, status
    except ValueError as e:
        return jsonify({"ok": False, "message": str(e)}), 400
    except Exception as e:
        return jsonify({"ok": False, "message": f"Unexpected error: {e}"}), 500

# Login route
@app.route('/api/login', methods=['POST'])
def login():
    login_data = request.json
    login = login_data.get('login')
    password = login_data.get('password')

    user = get_user_by_login(login)
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        session['user_id'] = user['id']
        return jsonify({'login':user['login'],"user_id": user['id'],"message": "successful loggin", "ok": True}), 200
    else:
        return jsonify({"message": "Invalid login or password"}), 400


@app.route('/api/favourite', methods=['POST'])
def favourite():
    data = request.json
    return add_favourite(data)

@app.route('/api/check_favourites', methods=['POST'])
def does_name_of_this_function_even_matter():
    data = request.json 
    return check_favourites(data)

@app.route('/api/delete_favourite', methods=['POST'])
def does_name_of_this_function_even_matter2():
    data = request.json
    return delete_favourite(data)

@app.route('/api/get_favourite', methods=['POST'])
def all_favourites():
    data = request.json
    return get_all_favourites(data)


@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    if 'user_id' not in session:
        return jsonify({"message": "Not logged in"}), 401
    
    user_id = session['user_id']
    user_data = get_user_by_login(user_id)
    
    return jsonify({
        "user_id": user_data['id'],
        "username": user_data['login'],
        "message": "Welcome to the dashboard!"
    })


@app.route('/api/add_search', methods=['POST'])
def search():
    data = request.json
    return add_search(data)


@app.route('/api/get_search', methods=['POST'])
def g_search():
    data = request.json
    return get_search(data)

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
