from flask import Flask, render_template, url_for, request, redirect
from flask_bootstrap import Bootstrap
import os
from apple_health_xml_convert_with_pii_filter import *

application = app = Flask(__name__)
Bootstrap(app)

@app.route('/')
def index():
	return render_template('index.html')



def allowed_type(filename):
	
	if not "." in filename:
		return False
	
	ext = filename.rsplit(".", 1)[1]
	
	if ext.upper() in ["XML"]:
		return True
	else:
		return False


@app.route('/upload', methods=["GET", "POST"])
def upload():

	# UNCOMMENT BELOW TO UPLOAD FILE
	# if request.method == "POST":
		# if request.files:
			# xml = request.files["xml"]
			# ext = xml.filename.rsplit(".", 1)[1]
			
			
			# if xml.filename == "":
				# print("File must have filename")
				# return redirect(request.url)
			
			# if not allowed_type(xml.filename):
				# print("File not allowed")
				# return redirect(request.url)
				
			# xml.save('./static/data/user_upload' + '.' + ext)
			
			# print("File saved")
			
			# apple_health_xml_convert_with_pii_filter.main()
			
			
			# return render_template('index.html')
			
	return render_template('index.html')


if __name__ == '__main__':
	app.run(debug=True)