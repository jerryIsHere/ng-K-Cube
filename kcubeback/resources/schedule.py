from flask_restful import Resource, reqparse, fields, marshal
from flask import request, jsonify
import datetime
from ..common.db import get_db

resource_fields = {
    "schedule_id": fields.Integer,
    "person_id": fields.Integer,
    "course_id": fields.Integer,
    "create_datetime": fields.DateTime,
    "last_update": fields.DateTime,
}


class Schedules(Resource):
    def get(self):
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from schedules")
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
        json_data = request.get_json(force=True)
        try:
            db = get_db()
            cur = db.cursor()
            now = datetime.datetime.now()
            cur.execute(
                "INSERT INTO schedules(person_id,course_id,create_datetime,last_update) VALUES (?,?,?,?)",
                (json_data["person_id"], json_data["course_id"], now, now),
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
        json_data = request.get_json(force=True)
        try:
            db = get_db()
            cur = db.cursor()
            now = datetime.datetime.now()
            cur.execute(
                "UPDATE schedules SET person_id = ?, course_id = ?, last_update =? WHERE schedule_id = ?",
                (json_data["person_id"], json_data["course_id"], now, schedule_id),
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
