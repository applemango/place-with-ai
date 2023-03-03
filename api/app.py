import json
import os
from flask import Flask, Request,jsonify
from flask_socketio import SocketIO, send
from flask_cors import CORS, cross_origin
from flask import request

import openai

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__, instance_relative_config=True)
app.config.from_mapping(
    SECRET_KEY = "secret"
    ,JSON_AS_ASCII = False
)
cors = CORS(app, responses={r"/*": {"origins": "*"}})

openai.api_key = "TOKEN"


data = "(ysqGgWjYBSMV!nb8EywAE!="
sizeX,sizeY = 32,32

def request_data(request: Request, name: str):
    try:
        data = json.loads(json.loads(request.get_data().decode('utf-8'))["body"])[name]
        if data:
            return data
    except :
        return None
    return None

@app.route("/ai", methods=["POST"])
@cross_origin()
def get_ai():
    command = request_data(request, "command")
    response = openai.Completion.create(
            model="text-davinci-003",
            prompt=generate_prompt(command),
            temperature=0.6,
            max_tokens=360
        )
    print(response)
    return jsonify({"data":response.choices[0].text})

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

def generate_prompt(order):
    return """Please write shapes and patterns in 0s and 1s.
The size is 16pixel in height and 16pixel in width.

examples:
name: quadrangle
result:
0000000000000000
0000000000000000
0000000000000000
0001111111111000
0001111111111000
0001111111111000
0001111111111000
0001111111111000
0001111111111000
0001111111111000
0001111111111000
0001111111111000
0001111111111000
0000000000000000
0000000000000000
0000000000000000
name: circle
result:
0000000000000000
0000000000000000
0000000000000000
0000000100000000
0000011111000000
0000111111100000
0000111111100000
0001111111110000
0000111111100000
0000111111100000
0000011111000000
0000000100000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
order:
name: {}
result:""".format(
        order.capitalize()
    )

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)