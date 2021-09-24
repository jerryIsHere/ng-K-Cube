from flask_restful import Resource, fields as flask_fields, marshal
from flask import request, jsonify
import datetime
from ..common.db import get_db, where
from marshmallow import Schema, fields as marshmallow_fields

resource_fields = {
    "triple_id": flask_fields.Integer,
    "graph_id": flask_fields.Integer,
    "head_entity": flask_fields.Integer,
    "relationship": flask_fields.Integer,
    "tail_entity": flask_fields.Integer,
}
class QuerySchema(Schema):
    triple_id = marshmallow_fields.Integer()
    graph_id = marshmallow_fields.Integer()
    head_entity = marshmallow_fields.Integer()
    relationship = marshmallow_fields.Integer()
    tail_entity = marshmallow_fields.Integer()


class Triples(Resource):
    def get(self):
        error = QuerySchema().validate(request.args)
        query = QuerySchema().dump(request.args)
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from triples" + where(query, resource_fields))
            rows = cur.fetchall()
        except:
            return None, 204
        finally:
            db.close()
        if rows == None:
            return None, 204
        return marshal(rows, resource_fields), 200


class Triple(Resource):
    def get(self, triple_id):
        if triple_id is None:
            return None, 400
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from triples where triple_id = ?", (triple_id))
            row = cur.fetchone()
        except:
            return None, 204
        finally:
            db.close()
        if row == None:
            return None, 204
        return marshal(row, resource_fields), 200

    def post(self):
        if request.data == None and request.data == "":
            json_data = {}
        try:
            json_data = request.get_json(force=True)
        except:
            json_data = {}
        try:
            db = get_db()
            cur = db.cursor()
            now = datetime.datetime.now()
            cur.execute(
                "INSERT INTO triples(graph_id,head_entity,relationship,tail_entity) VALUES (?,?,?,?)",
                (
                    json_data["graph_id"],
                    json_data["head_entity"],
                    json_data["relationship"],
                    json_data["tail_entity"],
                ),
            )
            db.commit()

            cur.execute("select * from triples where triple_id = ?", (cur.lastrowid,))
            row = cur.fetchone()
        except Exception as e:
            return {"sql error": str(e)}, 500
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def put(self, triple_id):
        if triple_id is None:
            return None, 400
        if request.data == None and request.data == "":
            json_data = {}
        try:
            json_data = request.get_json(force=True)
        except:
            json_data = {}
        try:
            db = get_db()
            cur = db.cursor()
            now = datetime.datetime.now()
            cur.execute(
                "UPDATE triples SET graph_id = ?, head_entity = ?, relationship =?, tail_entity =? WHERE triple_id = ?",
                (
                    json_data["graph_id"],
                    json_data["head_entity"],
                    json_data["relationship"],
                    json_data["tail_entity"],
                ),
            )
            db.commit()
            cur.execute(
                "select * from triples where triple_id = ?",
                (triple_id),
            )
            row = cur.fetchone()
        except:
            row = {}
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def delete(self, triple_id):
        if triple_id is None:
            return None, 400
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("DELETE from triples where triple_id = ?", (triple_id))
            db.commit()
        except:
            db.rollback()
            return {}, 404
        finally:
            db.close()
        return {}, 200
