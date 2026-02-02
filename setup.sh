#!/bin/bash

echo "🚀 Internal Leave Management API - Setup Script"
echo "================================================"
echo ""

# color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# install dependencies
echo -e "${BLUE}Step 1: Installing dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# setup environment variables
echo -e "${BLUE}Step 2: Setting up environment variables...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
fi
echo ""

# create database
echo -e "${BLUE}Step 3: Creating PostgreSQL database...${NC}"
echo -e "${YELLOW}Attempting to create 'leave_db' database...${NC}"
createdb leave_db 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database created (or already exists)${NC}"
else
    echo -e "${YELLOW}⚠️  Database creation skipped (may already exist)${NC}"
fi
echo ""

# summary
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Edit .env file with your database credentials:"
echo "   - DB_HOST=localhost"
echo "   - DB_USERNAME=postgres"
echo "   - DB_PASSWORD=your_password"
echo "   - DB_NAME=leave_db"
echo ""
echo "2. Start development server:"
echo -e "${YELLOW}   npm run start:dev${NC}"
echo ""
echo "3. Server will be available at http://localhost:3000"
echo ""
echo -e "${BLUE}Testing the API:${NC}"
echo "- Import postman_collection.json to Postman"
echo ""
echo -e "${BLUE}Running E2E Tests:${NC}"
echo -e "${YELLOW}   npm run test:e2e${NC}"
echo ""
