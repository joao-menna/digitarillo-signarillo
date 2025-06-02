import { DashboardPage } from "@/pages/dashboard";
import { EmployeesPage } from "@/pages/employees";
import { LoginPage } from "@/pages/login";
import { PendingExpensesPage } from "@/pages/pendingExpenses";
import { RegisterPage } from "@/pages/register";
import { SignedExpensesPage } from "@/pages/signedExpenses";
import { SignExpensePage } from "@/pages/signExpense";
import { SubmitExpensePage } from "@/pages/submitExpense";
import { ValidateExpensePage } from "@/pages/validateExpense";
import { VerifySignaturePage } from "@/pages/verifySignature";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "login",
    element: <LoginPage />
  },
  {
    path: "register",
    element: <RegisterPage />
  },
  {
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />
      },
      {
        path: "employees",
        element: <EmployeesPage />
      },
      {
        path: "signature",
        children: [
          {
            path: "verify",
            element: <VerifySignaturePage />
          },
        ],
      },
      {
        path: "expense",
        children: [
          {
            path: "submit",
            element: <SubmitExpensePage />
          },
          {
            path: "pending",
            element: <PendingExpensesPage />
          },
          {
            path: "validate",
            element: <ValidateExpensePage />
          },
          {
            path: "sign",
            element: <SignExpensePage />
          },
          {
            path: "signed",
            element: <SignedExpensesPage />
          },
        ],
      },
    ],
  },
]);
