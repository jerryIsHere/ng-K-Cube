from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from k.resoures.foo import Foo

app = Flask(__name__)
CORS(app)
api = Api(app)

api.add_resource(Foo, '/Foo', '/Foo/<string:id>')

if __name__ == '__main__':
    app.run(debug=True)