from flask_restful import Resource, reqparse, fields, marshal
from flask import request, jsonify
import datetime
from ..common.db import get_db

resource_fields = {
    "triple_id": fields.Integer,
    "graph_id": fields.Integer,
    "head_entity": fields.Integer,
    "relationship": fields.Integer,
    "tail_entity": fields.Integer,
}


class Triples(Resource):
    def get(self):
        json_data = request.get_json(force=True)
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from triples")
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
        json_data = request.get_json(force=True)
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
            return e, 500
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def put(self, triple_id):
        if triple_id is None:
            return None, 400
        json_data = request.get_json(force=True)
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
