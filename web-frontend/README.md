# Puertollano Dental Clinic Frontend

## Overview

This is the frontend codebase for the Puertollano Dental Clinic appointment and patient management system. It is built using React and Material UI, and provides a modern, responsive interface for both patients and administrators.

## Main Features

- **Appointment Booking:**  
  Patients can book appointments by filling out a detailed form. The form includes fields for personal information, procedure, branch selection, date and time (with booked slots disabled), HMO details, number of patients (1-3), and notes/comments. Google reCAPTCHA is integrated for spam prevention.

- **Branch and Time Selection:**  
  Patients must select a branch before choosing a date and time. The time dropdown disables and marks slots that are already booked (status "Accepted") for the selected branch and date.

- **Admin Panel:**  
  Administrators can log in to access a calendar view of appointments. The admin calendar supports filtering by branch, color-coding by appointment status, and editing/cancelling appointments. When cancelling, admins must provide a reason, which is stored in the database.

- **Patient Management System (PMS):**  
  Accessible via `/pdc_pms`, this system provides a login page for administrators and a dashboard for managing patients and appointments. The dashboard displays metrics, charts, and a searchable patient table.

- **Dialogs and Confirmations:**  
  Booking an appointment prompts a confirmation dialog explaining that the booking is tentative until approved by an admin. Patients can cancel the booking request if they do not agree.

- **Accessibility and Responsiveness:**  
  The UI is designed to be accessible and responsive across devices, with clear labels, helper texts, and error handling.

## Data Flow

- **API Integration:**  
  The frontend communicates with a backend API (e.g., `https://purtollano-dental-app.vercel.app/appointments`) for booking, updating, and fetching appointments and patient data.

- **State Management:**  
  React hooks (`useState`, `useEffect`) are used for managing form state, fetching booked times, and handling dialog visibility.

## Customization

- **Configurable Procedures and Branches:**  
  Procedures and branches are defined as dropdown options and can be easily updated.

- **Extensible Patient Data:**  
  The patient management dashboard can be extended to show more fields or support additional actions.

## Security

- **Admin Authentication:**  
  Admin login is required for accessing sensitive features. Session management and redirection are handled in the frontend.

- **Spam Prevention:**  
  Google reCAPTCHA is used on the booking form.

## Summary

This frontend provides a comprehensive solution for dental clinic appointment booking and administration, with robust features for both patients and staff. It is designed for ease of use, flexibility, and security, ensuring a smooth experience for all users.


