#!/bin/bash
#
# Vencord Plugin Auto-Installer Script
#
# Usage: ./install.sh
# Requires the plugin folder 'key-intercept' to be a direct child
# of the directory containing this script.
#
# This script automates:
# 1. Installing Vencord (if not present) and pnpm (if not present).
# 2. Moving the local plugin folder to Vencord's userplugins directory.
# 3. Modifying Vencord's CSP file for Supabase support.
# 4. Building and injecting Vencord.

# --- Configuration ---
VENCOORD_DIR="$HOME/Vencord"
# The plugin folder name is now fixed to 'key-intercept' as requested.
PLUGIN_FOLDER="key-intercept"
PLUGIN_DEST="$VENCOORD_DIR/src/userplugins/$PLUGIN_FOLDER"
CSP_FILE="$VENCOORD_DIR/src/main/csp/index.ts"
PACKAGE_FILE="$VENCOORD_DIR/package.json"
VITEST_CONFIG="vitest.config.ts"

echo "--- Vencord Plugin Installer for '$PLUGIN_FOLDER' ---"

# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 24

# Verify the Node.js version:
node -v # Should print "v24.13.0".

# Download and install pnpm:
corepack enable pnpm

# Verify pnpm version:
pnpm -v

# 1. Vencord Installation Check
if [ ! -d "$VENCOORD_DIR" ]; then
    echo "Vencord directory ($VENCOORD_DIR) not found. Cloning repository..."
    if command -v git &> /dev/null; then
        git clone https://github.com/Vendicated/Vencord.git "$VENCOORD_DIR"
        if [ $? -ne 0 ]; then
            echo "Error: Failed to clone Vencord repository. Exiting."
            exit 1
        fi
        echo "Vencord cloned successfully."
    else
        echo "Error: 'git' is not installed. Please install git and try again. Exiting."
        exit 1
    fi
else
    echo "Vencord directory found at $VENCOORD_DIR. Skipping clone."
fi

# 2. Copy Plugin Folder (MUST happen BEFORE we change directories)
SOURCE_PLUGIN_PATH="$PLUGIN_FOLDER"

if [ ! -d "$SOURCE_PLUGIN_PATH" ]; then
    echo "Error: Source plugin folder '$SOURCE_PLUGIN_PATH' not found."
    echo "Ensure the 'key-intercept' folder is in the same directory as this script."
    exit 1
fi

echo "Copying plugin '$PLUGIN_FOLDER' contents to $PLUGIN_DEST..."

# Remove existing plugin destination for a clean install
rm -rf "$PLUGIN_DEST"

# Explicitly create the destination folder
mkdir -p "$PLUGIN_DEST"

