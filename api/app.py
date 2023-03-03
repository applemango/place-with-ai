import os
from flask import Flask,jsonify
from flask_socketio import SocketIO, send
from flask_cors import CORS, cross_origin

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__, instance_relative_config=True)
app.config.from_mapping(
    SECRET_KEY = "secret"
    ,JSON_AS_ASCII = False
)
cors = CORS(app, responses={r"/*": {"origins": "*"}})


data = "(ysqGgWjYBSMV!nb8EywAE!="
sizeX,sizeY = 32,32

@app.route("/get/data", methods=["GET"])
@cross_origin()
def get_data():
    return jsonify({"data":data,"sizeX":sizeX,"sizeY":sizeY})

socketIo = SocketIO(app, cors_allowed_origins="*")
@socketIo.on("json")
def get_json(json):
    global data, sizeX, sizeY
    data,sizeX,sizeY = json["data"],json["sizeX"],json["sizeY"]
    send(json, json=True, broadcast=True)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)