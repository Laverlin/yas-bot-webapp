#!/bin/bash

# init.sh - Deploy ArgoCD application with specified overlay
# Usage: ./init.sh <overlay-name>
# Example: ./init.sh hetzner

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 <overlay-name>"
    echo ""
    echo "Available overlays:"
    if [ -d "webapp/overlays" ]; then
        for overlay in webapp/overlays/*/; do
            overlay_name=$(basename "$overlay")
            echo "  - $overlay_name"
        done
    else
        echo "  No overlays found in webapp/overlays/"
    fi
    echo ""
    echo "Example: $0 hetzner"
}

# Check if overlay name is provided
if [ $# -eq 0 ]; then
    log_error "Overlay name is required"
    show_usage
    exit 1
fi

OVERLAY_NAME="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$DEPLOY_DIR")"

# Paths
KUBECONFIG_PATH="$HOME/remote-kube/$OVERLAY_NAME/config"
ARGOCD_TEMPLATE="$SCRIPT_DIR/init/argocd.yaml"
ARGOCD_TEMP="/tmp/argocd-$OVERLAY_NAME-$(date +%s).yaml"
OVERLAY_PATH="$DEPLOY_DIR/webapp/overlays/$OVERLAY_NAME"

log_info "Starting deployment for overlay: $OVERLAY_NAME"
log_info "Project root: $PROJECT_ROOT"
log_info "Deploy directory: $DEPLOY_DIR"

# Validate overlay exists
if [ ! -d "$OVERLAY_PATH" ]; then
    log_error "Overlay '$OVERLAY_NAME' not found at: $OVERLAY_PATH"
    show_usage
    exit 1
fi

log_success "Found overlay directory: $OVERLAY_PATH"

# Validate kubeconfig exists
if [ ! -f "$KUBECONFIG_PATH" ]; then
    log_error "Kubeconfig not found at: $KUBECONFIG_PATH"
    log_info "Please ensure the kubeconfig file exists at the expected location"
    exit 1
fi

log_success "Found kubeconfig: $KUBECONFIG_PATH"

# Validate ArgoCD template exists
if [ ! -f "$ARGOCD_TEMPLATE" ]; then
    log_error "ArgoCD template not found at: $ARGOCD_TEMPLATE"
    exit 1
fi

log_success "Found ArgoCD template: $ARGOCD_TEMPLATE"

# Test kubeconfig connectivity
log_info "Testing cluster connectivity..."
if ! KUBECONFIG="$KUBECONFIG_PATH" kubectl cluster-info --request-timeout=10s > /dev/null 2>&1; then
    log_error "Unable to connect to cluster using kubeconfig: $KUBECONFIG_PATH"
    log_info "Please verify the kubeconfig is valid and the cluster is accessible"
    exit 1
fi

log_success "Cluster connectivity verified"

# Check if ArgoCD namespace exists
log_info "Checking ArgoCD namespace..."
if ! KUBECONFIG="$KUBECONFIG_PATH" kubectl get namespace argocd > /dev/null 2>&1; then
    log_warning "ArgoCD namespace not found. Creating it..."
    if ! KUBECONFIG="$KUBECONFIG_PATH" kubectl create namespace argocd; then
        log_error "Failed to create ArgoCD namespace"
        exit 1
    fi
    log_success "ArgoCD namespace created"
else
    log_success "ArgoCD namespace exists"
fi

# Create temporary ArgoCD manifest with correct overlay
log_info "Preparing ArgoCD manifest for overlay: $OVERLAY_NAME"
cp "$ARGOCD_TEMPLATE" "$ARGOCD_TEMP"

# Replace placeholder with actual overlay name
if command -v sed > /dev/null 2>&1; then
    # Use sed to replace the placeholder
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS sed
        sed -i '' "s|<overlay-name>|$OVERLAY_NAME|g" "$ARGOCD_TEMP"
    else
        # GNU sed
        sed -i "s|<overlay-name>|$OVERLAY_NAME|g" "$ARGOCD_TEMP"
    fi
else
    log_error "sed command not found. Cannot replace overlay placeholder."
    rm -f "$ARGOCD_TEMP"
    exit 1
fi

log_success "ArgoCD manifest prepared with overlay: $OVERLAY_NAME"

# Show the prepared manifest
log_info "Generated ArgoCD manifest:"
echo "----------------------------------------"
cat "$ARGOCD_TEMP"
echo "----------------------------------------"

# Apply the ArgoCD application
log_info "Deploying ArgoCD application..."
if KUBECONFIG="$KUBECONFIG_PATH" kubectl apply -f "$ARGOCD_TEMP"; then
    log_success "ArgoCD application deployed successfully"
    
    # Get application status
    log_info "Checking application status..."
    KUBECONFIG="$KUBECONFIG_PATH" kubectl get application sailingapp-botwebapp -n argocd -o wide || true
    
    log_info "You can check the application status with:"
    echo "  KUBECONFIG=$KUBECONFIG_PATH kubectl get applications -n argocd"
    echo "  KUBECONFIG=$KUBECONFIG_PATH kubectl describe application sailingapp-botwebapp -n argocd"
    
else
    log_error "Failed to deploy ArgoCD application"
    rm -f "$ARGOCD_TEMP"
    exit 1
fi

# Cleanup temporary file
rm -f "$ARGOCD_TEMP"

log_success "Deployment completed successfully for overlay: $OVERLAY_NAME"
log_info "The application should now be syncing in ArgoCD"
