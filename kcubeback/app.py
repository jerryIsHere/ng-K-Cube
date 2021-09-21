import sys

sys.path.append("./")  #
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from kcubeback.common.db import create_tables
from kcubeback.resources.contributor import Contributor
from kcubeback.resources.course import Course
from kcubeback.resources.graph import Graph
from kcubeback.resources.tripple import Tripple

app = Flask(__name__)
CORS(app)
api = Api(app)

api.add_resource(Contributor, "/contributor", "/contributor/<string:id>")
api.add_resource(Course, "/course", "/course/<string:id>")
api.add_resource(Graph, "/graph", "/graph/<string:id>")
api.add_resource(Tripple, "/tripple", "/tripple/<string:id>")

if __name__ == "__main__":
    create_tables()
    app.run(debug=True)
