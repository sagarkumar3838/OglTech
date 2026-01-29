# HTML5 Question Generation API

## Overview
You now have a dedicated API endpoint to generate questions for HTML5 features without storing them in the database. Questions are generated on-demand using AI.

## API Endpoint

### Generate HTML5 Feature Questions
**POST** `/api/questions/generate-html5`

#### Request Body
```json
{
  "features": ["Web Workers API", "WebSockets", "Canvas 2D Context"],
  "level": "BASIC",
  "questionsPerFeature": 2,
  "useAI": true
}
```

#### Parameters
- `features` (required): Array of HTML5 feature names
- `level` (optional): "BASIC", "INTERMEDIATE", or "ADVANCED" (default: "BASIC")
- `questionsPerFeature` (optional): Number of questions per feature (default: 2)
- `useAI` (optional): Use AI generation or fallback to database (default: true)

#### Response
```json
{
  "success": true,
  "data": {
    "level": "BASIC",
    "totalFeatures": 3,
    "totalQuestions": 6,
    "questionsByFeature": [
      {
        "feature": "Web Workers API",
        "questions": [
          {
            "type": "mcq",
            "question": "What is the primary purpose of Web Workers?",
     