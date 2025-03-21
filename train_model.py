import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LinearRegression
import joblib

# Load the dataset
data = pd.read_csv("toys_data.csv")

# Separate features and target
X = data.drop("Estimated Value (Frw)", axis=1)  # Features
y = data["Estimated Value (Frw)"]  # Target

# Define numerical and categorical features
numerical_features = ["Size (cm)", "Weight (kg)"]
categorical_features = ["Category", "Brand", "Age Group", "Material", "Condition"]

# Create a preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_features),  # Scale numerical features
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),  # Encode categorical features
    ]
)

# Create the model pipeline
model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),  # Preprocess the data
        ("regressor", LinearRegression()),  # Use Linear Regression for prediction
    ]
)

# Train the model
model.fit(X, y)

# Save the model to a .pkl file
joblib.dump(model, "toy_price_model.pkl")
print("Model saved as toy_price_model.pkl")