from models import db, Wine, Producer, Country, Region, Sub_Region, Varietal, VarietalWine
from dotenv import load_dotenv
import os
import requests

load_dotenv()

key = os.getenv('KEY')

headers = {
        'Content-Type': 'application/json',
        'Authorization': key
    }

def get_inventory(inventory, id):
    inventory = {i['wine']['id']:i for i in inventory['data']['inventory']}
    if id in inventory:
        return round(float(inventory[id]['inventory']['on_hand']) + float(inventory[id]['inventory']['on_hold']))
    return 0

def get_discount(prices, id):
    for price in prices['data']['prices']:
        if price['price']['label'] == 'Discount' and price['wine']['id'] == id:
            return price['price']['price_cents']/100
    return None

def get_frontline(prices, id):
    for price in prices['data']['prices']:
        if price['price']['label'] == 'Frontline' and price['wine']['id'] == id:
            return price['price']['price_cents']/100
    return None


def wines_to_db():
    # Connect to Vinosmith API and collect relevant data, compare each wine to data on our database
    # saving wines that exist in inventory but are not on the database, inactivate wines that are on the database
    # but are out of stock. 
    url_wines = 'https://private-anon-b97c5a28b1-vinosmith.apiary-proxy.com/api/distributor/wines'
    url_prices = 'https://private-anon-b97c5a28b1-vinosmith.apiary-proxy.com/api/distributor/prices'
    url_inventory = 'https://private-anon-b97c5a28b1-vinosmith.apiary-proxy.com/api/distributor/inventory'
    wines = (requests.get(url_wines, headers=headers)).json()
    prices = (requests.get(url_prices, headers=headers)).json()
    inventory = (requests.get(url_inventory, headers=headers)).json()
    for wine in wines['data']['wines']: 
        wines_db = {w.external_id for w in Wine.query.all()}
        producers_db = {p.name:p.id for p in Producer.query.all()}
        producer_id = None
        countries_db = {c.name:c.id for c in Country.query.all()}
        country_id = None
        regions_db = {r.name:r.id for r in Region.query.all()}
        region_id = None
        sub_regions_db = {s.name:s.id for s in Sub_Region.query.all()}
        sub_region_id = None
        varietals_db = {v.name:v.id for v in Varietal.query.all()}
        count = get_inventory(inventory, wine['id'])
        if count <= 0:
            if wine['id'] in wines_db:
                w = Wine.query.filter_by(external_id=wine['id']).first()
                w.is_active = False
                db.session.add(w)
                db.session.commit()
        if count > 0 and wine['id'] not in wines_db:
            # with correct data input on Vinomsith the following would simply be name = wine['name']
            # the company I built this for included the producer as a prefix in the name which is removed here:
            name = ''.join(list(wine['name'])[len(wine['producer']['name'])+1:])
            if wine['country'] and wine['country'] not in countries_db:
                country = Country(name=wine['country'])
                db.session.add(country) 
                db.session.commit()
                country_id = country.id
            elif wine['country'] in countries_db:
                country_id = countries_db[wine['country']]
            if wine['region'] and wine['region'] not in regions_db:
                region = Region(name=wine['region'])
                db.session.add(region)
                db.session.commit()
                region_id = region.id
            elif wine['region'] in regions_db:
                region_id = regions_db[wine['region']]
            if wine['appellation'] and wine['appellation'] not in sub_regions_db:
                sub_region = Sub_Region(name=wine['appellation'])
                db.session.add(sub_region)
                db.session.commit()
                sub_region_id = sub_region.id
            elif wine['appellation'] in sub_regions_db:
                sub_region_id = sub_regions_db[wine['appellation']]
            if wine['producer']['name'] and wine['producer']['name'] not in producers_db:
                p = Producer(name=wine['producer']['name'], external_id=wine['producer']['id'], external_source='Vinosmith')
                db.session.add(p)
                db.session.commit()
                producer_id = p.id
            elif wine['producer']['name'] in producers_db:
                producer_id = producers_db[wine['producer']['name']]
            for varietal in wine['varietals']:
                if varietal['name'] and varietal['name'] not in varietals_db:
                    v = Varietal(name=varietal['name'])
                    db.session.add(v)    
            db.session.commit()

            frontline = get_frontline(prices, wine['id'])
            discount = get_discount(prices, wine['id'])
            low_stock = True if count < 1 else False 

            w = Wine(
                name=name,
                external_id=wine['id'],
                external_source='Vinosmith',
                producer_id=producer_id,
                country_id=country_id,
                region_id=region_id,
                sub_region_id=sub_region_id,
                frontline=frontline,
                discount=discount,
                low_stock=low_stock,
                is_active=True
            )
            db.session.add(w)
            db.session.commit()

            varietals_db = {v.name:v.id for v in Varietal.query.all()}
            for varietal in wine['varietals']:
                if varietal != None:
                    v_to_w = VarietalWine(wine_id=w.id, varietal_id=varietals_db[varietal['name']])
                    db.session.add(v_to_w)
                    db.session.commit()