import { createBrowserRouter } from "react-router-dom"
import App from "@/App"
import HomePage from "@/pages/HomePage"
import ProjectsPage from "@/pages/ProjectsPage"
import ProjectDetailPage from "@/pages/ProjectDetailPage"
import EducationPage from "@/pages/EducationPage"
import CertificationsPage from "@/pages/CertificationsPage"
import NotFoundPage from "@/pages/NotFoundPage"
import { ErrorFallback } from "@/components/common/ErrorFallback"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App is the global layout
    errorElement: <ErrorFallback />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "projects/:id",
        element: <ProjectDetailPage />,
      },
      {
        path: "education",
        element: <EducationPage />,
      },
      {
        path: "certifications",
        element: <CertificationsPage />,
      },
      {
        path: "certifications/:category",
        element: <CertificationsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
])
