🤖 Agent Instructions
Welcome to the project! To ensure your contributions are effective, accurate, and aligned with our development practices, please adhere to the following instructions for all tasks within this repository.

1. Core Tools & Methodologies
These are the foundational tools and processes to be used for all assignments.

Documentation Context (Context7): For all coding and documentation-related tasks, you are required to use the Context7 MCP server. This is non-negotiable and ensures that all code, libraries, and frameworks are based on the latest, most accurate documentation available, preventing the use of outdated or hallucinatory information.

Problem-Solving Approach (sequential-thinking): Apply a sequential thinking process to deconstruct complex problems. Before generating code, you must first outline the step-by-step plan you will follow. This ensures a logical, structured, and transparent approach to arriving at the solution.

2. Additional Context Servers
To enhance your capabilities, please leverage the following MCP servers where appropriate:

Dependency Management (dependency-management): When a task involves adding, removing, or updating project dependencies, you must use the dependency-management server. This server provides context on the project's current dependencies and preferred package manager (npm, pip, cargo, etc.), ensuring consistency and preventing version conflicts.

File System Interaction (file-system-interaction): For any tasks that require reading, writing, or modifying files within the repository, engage the file-system-interaction server. This provides you with the necessary context about the project's directory structure and ensures you have the correct permissions and pathing.

API Context (api-context): When working with external APIs, utilize the api-context server. It can provide you with up-to-date API specifications, endpoint details, and authentication requirements, which is crucial for successful integration.

3. General Instructions & Best Practices
Follow these guidelines to ensure the quality and consistency of your work.

Code Style and Linting: All code must adhere to the formatting rules defined in the .eslintrc, prettierrc, or other linting configuration files in this repository. Before finalizing your work, lint your code and fix any reported issues.

Testing: If the task involves adding or modifying functionality, you are required to write or update corresponding tests. Ensure all existing and new tests pass before concluding the task.

Commit Messages: Follow the Conventional Commits specification for all commit messages. This helps maintain a clear and understandable version history. (e.g., feat: add user authentication endpoint).

Idempotency: Strive to make your operations idempotent where possible. This means that an operation, if performed multiple times, should have the same effect as if it were performed only once. This is particularly important for scripts and infrastructure changes.

Security: Do not hardcode secrets or sensitive information (API keys, passwords, etc.) directly in the code. Use environment variables or a designated secrets management tool as configured for this project.

4. Workflow and Checkpoints
Iterative Development: Do not attempt to complete large tasks in a single response. Break down each assignment into smaller, logical sub-tasks (e.g., creating a new file, implementing a single function, adding a UI component).

Stop and Await Approval: After completing each sub-task, you must pause and explicitly state that you are awaiting my review and approval. Present the changes you have made, and do not proceed to the next sub-task until I give you the go-ahead. This ensures we stay aligned and no work is lost.

5. After completeing a task please update the documentation to reflect the accomplishment. Next look at the remaining TODO items list and suggest the enxt step.

Run all terminal commands with PowerShell

npx tsc --noEmit --skipLibCheck

# Production Management & Inventory Tracking App

Internal web application using React and TypeScript for production management and inventory tracking for a small team (~10 users). The application is styled using Material UI

### 🎯 Strategic Enhancement Roadmap

*Organized by Impact vs Implementation Effort*

#### **🚀 Immediate Next Steps (Priority Order)**

**Week 1-2: Foundation & Testing Infrastructure**
1. **Setup & Verify Testing Infrastructure** (1-2 days)
   ```bash
   # Frontend Testing Setup
   cd TF_CMapp
   npm install # Install testing dependencies
   npm run test # Run notification tests
   npm run test:coverage # Check coverage

   # Backend Testing Setup  
   cd ../api
   npm install # Install Jest and Supertest
   npm test # Run API tests
   ```

2. **Integrate Notifications & Error Handling** (1-2 days)
   - [ ] Install react-hot-toast: `npm install react-hot-toast`
   - [ ] Integrate notifications into existing dashboard mutations
   - [ ] Add skeleton loaders to ProjectsDashboardPage and ProjectManagementDashboard
   - [ ] Test error boundary with intentional errors
   - [ ] Verify notification system across all user actions

3. **Advanced Search & Filtering Implementation** ⭐⭐⭐ *[3-5 days]* ✅ **COMPLETED**
   - ✅ Create global search service with debouncing
   - ✅ Implement fuzzy search for projects and inventory  
   - ✅ Add advanced filter components with AND/OR logic
   - ✅ Create saved filter presets functionality
   - ✅ Add enhanced search bar to main header/navigation
   - ✅ Create search results page with categorized display
   - 📄 **Documentation**: [`SEARCH_SYSTEM_README.md`](src/services/SEARCH_SYSTEM_README.md)

**Week 3-4: Core Feature Completion**
4. **Project & Step Management UI** ⭐⭐⭐ *[5-7 days]*
   - [ ] Design and implement project creation wizard
   - [ ] Build step management interface for dynamic step creation
   - [ ] Create project template system
   - [ ] Add inventory-to-step association UI
   - [ ] Implement project configuration forms

5. **Enhanced Inventory Dashboard** ⭐⭐ *[3-4 days]*
   - [ ] Add inventory statistics cards (total value, low stock count, etc.)
   - [ ] Implement bulk operations (bulk adjustments, imports)
   - [ ] Create advanced analytics views (consumption patterns, forecasting)
   - [ ] Add data export capabilities (CSV, Excel)

**Week 5-6: Analytics & Reporting**
6. **Dashboard Analytics Implementation** ⭐⭐⭐ *[1-2 weeks]*
   - [ ] Implement project velocity tracking
   - [ ] Create bottleneck identification system
   - [ ] Add team productivity metrics
   - [ ] Build resource utilization charts
   - [ ] Develop capacity planning tools

7. **Reporting Dashboard** ⭐⭐⭐ *[1-2 weeks]*
   - [ ] Create executive production reports
   - [ ] Implement cost tracking per project
   - [ ] Build automated report generation
   - [ ] Add PDF/Excel export capabilities

### 🔧 Automated Testing Strategy

#### **Database Testing (tSQLt Framework)**
```sql
-- Example test structure
EXEC tSQLt.NewTestClass 'ProjectTests'
GO
CREATE PROCEDURE ProjectTests.[test that creating project updates project count]
AS
BEGIN
    -- Arrange: Setup test data
    -- Act: Execute stored procedure
    -- Assert: Verify results
END
```

#### **API Testing (Jest + Supertest)**
```javascript
// Example API test
describe('Projects API', () => {
  test('POST /api/projects creates project successfully', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send(validProjectData)
      .expect(201)
    
    expect(response.body).toHaveProperty('project_id')
  })
})
```

#### **Frontend Testing (Vitest + React Testing Library)**
```typescript
// Example component test
import { render, screen } from '@testing-library/react'
import { ProjectCard } from './ProjectCard'

test('displays project information correctly', () => {
  render(<ProjectCard project={mockProject} />)
  expect(screen.getByText(mockProject.project_name)).toBeInTheDocument()
})
```

#### **E2E Testing (Playwright - Future Phase)**
```typescript
// Example E2E test
test('complete project workflow', async ({ page }) => {
  await page.goto('/project-management')
  await page.click('[data-testid="create-project"]')
  await page.fill('[name="project_name"]', 'Test Project')
  await page.click('[data-testid="save-project"]')
  await expect(page.locator('.project-card')).toContainText('Test Project')
})
```

### 📊 Success Metrics & Targets

