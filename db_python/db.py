from flask import Flask
import pymssql
app = Flask(__name__)
#Run para autoupdate => FLASK_APP=db.py FLASK_ENV=development flask run --port 4001

@app.route('/',methods = ['POST', 'GET'])
def login():
   if request.method == 'POST':
      
      return redirect(url_for('success',name = user))
   else:
      user = request.args.get('nm')
      return redirect(url_for('success',name = user))

