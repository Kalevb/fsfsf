// กำหนดเส้นทาง (Routes) ทั้งหมดของระบบให้ตรงตาม Sitemap, User Flow และหัวข้อ 4
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// หน้า Public
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// หน้าสำหรับผู้เสียหาย (role = victim)
import VictimDashboardPage from '../pages/VictimDashboardPage';
import SubmitCasePage from '../pages/SubmitCasePage';
import TrackStatusPage from '../pages/TrackStatusPage';
import VictimProfilePage from '../pages/VictimProfilePage';

// หน้าสำหรับเจ้าหน้าที่และแอดมิน (role = officer, admin)
import OfficerDashboardPage from '../pages/OfficerDashboardPage';
import VictimsListPage from '../pages/VictimsListPage';
import DuplicateDetectionPage from '../pages/DuplicateDetectionPage';
import ReportsPage from '../pages/ReportsPage';
import OfficerSettingsPage from '../pages/OfficerSettingsPage';
import UserManagementPage from '../pages/UserManagementPage';

// หน้าใช้ร่วมกันตามสิทธิ์ (Case Detail, Evidence Detail, Case Timeline)
import CaseDetailPage from '../pages/CaseDetailPage';
import EvidenceDetailPage from '../pages/EvidenceDetailPage';
import CaseTimelinePage from '../pages/CaseTimelinePage';

// หน้า 403 และ 404
import ForbiddenPage from '../pages/ForbiddenPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1-3. Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 4-7. Victim Routes */}
      <Route
        path="/victim/dashboard"
        element={
          <ProtectedRoute allowedRoles={['victim', 'admin']}>
            <VictimDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/victim/submit-case"
        element={
          <ProtectedRoute allowedRoles={['victim', 'admin']}>
            <SubmitCasePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/victim/track-status"
        element={
          <ProtectedRoute allowedRoles={['victim', 'admin']}>
            <TrackStatusPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/victim/cases/:caseId/track"
        element={
          <ProtectedRoute allowedRoles={['victim', 'admin']}>
            <TrackStatusPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/victim/profile"
        element={
          <ProtectedRoute allowedRoles={['victim', 'admin']}>
            <VictimProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['victim', 'officer', 'admin']}>
            <VictimProfilePage />
          </ProtectedRoute>
        }
      />

      {/* 8-13. Officer & Admin Routes */}
      <Route
        path="/officer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['officer', 'admin']}>
            <OfficerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/victims"
        element={
          <ProtectedRoute allowedRoles={['officer', 'admin']}>
            <VictimsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/duplicates"
        element={
          <ProtectedRoute allowedRoles={['officer', 'admin']}>
            <DuplicateDetectionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/duplicate-detection"
        element={<Navigate to="/officer/duplicates" replace />}
      />
      <Route
        path="/officer/reports"
        element={
          <ProtectedRoute allowedRoles={['officer', 'admin']}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/settings"
        element={
          <ProtectedRoute allowedRoles={['officer', 'admin']}>
            <OfficerSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagementPage />
          </ProtectedRoute>
        }
      />

      {/* 14-16. Shared Case, Evidence & Timeline Routes */}
      <Route
        path="/cases/:caseId"
        element={
          <ProtectedRoute allowedRoles={['victim', 'officer', 'admin']}>
            <CaseDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/cases/:caseId"
        element={
          <ProtectedRoute allowedRoles={['officer', 'admin']}>
            <CaseDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/:caseId/evidence/:evidenceId"
        element={
          <ProtectedRoute allowedRoles={['victim', 'officer', 'admin']}>
            <EvidenceDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/:caseId/timeline"
        element={
          <ProtectedRoute allowedRoles={['victim', 'officer', 'admin']}>
            <CaseTimelinePage />
          </ProtectedRoute>
        }
      />

      {/* 403 & 404 */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
