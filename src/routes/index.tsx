import { createBrowserRouter } from "react-router-dom"
import App from "@/App"
import HomePage from "@/pages/HomePage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App is the global layout
    children: [
      {
        index: true, // This means it renders on the "/" exact path
        element: <HomePage />,
      },
      // You can add more pages here later like:
      // { path: "projects", element: <Projects /> }
    ],
  },
])
