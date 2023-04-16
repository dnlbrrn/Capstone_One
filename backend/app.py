from crypt import methods
from flask import Flask, jsonify
from models import connect_db, db, Wine, Producer, Country, Region, Sub_Region, Varietal, VarietalWine
from server import wines_to_db
import time

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///inventory'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

with app.app_context():
    connect_db(app)
    db.create_all()


@app.route('/getwines')
def check_route():
    start = time.time()
    try:
        wines_to_db()
    except:
        print('Failed')
    end = time.time()
    print((end-start) * 10**3, "ms")
    return 'Success'

@app.route('/wines')
def get_wines():
    wines = [wine.serialize() for wine in Wine.query.all()]
    return jsonify(wines)


