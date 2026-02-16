# Zit AI Mentor - AWS Backend

This directory contains the AWS Lambda backend for Zit's AI Mentor feature, powered by Amazon Bedrock (Claude).

## Architecture

```
zit CLI → API Gateway → Lambda → Amazon Bedrock (Claude)
```

## Prerequisites

1. **AWS Account** with Bedrock access enabled
2. **AWS CLI** configured with credentials
3. **AWS SAM CLI** installed

```bash
# Install SAM CLI on macOS
brew install aws-sam-cli

# Configure AWS credentials
aws configure
```

## Project Structure

```
aws/
├── .env                    # Environment configuration
├── deploy.sh               # Deployment script
├── README.md               # This file
├── lambda/
│   ├── handler.py          # Lambda function code
│   ├── prompts.py          # AI system prompts
│   └── requirements.txt    # Python dependencies
└── infrastructure/
    └── template.yaml       # SAM/CloudFormation template
```

## Deployment

### 1. Configure Environment

Edit `.env` with your preferences:

```bash
AWS_REGION=us-east-1
ENVIRONMENT=dev
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

### 2. Enable Bedrock Model Access

Before deploying, ensure you have access to Claude models in Amazon Bedrock:

1. Go to AWS Console → Amazon Bedrock
2. Navigate to "Model access"
3. Request access to Anthropic Claude models
4. Wait for approval (usually instant for Claude Sonnet/Haiku)

### 3. Deploy

```bash
cd aws
chmod +x deploy.sh
./deploy.sh
```

### 4. Get API Credentials

After deployment:

```bash
# Get API endpoint
aws cloudformation describe-stacks \
  --stack-name zit-ai-mentor-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text

# Get API key ID, then retrieve the value from AWS Console
aws cloudformation describe-stacks \
  --stack-name zit-ai-mentor-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiKeyId`].OutputValue' \
  --output text
```

Then update `.env` with `API_ENDPOINT` and `API_KEY`.

## API Reference

### Endpoint

`POST /mentor`

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` |
| `x-api-key` | Yes | Your API key |

### Request Types

#### 1. Explain Repository State

```json
{
  "type": "explain",
  "context": {
    "branch": "main",
    "staged_files": ["src/main.rs"],
    "unstaged_files": ["README.md"],
    "ahead": 2,
    "behind": 0
  },
  "query": "What should I do next?"
}
```

#### 2. Translate Git Error

```json
{
  "type": "error",
  "error": "error: Your local changes would be overwritten by merge.",
  "context": {
    "branch": "feature",
    "unstaged_files": ["config.json"]
  }
}
```

#### 3. Get Recommendation

```json
{
  "type": "recommend",
  "context": {
    "branch": "main",
    "ahead": 5
  },
  "query": "I want to undo my last 3 commits"
}
```

#### 4. Suggest Commit Message

```json
{
  "type": "commit_suggestion",
  "context": {
    "staged_files": ["src/auth.rs", "src/login.rs"],
    "diff_stats": {
      "files_changed": 2,
      "insertions": 150,
      "deletions": 20
    }
  }
}
```

### Response Format

```json
{
  "success": true,
  "response": {
    "type": "explanation",
    "content": "Your repository is in a clean state..."
  },
  "timestamp": "2026-02-16T10:30:00.000Z"
}
```

## Testing

```bash
# Test explain endpoint
curl -X POST $API_ENDPOINT \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "type": "explain",
    "context": {"branch": "main"},
    "query": "What is my current state?"
  }'
```

## Cost Estimates

| Model | Cost per 1K tokens | Typical Request |
|-------|-------------------|-----------------|
| Claude 3 Haiku | ~$0.00025 | ~$0.001 |
| Claude 3 Sonnet | ~$0.003 | ~$0.01 |
| Claude 3 Opus | ~$0.015 | ~$0.05 |

With the default quota of 10,000 requests/month, estimated monthly cost:
- Haiku: ~$10/month
- Sonnet: ~$100/month
- Opus: ~$500/month

## Troubleshooting

### "Access Denied" on Bedrock

Ensure your Lambda execution role has Bedrock permissions. The SAM template includes this, but you may need to wait for IAM propagation.

### "Model not found"

Verify you've enabled model access in the Bedrock console for your region.

### Cold Start Latency

First request may take 2-3 seconds due to Lambda cold start. Subsequent requests are faster (~500ms).

## Cleanup

To delete all AWS resources:

```bash
aws cloudformation delete-stack --stack-name zit-ai-mentor-dev
```
