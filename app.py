from flask import Flask, render_template, request

app = Flask(__name__)


# ===== HOME PAGE =====
@app.route('/')
def home():
    return render_template('index.html')


# ===== MAP PAGE (MAIN FEATURE) =====
@app.route('/map')
def map_page():
    # Get data from URL
    from_location = request.args.get('from')
    to_location = request.args.get('to')

    # Optional fallback (prevents empty page)
    if not from_location or not to_location:
        from_location = "Hyderabad"
        to_location = "Bangalore"

    print("From:", from_location)
    print("To:", to_location)

    return render_template(
        'map.html',
        from_location=from_location,
        to_location=to_location
    )


# ===== RUN SERVER =====
if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)