#### **Technical Metrics**
- [ ] **Test Coverage**: >80% across frontend, backend, and database
- [ ] **Performance**: Dashboard load time <2 seconds
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **Error Rate**: <1% in production

#### **User Experience Metrics**
- [ ] **Task Completion Time**: 40% reduction in common workflows
- [ ] **User Satisfaction**: >4.5/5 rating
- [ ] **Feature Adoption**: >70% of users using new features
- [ ] **Support Tickets**: 60% reduction in user issues

#### **Business Metrics**
- [ ] **Production Efficiency**: 25% improvement in throughput
- [ ] **Inventory Accuracy**: >99% stock level accuracy
- [ ] **Project Predictability**: >90% on-time delivery
- [ ] **Resource Utilization**: 30% optimization improvement

### 🚀 Getting Started with Implementation

#### **Immediate Actions (Today)**
1. **Install Dependencies**:
   ```bash
   cd TF_CMapp && npm install
   cd ../api && npm install
   ```

2. **Run Tests**:
   ```bash
   npm test # Both frontend and backend
   ```

3. **Verify Notifications**:
   - Create a test project to see success notification
   - Try an invalid action to see error notification
   - Check notification theming in dark/light mode

#### **This Week's Goals**
- [ ] Complete testing infrastructure setup
- [ ] Integrate notifications into all user actions
- [ ] Add skeleton loaders to main dashboards
- [ ] Begin advanced search implementation

#### **Next Week's Goals**
- [ ] Complete advanced search & filtering
- [ ] Start project management UI wizard
- [ ] Enhance inventory dashboard with statistics
- [ ] Plan analytics implementation

# Production Management & Inventory Tracking App

Internal web application using React and TypeScript for production management and inventory tracking for a small team (~10 users). The application is styled using Material UI### 🎯 Strategic Enhancement Roadmap

*Organized by Impact vs Implementation Effort*

#### **🚀 Immediate Next Steps (Priority Order)**

**Phase 1: Foundation & Stability (Week 1-2)** - ✅ **COMPLETED**
1. ✅ **Smart Notifications System** ⭐⭐⭐ *[2-3 days]* - **IMPLEMENTED**
   - [x] Toast notifications for step completions and status changes
   - [x] Real-time alerts for projects falling behind schedule
   - [x] Inventory low stock alerts with automatic notifications
   - [x] Success/error feedback for all user actions

2. ✅ **Enhanced Error Handling & Loading States** ⭐⭐⭐ *[2-4 days]* - **IMPLEMENTED**
   - [x] Global error boundary with user-friendly fallbacks
   - [x] Skeleton loaders for all dashboard components
   - [x] Retry mechanisms for failed API calls
   - [x] Offline capability indicators

3. ✅ **Health Dashboard & System Monitoring** ⭐⭐⭐ *[2-3 days]* - **IMPLEMENTED**
   - [x] Comprehensive health monitoring page with real-time API checks
   - [x] System metrics display and test results integration
   - [x] Navigation integration and professional UI
   - [x] Advanced debugging information and status indicators

**Phase 2: User Productivity (Week 3)** - 🎯 **CURRENT PRIORITY**
4. **Advanced Search & Filtering** ⭐⭐⭐ *[3-5 days]* - **NEXT TASK**
   - [ ] Global search bar across projects, inventory, and steps
   - [ ] Saved filter presets for common queries
   - [ ] Recent searches history and suggestions
   - [ ] Advanced filter combinations with AND/OR logic
   - [ ] **Why Next**: Massive productivity boost, system is stable enough to handle complex queries
   - [ ] **Dependencies**: Error handling system for search failures (✅ completed)

**Phase 3: Essential Business Logic (Week 4-5)**
4. **Project & Step Management UI** ⭐⭐⭐ *[1 week]*
   - [ ] Create interfaces for users to create/edit projects and manufacturing steps
   - [ ] Dynamic form sections for project configuration
   - [ ] Step-to-inventory association UI
   - [ ] **Why Fourth**: Core business requirement, users need this before advanced analytics
   - [ ] **Dependencies**: Search system for finding inventory items to associate

5. **Enhanced Inventory Dashboard** ⭐⭐⭐ *[3-4 days]*
   - [ ] Inventory statistics cards (total items, low stock alerts)
   - [ ] Bulk operations for inventory management
   - [ ] Export inventory data (CSV, Excel)
   - [ ] Print inventory reports
   - [ ] **Why Fifth**: Completes the inventory management suite
   - [ ] **Dependencies**: Notification system for bulk operation feedback

**Phase 4: Analytics & Intelligence (Week 6-8)**
6. **Enhanced Dashboard Analytics** ⭐⭐⭐ *[1-2 weeks]*
   - [ ] Project velocity tracking (average completion time per step)
   - [ ] Bottleneck identification with automated alerts
   - [ ] Team productivity metrics and comparisons
   - [ ] Resource utilization charts and capacity planning
   - [ ] **Why Sixth**: Data-driven insights, requires stable core system
   - [ ] **Dependencies**: Notification system for alerts, stable data collection

7. **Reporting Dashboard** ⭐⭐⭐ *[1-2 weeks]*
   - [ ] Executive production efficiency reports
   - [ ] Cost tracking per project with profitability analysis
   - [ ] Resource utilization and capacity planning reports
   - [ ] Export capabilities (PDF, Excel, automated email reports)
   - [ ] **Why Seventh**: Executive visibility, builds on analytics foundation
   - [ ] **Dependencies**: Analytics system, export functionality from inventory

#### **🎨 Quality of Life Improvements (Week 9-10)**

8. **Keyboard Shortcuts & Power User Features** ⭐⭐ *[3-5 days]*
   - [ ] Command palette (Ctrl+K) for quick actions
   - [ ] Tab navigation and quick actions
   - [ ] **Why Later**: Nice-to-have after core functionality is solid

9. **Performance Optimizations** ⭐⭐ *[3-5 days]*
   - [ ] Virtual scrolling for large lists
   - [ ] React.memo for expensive components
   - [ ] **Why Later**: Optimization after feature completeness

#### **🔧 Advanced Features (Week 11+)**

10. **Advanced Calendar Features** ⭐⭐ *[1 week]*
    - [ ] Drag-and-drop project rescheduling
    - [ ] Resource allocation views
    - [ ] **Why Later**: Enhancement to existing working calendar

11. **Predictive Analytics** ⭐⭐ *[2-3 weeks]*
    - [ ] ML-powered completion predictions
    - [ ] Inventory reorder suggestions
    - [ ] **Why Last**: Requires significant historical data and stable system

### 🧪 Automated Testing Strategy

#### **Database Testing**
```sql
-- SQL Unit Tests (using tSQLt framework)
- [ ] **Stored Procedure Tests** (1-2 days)
  - [ ] Test usp_GetProjectsByStatus with various status combinations
  - [ ] Test usp_UpdateTrackedItemStepProgress with edge cases
  - [ ] Test inventory adjustment procedures with validation scenarios
  - [ ] Test batch operations for deadlock prevention

- [ ] **Data Integrity Tests** (1 day)
  - [ ] Foreign key constraint validation
  - [ ] Business rule enforcement (negative stock prevention)
  - [ ] Trigger functionality verification
```

#### **API Testing**
```javascript
// Jest + Supertest for API Integration Tests
- [ ] **API Integration Tests** (2-3 days)
  - [ ] Test all CRUD operations for Projects, Inventory, Steps
  - [ ] Test authentication and authorization flows
  - [ ] Test error handling and validation responses
  - [ ] Test concurrent operations and deadlock scenarios
  - [ ] Performance testing for large datasets

// Example test structure:
describe('Project API', () => {
  test('should create project with valid data', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send(validProjectData)
      .expect(201);
    
    expect(response.body.project_name).toBe(validProjectData.project_name);
  });
});
```

