from flask_restful import Resource, reqparse, fields, marshal
from flask import request, jsonify
import datetime
from ..common.db import get_db

resource_fields = {
    "entity_id": fields.Integer,
    "name": fields.String,
}


class Entities(Resource):
    def get(self):
        json_data = request.get_json(force=True)
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from entities")
            rows = cur.fetchall()
        except:
            return None, 204
        finally:
            db.close()
        if rows == None:
            return None, 204
        return marshal(rows, resource_fields), 200


class Entity(Resource):
    def get(self, entity_id):
        if entity_id is None:
            return None, 400
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from entities where entity_id = ?", (entity_id))
            row = cur.fetchone()
        except:
            return None, 204
        finally:
            db.close()
        if row == None:
            return None, 204
        return marshal(row, resource_fields), 200

    def post(self):
        json_data = request.get_json(force=True)
        try:
            db = get_db()
            cur = db.cursor()
            now = datetime.datetime.now()
            cur.execute(
                "INSERT INTO entities(name) VALUES (?)",
                (json_data["name"],),
            )
            db.commit()

            cur.execute("select * from entities where entity_id = ?", (cur.lastrowid,))
            row = cur.fetchone()
        except Exception as e:
            return e, 500
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def put(self, entity_id):
        if entity_id is None:
            return None, 400
        json_data = request.get_json(force=True)
        try:
            db = get_db()
            cur = db.cursor()
            now = datetime.datetime.now()
            cur.execute(
                "UPDATE entities SET name = ? WHERE entity_id = ?",
                (json_data["name"], entity_id),
            )
            db.commit()
            cur.execute(
                "select * from entities where entity_id = ?",
                (entity_id),
            )
            row = cur.fetchone()
        except:
            row = {}
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def delete(self, entity_id):
        if entity_id is None:
            return None, 400
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("DELETE from entities where entity_id = ?", (entity_id))
            db.commit()
        except:
            db.rollback()
            return {}, 404
        finally:
            db.close()
        return {}, 200
