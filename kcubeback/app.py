import sys

sys.path.append("./")  #
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from kcubeback.common.db import create_tables
from kcubeback.resources.contributor import Contributor, Contributors
from kcubeback.resources.course import Course, Courses
from kcubeback.resources.graph import Graph, Graphs
from kcubeback.resources.triple import Triple, Triples
from kcubeback.resources.entity import Entity, Entities
from kcubeback.resources.relationship import Relationship, Relationships
from kcubeback.resources.schedule import Schedule, Schedules
from kcubeback.resources.teaching import Teaching, Teachings

app = Flask(__name__)
CORS(app)
api = Api(app)

api.add_resource(
    Contributor,
    "/contributor",
    "/contributor/",
    "/contributor/<string:person_id>",
    endpoint="person_id",
)
api.add_resource(
    Contributors,
    "/contributors",
)
api.add_resource(
    Course, "/course", "/course/", "/course/<string:course_id>", endpoint="course_id"
)
api.add_resource(
    Courses,
    "/courses",
)
api.add_resource(
    Graph, "/graph", "/graph/", "/graph/<string:graph_id>", endpoint="graph_id"
)
api.add_resource(
    Graphs,
    "/graphs",
)
api.add_resource(
    Triple,
    "/triple",
    "/triple/",
    "/triple/<string:triple_id>",
    endpoint="triple_id",
)
api.add_resource(
    Triples,
    "/triples",
)
api.add_resource(
    Entity, "/entity", "/entity/", "/entity/<string:entity_id>", endpoint="entity_id"
)
api.add_resource(
    Entities,
    "/entities",
)
api.add_resource(
    Relationship,
    "/relationship",
    "/relationship/",
    "/relationship/<string:relationship_id>",
    endpoint="relationship_id",
)
api.add_resource(
    Relationships,
    "/relationships",
)
api.add_resource(
    Schedule,
    "/schedule",
    "/schedule/",
    "/schedule/<string:schedule_id>",
    endpoint="schedule_id",
)
api.add_resource(
    Schedules,
    "/schedules",
)
api.add_resource(
    Teaching,
    "/teaching",
    "/teaching/",
    "/teaching/<string:teaching_id>",
    endpoint="teaching_id",
)
api.add_resource(
    Teachings,
    "/teachings",
)

if __name__ == "__main__":
    create_tables()

    app.run(debug=True)