#### **Frontend Testing**
```javascript
// React Testing Library + Jest for Component Tests
- [ ] **Component Unit Tests** (3-4 days)
  - [ ] Dashboard component rendering with various project states
  - [ ] Modal form validation and submission
  - [ ] BatchTrackingComponent with mock data
  - [ ] Search and filter functionality

- [ ] **Integration Tests** (2-3 days)
  - [ ] End-to-end user workflows (project creation to completion)
  - [ ] Cross-component data flow testing
  - [ ] React Query cache behavior validation

// Example test:
test('should display projects in Production Dashboard', async () => {
  render(<ProjectsDashboardPage />);
  
  await waitFor(() => {
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
  });
  
  expect(screen.getByText('PR-001')).toBeInTheDocument();
});
```

#### **E2E Testing (Playwright/Cypress)**
```javascript
- [ ] **End-to-End Tests** (3-5 days)
  - [ ] Complete user journeys (login → project creation → step completion → reporting)
  - [ ] Cross-browser compatibility testing
  - [ ] Mobile responsiveness validation
  - [ ] Performance benchmarking

// Example E2E test:
test('complete project workflow', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('[data-testid=create-project-btn]');
  await page.fill('[data-testid=project-name]', 'Test Project');
  await page.click('[data-testid=submit-btn]');
  
  await expect(page.locator('[data-testid=project-card]')).toContainText('Test Project');
});
```

#### **Automated Testing Implementation Plan**
```bash
# Phase 1: Basic Testing Infrastructure (Week 2-3)
1. Set up Jest + React Testing Library
2. Configure tSQLt for database testing
3. Set up Supertest for API testing
4. Create CI/CD pipeline with automated test runs

# Phase 2: Core Test Coverage (Week 4-6)
1. Write unit tests for critical components
2. Create API integration test suite
3. Implement database stored procedure tests
4. Set up test data management and cleanup

# Phase 3: Advanced Testing (Week 7-8)
1. E2E testing with Playwright
2. Performance testing and benchmarking
3. Load testing for concurrent users
4. Security testing for API endpoints
```

#### **Testing Tools & Setup**
```json
// package.json additions
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "jest": "^29.3.1",
    "supertest": "^6.3.3",
    "@playwright/test": "^1.28.1",
    "msw": "^0.49.2"
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:api": "jest --testPathPattern=__tests__/api"
  }
}
```

### **📋 Development Timeline Summary**

**Weeks 1-2**: Foundation (Notifications + Error Handling)
**Week 3**: User Productivity (Search & Filtering)  
**Weeks 4-5**: Core Business Logic (Project Management + Enhanced Inventory)
**Weeks 6-8**: Analytics & Intelligence (Dashboard Analytics + Reporting)
**Weeks 9-10**: Quality of Life (Keyboard Shortcuts + Performance)
**Week 11+**: Advanced Features (Calendar Enhancements + Predictive Analytics)

**Testing Integration**: Start basic testing in Week 2, expand coverage through Week 6

This timeline ensures each phase builds logically on the previous one, with testing integrated throughout to maintain quality and catch regressions early.

#### **🚀 High Impact, Low/Medium Effort (Quick Wins)**(MUI) and communicates with a Node.js/Express API backed by an MSSQL database.

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

**Last Updated:** July 9, 2025

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
- [x] **Inventory Management System:**
  - [x] **Inventory Dashboard Page:** Created comprehensive inventory page displaying all items with filtering and search capabilities.
  - [x] **Inventory Data Fetching:** Implemented `useInventory` hooks and corresponding API service calls.
  - [x] **Add/Edit Inventory UI:** Created modals for adding new inventory items and editing existing ones.
  - [x] **Manual Inventory Adjustments (Plus/Minus System):**
    - [x] **Addition (+) Button:** Implemented inventory addition with required fields:
      - [x] Quantity to add with validation
      - [x] Purchase Order (PO) number
      - [x] Technician auto-populated from certificate service
      - [x] Date of addition (auto-populated)
      - [x] Notes/comments
    - [x] **Subtraction (-) Button:** Implemented inventory removal with required fields:
      - [x] Quantity to remove with stock validation
      - [x] Reason for removal (mandatory dropdown: damaged parts, repair usage, testing, etc.)
      - [x] Description/justification for the removal
      - [x] Technician auto-populated from certificate service
      - [x] Date of removal (auto-populated)
    - [x] **Real-time Stock Projections:** Shows projected stock levels before confirming adjustments
    - [x] **Comprehensive Validation:** Prevents negative stock and ensures all required fields are filled
  - [x] **Part Replacement System:**
    - [x] **Replace Part Feature:** Implemented complete part replacement functionality
    - [x] **Replacement Scenarios:** Support for various replacement reasons:
      - [x] End-of-life replacement (part no longer manufactured)
      - [x] Quality issues (part deemed no longer good for process)
      - [x] Obsolescence (newer version available)
      - [x] Supplier changes
    - [x] **Stock Handling Options:**
      - [x] Keep existing stock (transfer to new part number)
      - [x] Remove existing stock (mark as obsolete/disposed)
    - [x] **Replacement Tracking:**
      - [x] Old part number → New part number mapping
      - [x] Reason for replacement (dropdown + comments)
      - [x] Date of replacement (auto-populated)
      - [x] Technician auto-populated from certificate service
      - [x] Quantity affected tracking
  - [x] **Transaction History & Audit Trail:**
    - [x] **Transaction History Modal:** View complete history of all inventory movements
    - [x] **Audit Trail:** Complete tracking of all manual adjustments separate from automated step-based consumption
    - [x] **User Tracking:** All inventory changes tracked with user information from certificate service
  - [x] **Enhanced UI Features:**
    - [x] Stock level indicators with color coding (red for low stock, green for adequate)
    - [x] Search and filtering capabilities across all inventory items
    - [x] Action buttons with icons for better UX
    - [x] Improved table layout with better spacing and responsive design
    - [x] Real-time updates using React Query for data synchronization
- [x] **Project Status System & Dashboard Redesign:**
  - [x] **Redesigned Project Status System:** Refactored to use six distinct status types:
    - [x] Active, Planning, Completed, On Hold, Inactive, Archived
    - [x] Hierarchical priority ordering for automatic sorting
    - [x] Enhanced status badges with icons and color coding
    - [x] Updated all project creation modals with new status defaults
  - [x] **Dual Dashboard Architecture:**
    - [x] **Production Dashboard** (`/dashboard`): Technician-focused interface showing only Active and On Hold projects
    - [x] **Project Management Dashboard** (`/project-management`): Manager interface with full portfolio view
  - [x] **Enhanced Project Management Features:**
    - [x] Smart project sorting by status priority in both dashboards
    - [x] Portfolio overview statistics cards (total, active, planning, completed)
    - [x] Project status management with dropdown menus
    - [x] Real-time status updates with success feedback
    - [x] **Step-Based Progress Tracking:** Production progress calculated based on percentage of manufacturing steps completed across all units
    - [x] **Batch-Oriented Metrics:** Progress indicators reflect actual batch production workflow where all units progress through steps together
    - [x] **Production Dashboard Enhancements:** Added step-based progress, project timeline dates, and "last time active" indicators to technician dashboard cards
  - [x] **Updated Navigation System:**
    - [x] Role-based sidebar navigation
    - [x] Separate routes for production and management dashboards
    - [x] Clean separation between technician and manager interfaces
  - [x] **UI/UX Improvements:**
    - [x] Dark mode compatibility for all new components
    - [x] Responsive design for various screen sizes
    - [x] Optimized for production environment use (touch-friendly, high contrast)
    - [x] Professional management interface with comprehensive controls

