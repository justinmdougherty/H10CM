# Production Management & Inventory Tracking App

Internal web application using React and TypeScript for production management and inventory tracking for a small team (~10 users). The application is styled using Material UI (MUI) and communicates with a Node.js/Express API backed by an MSSQL database.

This project was bootstrapped from the "Modernize - React and Next.js Admin Dashboard" template (Vite + TypeScript version, starterkit).

## Project Setup

1. **Navigate to the project directory:**

    ```bash
    cd path/to/your/TF_CMapp
    ```

2. **Install dependencies:**

    ```bash
    npm install

    ```

3. **Configure API Proxy:**
    - Ensure the `server.proxy` in `vite.config.ts` is correctly pointing to your backend API.
        **Example:**

        ```typescript
        // vite.config.ts
        server: {
          proxy: {
            '/api': {
              target: '[http://h10-websvr01.rdte.nswc.navy.mil:3000/](http://h10-websvr01.rdte.nswc.navy.mil:3000/)', // Or your local backend
              changeOrigin: true,
              secure: false,
            },
          },
        },
        ```

4. **Run the development server:**

    ```bash
    npm run dev    
    ```

    The application will typically be available at `http://localhost:5173`.

## Project Progress & TODO List

**Last Updated:** July 5, 2025

### ✅ Completed

- [x] **Initial Setup & Project Structure:**
  - [x] Bootstrapped from Modernize template (Vite + TypeScript).
  - [x] Established scalable structure for services, hooks (`react-query`), and state (`zustand`).
- [x] **Core UI & Navigation:**
  - [x] Replaced sample pages with "Projects Dashboard" and "Project Detail" views.
  - [x] Configured sidebar navigation (`MenuItems.ts`) and routing (`Router.tsx`).
  - [x] Implemented a "Government Blue" theme.
  - [x] Integrated user's certificate info into the sidebar profile.
- [x] **State Management & Data Fetching:**
  - [x] Set up `react-query` with a global `QueryClientProvider` in `main.tsx`.
  - [x] Set up `zustand` for client-side state management.
  - [x] Centralized API calls in `src/services/api.ts`.
  - [x] Created domain-specific hooks for projects and inventory (e.g., `useProjectHooks.ts`).
  - [x] Connected frontend components to the API hooks.
- [x] **Generic Batch Tracking System:**
  - [x] Refactored `PRBatchTrackingComponent` into a reusable `BatchTrackingComponent`.
  - [x] Developed a configuration-driven system to support multiple project types (PR, ASSEMBLY).
  - [x] Implemented a flexible table column system with tab-specific visibility and dynamic serial number handling.
  - [x] Enhanced UI with a unit detail modal, step progress tracking, and improved layout.
  - [x] Implemented attribute editing and saving within the unit detail modal.
  - [x] Added functionality to create new tracked items/units.
  - [x] Dynamically set the modal title based on the primary identifier of the unit.
  - [x] Connected the component to live database calls for all its functions.
- [x] **Backend API:**
  - [x] Fixed a critical bug where the API would crash when fetching tracked items for a project with no existing items.

### 🚧 In Progress

- [ ] **Styling & Theming:**
  - [ ] Continue iterating on light theme colors to improve contrast between `background.default` and `background.paper`.
- [ ] **App Integration (from Full Template):**
  - [ ] **Tickets App:** Resolve any remaining dependencies and verify full functionality.
  - [ ] **Notes App:** Integrate from the full template.
  - [ ] **Calendar App:** Integrate from the full template.
- [ ] **API Integration:**
  - [ ] Finalize backend integration for all CRUD operations (Projects, Inventory, Steps).

### 📝 To Do

- [ ] **Core Features - UI & Logic:**
  - [ ] **Project & Step Management UI:** Create interfaces for users to create/edit projects and their associated manufacturing steps.
  - [ ] **Inventory Page (Full Implementation):** Build out the UI for displaying and managing inventory items, including forms for adding and adjusting stock.
  - [ ] **Production Order Views:** Design and implement views for creating and managing production batches.
- [ ] **Inventory Management System:**
  - [ ] **Inventory Dashboard Page:** Create a new page to display all inventory items from the database, initially showing items across all projects.
  - [ ] **Inventory Data Fetching:** Implement `useInventory` hooks and corresponding API service calls.
  - [ ] **Filtering Logic:** Add controls to the Inventory Dashboard to filter items by project.
  - [ ] **Add/Edit Inventory UI:** Create modals or forms to add new inventory items and edit existing ones.
