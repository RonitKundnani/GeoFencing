from flask import Flask
from flask_login import LoginManager
from config import Config
from models import db, User, UserManagement
from auth import auth
from main import main
import json

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register blueprints
    app.register_blueprint(auth)
    app.register_blueprint(main)

    # Create database tables
    with app.app_context():
        db.drop_all()  # Drop all existing tables
        db.create_all()  # Create new tables
        
        # Create a default admin user if none exists
        if not User.query.filter_by(username='admin').first():
            admin = User(
                username='admin',
                email='admin@example.com',
                is_admin=True,
                is_active=True
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.flush()  # Get the admin user ID

            # Create UserManagement entry for admin
            admin_management = UserManagement(
                user_id=admin.id,
                role='admin',
                department='Administration',
                permissions=json.dumps(['all']),
                location_access=json.dumps(['all'])
            )
            db.session.add(admin_management)
            db.session.commit()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)