### 🚧 In Progress

- [x] **Smart Notifications System** ⭐⭐⭐ (2-3 days) - **IMPLEMENTED**
  - [x] Toast notification infrastructure with react-hot-toast
  - [x] Project-specific notification helpers (status updates, step completion, inventory alerts)
  - [x] Integrated with React Query mutations for automatic user feedback
  - [x] Themed notifications for dark/light mode compatibility
  - [x] Error, success, warning, info, and loading notification types

- [x] **Enhanced Error Handling & Loading States** ⭐⭐⭐ (2-4 days) - **IMPLEMENTED**
  - [x] Global ErrorBoundary component with user-friendly fallbacks
  - [x] Comprehensive skeleton loader components (ProjectCardSkeleton, DashboardSkeleton, TableSkeleton, CalendarSkeleton)
  - [x] LoadingOverlay component for existing content
  - [x] FormSkeleton for modals and forms

- [x] **Testing Infrastructure Setup** - **IMPLEMENTED**
  - [x] Frontend: Vitest + React Testing Library + Happy DOM configuration
  - [x] Backend: Jest + Supertest for API testing  
  - [x] Test utilities and custom render functions
  - [x] Mock setup for browser APIs and external dependencies
  - [x] Coverage reporting configuration

- [x] **Health Dashboard & System Monitoring** ⭐⭐⭐ (2-3 days) - **IMPLEMENTED**
  - [x] **Comprehensive Health Monitoring Page** (`/system/health`):
    - [x] Real-time API health checks with 30-second intervals
    - [x] System metrics display (uptime, memory usage, active connections)
    - [x] Test results integration showing frontend/backend test status
    - [x] Notification system status verification
    - [x] Advanced debugging information with browser and environment details
  - [x] **Navigation Integration**:
    - [x] Added to sidebar navigation under "System" section with heartbeat icon
    - [x] Integrated into routing system with lazy loading
    - [x] Accessible at `/system/health` route
  - [x] **Technical Features**:
    - [x] Interactive refresh controls for manual health checks
    - [x] Visual status indicators (success/warning/error chips)
    - [x] Expandable debugging section with performance metrics
    - [x] Real-time API endpoint monitoring (/api/health, /api/health/db)
    - [x] Integration with notification service for status updates

### 📝 To Do

- [ ] **Advanced Search & Filtering Implementation** ⭐⭐⭐ *[3-5 days]* - **NEXT PRIORITY**
  - [ ] Create global search service with debouncing
  - [ ] Add search bar to main header/navigation
  - [ ] Implement fuzzy search for projects and inventory
  - [ ] Add advanced filter components with AND/OR logic
  - [ ] Create saved filter presets functionality

- [ ] **Core Features - UI & Logic:**
  - [ ] **Project & Step Management UI:** Create interfaces for users to create/edit projects and their associated manufacturing steps.
  - [ ] **Production Order Views:** Design and implement views for creating and managing production batches.
- [ ] **Enhanced Inventory Page Improvements:**
  - [ ] **Enhanced Dashboard UI:**
    - [ ] Add inventory statistics cards (total items, low stock alerts, etc.)
    - [ ] Bulk operations for inventory management
    - [ ] Export inventory data (CSV, Excel)
    - [ ] Print inventory reports
  - [ ] **Inventory Delete Functionality:**
    - [ ] **Delete Modal:** Replace current alert with proper modal for inventory item deletion
    - [ ] **Mandatory Reason:** Require reason selection for item deletion (discontinued, damaged beyond repair, obsolete, etc.)
    - [ ] **User Tracking:** Track who deleted the item using certificate service
    - [ ] **Confirmation Process:** Two-step confirmation to prevent accidental deletions
    - [ ] **Audit Trail:** Log all deletions with reason, user, and timestamp
  - [ ] **Advanced Inventory Features:**
    - [ ] Barcode scanning integration
    - [ ] Batch processing for inventory updates
    - [ ] Automated reordering based on minimum stock levels
    - [ ] Advanced reporting and analytics
    - [ ] Integration with external systems (ERP, accounting)
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
- [x] **Calendar Integration:**
  - [x] Display project start and target completion dates on the Calendar app.
  - [x] Added project timeline fields (project_start_date, project_end_date, estimated_completion_date) to database.
  - [x] Created enhanced calendar component (BigCalendarWithProjects) that fetches and displays project timelines.
  - [x] Implemented color-coded project events on calendar with different types for milestones.
  - [x] Integrated project timeline calendar into the main app navigation.
  - [x] **Calendar UI Improvements:**
    - [x] Removed demo data and static events for cleaner project-focused view.
    - [x] Simplified event titles to show project names directly on calendar events.
    - [x] Fixed navigation buttons (Today, Back, Next, Week, Day, Agenda views).
    - [x] Removed project overview chips/labels for streamlined interface.
    - [x] Implemented proper calendar toolbar with working view controls.
    - [x] **Project Timeline Bars:** Created spanning timeline events from project start to completion dates.
    - [x] **Visual Styling:** Implemented distinct styling for completed vs estimated timelines.
    - [x] **Event Optimization:** Reduced event bar heights and improved spacing for better visibility.
    - [x] **Calendar Layout:** Added proper padding and spacing for professional appearance.
  - [x] **Backend Integration:** Updated stored procedures to include timeline fields in API responses.
  - [x] **Data Synchronization:** Fixed project date field serialization from database to frontend.
- [ ] **Configuration Management & DevOps:**
  - [ ] **Database Migrations:** Implement a tool or strategy for managing database schema changes.
  - [ ] **Environment Configuration:** Solidify the process for managing `.env` files for dev, test, and production.
  - [ ] **CI/CD:** Set up build and deployment automation pipelines.

## 📈 Recent Accomplishments

### ✅ Advanced Search Infrastructure (Sub-task 2) - December 2024
**Global Search Service Infrastructure - COMPLETED**

Implemented comprehensive search system foundation with:

#### **Core Infrastructure** 
- **Search Types** (`src/types/Search.ts`): Complete type definitions for SearchResult, SearchFilter, ActiveFilter, SearchPreset, SearchState
- **State Management** (`src/store/searchStore.ts`): Zustand store with persistence for search preferences and history
- **Search Service** (`src/services/searchService.ts`): Debounced search engine with fuzzy matching and multi-source querying
- **React Hooks** (`src/hooks/api/useGlobalSearch.ts`): Four specialized hooks for different search scenarios
- **Utilities** (`src/utils/searchUtils.ts`): Default filter configurations and search helper functions
- **Initializer** (`src/services/searchInitializer.ts`): System initialization and health checks

#### **Key Features Implemented**
- ⚡ **Debounced Search**: 300ms debouncing with subscription-based result delivery
- 🔍 **Fuzzy Matching**: Custom Levenshtein-based similarity scoring for intelligent text matching
- 🏷️ **Advanced Filtering**: Support for 8 filter types (text, select, date ranges, numbers, etc.)
- 💾 **Persistent State**: Search preferences and recent searches saved to localStorage
- 🎯 **Multi-source**: Unified search across projects, inventory, and navigation
- 📊 **Result Scoring**: Intelligent relevance ranking with metadata support

#### **Filter System**
- **Project Filters**: Status, type, creation date
- **Inventory Filters**: Stock levels, units of measure, low stock alerts  
- **General Filters**: Content type filtering with AND/OR logic support

