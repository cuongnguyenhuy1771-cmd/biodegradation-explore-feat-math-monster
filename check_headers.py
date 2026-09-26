import os
import glob
import re

directories = ['src/app/(screens)', 'src/app/(tabs)']
for directory in directories:
    for filepath in glob.glob(directory + '/**/*.tsx', recursive=True):
        with open(filepath, 'r') as f:
            content = f.read()
            # If there's a ScrollView
            if '<ScrollView' in content:
                print(f"File: {filepath}")
                # Print a summary of the layout around ScrollView
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if '<ScrollView' in line:
                        start = max(0, i - 2)
                        end = min(len(lines), i + 10)
                        print('\n'.join(lines[start:end]))
                        print('-' * 40)
