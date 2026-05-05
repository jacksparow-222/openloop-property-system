# OpenLoop API Documentation

This document describes the tRPC API endpoints available in the OpenLoop Property System.

## Overview

All API calls are made through tRPC at `/api/trpc`. The API uses **type-safe** procedures with automatic validation and error handling.

### Base URL
```
/api/trpc
```

### Authentication

- **Public Procedures** — No authentication required
  - `leads.submit` — Submit a new lead
  - `properties.getByPropertyId` — Fetch property details

- **Protected Procedures** — Requires authenticated session
  - All property management endpoints
  - All lead management endpoints

---

## Properties API

### List Properties
**Procedure:** `properties.list`  
**Type:** Protected Query  
**Returns:** Array of properties

```typescript
const properties = await trpc.properties.list.useQuery();
```

**Response:**
```typescript
[
  {
    id: 1,
    propertyId: "abc123def456",
    name: "Penthouse Agdal",
    address: "Agdal, Marrakech",
    price: "500000",
    agentPhone: "+212612345678",
    createdAt: "2026-05-05T00:00:00Z",
    updatedAt: "2026-05-05T00:00:00Z"
  }
]
```

### Get Property by ID
**Procedure:** `properties.getByPropertyId`  
**Type:** Public Query  
**Input:**
```typescript
{
  propertyId: string
}
```

**Returns:** Single property object or null

```typescript
const property = await trpc.properties.getByPropertyId.useQuery({
  propertyId: "abc123def456"
});
```

### Create Property
**Procedure:** `properties.create`  
**Type:** Protected Mutation  
**Input:**
```typescript
{
  propertyId?: string,      // Auto-generated if not provided
  name: string,             // Required
  address?: string,
  price?: string,           // Stored as decimal
  agentPhone?: string
}
```

**Returns:** Created property object

```typescript
const property = await trpc.properties.create.useMutation({
  mutationFn: async (input) => {
    return await trpc.properties.create.mutate(input);
  }
});

await property.mutateAsync({
  name: "Villa Californie",
  address: "Californie, Casablanca",
  price: "750000",
  agentPhone: "+212612345678"
});
```

### Update Property
**Procedure:** `properties.update`  
**Type:** Protected Mutation  
**Input:**
```typescript
{
  id: number,               // Property database ID (required)
  name?: string,
  address?: string,
  price?: string,
  agentPhone?: string
}
```

**Returns:** Updated property object

```typescript
await trpc.properties.update.mutate({
  id: 1,
  name: "Updated Villa Name",
  price: "800000"
});
```

### Delete Property
**Procedure:** `properties.delete`  
**Type:** Protected Mutation  
**Input:**
```typescript
{
  id: number  // Property database ID
}
```

**Returns:** Confirmation object

```typescript
await trpc.properties.delete.mutate({ id: 1 });
```

---

## Leads API

### List Leads
**Procedure:** `leads.list`  
**Type:** Protected Query  
**Returns:** Array of all leads

```typescript
const leads = await trpc.leads.list.useQuery();
```

**Response:**
```typescript
[
  {
    id: 1,
    leadId: "xyz789abc123",
    propertyId: "abc123def456",
    visitorName: "John Doe",
    visitorPhone: "+212612345678",
    intent: "Buy Now",
    status: "New",
    smsSent: 1,
    sheetsSync: 1,
    createdAt: "2026-05-05T12:00:00Z",
    updatedAt: "2026-05-05T12:00:00Z"
  }
]
```

### Get Leads by Property
**Procedure:** `leads.getByPropertyId`  
**Type:** Protected Query  
**Input:**
```typescript
{
  propertyId: string
}
```

**Returns:** Array of leads for that property

```typescript
const leads = await trpc.leads.getByPropertyId.useQuery({
  propertyId: "abc123def456"
});
```

### Submit Lead (Public Form)
**Procedure:** `leads.submit`  
**Type:** Public Mutation  
**Input:**
```typescript
{
  propertyId: string,                           // Required
  visitorName: string,                          // Required
  visitorPhone: string,                         // Required
  intent: "Buy Now" | "This Week" | "Exploring" // Required
}
```

**Returns:** Confirmation with lead ID

```typescript
const result = await trpc.leads.submit.mutate({
  propertyId: "abc123def456",
  visitorName: "Jane Smith",
  visitorPhone: "+212612987654",
  intent: "This Week"
});

// Returns:
// {
//   leadId: "xyz789abc123",
//   success: true
// }
```

