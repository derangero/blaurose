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
    shopCode?: string
    shopName?: string
    employeeName?: string
    employeeId?: string
    stampedFromAt?: Date
    stampedToAt?: Date
    stampedByPreviousMark?: string
  }

  export type Timecard = (typeof Timecard)[keyof typeof Timecard]
  export type User = (typeof User)[keyof typeof User]