from flask_restful import Resource, reqparse, fields, marshal_with
from ..common.db import get_db

identifier_parser = reqparse.RequestParser()
identifier_parser.add_argument("person_id", required=True, help="id cannot be blank!")
resource_fields = {
    "person_id": fields.Integer,
    "name": fields.String,
}
content_parser = reqparse.RequestParser()
content_parser.add_argument("name", required=True, help="person name cannot be blank!")


class Contributor(Resource):
    @marshal_with(resource_fields)
    def get(self):
        parser = identifier_parser.copy()
        args = parser.parse_args()
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute(
                "select * from contributors where person_id = ?", (args.person_id)
            )
            row = cur.fetchone()
        except:
            return {}, 404
        finally:
            db.close()
        return row

    @marshal_with(resource_fields)
    def post(self):
        parser = content_parser.copy()
        args = parser.parse_args()
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("INSERT INTO contributors (name) VALUES (?)", (args.name))
            db.commit()
            cur.execute(
                "select * from contributors where person_id = ?", (cur.lastrowid)
            )
            row = cur.fetchone()
        except:
            row = {}
        finally:
            db.close()
        return row

    def put(self):
        parser = identifier_parser.copy()
        args_id = parser.parse_args()
        parser = content_parser.copy()
        args_content = parser.parse_args()
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute(
                "UPDATE contributors SET name = ? WHERE person_id = ?",
                (args_content.name, args_id.person_id),
            )
            db.commit()
            cur.execute(
                "select * from contributors where person_id = ?",
                (args_content.person_id),
            )
            row = cur.fetchone()
        except:
            row = {}
        finally:
            db.close()
        return row

    def delete(self):
        parser = identifier_parser.copy()
        args = parser.parse_args()
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute(
                "DELETE from contributors where person_id = ?", (args.person_id)
            )
            db.commit()
        except:
            db.rollback()
            return {}, 404
        finally:
            db.close()
        return {}, 200
