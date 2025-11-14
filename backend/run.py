"""
Data Pipeline CLI - Orchestrates the data processing pipeline
Run all steps: python run.py
"""

import os
import sys
import argparse

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from scripts.clean_data import clean
from scripts.generate_features import generate_features
from scripts.insert_data import insert_data

def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(description='Lernexa AI Data Pipeline')
    parser.add_argument(
        '--step',
        type=int,
        choices=[1, 2, 3],
        help='Run specific step: 1=clean, 2=features, 3=insert'
    )
    parser.add_argument(
        '--all',
        action='store_true',
        help='Run all steps sequentially'
    )
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("🚀 Lernexa AI - Data Pipeline")
    print("=" * 60)
    print()
    
    # If no arguments, show interactive menu
    if not args.step and not args.all:
        print("Select an option:")
        print("1. Clean raw data")
        print("2. Generate features")
        print("3. Insert data to MongoDB")
        print("4. Run all steps (1, 2, 3)")
        print("0. Exit")
        print()
        
        try:
            choice = input("Enter your choice (0-4): ").strip()
        except KeyboardInterrupt:
            print("\n\n❌ Cancelled by user")
            sys.exit(1)
        
        if choice == '0':
            print("👋 Goodbye!")
            sys.exit(0)
        elif choice == '1':
            step = 1
        elif choice == '2':
            step = 2
        elif choice == '3':
            step = 3
        elif choice == '4':
            args.all = True
        else:
            print("❌ Invalid choice")
            sys.exit(1)
    else:
        step = args.step
    
    success = True
    
    if args.all or step == 1:
        print("\n" + "=" * 60)
        print("STEP 1: Cleaning raw data")
        print("=" * 60)
        success = clean()
        if not success:
            print("\n❌ Step 1 failed. Aborting pipeline.")
            sys.exit(1)
        print()
    
    if args.all or step == 2:
        print("\n" + "=" * 60)
        print("STEP 2: Generating features")
        print("=" * 60)
        success = generate_features()
        if not success:
            print("\n❌ Step 2 failed. Aborting pipeline.")
            sys.exit(1)
        print()
    
    if args.all or step == 3:
        print("\n" + "=" * 60)
        print("STEP 3: Inserting data to MongoDB")
        print("=" * 60)
        success = insert_data()
        if not success:
            print("\n❌ Step 3 failed. Aborting pipeline.")
            sys.exit(1)
        print()
    
    if success:
        print("\n" + "=" * 60)
        print("✅ Pipeline completed successfully!")
        print("=" * 60)
        print("\nYou can now start the API server with:")
        print("  python app.py")
        print()

if __name__ == "__main__":
    main()

