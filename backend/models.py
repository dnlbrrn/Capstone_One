from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
    db.app = app
    db.init_app(app)

class Wine(db.Model):
    __tablename__ = 'wines'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, nullable=False)
    external_id = db.Column(db.Integer)
    external_source = db.Column(db.Text)
    producer_id = db.Column(db.Integer, db.ForeignKey('producers.id'))
    country_id = db.Column(db.Integer, db.ForeignKey('countries.id'))
    region_id = db.Column(db.Integer, db.ForeignKey('regions.id'))
    sub_region_id = db.Column(db.Integer, db.ForeignKey('sub_regions.id'))
    frontline = db.Column(db.Integer)
    discount = db.Column(db.Integer)
    low_stock = db.Column(db.Boolean)
    is_active = db.Column(db.Boolean)

    varietals = db.relationship('VarietalWine', backref='wines')

    def serialize(self):
        varietals = [v.varietals.name for v in self.varietals] if self.varietals else None
        v = ''
        for var in varietals:
            if varietals.index(var) + 1 != len(varietals):
                v = v + var + ',' + ' '
            else:
                v = v + var
        return {
            'id': self.id,
            'name': self.name,
            'external_id': self.external_id,
            'external_source': self.external_source,
            'producer': self.producers.name if self.producers else None,
            'country': self.countries.name if self.countries else None,
            'region': self.regions.name if self.regions else None,
            'sub_region': self.sub_regions.name if self.sub_regions else None,
            'frontline': self.frontline,
            'discount': self.discount,
            'low_stock': self.low_stock,
            'varietals': v
        }

class Producer(db.Model):
    __tablename__ = 'producers'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, nullable=False, unique=True)
    external_id = db.Column(db.Integer)
    external_source = db.Column(db.Text)
    wines = db.relationship('Wine', backref='producers')
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
        }

class Country(db.Model):
    __tablename__ = 'countries'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, unique=True)
    wines = db.relationship('Wine', backref='countries')

class Region(db.Model):
    __tablename__ = 'regions'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, nullable=False)
    wines = db.relationship('Wine', backref='regions')

class Sub_Region(db.Model):
    __tablename__ = 'sub_regions'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, nullable=False)
    wines = db.relationship('Wine', backref='sub_regions')

class Varietal(db.Model):
    __tablename__ = 'varietals'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, unique=True)
    wines = db.relationship('VarietalWine', backref='varietals')

class VarietalWine(db.Model):
    __tablename__ = 'varietals_wines'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    wine_id = db.Column(db.Integer, db.ForeignKey('wines.id'))
    varietal_id = db.Column(db.Integer, db.ForeignKey('varietals.id'))

