from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)


# ===== HOME ROUTE =====
@app.route('/')
def home():
    return render_template('index.html')


# ===== HANDLE FORM (OPTIONAL FOR NOW) =====
@app.route('/search', methods=['POST'])
def search():
    from_location = request.form.get('from')
    to_location = request.form.get('to')

    # For now, just print (later we connect DB)
    print("From:", from_location)
    print("To:", to_location)

    # Redirect back to home (you can change later)
    return redirect(url_for('home'))


# ===== RUN SERVER =====
if __name__ == '__main__':
    app.run(debug=True)