// main.jsx
import React from 'react';
import ErrorBoundary from './pages/ErrorBoundry';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './components/Root';
import CoursesPage from './pages/CoursesPage';
import { CoursePage } from './pages/CoursePage';
import AddCourse from './pages/AddCourse';
import { CourseDetail } from './components/CourseDetail';
import { ToastProvider } from './pages/ToastContext';
import InformationAndContactPage from './components/Contact'; 

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <ErrorBoundary><CoursesPage /></ErrorBoundary>,
      },
      {
        path: '/course/:courseId',
        element: <ErrorBoundary><CoursePage /></ErrorBoundary>,
      },
      {
        path: '/add-course-form',
        element: <ErrorBoundary><AddCourse /></ErrorBoundary>,
      },
      {
        path: '/course-page/:courseId',
        element: <ErrorBoundary><CourseDetail /></ErrorBoundary>,
      },
      {
        path: '/information-and-contact',
        element: <ErrorBoundary><InformationAndContactPage /></ErrorBoundary>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ToastProvider>
    <RouterProvider router={router}>
      <Root />
    </RouterProvider>
    </ToastProvider>
  </ChakraProvider>
);

export default router;

