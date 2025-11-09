# API Integration Documentation
## Claude Code Academy ↔ aitmpl.com

This document defines the API endpoints required for seamless integration between Claude Code Academy (learning platform) and aitmpl.com (components marketplace).

---

## Overview

**Flow:**
1. User browses components on **aitmpl.com**
2. User clicks "Save to Academy" button
3. Component is saved to user's account in **Academy**
4. User can organize saved components into Stacks in **Academy**
5. Academy tracks which components user has used/learned

---

## Authentication

All API calls between platforms use **JWT tokens** for authentication.

### Headers Required
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### User Session Sync
When user logs into Academy, generate a session token that can be used on aitmpl.com:

```
POST /api/auth/generate-cross-platform-token
```

**Request:**
```json
{
  "userId": "user-uuid",
  "platform": "academy"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2025-01-15T10:30:00Z",
  "platforms": ["academy", "aitmpl"]
}
```

---

## 1. Component Management

### 1.1 Save Component from aitmpl.com to Academy

When user clicks "Save to Academy" on aitmpl.com:

```
POST https://academy.aitmpl.com/api/components/save
```

**Request:**
```json
{
  "componentId": "comp-uuid",
  "userId": "user-uuid",
  "sourceUrl": "https://aitmpl.com/agents/docusaurus-expert",
  "metadata": {
    "name": "Docusaurus Expert",
    "type": "agent",
    "description": "Specialized agent for Docusaurus development",
    "author": "Claude Templates",
    "authorId": "author-uuid",
    "tags": ["docusaurus", "documentation", "react"],
    "downloads": 1250,
    "version": "1.2.0"
  }
}
```

**Response:**
```json
{
  "success": true,
  "savedComponentId": "saved-comp-uuid",
  "savedAt": "2025-01-08T14:30:00Z",
  "message": "Component saved successfully"
}
```

---

### 1.2 Get User's Saved Components

Fetch all components user has saved from aitmpl.com:

```
GET https://academy.aitmpl.com/api/users/{userId}/components
```

