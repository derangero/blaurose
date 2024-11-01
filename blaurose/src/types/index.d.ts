  type AccessControlType = 'replace' | 'push';
  type AccessControlFallback = { type: AccessControlType; destination: string }
  type GetAccessControl = () =>
    | null
    | AccessControlFallback
    | Promise<null | AccessControlFallback>
  type WithGetAccessControl<P> = P & {
    getAccessControl?: GetAccessControl
  }
  type SignInProps = {
    csrfToken?: string;
  };
  type SessionData = {
    companyId: string
    shopCode: string
    shopName: string
    employeeName: string
    employeeId: string
  }
  type MDBBtnColor = "secondary" | "link" | "none" | "primary" | "success" | "danger" | "warning" | "light" | "dark" | "muted" | "white" | "info" | "tertiary" | undefined;

  export type Timecard = (typeof Timecard)[keyof typeof Timecard]
  export type User = (typeof User)[keyof typeof User]