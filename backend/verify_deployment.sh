#!/usr/bin/env bash
# Quick deployment verification script
# Run this before deploying to Render to catch common issues

echo "========================================="
echo "TeamLoom Render Deployment Verification"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: render.yaml exists
echo "✓ Checking render.yaml..."
if [ -f "../render.yaml" ]; then
    echo -e "${GREEN}  ✓ render.yaml found${NC}"
else
    echo -e "${RED}  ✗ render.yaml not found!${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: build.sh exists and is executable
echo "✓ Checking build.sh..."
if [ -f "build.sh" ]; then
    echo -e "${GREEN}  ✓ build.sh found${NC}"
    if [ -x "build.sh" ]; then
        echo -e "${GREEN}  ✓ build.sh is executable${NC}"
    else
        echo -e "${YELLOW}  ⚠ build.sh is not executable (will be fixed by Render)${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}  ✗ build.sh not found!${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check 3: requirements.txt exists
echo "✓ Checking requirements.txt..."
if [ -f "requirements.txt" ]; then
    echo -e "${GREEN}  ✓ requirements.txt found${NC}"
    
    # Check for critical packages
    if grep -q "Django" requirements.txt; then
        echo -e "${GREEN}  ✓ Django listed${NC}"
    else
        echo -e "${RED}  ✗ Django not in requirements.txt!${NC}"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q "daphne" requirements.txt; then
        echo -e "${GREEN}  ✓ Daphne listed${NC}"
    else
        echo -e "${RED}  ✗ Daphne not in requirements.txt!${NC}"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q "psycopg2" requirements.txt; then
        echo -e "${GREEN}  ✓ PostgreSQL driver listed${NC}"
    else
        echo -e "${RED}  ✗ psycopg2 not in requirements.txt!${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}  ✗ requirements.txt not found!${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check 4: Settings configuration
echo "✓ Checking settings.py..."
if [ -f "teamloom/settings.py" ]; then
    echo -e "${GREEN}  ✓ settings.py found${NC}"
    
    if grep -q "ALLOWED_HOSTS.*onrender" teamloom/settings.py; then
        echo -e "${GREEN}  ✓ .onrender.com in ALLOWED_HOSTS${NC}"
    else
        echo -e "${YELLOW}  ⚠ .onrender.com not in ALLOWED_HOSTS${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    if grep -q "CSRF_TRUSTED_ORIGINS" teamloom/settings.py; then
        echo -e "${GREEN}  ✓ CSRF_TRUSTED_ORIGINS configured${NC}"
    else
        echo -e "${YELLOW}  ⚠ CSRF_TRUSTED_ORIGINS not configured${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    if grep -q "whitenoise" teamloom/settings.py; then
        echo -e "${GREEN}  ✓ WhiteNoise configured${NC}"
    else
        echo -e "${RED}  ✗ WhiteNoise not configured!${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}  ✗ settings.py not found!${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check 5: ASGI configuration
echo "✓ Checking ASGI configuration..."
if [ -f "teamloom/asgi.py" ]; then
    echo -e "${GREEN}  ✓ asgi.py found${NC}"
else
    echo -e "${RED}  ✗ asgi.py not found!${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check 6: Health check endpoint
echo "✓ Checking health check endpoint..."
if grep -q "health" teamloom/urls.py; then
    echo -e "${GREEN}  ✓ Health check endpoint configured${NC}"
else
    echo -e "${YELLOW}  ⚠ Health check endpoint not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 7: Management commands
echo "✓ Checking management commands..."
if [ -f "profiles/management/commands/seed_skills.py" ]; then
    echo -e "${GREEN}  ✓ seed_skills command found${NC}"
else
    echo -e "${YELLOW}  ⚠ seed_skills command not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "========================================="
echo "Verification Summary"
echo "========================================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready to deploy.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found. Review before deploying.${NC}"
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) and $WARNINGS warning(s) found.${NC}"
    echo -e "${RED}Please fix errors before deploying.${NC}"
    exit 1
fi
