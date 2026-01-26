# Requires PowerShell 5.1 or later. Run as Administrator if needed for injection.
#
# Vencord Plugin Auto-Installer Script for Windows
#
# Usage: .\install.ps1
# Requires the plugin folder 'key-intercept' to be a direct child
# of the directory containing this script.
#
# This script automates:
# 1. Installing Vencord (if not present) and pnpm (if not present).
# 2. Moving the local plugin folder to Vencord's userplugins directory.
# 3. Modifying Vencord's CSP file for Supabase support.
# 4. Building and injecting Vencord.

# --- Configuration ---
# Use $env:USERPROFILE for the Windows user home directory
$VENCOORD_DIR = "$env:USERPROFILE\Vencord"
$PLUGIN_FOLDER = "key-intercept"
$PLUGIN_DEST = Join-Path $VENCOORD_DIR "src\userplugins\$PLUGIN_FOLDER"
$CSP_FILE = Join-Path $VENCOORD_DIR "src\main\csp\index.ts"


Write-Host "--- Vencord Plugin Installer for '$PLUGIN_FOLDER' (PowerShell) ---"

# 1. Vencord Installation Check
if (-not (Test-Path $VENCOORD_DIR -PathType Container)) {
    Write-Host "Vencord directory ($VENCOORD_DIR) not found. Cloning repository..."

    # Check for git
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Host "Error: 'git' is not installed. Please install git and try again." -ForegroundColor Red
        exit 1
    }

    git clone "https://github.com/Vendicated/Vencord.git" $VENCOORD_DIR
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to clone Vencord repository. Exiting." -ForegroundColor Red
        exit 1
    }
    Write-Host "Vencord cloned successfully."
} else {
    Write-Host "Vencord directory found at $VENCOORD_DIR. Skipping clone."
}

# 2. Copy Plugin Folder (MUST happen BEFORE we change directories)
$SOURCE_PLUGIN_PATH = Join-Path $PSScriptRoot $PLUGIN_FOLDER

if (-not (Test-Path $SOURCE_PLUGIN_PATH -PathType Container)) {
    Write-Host "Error: Source plugin folder '$SOURCE_PLUGIN_PATH' not found." -ForegroundColor Red
    Write-Host "Ensure the 'key-intercept' folder is in the same directory as this script." -ForegroundColor Red
    exit 1
}

Write-Host "Copying plugin '$PLUGIN_FOLDER' contents to $PLUGIN_DEST..."

# Remove existing plugin destination for a clean install
if (Test-Path $PLUGIN_DEST) {
    try {
        Remove-Item -Path $PLUGIN_DEST -Recurse -Force -ErrorAction Stop
    } catch {
        Write-Host "Warning: Could not remove existing plugin folder: $_" -ForegroundColor Yellow
    }
}

# Explicitly create the destination folder and its parent directories
try {
    New-Item -ItemType Directory -Path $PLUGIN_DEST -Force -ErrorAction Stop | Out-Null
    Write-Host "Created destination directory: $PLUGIN_DEST" -ForegroundColor Gray
} catch {
    Write-Host "Error: Failed to create destination directory: $_" -ForegroundColor Red
    exit 1
}

# Copy the *contents* of the plugin folder recursively into the destination
try {
    Copy-Item -Path "$SOURCE_PLUGIN_PATH\*" -Destination "$PLUGIN_DEST" -Recurse -ErrorAction Stop
    Write-Host "Plugin contents copied successfully to $PLUGIN_DEST."
} catch {
    Write-Host "Error: Failed to copy plugin folder contents: $_" -ForegroundColor Red
    exit 1
}

# Ensure we are in the plugin destination directory for subsequent operations
try {
    Set-Location -Path $PLUGIN_DEST -ErrorAction Stop
    Write-Host "Changed current directory to $PLUGIN_DEST."
} catch {
    Write-Host "Warning: Failed to change directory to ${PLUGIN_DEST}: $_" -ForegroundColor Yellow
}

# 3. pnpm Installation Check
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "pnpm not found. Attempting to install pnpm globally..."

    # Check for npm
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Host "Error: 'npm' is not installed. Please install Node.js (which includes npm) or install pnpm manually. Exiting." -ForegroundColor Red
        exit 1
    }

    # Install pnpm using npm
    npm install -g pnpm
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to install pnpm. Ensure Node.js/npm are installed correctly. Exiting." -ForegroundColor Red
        exit 1
    }
    Write-Host "pnpm installed successfully."
} else {
    Write-Host "pnpm is installed."
}

