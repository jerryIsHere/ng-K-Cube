from flask_restful import Resource, fields, marshal
from flask import request, jsonify
import datetime
from ..common.db import get_db, where

resource_fields = {
    "schedule_id": fields.Integer,
    "graph_id": fields.Integer,
    "create_datetime": fields.String,
    "last_update": fields.String,
}


class Schedules(Resource):
    def get(self):
        
        try:
            json_data = request.get_json(force=True)
        except:
            json_data = {}
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from schedules" + where(json_data, resource_fields))
            rows = cur.fetchall()
        except:
            return None, 204
        finally:
            db.close()
        if rows == None:
            return None, 204
        return marshal(rows, resource_fields), 200


class Schedule(Resource):
    def get(self, schedule_id):
        if schedule_id is None:
            return None, 400
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from schedules where schedule_id = ?", (schedule_id))
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
                "INSERT INTO schedules(graph_id,create_datetime,last_update) VALUES (?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)",
                (json_data["graph_id"]),
            )
            db.commit()

            cur.execute("select * from schedules where schedule_id = ?", (cur.lastrowid,))
            row = cur.fetchone()
        except Exception as e:
            return e, 500
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def put(self, schedule_id):
        if schedule_id is None:
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
                "UPDATE schedules SET graph_id = ?, last_update = CURRENT_TIMESTAMP WHERE schedule_id = ?",
                (json_data["graph_id"], schedule_id),
            )
            db.commit()
            cur.execute(
                "select * from schedules where schedule_id = ?",
                (schedule_id),
            )
            row = cur.fetchone()
        except:
            row = {}
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def delete(self, schedule_id):
        if schedule_id is None:
            return None, 400
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("DELETE from schedules where schedule_id = ?", (schedule_id))
            db.commit()
        except:
            db.rollback()
            return {}, 404
        finally:
            db.close()
        return {}, 200