#### **Performance & UX**
- Maximum 50 results with intelligent scoring
- Subscription-based updates for real-time results
- Memory-efficient with automatic cleanup
- URL serialization for shareable searches

**Next**: Sub-task 3 (Enhanced Global Search Bar Component) - UI implementation pending

---

### ✅ Enhanced Global Search Bar (Sub-task 3) - December 2024
**Enhanced Global Search Bar Component - COMPLETED**

Built complete UI layer for global search with modern UX patterns:

#### **UI Components Created**
- **Enhanced Search.tsx**: Complete overhaul of header search with global functionality
- **SearchResultItem.tsx**: Rich result preview cards with metadata and scoring
- **SearchResultsDropdown.tsx**: Categorized results with keyboard navigation
- **QuickFilters.tsx**: Active filter management with visual chips
- **SearchResultsPage.tsx**: Dedicated full-page search experience
- **SearchSystemDemo.tsx**: Test interface for development and debugging

#### **Key Features Implemented**
- 🎯 **Keyboard Navigation**: Full arrow key navigation and shortcuts (Ctrl+K, Esc, Enter)
- 🎨 **Rich Results Display**: Categorized results with icons, metadata, and relevance scores
- 🔧 **Quick Filters**: Visual filter chips with instant add/remove functionality
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile interfaces
- ⚡ **Real-time Updates**: Live search results with subscription-based updates
- 🎪 **Recent Searches**: Smart suggestions based on search history

#### **User Experience Enhancements**
- **Modal Search Interface**: Clean, focused search dialog with Material UI design
- **Visual Feedback**: Loading states, empty states, and error handling
- **Smart Categorization**: Results grouped by Projects, Inventory, Navigation
- **Result Previews**: Rich cards showing title, description, and metadata
- **Accessibility**: Full ARIA support and keyboard navigation

#### **Testing & Development**
- **Demo Page**: `/search/demo` - Interactive testing interface
- **Search Results Page**: `/search` - Full search experience
- **Error-free Implementation**: All TypeScript errors resolved
- **Router Integration**: Complete routing setup for search functionality

**Next**: Sub-task 4 (Advanced Filter Components) - Advanced filtering UI pending

---

### 🎯 Strategic Enhancement Roadmap

*Organized by Impact vs Implementation Effort*

#### **� High Impact, Low/Medium Effort (Quick Wins)**

- [ ] **Smart Notifications System** ⭐⭐⭐
  - [ ] Toast notifications for step completions and status changes
  - [ ] Real-time alerts for projects falling behind schedule
  - [ ] Inventory low stock alerts with automatic notifications
  - [ ] Success/error feedback for all user actions
  - [ ] **Impact**: Immediate user experience improvement, reduces manual checking
  - [ ] **Effort**: 2-3 days (integrate with existing React Query mutations)

- [ ] **Enhanced Error Handling & Loading States** ⭐⭐⭐
  - [ ] Global error boundary with user-friendly fallbacks
  - [ ] Skeleton loaders for all dashboard components
  - [ ] Retry mechanisms for failed API calls
  - [ ] Offline capability indicators
  - [ ] **Impact**: Production-ready robustness, professional UX
  - [ ] **Effort**: 2-4 days (component wrappers and error boundaries)

- [ ] **Advanced Search & Filtering** ⭐⭐⭐
  - [ ] Global search bar across projects, inventory, and steps
  - [ ] Saved filter presets for common queries
  - [ ] Recent searches history and suggestions
  - [ ] Advanced filter combinations with AND/OR logic
  - [ ] **Impact**: Massive productivity boost for users with large datasets
  - [ ] **Effort**: 3-5 days (search infrastructure and UI components)

#### **📊 High Impact, Medium/High Effort (Strategic Investments)**

- [ ] **Enhanced Dashboard Analytics** ⭐⭐⭐
  - [ ] Project velocity tracking (average completion time per step)
  - [ ] Bottleneck identification with automated alerts
  - [ ] Team productivity metrics and comparisons
  - [ ] Resource utilization charts and capacity planning
  - [ ] **Impact**: Data-driven decision making, process optimization
  - [ ] **Effort**: 1-2 weeks (analytics engine, chart components)

- [ ] **Reporting Dashboard** ⭐⭐⭐
  - [ ] Executive production efficiency reports
  - [ ] Cost tracking per project with profitability analysis
  - [ ] Resource utilization and capacity planning reports
  - [ ] Export capabilities (PDF, Excel, automated email reports)
  - [ ] **Impact**: Executive visibility, compliance, business insights
  - [ ] **Effort**: 1-2 weeks (reporting engine, chart library integration)

- [ ] **Predictive Analytics** ⭐⭐
  - [ ] Project completion date predictions based on current velocity
  - [ ] Inventory reorder suggestions with lead time optimization
  - [ ] Capacity planning recommendations for future projects
  - [ ] Bottleneck predictions with proactive alerts
  - [ ] **Impact**: Proactive management, reduced delays, optimized inventory
  - [ ] **Effort**: 2-3 weeks (ML algorithms, historical data analysis)

#### **🎨 Medium Impact, Low/Medium Effort (User Experience)**

- [ ] **Keyboard Shortcuts & Power User Features** ⭐⭐
  - [ ] Command palette (Ctrl+K) for quick actions
  - [ ] Tab navigation through all forms and interfaces
  - [ ] Quick actions (Ctrl+N for new project, Ctrl+S for save)
  - [ ] Escape key to close modals and cancel operations
  - [ ] **Impact**: Power user productivity, accessibility compliance
  - [ ] **Effort**: 3-5 days (hotkey library integration)

- [ ] **Advanced Calendar Features** ⭐⭐
  - [ ] Drag-and-drop to reschedule projects directly on calendar
  - [ ] Resource allocation view showing who's working on what
  - [ ] Critical path highlighting for project dependencies
  - [ ] Milestone tracking with automatic progress updates
  - [ ] **Impact**: Visual project management, intuitive scheduling
  - [ ] **Effort**: 1 week (calendar library extensions, drag-drop logic)

- [ ] **Performance Optimizations** ⭐⭐
  - [ ] Virtual scrolling for large project and inventory lists
  - [ ] React.memo for expensive components and calculations
  - [ ] Debounced search inputs to reduce API calls
  - [ ] Image lazy loading for project photos and documents
  - [ ] **Impact**: Faster load times, better scalability
  - [ ] **Effort**: 3-5 days (optimization analysis and implementation)

#### **🔧 Medium Impact, Medium/High Effort (Foundation Building)**

- [ ] **Comprehensive Audit Trail Enhancement** ⭐⭐
  - [ ] User action logs with detailed context
  - [ ] Data change history with before/after snapshots
  - [ ] System event logging for troubleshooting
  - [ ] Compliance reporting with automated audit trails
  - [ ] **Impact**: Compliance, security, troubleshooting capabilities
  - [ ] **Effort**: 1-2 weeks (audit infrastructure, storage optimization)

- [ ] **Backup & Recovery System** ⭐⭐
  - [ ] Automated daily backups with retention policies
  - [ ] Point-in-time recovery for critical data
  - [ ] Data export/import tools for migration
  - [ ] Configuration backup and restore capabilities
  - [ ] **Impact**: Data protection, business continuity
  - [ ] **Effort**: 1-2 weeks (backup infrastructure, recovery procedures)

#### **🔮 Future Vision (High Impact, High Effort)**

- [ ] **AI-Powered Insights** ⭐⭐⭐
  - [ ] Machine learning for project timeline predictions
  - [ ] Automated quality control suggestions based on historical data
  - [ ] Intelligent resource allocation recommendations
  - [ ] Natural language queries for complex data analysis
  - [ ] **Impact**: Next-generation productivity, competitive advantage
  - [ ] **Effort**: 1-3 months (AI/ML infrastructure, training data)