# 4. Edit CSP File
if (Test-Path $CSP_FILE) {
    Write-Host "Modifying CSP file: $CSP_FILE to add Supabase rules..."

    # CSP lines to be inserted
    $LINE1 = '"https://*.supabase.co": [ConnectSrc, "media-src"],'
    $LINE2 = '"wss://*.supabase.co": [ConnectSrc],'

    # Read the content
    $CSP_FILE_CONTENT = Get-Content $CSP_FILE
    
    # Convert to a mutable ArrayList
    $CSP_LIST = New-Object System.Collections.ArrayList
    $CSP_LIST.AddRange($CSP_FILE_CONTENT)
    
    # Insert at the appropriate positions
    $CSP_LIST.Insert(63, $LINE1)
    $CSP_LIST.Insert(65, $LINE2)
    
    # Write the modified content back to the file
    $CSP_LIST | Set-Content $CSP_FILE

    Write-Host "CSP modified successfully."
} else {
    Write-Host "Error: CSP file $CSP_FILE not found. Cannot modify CSP. Exiting." -ForegroundColor Red
    exit 1
}

# 5. Run pnpm install and add Supabase client
Write-Host "Installing Vencord dependencies (pnpm install)..."
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: pnpm install failed. Check network connection and dependencies. Exiting." -ForegroundColor Red
    exit 1
}
Write-Host "Core dependencies installed."

Write-Host "Installing Supabase client as a workspace dependency (pnpm add @supabase/supabase-js -w)..."
pnpm add @supabase/supabase-js -w
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: pnpm add @ -w failed. Exiting." -ForegroundColor Red
    exit 1
}
Write-Host "Supabase client installed successfully."

# 6. Run pnpm build
Write-Host "Building Vencord (pnpm build)..."
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: pnpm build failed. Exiting." -ForegroundColor Red
    exit 1
}
Write-Host "Vencord built successfully."

# 7. Run pnpm inject (requires elevated permissions on Windows)
Write-Host "Running Vencord injection (You may be prompted for administrator credentials)..."
# Start-Process is used here to run the command in an elevated context (Run as Administrator)
pnpm inject

if ($LASTEXITCODE -ne 0) {
    Write-Host "Injection complete, but may have reported an error or warning. The plugin should be active after restarting Discord."
} else {
    Write-Host "Vencord injection complete. The plugin should now be active after restarting Discord."
}

# 8. Enable Plugin in Settings
$VENCORD_SETTINGS_DIR = Join-Path $env:APPDATA "Vencord\settings"
$SETTINGS_FILE = Join-Path $VENCORD_SETTINGS_DIR "settings.json"

Write-Host "Attempting to enable '$PLUGIN_FOLDER' in Vencord settings..."
try {
    function Ensure-NoteProperty {
        param(
            [Parameter(Mandatory)][object]$Object,
            [Parameter(Mandatory)][string]$Name,
            [Parameter()][object]$Default = ([pscustomobject]@{})
        )
        if ($null -eq $Object) { throw "Target object is null." }
        if ($null -eq $Object.PSObject.Properties[$Name]) {
            $Object | Add-Member -MemberType NoteProperty -Name $Name -Value $Default
        }
        return $Object.PSObject.Properties[$Name].Value
    }

    # Load or init settings as PSCustomObject
    $settings = [pscustomobject]@{}
    if (Test-Path $SETTINGS_FILE) {
        try {
            $raw = Get-Content -Path $SETTINGS_FILE -Raw
            if ($raw -and $raw.Trim().Length -gt 0) {
                $settings = $raw | ConvertFrom-Json -ErrorAction Stop
            }
        } catch {
            Write-Host "Warning: Settings JSON invalid. Recreating from defaults." -ForegroundColor Yellow
            $settings = [pscustomobject]@{}
        }
    } else {
        Write-Host "Settings file not found. Creating new settings file at '$SETTINGS_FILE'."
        New-Item -Path $VENCORD_SETTINGS_DIR -ItemType Directory -Force -ErrorAction Stop | Out-Null
    }

    # Ensure nested objects exist
    $plugins    = Ensure-NoteProperty -Object $settings -Name 'plugins'
    $pluginObj  = Ensure-NoteProperty -Object $plugins  -Name $PLUGIN_FOLDER
    $loggerObj  = Ensure-NoteProperty -Object $plugins  -Name 'MessageLogger'

    # Ensure 'enabled' exists and is true
    if ($null -eq $pluginObj.PSObject.Properties['enabled']) {
        $pluginObj | Add-Member -MemberType NoteProperty -Name 'enabled' -Value $true
    } else {
        $pluginObj.enabled = $true
    }

    if ($null -eq $loggerObj.PSObject.Properties['enabled']) {
        $loggerObj | Add-Member -MemberType NoteProperty -Name 'enabled' -Value $true
    } else {
        $loggerObj.enabled = $true
    }

    # Save
    $settings | ConvertTo-Json -Depth 32 | Set-Content -Path $SETTINGS_FILE -Force
    Write-Host "Successfully enabled '$PLUGIN_FOLDER' in Vencord settings."
} catch {
    Write-Host "Warning: Could not automatically enable plugin in settings file '$SETTINGS_FILE'. You may need to enable it manually in Discord. Error: $_" -ForegroundColor Yellow
}

Write-Host "--- Installation finished. ---"
