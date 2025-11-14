"""
Kaggle API utility for downloading education datasets
Requires Kaggle API credentials (kaggle.json) in ~/.kaggle/
"""

import os
import json
import requests
from pathlib import Path

class KaggleAPI:
    """Utility class for Kaggle API operations"""
    
    def __init__(self):
        self.kaggle_dir = Path.home() / '.kaggle'
        self.kaggle_json = self.kaggle_dir / 'kaggle.json'
        self.api_key = None
        self.username = None
        self._load_credentials()
    
    def _load_credentials(self):
        """Load Kaggle API credentials"""
        try:
            if self.kaggle_json.exists():
                with open(self.kaggle_json, 'r') as f:
                    creds = json.load(f)
                    self.username = creds.get('username')
                    self.api_key = creds.get('key')
        except Exception as e:
            print(f"Warning: Could not load Kaggle credentials: {e}")
            print("To use Kaggle API, place kaggle.json in ~/.kaggle/")
    
    def is_configured(self):
        """Check if Kaggle API is configured"""
        return self.api_key is not None and self.username is not None
    
    def download_dataset(self, dataset_name, output_dir='datasets/raw'):
        """
        Download a dataset from Kaggle
        Example: dataset_name = 'datasets/student-performance-data'
        """
        if not self.is_configured():
            return {
                'success': False,
                'error': 'Kaggle API not configured',
                'message': 'Please set up Kaggle API credentials'
            }
        
        try:
            # Use kaggle CLI if available
            import subprocess
            
            os.makedirs(output_dir, exist_ok=True)
            
            # Download using kaggle CLI
            result = subprocess.run(
                ['kaggle', 'datasets', 'download', '-d', dataset_name, '-p', output_dir],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                return {
                    'success': True,
                    'message': f'Dataset downloaded to {output_dir}',
                    'dataset': dataset_name
                }
            else:
                return {
                    'success': False,
                    'error': result.stderr,
                    'message': 'Failed to download dataset'
                }
                
        except FileNotFoundError:
            return {
                'success': False,
                'error': 'Kaggle CLI not found',
                'message': 'Install kaggle package: pip install kaggle'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Error downloading dataset'
            }
    
    def search_datasets(self, search_term='education', page=1):
        """Search for education datasets on Kaggle"""
        # This would require Kaggle API client library
        # For now, return popular education datasets
        popular_datasets = [
            {
                'name': 'Students Performance in Exams',
                'ref': 'spscientist/students-performance-in-exams',
                'description': 'Student performance dataset with exam scores'
            },
            {
                'name': 'Student Study Hours',
                'ref': 'datasets/student-study-hours',
                'description': 'Dataset with student study hours and scores'
            },
            {
                'name': 'Online Education Dataset',
                'ref': 'datasets/online-education',
                'description': 'Online learning platform data'
            }
        ]
        
        return {
            'datasets': popular_datasets,
            'search_term': search_term,
            'note': 'Install kaggle package for full API access'
        }

