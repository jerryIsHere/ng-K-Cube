import sys
sys.path.append('./')#
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from kcubeback.resources.foo import Foo
app = Flask(__name__)
app.config['DATABASE']=":memory:" ## change it to create an actual database
CORS(app)
api = Api(app)

api.add_resource(Foo, '/Foo', '/Foo/<string:id>')

if __name__ == '__main__':
    app.run(debug=True)