from flask import Flask, render_template, url_for, request, redirect
from flask_bootstrap import Bootstrap
import os


application = app = Flask(__name__)
Bootstrap(app)

@app.route('/')
def index():
	return render_template('index.html')


# app.config["XML_UPLOADS"] = "/data"


def allowed_type(filename):
	
	if not "." in filename:
		return False
	
	ext = filename.rsplit(".", 1)[1]
	
	if ext.upper() in ["XML", "PNG", "JPG"]:
		return True
	else:
		return False


@app.route('/upload', methods=["GET", "POST"])
def upload():
	if request.method == "POST":
		if request.files:
			xml = request.files["xml"]
			ext = xml.filename.rsplit(".", 1)[1]
			
			
			if xml.filename == "":
				print("File must have filename")
				return redirect(request.url)
			
			if not allowed_type(xml.filename):
				print("File not allowed")
				return redirect(request.url)
				
			xml.save('./static/data/user_upload' + '.' + ext)
			
			print("File saved")
			
			return render_template('results.html')
			
	return render_template('index.html')


if __name__ == '__main__':
	app.run(debug=True)