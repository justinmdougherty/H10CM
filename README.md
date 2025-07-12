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

**Internal web application using React and TypeScript for production management and inventory tracking for a small team (~10 users). The application is styled using Material UI and communicates with a Node.js/Express API backed by an MSSQL database.**

*This project was bootstrapped from the "Modernize - React and Next.js Admin Dashboard" template (Vite + TypeScript version, starterkit).*

## 🚀 Quick Start

```bash
# Navigate to project directory
cd TF_CMapp

# Install dependencies
npm install

# Start development server
npm run dev
# Application available at http://localhost:5173

# Run tests
npm test
```

## ✅ Completed Features

*Last Updated: July 12, 2025*

### **🏗️ Foundation & Infrastructure** 
- ✅ **Project Setup & Architecture** - Modern React/TypeScript with Material UI, Vite build system
- ✅ **Comprehensive Smart Notifications System** - Dual-layer notification architecture
  - ✅ **Toast Notifications** - React Hot Toast integration for immediate feedback
  - ✅ **Smart Persistent Notifications** - Manufacturing-specific intelligent notifications with localStorage persistence
  - ✅ **Enhanced Header Component** - Real-time notification bell with unread counts and dropdown interface
  - ✅ **Manufacturing Categories** - Inventory, orders, production, quality, system, user, deadlines, approvals
  - ✅ **Actionable Notifications** - Click-to-navigate functionality with metadata and action buttons
  - ✅ **API Integration** - Full REST endpoints for notification management (ready for database migration)
  - ✅ **Workflow Integration** - Automatic notifications for order status changes, inventory alerts, production milestones
  - 📄 **Test Interface**: [`/notifications/test`](http://localhost:5173/notifications/test) - Complete testing dashboard
- ✅ **Enhanced Error Handling & Loading States** - Global ErrorBoundary, skeleton loaders, retry mechanisms
- ✅ **Health Dashboard & System Monitoring** - Comprehensive monitoring at `/system/health`
- ✅ **Testing Infrastructure** - Vitest + React Testing Library + Jest + Supertest setup

### **🔍 Search & Productivity**
- ✅ **Advanced Search & Filtering System** - Global search with debouncing, fuzzy matching, advanced filters
  - ✅ Recent search quality control (only captures complete words)
  - ✅ AND/OR logic filtering, saved presets, categorized results
  - 📄 **Documentation**: [`SEARCH_SYSTEM_README.md`](src/services/SEARCH_SYSTEM_README.md)

### **📊 Project Management**
- ✅ **Dual Dashboard Architecture**
  - ✅ **Production Dashboard** (`/dashboard`) - Technician-focused (Active/On Hold projects only)
  - ✅ **Project Management Dashboard** (`/project-management`) - Manager interface (full portfolio)
- ✅ **Project Status System** - 6-tier status system (Active, Planning, Completed, On Hold, Inactive, Archived)
- ✅ **Project & Step Management UI** - Complete 4-step project creation wizard (AddProjectModal)
- ✅ **Generic Batch Tracking System** - Configurable component supporting multiple project types
- ✅ **Calendar Integration** - Project timelines displayed on interactive calendar

### **📦 Inventory Management**
- ✅ **Comprehensive Inventory System** - Full CRUD operations with advanced features
- ✅ **Inventory Statistics Dashboard** - Real-time cards showing total value, low stock alerts, category counts
- ✅ **Shopping Cart System** - E-commerce-like cart for new items and reorders
  - ✅ Persistent cart state across sessions with Zustand store
  - ✅ Smart reorder suggestions based on current stock and reorder points
  - ✅ Bulk item management with quantity and cost adjustments
  - ✅ Integration with header cart icon and drawer interface
- ✅ **Manual Inventory Adjustments** - Add/remove stock with validation and audit trails
- ✅ **Bulk Inventory Adjustments** - Cart-based system for processing multiple adjustments at once
- ✅ **Pending Orders System** - Realistic order management workflow
  - ✅ Status tracking (Requested → Ordered → Shipped → Received)
  - ✅ User and date tracking for each status change with certificate service integration
  - ✅ Partial receipt handling with automatic order splitting
  - ✅ Duplicate order prevention with intelligent quantity combining
  - ✅ Reason tracking for partial receipts and delays
- ✅ **Part Replacement System** - End-of-life and quality replacement tracking
- ✅ **Transaction History & Audit Trail** - Complete tracking of all inventory movements
- ✅ **Real-time Stock Management** - Live updates with React Query integration

### **👤 User Experience**
- ✅ **Certificate Service Integration** - User authentication and identification
- ✅ **Dark/Light Mode Support** - Consistent theming across all components
- ✅ **Per-User Persistent Preferences** - Dark mode and layout choices saved individually by user
- ✅ **Responsive Design** - Optimized for desktop, tablet, and mobile
- ✅ **Role-based Navigation** - Separate interfaces for technicians vs managers

## 🎯 Current Priority

### **✅ COMPLETED: Smart Notifications System** 🎉 *[DONE - July 12, 2025]*
- ✅ **Comprehensive dual-layer notification architecture implemented**
  - ✅ Toast notifications for immediate feedback with React Hot Toast
  - ✅ Smart persistent notifications with manufacturing-specific intelligence
  - ✅ Enhanced header bell component with real-time counts and dropdown
  - ✅ Eight manufacturing categories (inventory, orders, production, quality, system, user, deadlines, approvals)
  - ✅ Actionable notifications with click-to-navigate and metadata
  - ✅ Complete API endpoints ready for database integration
  - ✅ Automatic workflow integration for order management and inventory
  - ✅ Comprehensive test interface at `/notifications/test`

### **Enhanced Inventory Dashboard** ⭐⭐ *[3-4 days]*
- ✅ Add inventory statistics cards (total value, low stock count, etc.)
- ✅ Implement cart system for new items and reorders
  - ✅ Shopping cart store with Zustand (persistent across sessions)
  - ✅ Cart icon with badge in header showing item count
  - ✅ Cart drawer with item management (add, remove, adjust quantities/costs)
  - ✅ "Add to Cart" functionality in AddInventoryModal
  - ✅ "Reorder" functionality in InventoryPage with intelligent quantity suggestions
  - ✅ Bulk submission preparation (UI ready, backend integration pending)
- ✅ Implement bulk operations (bulk adjustments, imports)
- [ ] Create advanced analytics views (consumption patterns, forecasting)


### **Phase 1: Analytics & Reporting** ⭐⭐⭐ *[2-3 weeks]*
- [ ] **Dashboard Analytics Implementation**
  - [ ] Project velocity tracking (average completion time per step)
  - [ ] Bottleneck identification with automated alerts
  - [ ] Team productivity metrics and comparisons
  - [ ] Resource utilization charts and capacity planning

- [ ] **Reporting Dashboard**
  - [ ] Executive production efficiency reports
  - [ ] Cost tracking per project with profitability analysis
  - [ ] Export capabilities (PDF, Excel, automated email reports)

### **Phase 2: Quality of Life Improvements** ⭐⭐ *[1-2 weeks]*
- [ ] **Keyboard Shortcuts & Power User Features**
  - [ ] Command palette (Ctrl+K) for quick actions
  - [ ] Tab navigation and quick actions

- [ ] **Bulk Data Import/Export**
  - [ ] XLSX inventory import functionality
  - [ ] Support for batch inventory creation from spreadsheets
  - [ ] Data validation and error reporting for imported files
  - [ ] Template download for proper XLSX format

- [ ] **Avery Label Printing System**
  - [ ] Modal in Batch Tracking app for label configuration
  - [ ] Avery sheet type selection (5160, 5161, 5162, etc.)
  - [ ] Customizable label content selection from batch attributes
  - [ ] Custom field addition for labels (manual text, dates, special instructions)
  - [ ] Label template editor with real-time preview
  - [ ] Print-ready PDF generation optimized for Avery sheets
  - [ ] Save/load label templates for reuse
  - [ ] Batch label printing for multiple items

- [ ] **Performance Optimizations**
  - [ ] Virtual scrolling for large lists
  - [ ] React.memo for expensive components

### **Phase 3: Advanced Features** ⭐⭐ *[2-4 weeks]*
- [ ] **Advanced Calendar Features**
  - [ ] Drag-and-drop project rescheduling
  - [ ] Resource allocation views

- [ ] **Predictive Analytics**
  - [ ] ML-powered completion predictions
  - [ ] Inventory reorder suggestions

## 🧪 Testing Strategy

### **Database Testing (tSQLt Framework)**

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

### **API Testing (Jest + Supertest)**

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

### **Frontend Testing (Vitest + React Testing Library)**

```typescript
// Example component test
import { render, screen } from '@testing-library/react'
import { ProjectCard } from './ProjectCard'

test('displays project information correctly', () => {
  render(<ProjectCard project={mockProject} />)
  expect(screen.getByText(mockProject.project_name)).toBeInTheDocument()
})
```

## 📊 Success Metrics & Targets

### **Technical Metrics**

- [ ] **Test Coverage**: >80% across frontend, backend, and database
- [ ] **Performance**: Dashboard load time <2 seconds
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **Error Rate**: <1% in production

### **User Experience Metrics**

- [ ] **Task Completion Time**: 40% reduction in common workflows
- [ ] **User Satisfaction**: >4.5/5 rating
- [ ] **Feature Adoption**: >70% of users using new features
- [ ] **Support Tickets**: 60% reduction in user issues

### **Business Metrics**

- [ ] **Production Efficiency**: 25% improvement in throughput
- [ ] **Inventory Accuracy**: >99% stock level accuracy
- [ ] **Project Predictability**: >90% on-time delivery
- [ ] **Resource Utilization**: 30% optimization improvement

## � Technical Architecture

*Detailed technical documentation for system components and architecture details.*

### **Project Setup**

1. **Navigate to the project directory:**

   ```bash
   cd TF_CMapp
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
         target: 'http://h10-websvr01.rdte.nswc.navy.mil:3000/',
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

### **Inventory Management System Architecture**

#### **Overview**
The inventory management system provides comprehensive tracking and control of all inventory items across projects, with features for manual adjustments, part replacements, and complete audit trails.

#### **Core Features Implemented**

**1. Inventory Dashboard**
- Comprehensive item display with real-time search & filtering
- Color-coded stock level indicators
- Project-based filtering capabilities
- Mobile-responsive design with React Query integration

**2. Manual Inventory Adjustments**
- **Add Stock (+)**: Quantity validation, PO tracking, real-time projections
- **Remove Stock (-)**: Mandatory reason codes, stock protection, audit trails
- **User Integration**: Certificate service integration for technician tracking

**3. Part Replacement System**
- Comprehensive replacement tracking (old → new part mapping)
- Replacement reason categorization (end-of-life, quality issues, obsolescence)
- Stock handling options (transfer vs. remove)
- Complete replacement history

**4. Transaction History & Audit Trail**
- Complete transaction logging with timestamps and user identification
- Searchable and filterable transaction history
- Before/after quantity tracking
- Reason codes and descriptions

#### **Technical Implementation**
- **Frontend**: React/TypeScript with Material UI components
- **State Management**: React Query for real-time synchronization
- **Backend Integration**: RESTful API endpoints with comprehensive validation
- **Security**: Input validation, user tracking, audit compliance

### **Health Dashboard & System Monitoring Architecture**

#### **Overview**
The Health Dashboard provides comprehensive system monitoring and health checking capabilities, offering real-time insights into system status, API health, and testing results.

#### **Key Features**
- **Real-time Health Monitoring**: Continuous API endpoint monitoring with 30-second intervals
- **System Metrics Display**: Uptime tracking, memory usage, active connections
- **Test Results Integration**: Frontend/backend test status with timing information
- **Advanced Debugging**: Browser information, performance metrics, environment details

#### **Technical Implementation**
- **Route**: Accessible at `/system/health`
- **Navigation**: Integrated into sidebar under "System" section
- **Components**: `HealthDashboard.tsx` with Material UI integration
- **Monitoring**: Automated health checks with manual refresh controls

### **Calendar Integration System Architecture**

#### **Overview**
The calendar integration system displays project timelines and milestones on an interactive calendar interface for visual project management.

#### **Key Features**
- **Project Timeline Display**: Start dates, target completion, estimated completion
- **Enhanced Calendar Component**: `BigCalendarWithProjects.tsx` with real-time data fetching
- **Color-Coded Events**: Different event types with distinct visual styling
- **Interactive Events**: Click events show project details and status

#### **Technical Implementation**
- **Route**: Accessible via `/apps/calendar`
- **Database Integration**: Timeline fields (`project_start_date`, `project_end_date`, `estimated_completion_date`)
- **Real-time Updates**: React Query integration for live data synchronization

### **Generic Batch Tracking System Architecture**

#### **Overview**
The batch tracking system is designed as a highly configurable, reusable component supporting multiple project types with different workflows, steps, and requirements.

#### **Key Components**
- **BatchTrackingComponent.tsx**: Main generic component with configuration-driven rendering
- **PROJECT_TYPE_CONFIGS**: Configuration object defining project type behaviors
- **Configuration Structure**: Steps, table columns, unit fields, serial number patterns

#### **Technical Implementation**
- **Props**: `projectId` and `projectType` determine configuration loading
- **Flexibility**: Easy addition of new project types through configuration
- **Integration**: Certificate service integration, React Query for data management
### **Application Structure Overview**

```
src/
├── hooks/
│   ├── api/
│   │   ├── useProjectHooks.ts      // Project-specific API hooks
│   │   └── useInventoryHooks.ts    // Inventory-specific API hooks
├── services/
│   └── api.ts                      // Central axios API configuration
├── store/
│   └── userStore.ts                // Zustand store for client-side state
├── types/
│   ├── Project.ts                  // Project type definitions
│   └── Inventory.ts                // Inventory type definitions
├── views/
│   └── dashboard/
│       └── ProjectsDashboardPage.tsx // Production dashboard
├── main.tsx                        // Application entry point
└── index.html                      // Main HTML file
```

### **Development Guidelines**

#### **Code Quality**
- All code must adhere to TypeScript strict mode
- Follow ESLint and Prettier configurations
- Implement comprehensive error handling
- Use React Query for all API interactions

#### **Testing Requirements**
- Maintain >80% test coverage across frontend, backend, and database
- Write unit tests for all new components and hooks
- Implement integration tests for critical user workflows
- Use Jest + Supertest for API testing, Vitest + React Testing Library for frontend

#### **Performance Standards**
- Dashboard load time <2 seconds
- Implement React.memo for expensive components
- Use virtual scrolling for large datasets
- Optimize API calls with debouncing and caching

---

*Last Updated: July 12, 2025*
*Current Priority: Enhanced Inventory Dashboard implementation*
*Recent Accomplishment: ✅ Complete Smart Notifications System (July 12, 2025)*
