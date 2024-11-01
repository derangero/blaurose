import React, { useState } from 'react';
import { DateTime,Settings } from "luxon";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
} from 'mdb-react-ui-kit';
import { signOut } from 'next-auth/react';

export default function Header(param: any) {
  const sessionData = param.sessionData;
  const [openBasic, setOpenBasic] = useState(false);
  Settings.defaultLocale = 'ja';
  const displayDate = DateTime.local().toFormat('yyyy/M/d（EEE）');

  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarToggler
          className="header-MDBNavbarToggler"
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setOpenBasic(!openBasic)}
        >
          <div className="header-container-flex">
            <MDBIcon icon='bars' fas />
          <div className="header-name">{sessionData?.shopName}&nbsp;&nbsp;{sessionData?.employeeName}&nbsp;さん</div>
          </div>
        </MDBNavbarToggler>

        <MDBCollapse navbar open={openBasic}>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
            <MDBNavbarItem>
              <MDBNavbarLink aria-current='page' href='#'>
                シフト確認
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='/workList/workList'>
                勤怠表
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink aria-current='page' href='#'>
                打刻訂正
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink active onClick={() => signOut()}>ログアウト</MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};
//{sessionData.shopName}  {sessionData.employeeId} さん

