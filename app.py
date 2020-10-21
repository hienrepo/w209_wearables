from flask import Flask, render_template, url_for, request
from flask_bootstrap import Bootstrap


application = app = Flask(__name__)
Bootstrap(app)

@app.route('/')
def index():
	return render_template('index.html')

# @app.route('/prompts')
# def prompts():
		# return render_template('prompts.html')

# @app.route('/grader')
# def grader():
		# return render_template('grader.html')



# @app.route('/predict',methods=['POST', 'GET'])
# def predict():

	# if request.method == 'POST':
		# essay = request.form['essay_input']
		# prompt = request.form['prompt_input']
		# print(prompt)

		# if essay[0] in ['a', 'b', 'c']:
			# my_prediction = "True"
		# else:
			# my_prediction = "False"

		# return render_template('results.html', prediction = my_prediction
											 # , input_essay = essay.upper()
											 # , input_prompt = prompt)
	# elif request.method == 'GET':
		# return render_template('results.html')


if __name__ == '__main__':
	app.run(debug=True)