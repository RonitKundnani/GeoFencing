from flask import Blueprint, render_template, request, jsonify, flash, redirect, url_for
from flask_login import login_required, current_user
from models import db, User, UserManagement
from datetime import datetime
import json

main = Blueprint('main', __name__)

@main.route('/')
@main.route('/index.html')
@login_required
def index():
    return render_template('index.html')

@main.route('/locations.html')
@login_required
def locations():
    return render_template('locations.html')

@main.route('/geofences.html')
@login_required
def geofences():
    return render_template('geofences.html')

@main.route('/users.html')
@login_required
def users():
    if not current_user.is_admin:
        flash('You do not have permission to access this page', 'danger')
        return redirect(url_for('main.index'))
    users = User.query.all()
    return render_template('users.html', users=users)

@main.route('/add_user', methods=['POST'])
@login_required
def add_user():
    if not current_user.is_admin:
        return jsonify({'success': False, 'message': 'Permission denied'}), 403

    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    role = request.form.get('role')
    department = request.form.get('department')

    if User.query.filter_by(username=username).first():
        flash('Username already exists', 'danger')
        return redirect(url_for('main.users'))

    if User.query.filter_by(email=email).first():
        flash('Email already exists', 'danger')
        return redirect(url_for('main.users'))

    user = User(username=username, email=email)
    user.set_password(password)
    user.is_admin = (role == 'admin')

    db.session.add(user)
    db.session.flush()  # Get the user ID

    user_management = UserManagement(
        user_id=user.id,
        role=role,
        department=department,
        permissions=json.dumps([]),
        location_access=json.dumps([])
    )
    db.session.add(user_management)
    db.session.commit()

    flash('User added successfully', 'success')
    return redirect(url_for('main.users'))

@main.route('/edit_user', methods=['POST'])
@login_required
def edit_user():
    if not current_user.is_admin:
        return jsonify({'success': False, 'message': 'Permission denied'}), 403

    user_id = request.form.get('user_id')
    user = User.query.get_or_404(user_id)
    
    user.username = request.form.get('username')
    user.email = request.form.get('email')
    user.is_active = request.form.get('is_active') == 'on'
    user.is_admin = request.form.get('role') == 'admin'

    if not user.user_management:
        user_management = UserManagement(user_id=user.id)
        db.session.add(user_management)
    else:
        user_management = user.user_management

    user_management.role = request.form.get('role')
    user_management.department = request.form.get('department')

    db.session.commit()
    flash('User updated successfully', 'success')
    return redirect(url_for('main.users'))

@main.route('/api/user/<int:user_id>', methods=['GET'])
@login_required
def get_user(user_id):
    if not current_user.is_admin:
        return jsonify({'success': False, 'message': 'Permission denied'}), 403

    user = User.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.user_management.role if user.user_management else 'user',
        'department': user.user_management.department if user.user_management else '',
        'is_active': user.is_active
    })

@main.route('/api/user/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    if not current_user.is_admin:
        return jsonify({'success': False, 'message': 'Permission denied'}), 403

    user = User.query.get_or_404(user_id)
    if user.id == current_user.id:
        return jsonify({'success': False, 'message': 'Cannot delete your own account'}), 400

    db.session.delete(user)
    db.session.commit()
    return jsonify({'success': True})

@main.route('/alerts.html')
@login_required
def alerts():
    return render_template('alerts.html')

@main.route('/settings.html')
@login_required
def settings():
    return render_template('settings.html') 