**Side Effects:**
- Creates lead record in database
- Sends SMS via Twilio (async)
- Syncs to Google Sheets (async)
- Sends owner notification (async)

### Update Lead Status
**Procedure:** `leads.updateStatus`  
**Type:** Protected Mutation  
**Input:**
```typescript
{
  id: number,                                    // Lead database ID
  status: "New" | "Engaged" | "Booked" | "Cold" // Required
}
```

**Returns:** Updated lead object

```typescript
await trpc.leads.updateStatus.mutate({
  id: 1,
  status: "Engaged"
});
```

### Update SMS Status
**Procedure:** `leads.updateSmsStatus`  
**Type:** Protected Mutation  
**Input:**
```typescript
{
  leadId: string,
  sent: boolean
}
```

**Returns:** Confirmation

```typescript
await trpc.leads.updateSmsStatus.mutate({
  leadId: "xyz789abc123",
  sent: true
});
```

### Update Sheets Sync Status
**Procedure:** `leads.updateSheetsSyncStatus`  
**Type:** Protected Mutation  
**Input:**
```typescript
{
  leadId: string,
  synced: boolean
}
```

**Returns:** Confirmation

```typescript
await trpc.leads.updateSheetsSyncStatus.mutate({
  leadId: "xyz789abc123",
  synced: true
});
```

---

## Authentication API

### Get Current User
**Procedure:** `auth.me`  
**Type:** Public Query  
**Returns:** Current user object or null

```typescript
const user = await trpc.auth.me.useQuery();

// Returns:
// {
//   id: 1,
//   openId: "user-123",
//   name: "Ismail El Harrak",
//   email: "ismail@example.com",
//   role: "admin",
//   createdAt: "2026-05-05T00:00:00Z",
//   updatedAt: "2026-05-05T00:00:00Z",
//   lastSignedIn: "2026-05-05T12:00:00Z"
// }
```

### Logout
**Procedure:** `auth.logout`  
**Type:** Public Mutation  
**Returns:** Confirmation

```typescript
await trpc.auth.logout.mutate();

// Returns:
// {
//   success: true
// }
```

---

## QR Code API (REST)

### Generate and Download QR Code
**Endpoint:** `POST /api/qr/download`  
**Type:** Public  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "url": "https://yoursite.com/form?id=abc123def456",
  "propertyName": "Penthouse Agdal"
}
```

**Response:** PNG image file

**Example:**
```javascript
const response = await fetch('/api/qr/download', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://yoursite.com/form?id=abc123def456',
    propertyName: 'Penthouse Agdal'
  })
});

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'QR-Penthouse-Agdal.png';
a.click();
```

### Generate QR Code as Data URL
**Endpoint:** `POST /api/qr/dataurl`  
**Type:** Public  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "url": "https://yoursite.com/form?id=abc123def456"
}
```

**Response:**
```json
{
  "dataUrl": "data:image/png;base64,iVBORw0KGgo..."
}
```

---

## Error Handling

All API calls return typed errors. Common error codes:

| Code | Meaning |
|------|---------|
| `PARSE_ERROR` | Invalid input format |
| `BAD_REQUEST` | Missing required fields |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `INTERNAL_SERVER_ERROR` | Server error |

**Example Error Response:**
```typescript
{
  code: "BAD_REQUEST",
  message: "Property not found"
}
```

---

## Rate Limiting

No rate limiting is currently enforced. For production deployments, consider implementing:
- Per-user request limits
- Per-IP request limits
- Exponential backoff for retries

---

## Webhook Integration

### Google Sheets Webhook
When a lead is submitted, an async call is made to:
```
POST {GOOGLE_SHEETS_WEBHOOK_URL}
```

**Payload:**
```json
{
  "leadId": "xyz789abc123",
  "propertyId": "abc123def456",
  "visitorName": "John Doe",
  "visitorPhone": "+212612345678",
  "intent": "Buy Now",
  "createdAt": "2026-05-05T12:00:00Z",
  "timestamp": "2026-05-05T12:00:00Z"
}
```

---

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

### Starting Production Server
```bash
pnpm start
```

---

## Support

For API questions or issues, refer to the tRPC documentation at https://trpc.io or contact support.
