from flask_restful import Resource, fields as flask_fields, marshal
from flask import request, jsonify
import datetime
from ..common.db import get_db, where
from marshmallow import Schema, fields as marshmallow_fields

resource_fields = {
    "graph_id": flask_fields.Integer,
    "person_id": flask_fields.Integer,
    "course_id": flask_fields.Integer,
    "create_datetime": flask_fields.String,
    "last_update": flask_fields.String,
}

class QuerySchema(Schema):
    graph_id = marshmallow_fields.Integer()
    person_id = marshmallow_fields.Integer()
    course_id = marshmallow_fields.Integer()
    create_datetime = marshmallow_fields.Str()
    last_update = marshmallow_fields.Str()

class Graphs(Resource):
    def get(self):
        error = QuerySchema().validate(request.args)
        query = QuerySchema().dump(request.args)
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from graphs" + where(query, resource_fields))
            rows = cur.fetchall()
        except:
            return None, 204
        finally:
            db.close()
        if rows == None:
            return None, 204
        return marshal(rows, resource_fields), 200


class Graph(Resource):
    def get(self, graph_id):
        if graph_id is None:
            return None, 400
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from graphs where graph_id = ?", (graph_id))
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
                "INSERT INTO graphs(person_id,course_id,create_datetime,last_update) VALUES (?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)",
                (json_data["person_id"], json_data["course_id"]),
            )
            db.commit()
            cur.execute("select * from graphs where graph_id = ?", (cur.lastrowid,))
            row = cur.fetchone()
        except Exception as e:
            return {"sql error": str(e)}, 500
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def put(self, graph_id):
        if graph_id is None:
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
                "UPDATE graphs SET person_id = ?, course_id = ?, last_update = CURRENT_TIMESTAMP WHERE graph_id = ?",
                (json_data["person_id"], json_data["course_id"], graph_id),
            )
            db.commit()
            cur.execute(
                "select * from graphs where graph_id = ?",
                (graph_id),
            )
            row = cur.fetchone()
        except:
            row = {}
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def delete(self, graph_id):
        if graph_id is None:
            return None, 400
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("DELETE from graphs where graph_id = ?", (graph_id))
            db.commit()
        except:
            db.rollback()
            return {}, 404
        finally:
            db.close()
        return {}, 200
