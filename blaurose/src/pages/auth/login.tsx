import React from "react";
import {MDBBtn, MDBContainer,MDBRow,MDBCol,MDBIcon,MDBInput} from 'mdb-react-ui-kit';
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getCsrfToken } from "next-auth/react";
import Image from 'next/image'
import { SignInProps } from "@/types";

const Login: React.FC = ({ csrfToken }: SignInProps) => {
  const router = useRouter();
  const { error } = router.query;

  //ログインボタン押下後、[nextauth].tsのauthorizeが実行される
    return (
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol sm='6'>
              <div className='d-flex flex-row ps-5 pt-5'>
                <Image src="/flower4519.png" width={48} height={48} alt="logo"
                      className="hidden md:block App-logo mr-5"
                />
                <span className="h1 fw-bold mb-0">Braurose</span>
              </div>
              <form method="post" action="/api/auth/callback/credentials">
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>
        
                    <h3 className="fw-normal mb-3 ps-5 pb-3 fs-4" style={{letterSpacing: '1px'}}>勤怠管理システム</h3>
                    {error && <div>サインイン失敗</div>}
                    <MDBInput wrapperClass='mb-4 mx-5 w-100' label='社員コード' id='login_id' name='login_id' type='text' size="lg"/>
                    <MDBInput wrapperClass='mb-4 mx-5 w-100' label='パスワード' id='password' name='password' type='password' size="lg"/>
        
                    <MDBBtn className="mb-4 px-5 mx-5 w-100" color='info' size='lg' type="submit">ログイン</MDBBtn>
                </div>
              </form>
            </MDBCol>
            <MDBCol sm='6' className='d-none d-sm-block px-0'>
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
                alt="Login image" className="w-100" style={{objectFit: 'cover', objectPosition: 'left'}} />
            </MDBCol>
    
          </MDBRow>
        </MDBContainer>
      );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};
Login.displayName = "Login"
export default Login;