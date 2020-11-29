from flask import Flask, render_template, url_for, request, redirect
from flask_bootstrap import Bootstrap
import os
import sys
import boto3


application = app = Flask(__name__)
Bootstrap(app)


s3 = boto3.client(
    's3',
    aws_access_key_id="AKIAZZ6R5VR2ANX4XGF3",
    aws_secret_access_key="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",
    region_name='us-west-1',
)

BUCKET_NAME = 'w209-upload'


def s3_get_file(file_name):
	s3_response_object = s3.get_object(Bucket=BUCKET_NAME, Key='data/'+ file_name)
	object_content = s3_response_object['Body'].read()
	return object_content
	
def s3_put_file(xml, file_name):
	ext = xml.filename.rsplit(".", 1)[1]
	s3.put_object(Body=xml, Bucket=BUCKET_NAME, Key='data/'+file_name + '.' + ext)


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
			# ext = xml.filename.rsplit(".", 1)[1]
			
			
			if xml.filename == "":
				print("File must have filename")
				return redirect(request.url)
			
			if not allowed_type(xml.filename):
				print("File not allowed")
				return redirect(request.url)
				
			# xml.save('./static/data/user_upload' + '.' + ext)
			
			# with open(xml, "rb") as f:
				# s3.upload_fileobj(f, "w209-upload", 'user_upload' + '.' + ext)
			
			# s3.put_object(Body=xml, Bucket='w209-upload', Key='data/'+'user_upload' + '.' + ext)
			
			s3_put_file(xml, "user_upload")
			
			# a = s3_get_file("testing.png")
			# print(sys.getsizeof(a))
			
			print("File saved")
			
			return render_template('results.html')
			
	return render_template('index.html')


if __name__ == '__main__':
	app.run(debug=True)