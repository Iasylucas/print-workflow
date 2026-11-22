# Task Summary: New Order Status & Commercial Workflow

## Problem
Need to add a new order status for visual files waiting, plus a quick link insertion UI for commercials, plus delivery person interface.

## New Status to Add
- `waiting_for_visual` (or French: `en_attente_visuel`)
- Position: First status when commercial creates an order
- Meaning: Client may or may not have provided visual files
  - If yes: Commercial saves file + sends Google Drive link
  - If file is heavy: Save to hard drive first, then Google Drive (takes time)
  - Toggle in POS: "Still waiting for visual" to add later

## Required Changes

### 1. Update Order Status Enum
Add `"waiting_for_visual"` to all status enums:
- `backend/src/features/orders/orders.schema.ts` - updateOrderStatusSchema, addOrderStatusSchema, ordersQuerySchema, updateOrderSchema
- `frontend/src/features/orders/types/orders.types.ts` - OrderStatus type
- `frontend/src/features/orders/schema/orders.schema.ts` - ORDER_STATUSES, ORDER_STATUS_LABELS

### 2. Update Order Constants
- `backend/src/features/orders/orders.constants.ts` - Add `waiting_for_visual` to ORDER_STATUS_PIPELINE, update IN_PROGRESS_STATUSES/IN_PRODUCTION_STATUSES if needed

### 3. Add Order Labels (French)
- `frontend/src/features/orders/schema/orders.schema.ts` - Add `waiting_for_visual: "En attente visuel"` to ORDER_STATUS_LABELS

### 4. Commercial Quick Link Insertion
- Create modal/space in POS with:
  - List of orders in `waiting_for_visual` status
  - Quick input field for Google Drive link
  - Button to update status to `waiting_for_file` after link insertion
- Avoid navigating pages/filters one by one

### 5. Status Transition Logic
- When link is inserted → status changes directly to `waiting_for_file`
- Toggle in POS to mark "still waiting for visual" to add link later

### 6. Delivery Person Interface
- Implement interface for livreur (delivery person)
- This completes the task

## Files to Modify (6 files total)
1. `backend/src/features/orders/orders.schema.ts`
2. `frontend/src/features/orders/types/orders.types.ts`
3. `frontend/src/features/orders/schema/orders.schema.ts`
4. `backend/src/features/orders/orders.constants.ts`
5. [POS modal/space component - to create]
6. [Delivery person interface - to implement]

## Priority
- High: Add new status enum + constants
- High: Commercial quick link insertion UI
- Medium: Delivery person interface