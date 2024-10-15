import React, { useState } from "react";
import {MDBBtn, MDBContainer,MDBRow,MDBCol,MDBIcon,MDBInput} from 'mdb-react-ui-kit';
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getCsrfToken } from "next-auth/react";

type SignInProps = {
  csrfToken?: string;
};

const Login: React.FC = ({ csrfToken }: SignInProps) => {
    const [login_id, setEmployeeCode] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    //ログイン後にトップページへ移動させる
    const router = useRouter();
	
    //フォームデータをapi側にリクエストを送る
    const submitHandler = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
	
        const res = await fetch("http://localhost:3000/api/_login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login_id,
                password,
            })
        });
	
	//api側のレスポンスを受け取る
        const data = await res.json();
        if(data.token) {
            localStorage.setItem("token", data.token);
            // セッション管理用
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("employee_code", data.param.employee_code);
            sessionStorage.setItem("employee_name", data.param.employee_name);
            sessionStorage.setItem("shop_code", data.param.shop_code);
            sessionStorage.setItem("shop_name", data.param.shop_name);
            //router.push({ pathname: "main", query: { login_id : data.login_id } }, "../main/main");
            //router.push({ pathname: "../main/main", query: data.param }, "../main/main");
            router.push("../main/main");
        }else{
            setError(data.message);
        }
    };

    const changeHandler = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
 
        switch (name) {          
            case "login_id":
                setEmployeeCode(value);
                break;
            case "password":
                setPassword(value);
                break;
        }
    }
    //<form onSubmit={submitHandler}>
    return (
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol sm='6'>
              <div className='d-flex flex-row ps-5 pt-5'>
                <img src="../assets/icons/flower4519.png" width="48" height="48" className="App-logo mr-5" alt="logo" />
                <span className="h1 fw-bold mb-0">Braurose</span>
              </div>
              <form method="post" action="/api/auth/callback/credentials">
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>
        
                    <h3 className="fw-normal mb-3 ps-5 pb-3 fs-4" style={{letterSpacing: '1px'}}>勤怠管理システム</h3>
                    {error && <span className="ml-12">{error}</span>}
                    <MDBInput wrapperClass='mb-4 mx-5 w-100' label='社員コード' id='login_id' name='login_id' type='text' size="lg"
                      value={login_id} onChange={changeHandler}/>
                    <MDBInput wrapperClass='mb-4 mx-5 w-100' label='パスワード' id='password' name='password' type='password' size="lg"
                        onChange={changeHandler}/>
        
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

export default Login;