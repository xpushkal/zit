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
echo "📋 Next steps:"
echo "1. Get your API endpoint from CloudFormation outputs:"
echo "   aws cloudformation describe-stacks --stack-name zit-ai-mentor-${ENVIRONMENT} --query 'Stacks[0].Outputs'"
echo ""
echo "2. Retrieve your API key value from AWS Console:"
echo "   AWS Console → API Gateway → API Keys → zit-api-key-${ENVIRONMENT}"
echo ""
echo "3. Update your .env file with API_ENDPOINT and API_KEY values"
echo ""
echo "4. Test with:"
echo "   curl -X POST \$API_ENDPOINT -H 'Content-Type: application/json' -H 'x-api-key: \$API_KEY' -d '{\"type\":\"explain\",\"query\":\"test\"}'"
