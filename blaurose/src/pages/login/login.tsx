import React, { useEffect, useState } from "react";
import {MDBBtn, MDBContainer,MDBRow,MDBCol,MDBIcon,MDBInput} from 'mdb-react-ui-kit';
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import Image from 'next/image'
import { SignInProps } from "@/types";
import { toast } from "react-toastify";

const Login: React.FC = ({ csrfToken }: SignInProps) => {
  const router = useRouter();
  const [loginId, setLoginId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
        redirect: false,
        loginId: loginId,
        password: password
    });

    if (result?.error) {
        toast.error('ログインに失敗しました');
    } else {
      toast.dismiss()
      router.push('/main/main');
    }
  }

  //ログインボタン押下後、[nextauth].tsのauthorizeが実行される
  //hidden レスポンシブ対応につかうタグ
  return (
      <>
      <MDBContainer fluid>
        <MDBRow>
          <MDBCol sm='6'>
            <div className='d-flex flex-row ps-5 pt-5'>
              <Image src="/assets/images/blaurose_w48h42.png" alt="logo" className="md:block App-logo mr-5" width={48} height={42} />
              <span className="h1 fw-bold mb-0">Blaurose</span>
            </div>
            {/* <form method="post" action="/api/auth/callback/credentials"> */}
            <form onSubmit={handleLogin}>
            
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>
      
                  <h3 className="fw-normal mb-3 ps-5 pb-3 fs-4" style={{letterSpacing: '1px'}}>勤怠管理システム</h3>
                  <MDBInput wrapperClass='mb-4 mx-5 w-100' label='社員コード' id='login_id' name='login_id' type='text' size="lg"
                    value={loginId} onChange={(e) => setLoginId(e.target.value)}
                    />
                  <MDBInput wrapperClass='mb-4 mx-5 w-100' label='パスワード' id='password' name='password' type='password' size="lg"
                    value={password} onChange={(e) => setPassword(e.target.value)}/>
      
                  <MDBBtn className="mb-4 px-5 mx-5 w-100" color='info' size='lg' type="submit">ログイン</MDBBtn>
              </div>
            </form>
          </MDBCol>
          <MDBCol sm='6' className='d-none d-sm-block px-0'>
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
              alt="Login image" className="w-100" style={{height:'100%', objectFit: 'cover', objectPosition: 'left'}} />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      </>
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