from flask_restful import Resource, fields as flask_fields, marshal
from flask import request, jsonify
import datetime
from ..common.db import get_db, where
from marshmallow import Schema, fields as marshmallow_fields

resource_fields = {
    "teaching_id": flask_fields.Integer,
    "schedule_id": flask_fields.Integer,
    "entity_id": flask_fields.Integer,
    "start": flask_fields.Integer,
    "duration": flask_fields.Integer,
}


class QuerySchema(Schema):
    teaching_id = marshmallow_fields.Integer()
    schedule_id = marshmallow_fields.Integer()
    entity_id = marshmallow_fields.Integer()
    start = marshmallow_fields.Integer()
    duration = marshmallow_fields.Integer()


class Teachings(Resource):
    def get(self):
        error = QuerySchema().validate(request.args)
        query = QuerySchema().dump(request.args)
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("select * from teachings" + where(query, resource_fields))
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
            #     """
            #                 SELECT *
            #                 FROM 
            #                 (SELECT * FROM schedules WHERE schedules.schedule_id = ?) AS s 
            #                 INNER JOIN graphs on graphs.graph_id = s.graph_id 
            #                 INNER JOIN triples ON triples.graph_id = graphs.graph_id
            #                 INNER JOIN (SELECT * FROM entities WHERE entities.entity_id = ?) AS e
            #                  ON e.entity_id = triples.head_entity
            #                 UNION
            #                 SELECT *
            #                 FROM 
            #                 (SELECT * FROM schedules WHERE schedules.schedule_id = ?) AS s 
            #                 INNER JOIN graphs on graphs.graph_id = s.graph_id 
            #                 INNER JOIN triples ON triples.graph_id = graphs.graph_id
            #                 INNER JOIN (SELECT * FROM entities WHERE entities.entity_id = ?) AS e
            #                  ON e.entity_id = triples.tail_entity                       
            # """,
            #     (
            #         json_data["schedule_id"],
            #         json_data["entity_id"],
            #         json_data["schedule_id"],
            #         json_data["entity_id"],
            #     ),
            # )
            # db.commit()
            # rows = cur.fetchall()
            # print(rows[0].keys())
            # for row in rows:
            #     print(" ".join([str(row[key]) for key in row.keys()]))
            # print("select")
            # cur.execute(
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
            return {"sql error": str(e)}, 500
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
