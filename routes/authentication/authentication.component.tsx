import SignUpForm from "../../components/SignUpForm/sign-up-form.component";
import SignInForm from "../../components/SignInForm/sign-in-form.component";

import { AuthenticationContainer } from "./authentication.styles";

const Authentication = () => {
    return (
        <AuthenticationContainer>
            <SignInForm />
            <SignUpForm />
        </AuthenticationContainer>
    );
};

export default Authentication;