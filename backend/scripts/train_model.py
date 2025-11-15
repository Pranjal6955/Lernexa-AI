#!/usr/bin/env python3
"""
Model training script - trains the completion prediction model using student data
Usage:
  python scripts/train_model.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.ml_service import MLService
import json

def main():
    print("\n" + "="*60)
    print("STUDENT DATA PREDICTION MODEL TRAINING")
    print("="*60 + "\n")
    
    print("Initializing ML service...")
    ml_service = MLService()
    
    print("Training model on student completion data...\n")
    result = ml_service.train_model()
    
    if result.get('success'):
        print("Model trained successfully!\n")
        metrics = result.get('metrics', {})
        
        print("MODEL METRICS:")
        print(f"  • Accuracy:  {metrics.get('accuracy', 'N/A')*100:.2f}%")
        print(f"  • Precision: {metrics.get('precision', 'N/A')*100:.2f}%")
        print(f"  • Recall:    {metrics.get('recall', 'N/A')*100:.2f}%")
        print(f"  • F1 Score:  {metrics.get('f1_score', 'N/A')*100:.2f}%")
        
        print(f"\nTRAINING DATA:")
        print(f"  • Training samples: {metrics.get('training_samples', 'N/A')}")
        print(f"  • Test samples:     {metrics.get('test_samples', 'N/A')}")
        
        print(f"\nFEATURES USED ({len(metrics.get('features_used', []))}):")
        for feat in metrics.get('features_used', []):
            print(f"  • {feat}")
        
        print(f"\nFEATURE IMPORTANCE (Top 5):")
        importance = metrics.get('feature_importance', {})
        sorted_importance = sorted(importance.items(), key=lambda x: x[1], reverse=True)
        for feat, imp in sorted_importance[:5]:
            print(f"  • {feat}: {imp*100:.2f}%")
        
        print("\nModel saved to ./models/completion_model.pkl")
        print("="*60 + "\n")
        
    else:
        print("Model training failed!")
        print(f"Error: {result.get('error', 'Unknown error')}")
        print(f"Message: {result.get('message', 'N/A')}")
        print("="*60 + "\n")
        sys.exit(1)

if __name__ == '__main__':
    main()
