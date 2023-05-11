from crypt import methods
from flask import Flask, jsonify, request
from models import connect_db, db, Wine, Producer, Country, Region, Sub_Region, Varietal, VarietalWine
from server import wines_to_db
from flask_apscheduler import APScheduler 

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///inventory'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True


with app.app_context():
    connect_db(app)
    db.create_all()

def get_wines():
    with app.app_context():
        try:
            wines_to_db()
            print('Wines Updated Successfully')
        except:
            print('Failed')
    

scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()
scheduler.add_job(id='get_wines', func=get_wines, trigger='cron', minute='59')


@app.route('/wines')
def get_wines():
    if 'producer' in request.args:
        search_term = request.args['producer']
        wines = [wine.serialize() for wine in Wine.query.join(Producer).filter(Producer.name.ilike(f'%{search_term}%')).all()]
        return jsonify(wines)
    if 'country' in request.args:
        search_term = request.args['country']
        wines = [wine.serialize() for wine in Wine.query.join(Country).filter(Country.name.ilike(f'%{search_term}%')).all()]
        return jsonify(wines)
    if 'varietal' in request.args:
        search_term = request.args['varietal']
        wines = [wine.serialize() for wine in Wine.query.join(VarietalWine).join(Varietal).filter(Varietal.name.ilike(f'%{search_term}%')).all()]
        return jsonify(wines)
    wines = [wine.serialize() for wine in Wine.query.all()]
    return jsonify(wines)
    




