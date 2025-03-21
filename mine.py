from flask import Flask, request, jsonify
import traceback
import pandas as pd
import joblib
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow CORS for all routes

# Load trained toy price prediction model
model = joblib.load("toy_price_model.pkl")

# Define the expected input features for toy price prediction
expected_features = [
    "Category", "Brand", "AgeGroup", "Size", "Weight", "Material", "Condition"
]

# Prediction route
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Convert JSON to DataFrame
        input_data = pd.DataFrame([data])

        # Ensure all required features exist
        missing_features = [feature for feature in expected_features if feature not in input_data.columns]
        if missing_features:
            return jsonify({"error": f"Missing features: {missing_features}"}), 400

        # Make prediction
        prediction = model.predict(input_data)[0]

        # Return the predicted price
        return jsonify({"predicted_price": round(prediction, 2)})

    except Exception as e:
        error_message = traceback.format_exc()
        print(f"Error occurred: {error_message}")
        return jsonify({"error": "An error occurred during prediction", "details": error_message}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)