from flask_restful import Resource, fields, marshal
from flask import request, jsonify
import datetime
from ..common.db import get_db, where

resource_fields = {
    "teaching_id": fields.Integer,
    "schedule_id": fields.Integer,
    "entity_id": fields.Integer,
    "start": fields.Integer,
    "duration": fields.Integer,
}


class Teachings(Resource):
    def get(self):
        
        try:
            json_data = request.get_json(force=True)
        except:
            json_data = {}
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from teachings" + where(json_data, resource_fields))
            rows = cur.fetchall()
        except:
            return None, 204
        finally:
            db.close()
        if rows == None:
            return None, 204
        return marshal(rows, resource_fields), 200


class Teaching(Resource):
    def get(self, teaching_id):
        if teaching_id is None:
            return None, 400
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from teachings where teaching_id = ?", (teaching_id))
            row = cur.fetchone()
        except:
            return None, 204
        finally:
            db.close()
        if row == None:
            return None, 204
        return marshal(row, resource_fields), 200

    def post(self):
        
        try:
            json_data = request.get_json(force=True)
        except:
            json_data = {}
        try:
            db = get_db()
            cur = db.cursor()
            now = datetime.datetime.now()
            cur.execute(
                "INSERT INTO teachings(schedule_id,entity_id,start,duration) VALUES (?,?,?,?)",
                (
                    json_data["schedule_id"],
                    json_data["entity_id"],
                    json_data["start"],
                    json_data["duration"],
                ),
            )
            db.commit()

            cur.execute(
                "select * from teachings where teaching_id = ?", (cur.lastrowid,)
            )
            row = cur.fetchone()
        except Exception as e:
            return e, 500
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def put(self, teaching_id):
        if teaching_id is None:
            return None, 400
        
        try:
            json_data = request.get_json(force=True)
        except:
            json_data = {}
        try:
            db = get_db()
            cur = db.cursor()
            now = datetime.datetime.now()
            cur.execute(
                "UPDATE teachings SET schedule_id = ?, entity_id = ?, start =?, duration =? WHERE teaching_id = ?",
                (
                    json_data["schedule_id"],
                    json_data["entity_id"],
                    json_data["start"],
                    json_data["duration"],
                ),
            )
            db.commit()
            cur.execute(
                "select * from teachings where teaching_id = ?",
                (teaching_id),
            )
            row = cur.fetchone()
        except:
            row = {}
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def delete(self, teaching_id):
        if teaching_id is None:
            return None, 400
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("DELETE from teachings where teaching_id = ?", (teaching_id))
            db.commit()
        except:
            db.rollback()
            return {}, 404
        finally:
            db.close()
        return {}, 200
