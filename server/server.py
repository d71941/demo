import sys
from flask import Flask
from flask import request
from flask import json

STATIC_FOLDER = '../client'

app = Flask(__name__,static_path = '', static_folder = STATIC_FOLDER)

@app.route('/update_question', methods=['POST'])
def update_question():
	f = open(STATIC_FOLDER + '/question.json', 'w')
	f.write(json.dumps(request.get_json(force=True)))
	return "ok"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(sys.argv[1]))
