#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Default values
AWS_REGION=${AWS_REGION:-ap-south-1}
ENVIRONMENT=${ENVIRONMENT:-dev}
BEDROCK_MODEL_ID=${BEDROCK_MODEL_ID:-anthropic.claude-3-sonnet-20240229-v1:0}

echo "🚀 Deploying Zit AI Mentor Backend..."
echo "   Region: ${AWS_REGION}"
echo "   Environment: ${ENVIRONMENT}"
echo "   Model: ${BEDROCK_MODEL_ID}"
echo ""

# Navigate to infrastructure directory
cd infrastructure

# Build with SAM
echo "📦 Building Lambda function..."
sam build

# Deploy with SAM
echo "☁️  Deploying to AWS..."
sam deploy \
  --stack-name zit-ai-mentor-${ENVIRONMENT} \
  --parameter-overrides Environment=${ENVIRONMENT} BedrockModelId=${BEDROCK_MODEL_ID} \
  --capabilities CAPABILITY_IAM \
  --region ${AWS_REGION} \
  --resolve-s3 \
  --no-confirm-changeset

echo ""
echo "✅ Deployment complete!"
echo ""

# Fetch outputs
STACK_NAME="zit-ai-mentor-${ENVIRONMENT}"
API_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text --region ${AWS_REGION} 2>/dev/null || echo "")

echo "📋 Next steps:"
echo ""
if [ -n "$API_ENDPOINT" ]; then
  echo "1. Your API endpoint: ${API_ENDPOINT}"
else
  echo "1. Get your API endpoint:"
  echo "   aws cloudformation describe-stacks --stack-name ${STACK_NAME} --query 'Stacks[0].Outputs'"
fi
echo ""
echo "2. Get your API key from the AWS Console:"
echo "   AWS Console → API Gateway → API Keys"
echo ""
echo "3. Configure zit (either method):"
echo ""
echo "   Option A — config file (~/.config/zit/config.toml):"
echo "   [ai]"
echo "   enabled = true"
echo "   endpoint = \"${API_ENDPOINT:-<your-api-endpoint>}\""
echo "   api_key = \"<your-api-key>\""
echo "   timeout_secs = 30"
echo ""
echo "   Option B — environment variables:"
echo "   export ZIT_AI_ENDPOINT=\"${API_ENDPOINT:-<your-api-endpoint>}\""
echo "   export ZIT_AI_API_KEY=\"<your-api-key>\""
echo ""
echo "4. Then in zit, press Ctrl+G in the commit view to generate AI messages!"
echo ""
echo "5. Test with:"
echo "   curl -X POST \$API_ENDPOINT -H 'Content-Type: application/json' -H 'x-api-key: \$API_KEY' -d '{\"type\":\"explain\",\"query\":\"test\"}'"
