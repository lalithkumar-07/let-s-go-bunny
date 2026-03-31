from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# ===== HOME =====
@app.route('/')
def home():
    return render_template('index.html')

# ===== SEARCH =====
@app.route('/search', methods=['POST'])
def search():
    from_location = request.form.get('from')
    to_location = request.form.get('to')

    print("From:", from_location)
    print("To:", to_location)

    return redirect(url_for('home'))

# ===== RUN =====
if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)