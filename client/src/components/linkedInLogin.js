import React from "react";
import styled from "styled-components";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import axios from "axios";
function LinkedInPage() {
  const [userData, setUserData] = React.useState(null);
  const { linkedInLogin } = useLinkedIn({
    clientId: "860t3y7zmcuxjk",
    redirectUri: `${window.location.origin}/linkedin`,
    onSuccess: (code) => {
      setCode(code);
    },
    scope: "email",
    onError: (error) => {
      console.log(error);
      setCode("");
      setErrorMessage(error.errorMessage);
    },
  });

  // const handleSuccess = async (code) => {
  //   fetch(
  //     "https://cors-anywhere.herokuapp.com/https://www.linkedin.com/oauth/v2/accessToken",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: new URLSearchParams({
  //         grant_type: "authorization_code",
  //         code: code,
  //         redirect_uri: "http://localhost:3000/linkedin",
  //         client_id: "860t3y7zmcuxjk",
  //         client_secret: "JNw2EVjcWGqtCatm",
  //       }),
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const accessToken = data.access_token;

  //       // Fetch the LinkedIn user data
  //       return fetch("https://api.linkedin.com/v2/me", {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });
  //     })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setUserData(data);
  //     })
  //     .catch((error) => console.error("Error:", error));
  // };
  const [code, setCode] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  return (
    <Wrapper>
      <img
        onClick={linkedInLogin}
        src={linkedin}
        alt="Log in with Linked In"
        style={{ maxWidth: "180px", cursor: "pointer" }}
      />

      {!code && <div>No code</div>}
      {code && (
        <div>
          <div>Authorization Code: {code}</div>
          <div>
            Follow{" "}
            <Link
              target="_blank"
              href="https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?context=linkedin%2Fconsumer%2Fcontext&tabs=HTTPS#step-3-exchange-authorization-code-for-an-access-token"
              rel="noreferrer"
            >
              this
            </Link>{" "}
            to continue
          </div>
          {userData && <div>{JSON.stringify(userData)}</div>}
        </div>
      )}
      {errorMessage && <div>{errorMessage}</div>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Link = styled.a`
  font-size: 20px;
  font-weight: bold;
`;

export default LinkedInPage;
