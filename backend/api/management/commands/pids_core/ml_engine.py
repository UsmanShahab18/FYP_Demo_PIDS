import os
import joblib
import pandas as pd
import numpy as np
from django.conf import settings
from colorama import Fore, Style
import traceback

class MLEngine:
    def __init__(self, feature_list):
        self.model_stage1 = None
        self.model_stage2 = None
        self.label_encoder = None
        self.features_list = feature_list

    def load_models(self):
        """Load ML models from ml_models directory"""
        models_dir = os.path.join(settings.BASE_DIR, 'ml_models')
        try:
            self.model_stage1 = joblib.load(os.path.join(models_dir, 'stage1_xgboost.pkl'))
            self.model_stage2 = joblib.load(os.path.join(models_dir, 'stage2_lightgbm.pkl'))
            self.label_encoder = joblib.load(os.path.join(models_dir, 'label_encoder.pkl'))
            print(f"{Fore.GREEN}✅ ML Models loaded successfully{Style.RESET_ALL}")
            return True
        except Exception as e:
            print(f"{Fore.RED}❌ Error loading models: {e}{Style.RESET_ALL}")
            return False

    def predict(self, features):
        """Make prediction using loaded models"""
        if not self.model_stage1:
            return 'Normal', 0.5, 'Normal'

        try:
            # Create DataFrame
            input_df = pd.DataFrame([features])[self.features_list]
            input_df = input_df.replace([np.inf, -np.inf], 0).fillna(0)

            # Stage 1
            stage1_pred = self.model_stage1.predict(input_df)[0]
            stage1_proba = self.model_stage1.predict_proba(input_df)[0]

            if stage1_pred == 1:
                # Stage 2
                stage2_pred = self.model_stage2.predict(input_df)[0]
                stage2_proba = self.model_stage2.predict_proba(input_df)[0]
                attack_type = self.label_encoder.inverse_transform([stage2_pred])[0]
                confidence = max(stage2_proba)
                return attack_type, confidence, 'Attack'
            else:
                return 'Normal', stage1_proba[0], 'Normal'
        except Exception as e:
                print(f"ML Error: {e}") 
                return 'Unknown', 0.0, 'Unknown'