# Copy the *contents* of the plugin folder recursively into the destination
# This ensures the destination directory contains the files, matching the request for src/userplugins/key-intercept/*
cp -r "$SOURCE_PLUGIN_PATH"/* "$PLUGIN_DEST"
if [ $? -ne 0 ]; then
    echo "Error: Failed to copy plugin folder contents. Exiting."
    exit 1
fi
echo "Plugin contents copied successfully to $PLUGIN_DEST."

# 5. Moving vitest config
echo "Copying Vitest config"
cp $VITEST_CONFIG $VENCOORD_DIR
if [ $? -ne 0 ]; then
    echo "Error: Vitest config not working"
    exit 1
fi
echo "Vitest Config moved succesfully"

# Change to Vencord directory for subsequent pnpm commands (Steps 3-7)
cd "$VENCOORD_DIR" || { echo "Error: Cannot change directory to $VENCOORD_DIR. Exiting."; exit 1; }

# 3. pnpm Installation Check
if ! command -v pnpm &> /dev/null
then
    echo "pnpm not found. Attempting to install pnpm globally..."
    if command -v npm &> /dev/null; then
        # Install pnpm using npm (assuming Node.js is installed)
        sudo npm install -g pnpm
        if [ $? -ne 0 ]; then
            echo "Error: Failed to install pnpm. Ensure Node.js/npm are installed correctly. Exiting."
            exit 1
        fi
        echo "pnpm installed successfully."
    else
        echo "Error: 'npm' is not installed. Please install Node.js (which includes npm) or install pnpm manually. Exiting."
        exit 1
    fi
else
    echo "pnpm is installed."
fi

# 4. Edit CSP File
if [ -f "$CSP_FILE" ]; then

    echo "Modifying CSP file: $CSP_FILE to add Supabase rules..."

    # CSP lines to be inserted (Note the trailing comma is crucial for the JSON-like structure)
    LINE1='"https://*.supabase.co": [ConnectSrc, "media-src"],'
    LINE2='"wss://*.supabase.co": [ConnectSrc],'

    # Inserting in reverse line number order to maintain original line numbering reference
    # Insert line 65 (original)
    # Using sed -i.bak for cross-platform compatibility (macOS/Linux)
    CURRENT_LINE=$(awk 'NR==64{ print; exit }' $CSP_FILE)

    if [ "$CURRENT_LINE" != "$LINE1" ]; then
        sed -i.bak "65i\\$LINE2" "$CSP_FILE"
        # Insert line 64 (original)
        sed -i.bak "64i\\$LINE1" "$CSP_FILE"

        # Clean up the backup file created by sed -i.bak
        find "$VENCOORD_DIR" -name "*.bak" -delete

        echo "CSP modified successfully."
    else
        echo "CSP modifications unnecessary"
    fi
else
    echo "Error: CSP file $CSP_FILE not found. Cannot modify CSP. Exiting."
    exit 1
fi

if [ -f "$PACKAGE_FILE" ]; then
    echo "Modifying package.json file: $PACKAGE_FILE to add test parameters"

    # CSP lines to be inserted (Note the trailing comma is crucial for the JSON-like structure)
    LINE1='"test": "pnpm buildStandalone && pnpm generatePluginJson && vitest key-intercept",'

    # Inserting in reverse line number order to maintain original line numbering reference
    # Insert line 65 (original)
    # Using sed -i.bak for cross-platform compatibility (macOS/Linux)
    CURRENT_LINE=$(awk 'NR==33{ print; exit }' $PACKAGE_FILE)

    if [ "$CURRENT_LINE" != "$LINE1" ]; then
        sed -i "33c\\$LINE1" "$PACKAGE_FILE"
        #sed "33s#.*#$LINE1#" "$PACKAGE_FILE"
        # Clean up the backup file created by sed -i.bak
        find "$VENCOORD_DIR" -name "*.bak" -delete

        echo "package.json modifications successful."
    else
        echo "package.json modifications unnecessary"
    fi
else
    echo "Error: package.json file $PACKAGE_FILE not found. Cannot modify package.json. Exiting."
    exit 1
fi

# 5. Run pnpm install and add Supabase client
echo "Installing Vencord dependencies (pnpm install)..."
pnpm install
if [ $? -ne 0 ]; then
    echo "Error: pnpm install failed. Check network connection and dependencies. Exiting."
    exit 1
fi
echo "Core dependencies installed."

echo "Installing Supabase client as a workspace dependency (pnpm add supabase -w)..."
pnpm add @supabase/supabase-js -w
if [ $? -ne 0 ]; then
    echo "Error: pnpm add supabase -w failed. Exiting."
    exit 1
fi
echo "Supabase client installed successfully."

echo "Installing vitest as a workspace dependency (pnpm add vitest -w)..."
pnpm add vitest -w
if [ $? -ne 0 ]; then
    echo "Error: pnpm add vitest -w failed. Exiting."
    exit 1
fi
echo "Vitest client installed successfully."

echo "Installing vitest-paths as a workspace dependency (pnpm add vite-tsconfig-paths -D -w)..."
pnpm add -D vite-tsconfig-paths -w
if [ $? -ne 0 ]; then
    echo "Error: pnpm add vitest-paths -w failed. Exiting."
    exit 1
fi
echo "Vitest-paths client installed successfully."

# 6. Run pnpm test
echo "Running Tests"
pnpm test
if [ $? -ne 0 ]; then
    echo "Error: pnpm test failed. Exiting."
    exit 1
fi
echo "Vencord tested successfully."