- [ ] **Dynamic Project Creation & Management:**
  - [ ] **Project Creation/Editing Page:** Design and build a form/page for creating and editing projects.
  - [ ] **Project Configuration Inputs:**
    - [ ] Add inputs for basic project details (name, type, etc.).
    - [ ] Implement a dynamic form section for defining custom table columns (attributes) with names and display order (e.g., using a repeating field with a '+' button).
    - [ ] Add an input for defining the serial number prefix/format.
    - [ ] Implement a dynamic form section for defining the project's production steps with names and order.
  - [ ] **Inventory Association UI:**
    - [ ] On the project page, implement a dynamic form section to list and associate required inventory items with the project.
    - [ ] Design an intuitive UI (e.g., drag-and-drop, dropdowns within each step) to link specific inventory items to each production step and specify the quantity consumed per unit.
  - [ ] **Backend Integration:** 
    - [ ] Create new API endpoints and update the database schema to store all dynamic project configurations (attributes, steps, inventory-step associations).
    - [ ] **Database Schema:** Add columns/tables to link inventory items to specific projects and to individual steps within those projects, including the quantity consumed.
- [ ] **TanStack Query Mutations:**
  - [x] Implement `useMutation` hooks for all create, update, and delete operations.
  - [x] Implement optimistic updates or query invalidation to ensure the UI stays in sync after mutations.
- [ ] **Calendar Integration:**
  - [ ] Display batch start and target completion dates on the Calendar app.
- [ ] **Configuration Management & DevOps:**
  - [ ] **Database Migrations:** Implement a tool or strategy for managing database schema changes.
  - [ ] **Environment Configuration:** Solidify the process for managing `.env` files for dev, test, and production.
  - [ ] **CI/CD:** Set up build and deployment automation pipelines.

### 💡 Future Enhancements & Bug Fixes

This section is for tracking new ideas, bugs, or improvements that come up during development.

- [x] **FIXED**:
    - [x] **S/N and Sorting**: `When new items are added, the item numbers are not based on that particular project, but all items added. MR had no items, I added 3 and rather than 1,2,3 it started at 5 and went to 7. also the items are not displayed in a lowest to highest sorting.`
    - [x] **S/N based on specific project**: `When adding new units, the starting s/n should be dynamic, and based on the project that is displayed. If the project has more than 1 item that has an S/N then is should offer a starting value for all items.`
    - [x] **Update steps completed**: `When the Step to update is applied, it does not update the batch tracking component or the information displayed in the modal.`
- [ ] **UI Polish:** Add loading spinners or skeletons to more areas for a smoother user experience.
- [ ] **Error Handling:** Display more user-friendly error messages (e.g., using snackbars/toasts) when API calls fail, instead of just logging to the console.
- [ ] **Final Touches:**
  - [ ] **Code Cleanup:** Remove unused variables, console logs, and commented-out code.
  - [ ] **Testing:** Implement unit and integration tests for critical components and hooks.
  - [ ] **Documentation:** Add JSDoc comments to complex functions and components.

## Generic Batch Tracking System Architecture

### Overview

The batch tracking system has been designed as a highly configurable, reusable component that can support multiple project types with different workflows, steps, and requirements.

### Key Components

#### 1. **BatchTrackingComponent.tsx**

The main generic component that renders the batch tracking interface based on configuration.
- **Props:**
  - `projectId: string` - The ID of the project
  - `projectType: string` - Determines which configuration to load

#### 2. **PROJECT_TYPE_CONFIGS**

A configuration object that defines how each project type should behave.

```typescript
const PROJECT_TYPE_CONFIGS: Record<string, ProjectTypeConfig> = {
  PR: { /* PR-specific configuration */ },
  ASSEMBLY: { /* Assembly-specific configuration */ },
  // Easy to add more project types
}
```

#### 3. **Configuration Structure**
Each project type configuration includes:
* **Steps**: Array of production steps with order and descriptions.
* **Table Columns**: Dynamic column definitions with tab-specific visibility.
* **Unit Fields**: Form fields for creating new units.
* **Serial Number Prefixes**: Automatic S/N generation patterns.


```
src/
├── hooks/
│   ├── api/
│   │   ├── useProjectHooks.ts      // Hooks specifically for projects
│   │   └── useInventoryHooks.ts    // Hooks specifically for inventory
├── services/
│   └── api.ts                      // Central place for all axios API calls
├── store/
│   └── userStore.ts                // Zustand store for client-side state
├── types/
│   ├── Project.ts
│   └── Inventory.ts
├── views/
│   └── dashboard/
│       └── ProjectsDashboardPage.tsx
├── main.tsx                        // Your application's entry point
└── index.html                      // The main HTML file
```
