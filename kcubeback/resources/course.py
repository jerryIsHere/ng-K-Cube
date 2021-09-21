from flask_restful import Resource, reqparse, fields
from ..common.db import get_db

identifier_parser = reqparse.RequestParser()
identifier_parser.add_argument("id", required=True, help="id cannot be blank!")
resource_fields = {
    'id': fields.Integer,
    'name': fields.String,
}

class Course(Resource):
    def get(self):
        pass

    def post(self):
        pass

    def put(self):
        pass

    def delete(self):
        pass