- [ ] **Mobile Application** ⭐⭐
  - [ ] React Native app for production floor use
  - [ ] Barcode scanning for inventory and step completion
  - [ ] Offline-first capability with sync when connected
  - [ ] Push notifications for critical updates
  - [ ] **Impact**: True mobility for production workers
  - [ ] **Effort**: 2-3 months (mobile development, offline architecture)

### 💡 Legacy Future Enhancements & Bug Fixes

This section tracks previously identified improvements and fixes.

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

## Inventory Management System Features

### Overview
The inventory management system provides comprehensive tracking and control of all inventory items across projects, with features for manual adjustments, part replacements, and complete audit trails.

### Core Features Implemented

#### 1. **Inventory Dashboard**
- **Comprehensive Item Display:** Shows all inventory items with key information (part number, description, current stock, minimum stock, location)
- **Search & Filtering:** Real-time search across all fields with project-based filtering
- **Stock Level Indicators:** Color-coded stock levels (red for low stock, green for adequate stock)
- **Responsive Design:** Optimized for desktop and mobile viewing
- **Real-time Updates:** Uses React Query for automatic data synchronization

#### 2. **Manual Inventory Adjustments**
- **Add Stock (+) Function:**
  - Quantity validation with positive number requirements
  - Purchase Order (PO) number tracking
  - Automatic technician population from certificate service
  - Auto-populated date/time stamps
  - Optional notes for additional context
  - Real-time stock projection before confirmation
  
- **Remove Stock (-) Function:**
  - Quantity validation to prevent negative stock
  - **Mandatory reason selection** from predefined categories:
    - Damaged parts
    - Repair usage
    - Testing consumption
    - Quality control
    - Other (with description)
  - Description field for additional justification
  - Automatic technician population from certificate service
  - Auto-populated date/time stamps
  - Real-time stock projection before confirmation

#### 3. **Part Replacement System**
- **Comprehensive Replacement Tracking:**
  - Old part number → New part number mapping
  - Replacement reason categorization:
    - End-of-life (no longer manufactured)
    - Quality issues (part deemed unsuitable)
    - Obsolescence (newer version available)
    - Supplier changes
  - Stock handling options:
    - Keep existing stock (transfer to new part)
    - Remove existing stock (mark as obsolete)
  - Complete replacement history and audit trail

#### 4. **Transaction History & Audit Trail**
- **Complete Transaction Tracking:**
  - All inventory movements logged with timestamps
  - User identification for every transaction
  - Reason codes and descriptions
  - Before/after stock quantities
  - Transaction type categorization (addition, removal, replacement)
  - Searchable and filterable transaction history

#### 5. **User Integration**
- **Certificate Service Integration:**
  - Automatic population of technician/user fields
  - Consistent user identification across all inventory operations
  - Integration with existing authentication system

### Technical Implementation

#### Frontend Components
- `InventoryPage.tsx` - Main inventory dashboard
- `InventoryAdjustmentModal.tsx` - Add/remove stock functionality  
- `PartReplacementModal.tsx` - Part replacement operations
- `TransactionHistoryModal.tsx` - Transaction history viewer
- `EditInventoryModal.tsx` - Edit inventory item details

#### Backend Integration
- RESTful API endpoints for all inventory operations
- Real-time data synchronization with React Query
- Comprehensive error handling and validation
- Transaction logging for audit requirements

#### Data Flow
1. **User Authentication** → Certificate service provides user details
2. **Inventory Operations** → Validation → Database updates → Audit logging
3. **Real-time Updates** → React Query invalidation → UI refresh
4. **Transaction History** → Comprehensive logging → Searchable audit trail

### Security & Validation
- **Input Validation:** All user inputs validated on frontend and backend
- **Stock Protection:** Prevents negative stock levels
- **Mandatory Fields:** Ensures reason codes for stock removal
- **User Tracking:** All operations tied to authenticated users
- **Audit Trail:** Complete transaction history for compliance

## Health Dashboard & System Monitoring

### Overview

The Health Dashboard provides comprehensive system monitoring and health checking capabilities for the production management application, offering real-time insights into system status, API health, and testing results.

### Key Features

#### 1. **Real-time Health Monitoring**
- **API Health Checks:** Continuous monitoring of critical API endpoints (`/api/health`, `/api/health/db`, `/api/projects`, `/api/inventory-items`)
- **Automated Refresh:** Health checks run automatically every 30 seconds
- **Manual Refresh:** On-demand health check triggering with loading states
- **Response Time Tracking:** Monitors API response times for performance insights
- **Status Indicators:** Visual chips showing healthy/warning/error states

#### 2. **System Metrics Display**
- **Uptime Tracking:** Shows system uptime with formatted display
- **Memory Usage:** Placeholder for server-side memory monitoring
- **Active Connections:** Displays current API connection count
- **Performance Metrics:** Browser-based performance and timing data

#### 3. **Test Results Integration**
- **Frontend Testing:** Shows status of Vitest + React Testing Library tests
- **Backend Testing:** Displays Jest + Supertest API test results
- **Mock Test Data:** Realistic test scenarios with timing and status information
- **Test Categories:** Organized by test type (unit, integration, API)

#### 4. **Notification System Status**
- **React Hot Toast Integration:** Confirms notification system is active
- **Error Boundary Status:** Verifies global error handling is operational
- **Testing Infrastructure:** Shows testing framework integration status
- **API Documentation:** Confirms health endpoint availability

#### 5. **Advanced Debugging Information**
- **Browser Information:** User agent, screen resolution, color depth
- **Performance Metrics:** Navigation timing, memory usage, connection type
- **Environment Details:** Current URL, timestamp, viewport information
- **Expandable Section:** Collapsible accordion for detailed debugging data

### Technical Implementation

#### Frontend Components
- `HealthDashboard.tsx` - Main health monitoring dashboard
- **Navigation Integration** - Added to sidebar under "System" section
- **Route Configuration** - Accessible at `/system/health`
- **Icon Integration** - Uses heartbeat icon (IconHeartbeat) from Tabler Icons

#### Health Check Logic
- **Endpoint Testing:** Automated testing of all critical API endpoints
- **Error Handling:** Graceful handling of connection failures and timeouts
- **Status Categorization:** Health checks categorized as healthy/warning/error
- **Real-time Updates:** Uses React state and intervals for live monitoring

#### UI/UX Features
- **Material UI Integration:** Consistent design with application theme
- **Responsive Layout:** Grid-based layout adapting to different screen sizes
- **Interactive Controls:** Refresh buttons with loading states and disabled states
- **Status Visualization:** Color-coded chips and icons for quick status identification
- **Professional Styling:** Clean, dashboard-style interface for system administrators

### Navigation & Access
- **Sidebar Navigation:** Added "System" section with "Health Dashboard" menu item
- **Route Protection:** Integrated into main application routing system
- **Lazy Loading:** Component loaded on-demand for optimal performance
- **Direct Access:** Available at `http://localhost:5173/system/health`

### Use Cases
- **System Administration:** Monitor overall application health and performance
- **Development & Testing:** Verify API endpoints and testing infrastructure
- **Troubleshooting:** Diagnose system issues with detailed debugging information
- **Performance Monitoring:** Track response times and system metrics
- **Production Monitoring:** Real-time oversight of critical system components

## Calendar Integration System

### Overview

The calendar integration system displays project timelines and milestones on an interactive calendar interface, providing visual project management capabilities.

### Key Features

