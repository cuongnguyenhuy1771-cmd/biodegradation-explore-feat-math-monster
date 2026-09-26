import os
import glob
import re

directories = ['src/app']

for directory in directories:
    for filepath in glob.glob(directory + '/**/*.tsx', recursive=True):
        with open(filepath, 'r') as f:
            content = f.read()

        changed = False

        # 1. Replace SafeAreaView from react-native with react-native-safe-area-context
        if 'SafeAreaView' in content and 'react-native-safe-area-context' not in content:
            # Replace import { ..., SafeAreaView, ... } from 'react-native'
            # with importing SafeAreaView from 'react-native-safe-area-context'
            
            # Remove SafeAreaView from react-native import
            content = re.sub(r'(\bSafeAreaView\b\s*,\s*)', '', content)
            content = re.sub(r'(,\s*\bSafeAreaView\b)', '', content)
            content = re.sub(r'(import\s*\{\s*\bSafeAreaView\b\s*\}\s*from\s*\'react-native\';?)', '', content)
            
            # Add SafeAreaView to react-native-safe-area-context import
            content = "import { SafeAreaView } from 'react-native-safe-area-context'\n" + content
            changed = True

        # 2. Add useSafeAreaInsets to files that have hardcoded pt-16, pt-14 on header views
        # Usually these are the ones I just changed today:
        # <View className="px-4 pt-16 pb-2"> or <View className="px-4 pt-14 pb-2"> etc.
        # But wait, using useSafeAreaInsets requires adding a hook to the component, which is hard to regex safely for all files.
        
        if changed:
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Fixed SafeAreaView in {filepath}")