**Query Parameters:**
- `type` (optional): Filter by component type (agent, hook, mcp, etc.)
- `sortBy` (optional): `savedAt`, `downloads`, `name`
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "components": [
    {
      "id": "saved-comp-1",
      "componentId": "comp-uuid",
      "name": "Docusaurus Expert",
      "type": "agent",
      "description": "Specialized agent for Docusaurus development",
      "author": "Claude Templates",
      "downloads": 1250,
      "tags": ["docusaurus", "documentation", "react"],
      "savedAt": "2025-01-05T10:30:00Z",
      "sourceUrl": "https://aitmpl.com/agents/docusaurus-expert",
      "stacks": ["stack-1", "stack-3"]
    }
  ],
  "total": 45,
  "hasMore": false
}
```

---

### 1.3 Remove Component

```
DELETE https://academy.aitmpl.com/api/components/{componentId}
```

**Request:**
```json
{
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Component removed successfully"
}
```

---

## 2. Stack Management

### 2.1 Create Stack

```
POST https://academy.aitmpl.com/api/stacks
```

**Request:**
```json
{
  "userId": "user-uuid",
  "name": "Frontend Development Stack",
  "description": "Components for building React frontends with Claude Code",
  "visibility": "private"
}
```

**Response:**
```json
{
  "success": true,
  "stack": {
    "id": "stack-uuid",
    "name": "Frontend Development Stack",
    "description": "Components for building React frontends with Claude Code",
    "components": [],
    "visibility": "private",
    "createdAt": "2025-01-08T14:30:00Z",
    "updatedAt": "2025-01-08T14:30:00Z"
  }
}
```

---

### 2.2 Add Component to Stack

```
POST https://academy.aitmpl.com/api/stacks/{stackId}/components
```

**Request:**
```json
{
  "userId": "user-uuid",
  "componentId": "saved-comp-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "stack": {
    "id": "stack-uuid",
    "name": "Frontend Development Stack",
    "componentsCount": 5
  }
}
```

---

### 2.3 Get User's Stacks

```
GET https://academy.aitmpl.com/api/users/{userId}/stacks
```

**Query Parameters:**
- `includeComponents` (optional): `true` to include full component details

**Response:**
```json
{
  "stacks": [
    {
      "id": "stack-1",
      "name": "Frontend Development Stack",
      "description": "Components for building React frontends",
      "componentsCount": 5,
      "components": [...],
      "visibility": "private",
      "createdAt": "2025-01-05T10:30:00Z",
      "updatedAt": "2025-01-07T16:20:00Z"
    }
  ],
  "total": 3
}
```

---

### 2.4 Remove Component from Stack

```
DELETE https://academy.aitmpl.com/api/stacks/{stackId}/components/{componentId}
```

**Request:**
```json
{
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Component removed from stack"
}
```

---

### 2.5 Delete Stack

```
DELETE https://academy.aitmpl.com/api/stacks/{stackId}
```

**Request:**
```json
{
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Stack deleted successfully"
}
```

---

## 3. Course Progress Tracking

### 3.1 Update Course Progress

When user completes a lesson:

```
POST https://academy.aitmpl.com/api/courses/progress
```

**Request:**
```json
{
  "userId": "user-uuid",
  "courseId": "claude-code-fundamentals",
  "lessonId": "lesson-3",
  "status": "completed",
  "timeSpent": 450,
  "completedAt": "2025-01-08T15:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "progress": {
    "courseId": "claude-code-fundamentals",
    "lessonsCompleted": 5,
    "totalLessons": 12,
    "percentComplete": 42,
    "lastAccessedAt": "2025-01-08T15:30:00Z"
  }
}
```

---

### 3.2 Get User's Course Progress

```
GET https://academy.aitmpl.com/api/users/{userId}/progress
```

**Query Parameters:**
- `courseId` (optional): Get progress for specific course

**Response:**
```json
{
  "courses": [
    {
      "courseId": "claude-code-fundamentals",
      "courseName": "Claude Code: A Highly Agentic Coding Assistant",
      "lessonsCompleted": 5,
      "totalLessons": 12,
      "percentComplete": 42,
      "startedAt": "2025-01-05T09:00:00Z",
      "lastAccessedAt": "2025-01-08T15:30:00Z",
      "timeSpent": 2250,
      "status": "in_progress"
    }
  ],
  "stats": {
    "totalCoursesEnrolled": 4,
    "totalCoursesCompleted": 1,
    "totalTimeSpent": 8450,
    "currentStreak": 3
  }
}
```

---

### 3.3 Mark Lesson as Complete

```
POST https://academy.aitmpl.com/api/lessons/{lessonId}/complete
```

**Request:**
```json
{
  "userId": "user-uuid",
  "courseId": "claude-code-fundamentals",
  "timeSpent": 450
}
```

**Response:**
```json
{
  "success": true,
  "lesson": {
    "id": "lesson-3",
    "title": "Introduction to Subagents",
    "completedAt": "2025-01-08T15:30:00Z",
    "nextLesson": {
      "id": "lesson-4",
      "title": "Building Your First Subagent",
      "url": "/docs/subagents/first-subagent"
    }
  },
  "courseProgress": {
    "percentComplete": 42,
    "lessonsCompleted": 5
  }
}
```

---

## 4. Integration Webhook (aitmpl.com → Academy)

When user saves a component on aitmpl.com, send webhook to Academy:

```
POST https://academy.aitmpl.com/api/webhooks/component-saved
```

**Request:**
```json
{
  "event": "component.saved",
  "timestamp": "2025-01-08T14:30:00Z",
  "data": {
    "userId": "user-uuid",
    "componentId": "comp-uuid",
    "componentType": "agent",
    "componentName": "Docusaurus Expert",
    "sourceUrl": "https://aitmpl.com/agents/docusaurus-expert"
  }
}
```

**Response:**
```json
{
  "success": true,
  "received": true
}
```

---

## 5. User Sync Endpoints (aitmpl.com needs these)

### 5.1 Check if Component is Saved

Called by aitmpl.com to show "Saved ✓" badge:

```
GET https://academy.aitmpl.com/api/components/{componentId}/saved-status
```

**Query Parameters:**
- `userId`: User UUID

**Response:**
```json
{
  "isSaved": true,
  "savedAt": "2025-01-05T10:30:00Z",
  "stacks": ["stack-1", "stack-2"]
}
```

---

### 5.2 Get User's Component Usage Stats

Show stats on aitmpl.com profile:

```
GET https://academy.aitmpl.com/api/users/{userId}/stats
```

**Response:**
```json
{
  "componentsSaved": 45,
  "stacksCreated": 6,
  "coursesCompleted": 2,
  "lessonsCompleted": 28,
  "currentStreak": 5,
  "totalTimeSpent": 12450,
  "memberSince": "2025-01-01T00:00:00Z",
  "membershipTier": "free"
}
```

---

## 6. Error Responses

All endpoints follow this error format:

```json
{
  "success": false,
  "error": {
    "code": "COMPONENT_NOT_FOUND",
    "message": "Component with ID 'comp-123' not found",
    "details": {}
  }
}
```

### Common Error Codes:
- `UNAUTHORIZED` - Invalid or missing JWT token
- `FORBIDDEN` - User doesn't have permission
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## 7. Rate Limiting

All endpoints are rate-limited:
- **Authenticated requests**: 1000 requests/hour
- **Webhooks**: 100 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1704726000
```

