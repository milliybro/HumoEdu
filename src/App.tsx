import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "./layouts/UserLayout/UserLayout";
import Experience from "./pages/user-page/experience/Experience";
import Skilss from "./pages/user-page/schedule/Skilss";
import Education from "./pages/user-page/group/Education";
import Portfolios from "./pages/user-page/students/Portfolios";
import Message from "./pages/user-page/messages/Message";
// import Settings from "./pages/user-page/settings/Settings";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import StudentAccount from "./pages/user-page/account/StudentAccount";
import DefaultLayout from "./layouts/defaultLayout/DefaultLayout";
import About from "./pages/default-page/about/About";
import Resume from "./pages/default-page/resume/Resume";
import Portfolio from "./pages/default-page/portfolio/Portfolio";
import Contact from "./pages/default-page/contact/Contact";
import NotFound from "./pages/user-page/NotFound";
import { useAuth } from "./states/auth";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import DashboardPage from "./pages/admin-page/dashboard/DashboardPage";
import EducationPage from "./pages/admin-page/education/EducationPage";
import AdminSkillsPage from "./pages/skills/AdminSkills";
import UsersPageAdmin from "./pages/admin-page/users/AdminUsers";
import PortfoliosPageAdmin from "./pages/admin-page/portfolios/AdminPortfolios";
import ExperiencePageAdmin from "./pages/admin-page/experience/AdminExperiencePage";
import HomePage from "./pages/user-page/home/HomePage";
import TeacherLayout from "./layouts/TeacherLayout/UserLayout";
import TeacherHomePage from "./pages/teacher-page/home/HomePage";
import TeacherExperience from "./pages/teacher-page/experience/Experience";
import TeacherSkilss from "./pages/teacher-page/schedule/Skilss";
import TeacherEducation from "./pages/teacher-page/group/Education";
import TeacherPortfolios from "./pages/teacher-page/students/Portfolios";
import TeacherAccount from "./pages/teacher-page/account/Account";
import TeacherAttendance from "./pages/teacher-page/attendance/Attendance";
import GetAttendanceStudents from "./pages/teacher-page/attendance/getAttendanceStudents";
import TeacherAttendanceGet from "./pages/teacher-page/attendance/TeacherAttendanceGet";
import AdminGroups from "./pages/admin-page/groups/AdminGroupsPage";
import AdminPayments from "./pages/admin-page/payments/AdminPaymentsPage";
import AdminStudents from "./pages/admin-page/students/AdminStudents";
import AdminSchedule from "./pages/admin-page/schedule/AdminSchedule";
import AdminProfile from './pages/branch-admin/profile/AdminProfile'
import BranchAdminLayout from "./layouts/branch-admin/AdminLayout";
import BranchDashboardPage from "./pages/branch-admin/dashboard/DashboardPage";
import RoomsPageAdmin from "./pages/branch-admin/experience/AdminExperiencePage";
import BranchGroups from "./pages/branch-admin/groups/AdminGroupsPage";
import BranchPayments from "./pages/branch-admin/payments/AdminPaymentsPage";
import BranchSchedule from "./pages/branch-admin/schedule/AdminSchedule";
import BranchStudents from "./pages/branch-admin/students/AdminStudents";
import UsersPageBranch from "./pages/branch-admin/users/AdminUsers";

import GroupStudentsList from "./pages/admin-page/groups/GroupStudentsList";
function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            isAuthenticated && role === "superadmin" ? (
              <AdminLayout />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          {" "}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/adminUsers" element={<UsersPageAdmin />} />
          <Route path="/adminEducation" element={<EducationPage />} />
          <Route path="/adminBranch" element={<PortfoliosPageAdmin />} />
          <Route
            path="/adminBranch/:branchId"
            element={<ExperiencePageAdmin />}
          />
          <Route path="/adminScience" element={<AdminSkillsPage />} />
          <Route path="/adminPayments" element={<AdminPayments />} />
          <Route path="/adminGroup" element={<AdminGroups />} />
          <Route path="/adminGroup/:scheduleId" element={<AdminSchedule />} />
          <Route path="/adminGroup/students/:groupId" element={<GroupStudentsList />} />
          <Route path="/adminStudents" element={<AdminStudents />} />
        </Route>

        <Route
          path="/"
          element={
            isAuthenticated && role === "admin" ? (
              <BranchAdminLayout />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          {" "}
          <Route path="/branchDashboard" element={<BranchDashboardPage />} />
          <Route path="/branchUsers" element={<UsersPageBranch />} />
          <Route path="/branchEducation" element={<EducationPage />} />
          <Route path="/branchRooms" element={<RoomsPageAdmin />} />
          <Route
            path="/adminBranch/:branchId"
            element={<ExperiencePageAdmin />}
          />
          <Route path="/adminScience" element={<AdminSkillsPage />} />
          <Route path="/branchPayments" element={<BranchPayments />} />
          <Route path="/branchGroup" element={<BranchGroups />} />
          <Route path="/branchGroup/:scheduleId" element={<BranchSchedule />} />
          <Route path="/branchStudents" element={<BranchStudents />} />
          <Route path="/adminprofile" element={<AdminProfile />} />
        </Route>

        <Route
          path="/"
          element={
            isAuthenticated && role === "student" ? (
              <UserLayout />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="/" element={<HomePage />} />

          <Route path="/home" element={<HomePage />} />
          {/* <Route path="/experience" element={<Experience />} /> */}
          <Route path="/skilss" element={<Skilss />} />
          <Route path="/my-group" element={<Education />} />
          <Route path="/my-group/:groupId" element={<Experience />} />
          <Route path="/payments" element={<Portfolios />} />
          <Route path="/messages" element={<Message />} />
          <Route path="/account" element={<StudentAccount />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Route>

        <Route
          path="/"
          element={
            isAuthenticated && role === "teacher" ? (
              <TeacherLayout />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="/teacher-home" element={<TeacherHomePage />} />
          <Route path="/teacher-experience" element={<TeacherExperience />} />
          <Route path="/teacher-schedule" element={<TeacherSkilss />} />
          <Route path="/my-groups" element={<TeacherEducation />} />
          <Route path="/my-groups/:groupId" element={<TeacherExperience />} />
          <Route path="/teacher-payments" element={<TeacherPortfolios />} />
          <Route path="/account" element={<TeacherAccount />} />
          <Route path="/teacher-attendance" element={<TeacherAttendance />} />
          <Route
            path="/teacher-attendance/:groupId"
            element={<TeacherAttendanceGet />}
          />
          <Route
            path="/teacher-attendance/:groupId/:lessonId"
            element={<GetAttendanceStudents />}
          />
        </Route>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="about" element={<About />} />
          <Route path="resume" element={<Resume />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
