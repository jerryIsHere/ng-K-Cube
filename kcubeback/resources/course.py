from flask_restful import Resource, fields, marshal
from flask import request, jsonify
from ..common.db import get_db, where

resource_fields = {
    "course_id": fields.Integer,
    "entity_id": fields.Integer,
    "course_code": fields.String,
    "course_name": fields.String,
}


class Courses(Resource):
    def get(self):

        try:
            json_data = request.get_json(force=True)
        except:
            json_data = {}
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from courses" + where(json_data, resource_fields))
            rows = cur.fetchall()
        except:
            return None, 204
        finally:
            db.close()
        if rows == None:
            return None, 204
        return marshal(rows, resource_fields), 200


class Course(Resource):
    def get(self, course_id):
        if course_id is None:
            return None, 400
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from courses where course_id = ?", (course_id))
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
        print(json_data)
        try:
            db = get_db()
            cur = db.cursor()
            print(json_data)
            cur.execute(
                "INSERT INTO courses(entity_id,course_code,course_name) VALUES (?,?,?)",
                (
                    json_data["entity_id"],
                    json_data["course_code"],
                    json_data["course_name"],
                ),
            )
            db.commit()
            print(json_data)
            cur.execute("select * from courses where course_id = ?", (cur.lastrowid,))
            row = cur.fetchone()
        except Exception as e:
            return e, 500
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def put(self, course_id):
        if course_id is None:
            return None, 400

        try:
            json_data = request.get_json(force=True)
        except:
            json_data = {}
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute(
                "UPDATE courses SET entity_id = ?, course_code = ?, course_name = ? WHERE course_id = ?",
                (
                    json_data["entity_id"],
                    json_data["course_code"],
                    json_data["course_name"],
                    course_id,
                ),
            )
            db.commit()
            cur.execute(
                "select * from courses where course_id = ?",
                (course_id),
            )
            row = cur.fetchone()
        except:
            row = {}
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def delete(self, course_id):
        if course_id is None:
            return None, 400
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("DELETE from courses where course_id = ?", (course_id))
            db.commit()
        except:
            db.rollback()
            return {}, 404
        finally:
            db.close()
        return {}, 200