#### 1. **Project Timeline Display**
- **Project Start Dates:** Visual representation of when projects begin
- **Target Completion Dates:** Shows expected project completion
- **Estimated Completion Dates:** Displays projected completion based on current progress
- **Color-Coded Events:** Different event types with distinct visual styling

#### 2. **Enhanced Calendar Component (BigCalendarWithProjects)**
- **Real-time Data Fetching:** Uses React Query to fetch live project data
- **Event Categorization:** Projects displayed as different event types:
  - **Project Start** (green): When a project begins
  - **Target Completion** (blue): Original planned completion date
  - **Estimated Completion** (orange): Current projected completion date
- **Interactive Events:** Click events show project details and status

#### 3. **Database Integration**
- **Timeline Fields:** Added `project_start_date`, `project_end_date`, `estimated_completion_date` to Projects table
- **Realistic Data Population:** Existing projects populated with meaningful timeline data
- **Automatic Updates:** Calendar reflects real-time changes to project timelines

### Frontend Components
- `BigCalendarWithProjects.tsx` - Enhanced calendar with project integration
- `BigCalendar.tsx` - Original calendar component (preserved)
- `EventData.ts` - Static event data for non-project events

### Backend Integration  
- Project timeline fields in database schema
- API endpoints fetch project data with timeline information
- Real-time updates through React Query

### Navigation
- Accessible via sidebar: **Apps > Calendar** (`/apps/calendar`)
- Integrated into main application navigation structure

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

# TF_CMapp Application Structure Breakdown

This document provides an overview of the `TF_CMapp` React frontend application's structure, highlighting key components and their dependencies.

## 1. Core Application Flow

The application's entry point and core setup are managed by the following files:

- **`src/main.tsx`**:
  - **Purpose**: The main entry point of the React application. It renders the root component (`App`).
  - **Key Responsibilities**:
    - Initializes React Query (`QueryClientProvider`) for global data fetching and caching.
    - Sets up `CustomizerContextProvider` for theme and layout customization.
    - Includes a `Suspense` fallback for lazy-loaded components, displaying a `Spinner`.
  - **Dependencies**: `App.tsx`, `views/spinner/Spinner.tsx`, `utils/i18n.ts`, `context/CustomizerContext.tsx`, `react-query`.

- **`src/App.tsx`**:
  - **Purpose**: The main application component that sets up the global theme and routing.
  - **Key Responsibilities**:
    - Applies the Material UI theme using `ThemeProvider`.
    - Manages Right-to-Left (RTL) direction with `RTL` component.
    - Integrates React Router for navigation using `RouterProvider`.
  - **Dependencies**: `context/CustomizerContext.tsx`, `theme/Theme.tsx`, `layouts/full/shared/customizer/RTL.tsx`, `routes/Router.tsx`, `@mui/material`.

- **`src/routes/Router.tsx`**:
  - **Purpose**: Defines the application's routing structure using `react-router-dom`.
  - **Key Responsibilities**:
    - Configures routes for different pages and layouts.
    - Uses `Loadable` for lazy loading components, improving initial load performance.
    - Defines main layouts (`FullLayout`, `BlankLayout`) and their nested routes.
  - **Key Routes**:
    - `/`: Redirects to `/dashboard`.
    - `/dashboard`: Renders `ProjectsDashboardPage` (Production Dashboard).
    - `/project-management`: Renders `ProjectManagementDashboard` (Manager Dashboard).
    - `/project/:projectId`: Renders `ProjectDetailPage` for specific project details.
    - `/inventory`: Renders `InventoryPage`.
    - `/apps/notes`: Renders `NotesPage`.
    - `/apps/calendar`: Renders `CalendarPage` (with integrated project timelines).
    - `/apps/tickets`: Renders `TicketsPage`.
    - `/auth/404`: Renders `Error` page for not found routes.
  - **Dependencies**: `layouts/full/FullLayout.tsx`, `layouts/blank/BlankLayout.tsx`, `layouts/full/shared/loadable/Loadable.tsx`, `views/dashboard/ProjectsDashboardPage.tsx`, `views/project-management/ProjectManagementDashboard.tsx`, `views/project-detail/ProjectDetailPage.tsx`, `views/authentication/Error.tsx`, `views/inventory/InventoryPage.tsx`, `views/apps/notes/Notes.tsx`, `views/apps/calendar/BigCalendarWithProjects.tsx`, `views/apps/tickets/Tickets.tsx`.

## 2. Key Pages/Views

- **`src/views/dashboard/ProjectsDashboardPage.tsx`**:
  - **Purpose**: Production-focused dashboard displaying actionable projects for technicians.
  - **Key Responsibilities**: Shows only Active and On Hold projects with simplified interface for production floor use.
  - **Dependencies**: Uses `hooks/api/useProjectHooks.ts` for data fetching with filtering logic.

- **`src/views/project-management/ProjectManagementDashboard.tsx`**:
  - **Purpose**: Comprehensive project management dashboard for supervisors and managers.
  - **Key Responsibilities**: 
    - Displays all projects regardless of status with smart priority-based sorting
    - Provides project creation, status management, and portfolio oversight capabilities
    - Shows detailed production statistics and portfolio analytics
  - **Dependencies**: Uses `hooks/api/useProjectHooks.ts` and `hooks/api/useTrackedItemHooks.ts` for comprehensive data management.

- **`src/views/project-detail/ProjectDetailPage.tsx`**:
  - **Purpose**: Displays detailed information for a single, selected project.
  - **Key Responsibilities**:
    - Fetches specific project data based on a `projectId` from URL parameters.
    - Acts as a container for other project-specific components, including `BatchTrackingComponent`.
  - **Dependencies**: Expected to use `hooks/api/useProjectHooks.ts` for data fetching, and renders `BatchTrackingComponent.tsx`.

- **`src/views/project-detail/BatchTrackingComponent.tsx`**:
  - **Purpose**: Manages and displays "tracked items" (batches) associated with a project.
  - **Key Responsibilities**:
    - Fetches batch data using React Query (`useQuery`).
    - Manages local state for selected units, step updates, and modal visibility.
    - Provides UI for updating step statuses and marking units as shipped using React Query mutations (`useMutation`).
    - Handles adding new units to a batch.
    - Displays unit details in a modal.
    - Integrates with `certificateService` to get current user information.
  - **Dependencies**: `react`, `react-query`, `axios`, `@mui/material` (extensive use of Material UI components like `Table`, `Dialog`, `Button`, `Select`, `TextField`, etc.), `@tabler/icons-react`, `services/certificateService.ts`, `types/Project.ts`.

- **`src/views/inventory/InventoryPage.tsx`**:
  - **Purpose**: Manages and displays inventory items.
  - **Key Responsibilities**: Expected to fetch and display inventory data.
  - **Dependencies**: Expected to use `hooks/api/useInventoryHooks.ts` for data fetching.

## 3. Data Fetching and Services

- **`src/hooks/api/useProjectHooks.ts` (Planned)**:
  - **Purpose**: To encapsulate API calls related to projects using React Query custom hooks.
  - **Key Responsibilities**: Provide hooks like `useProjects` (for fetching all projects) and `useProjectDetails` (for fetching a single project).
  - **Dependencies**: `axios`, `react-query`, `services/api.ts`, `types/Project.ts`.

- **`src/hooks/api/useInventoryHooks.ts` (Planned)**:
  - **Purpose**: To encapsulate API calls related to inventory using React Query custom hooks.
  - **Key Responsibilities**: Provide hooks for fetching inventory items and adjusting stock.
  - **Dependencies**: `axios`, `react-query`, `services/api.ts`, `types/Inventory.ts`.

