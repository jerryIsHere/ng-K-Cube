from flask_restful import Resource, fields as flask_fields, marshal
from flask import request, jsonify
from ..common.db import get_db, where
from marshmallow import Schema, fields as marshmallow_fields

resource_fields = {
    "person_id": flask_fields.Integer,
    "name": flask_fields.String,
}


class QuerySchema(Schema):
    person_id = marshmallow_fields.Integer()
    name = marshmallow_fields.Str()


class Contributors(Resource):
    def get(self):
        error = QuerySchema().validate(request.args)
        query = QuerySchema().dump(request.args)
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from contributors" + where(query, resource_fields))
            rows = cur.fetchall()
        except:
            return None, 204
        finally:
            db.close()
        if rows == None:
            return None, 204
        return marshal(rows, resource_fields), 200


class Contributor(Resource):
    def get(self, person_id=None):
        if person_id is None:
            return None, 400
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from contributors where person_id = ?", (person_id))
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
            cur.execute(
                "INSERT INTO contributors(name) VALUES (?)", (json_data["name"],)
            )
            db.commit()

            cur.execute(
                "select * from contributors where person_id = ?", (cur.lastrowid,)
            )
            row = cur.fetchone()
        except Exception as e:
            return {"sql error": str(e)}, 500
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def put(self, person_id):
        if person_id is None:
            return None, 400

        try:
            json_data = request.get_json(force=True)
        except:
            json_data = {}
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute(
                "UPDATE contributors SET name = ? WHERE person_id = ?",
                (json_data["name"], person_id),
            )
            db.commit()
            cur.execute(
                "select * from contributors where person_id = ?",
                (person_id),
            )
            row = cur.fetchone()
        except:
            row = {}
        finally:
            db.close()
        return marshal(row, resource_fields), 200

    def delete(self, person_id):
        if person_id is None:
            return None, 400
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("DELETE from contributors where person_id = ?", (person_id))
            db.commit()
        except:
            db.rollback()
            return {}, 404
        finally:
            db.close()
        return {}, 200
