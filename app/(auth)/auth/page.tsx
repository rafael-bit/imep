import AuthForm from "./_components/auth-form";
import ClientAuthWrapper from "./_components/ClientAuthWrapper";

export default function Auth() {
	return (
		<ClientAuthWrapper>
			<AuthForm />
		</ClientAuthWrapper>
	)
}