---

## 8. Implementation Checklist

### Academy Side (this app):
- [ ] Implement POST `/api/components/save`
- [ ] Implement GET `/api/users/{userId}/components`
- [ ] Implement POST `/api/stacks`
- [ ] Implement GET `/api/users/{userId}/stacks`
- [ ] Implement POST `/api/courses/progress`
- [ ] Implement GET `/api/users/{userId}/progress`
- [ ] Implement webhook receiver `/api/webhooks/component-saved`
- [ ] Implement GET `/api/components/{componentId}/saved-status`
- [ ] Create Supabase tables: `saved_components`, `stacks`, `stack_components`, `course_progress`

### aitmpl.com Side:
- [ ] Add "Save to Academy" button on component pages
- [ ] Implement authentication token sync
- [ ] Send webhook when component is saved
- [ ] Show "Saved ✓" badge for saved components
- [ ] Add "View in Academy" link for saved components
- [ ] Display user stats from Academy on profile page

---

## 9. Database Schema (Supabase)

### Table: `saved_components`
```sql
CREATE TABLE saved_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  component_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  author VARCHAR(255),
  tags TEXT[],
  downloads INTEGER DEFAULT 0,
  source_url VARCHAR(500) NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(user_id, component_id)
);

CREATE INDEX idx_saved_components_user_id ON saved_components(user_id);
CREATE INDEX idx_saved_components_type ON saved_components(type);
```

### Table: `stacks`
```sql
CREATE TABLE stacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  visibility VARCHAR(20) DEFAULT 'private',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_stacks_user_id ON stacks(user_id);
```

### Table: `stack_components`
```sql
CREATE TABLE stack_components (
  stack_id UUID NOT NULL REFERENCES stacks(id) ON DELETE CASCADE,
  component_id UUID NOT NULL REFERENCES saved_components(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (stack_id, component_id)
);
```

### Table: `course_progress`
```sql
CREATE TABLE course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id VARCHAR(255) NOT NULL,
  lesson_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'in_progress',
  time_spent INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id, lesson_id)
);

CREATE INDEX idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX idx_course_progress_course_id ON course_progress(course_id);
```

---

## 10. Next Steps

1. Implement API endpoints on Academy side
2. Create Supabase database tables and RLS policies
3. Add "Save to Academy" button on aitmpl.com
4. Test end-to-end flow
5. Deploy to production
6. Set up `app.aitmpl.com` subdomain pointing to Academy

---

**Last Updated:** January 8, 2025
**Version:** 1.0.0