- **`src/services/api.ts`**:
  - **Purpose**: Centralized Axios instance for making API requests to the backend.
  - **Key Responsibilities**: Configures the base URL for API calls.
  - **Dependencies**: `axios`.

- **`src/services/certificateService.ts`**:
  - **Purpose**: Handles fetching current user information, likely for authentication or display purposes.
  - **Key Responsibilities**: Provides a `getCurrentUser` function.
  - **Dependencies**: `axios`.

## 4. Type Definitions

- **`src/types/Project.ts`**:
  - **Purpose**: Defines TypeScript interfaces for project-related data structures.
  - **Key Responsibilities**: Ensures type safety and consistency across the application when dealing with project objects.

- **`src/types/Inventory.ts`**:
  - **Purpose**: Defines TypeScript interfaces for inventory-related data structures.
  - **Key Responsibilities**: Ensures type safety and consistency for inventory items.

## 5. Styling and Theming

- **`src/theme/Theme.tsx`**:
  - **Purpose**: Defines the Material UI theme for the application.
  - **Key Responsibilities**: Configures colors, typography, components, and shadows.
  - **Dependencies**: `@mui/material`, `DarkThemeColors.tsx`, `DefaultColors.tsx`, `LightThemeColors.tsx`, `Shadows.tsx`, `ThemeColors.tsx`, `Typography.tsx`, `Components.tsx`.

## 6. State Management

- **Zustand**: While not explicitly detailed in the current file analysis, the `GEMINI.md` indicates Zustand is used for global state management (e.g., user authentication, notifications). This would typically involve a store definition in `src/store/` (e.g., `src/store/userStore.ts`).

## 7. Utilities

- **`src/utils/i18n.ts`**:
  - **Purpose**: Configures internationalization (i18n) for the application.
  - **Dependencies**: `i18next`, `react-i18next`.

## 8. Component Hierarchy (High-Level)

```
main.tsx
└── App.tsx
    ├── CustomizerContext.tsx
    ├── theme/Theme.tsx
    ├── layouts/full/shared/customizer/RTL.tsx
    └── routes/Router.tsx
        ├── layouts/full/FullLayout.tsx
        │   └── (various shared components like Header, Sidebar, Breadcrumb)
        │       ├── views/dashboard/ProjectsDashboardPage.tsx
        │       ├── views/project-detail/ProjectDetailPage.tsx
        │       │   └── views/project-detail/BatchTrackingComponent.tsx
        │       │       ├── services/certificateService.ts
        │       │       └── types/Project.ts
        │       ├── views/inventory/InventoryPage.tsx
        │       └── (other app views like Notes, Calendar, Tickets)
        └── layouts/blank/BlankLayout.tsx
            └── views/authentication/Error.tsx
```

## Project Status System & Dashboard Architecture

### Project Status Overview

The application features a redesigned project status system with dedicated dashboards for different user roles. The system separates concerns between production technicians (who need to focus on actionable work) and project managers (who need comprehensive portfolio oversight).

### Project Status Types

The system uses six distinct project statuses with clear hierarchical priorities:

1. **Active** - Production is currently ongoing (highest priority)
2. **Planning** - Project is being planned and prepared
3. **Completed** - All production has been completed successfully
4. **On Hold** - Production temporarily paused (requires attention)
5. **Inactive** - No current production planned
6. **Archived** - Project has been archived (lowest priority)

### Dashboard Architecture

#### 1. **Production Dashboard** (`/dashboard`)

**Target Users**: Production technicians and operators

**Purpose**: Focus on actionable work and current production status

**Features**:

- Shows only Active and On Hold projects (filtered for relevance)
- Clean, simplified interface optimized for production floor use
- Quick access to project details and batch tracking
- Removes management controls (project creation, status changes)
- Direct links to Project Management Dashboard for supervisors

#### 2. **Project Management Dashboard** (`/project-management`)

**Target Users**: Project managers, supervisors, and administrators

**Purpose**: Comprehensive project portfolio management and oversight

**Features**:

- Shows ALL projects regardless of status
- Advanced project management controls:
  - Create new projects
  - Change project statuses (with dropdown menu)
  - Comprehensive portfolio statistics
- **Smart Sorting**: Projects automatically sorted by status priority (Active → Planning → Completed → On Hold → Inactive → Archived)
- **Portfolio Overview Cards**:
  - Total projects count
  - Active projects count
  - Planning projects count  
  - Completed projects count
- Production statistics for each project (progress tracking, unit completion)
- Full project lifecycle management

### Status Management System

#### Status Configuration

Each status includes:

- **Color coding** for visual identification (success, info, warning, etc.)
- **Icons** for quick visual recognition
- **Descriptions** explaining the status meaning
- **Priority ordering** for automatic sorting

#### Status Change Workflow

- **Dropdown Menu**: Accessible via three-dot menu on project cards
- **Real-time Updates**: Changes immediately reflected across all dashboards
- **Success Feedback**: Visual confirmation when status changes are applied
- **User Permissions**: Status changes available only in management dashboard

### Navigation & Routing

#### Sidebar Navigation

- **Production Dashboard**: Primary link for technicians (`/dashboard`)
- **Project Management**: Management link for supervisors (`/project-management`)
- Clear role-based navigation structure

#### Route Structure

```typescript
Routes:
  /dashboard - Production Dashboard (ProjectsDashboardPage)
  /project-management - Project Management Dashboard (ProjectManagementDashboard)
  /project/:projectId - Project Detail Page (unchanged)
  /inventory - Inventory Management (unchanged)
```

### Technical Implementation Details

#### Components

- **`ProjectsDashboardPage.tsx`** - Production-focused dashboard with filtered view
- **`ProjectManagementDashboard.tsx`** - Management dashboard with full portfolio view
- **`AddProjectModal.tsx`** - Project creation modal (management dashboard only)
- **Status management** integrated into project cards with dropdown menus

#### Data Flow Implementation

1. **Projects Fetched** → `useGetProjects()` hook
2. **Smart Filtering** → Production dashboard shows Active/On Hold only
3. **Intelligent Sorting** → Projects sorted by status priority in both dashboards
4. **Real-time Updates** → React Query ensures data synchronization
5. **Status Changes** → `useUpdateProject()` mutation with immediate UI feedback

#### Status Type System

```typescript
type ProjectStatus = 'Active' | 'Inactive' | 'Planning' | 'Completed' | 'Archived' | 'On Hold';

const statusPriority: Record<ProjectStatus, number> = {
  Active: 1,
  Planning: 2, 
  Completed: 3,
  'On Hold': 4,
  Inactive: 5,
  Archived: 6,
};
```

### UI/UX Design Principles

#### Production Dashboard

- **Minimalist Design**: Reduces visual clutter for production environment
- **High Contrast**: Optimized for various lighting conditions
- **Touch-Friendly**: Large buttons and cards for tablet/touch screen use
- **Dark Mode Compatible**: Consistent theming across light/dark modes

#### Management Dashboard

- **Information Dense**: Comprehensive overview for decision-making
- **Visual Hierarchy**: Clear status indicators and progress tracking
- **Professional Layout**: Cards with detailed statistics and management controls
- **Responsive Design**: Adapts to different screen sizes and orientations

### Future Enhancement Opportunities

- **Auto-status Suggestions**: Automatically suggest status changes based on production activity
- **Status Change Audit Trail**: Track who changed statuses and when
- **Role-based Permissions**: Fine-grained control over who can change project statuses
- **Status-based Notifications**: Alert users when projects need attention
- **Advanced Filtering**: Additional filters for managers (by date, team, etc.)
