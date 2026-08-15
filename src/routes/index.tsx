import { createBrowserRouter } from "react-router-dom"
import App from "@/App"
import HomePage from "@/pages/HomePage"
import ProjectsPage from "@/pages/ProjectsPage"
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App is the global layout
    children: [
      {
        index: true, // This means it renders on the "/" exact path
        element: <HomePage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      }
    ],
  },
])
