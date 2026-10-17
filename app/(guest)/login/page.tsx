import { getTranslations } from 'next-intl/server'

// import { LoginFooter } from './_ui/LoginFooter'
import { LoginForm } from './_ui/LoginForm'
import { Page } from '@shared/ui/Page'
import { Section } from '@shared/ui/Section'
import { FlowCard } from '@shared/ui/FlowCard'

const page = async () => {
	const t = await getTranslations()

	return (
		<Page>
			<Page.Content>
				<Section>
					<FlowCard>
						<FlowCard.Content>
							<FlowCard.Title>{t('auth.MyMail')}</FlowCard.Title>

							{/* <OAuthButtons />

							<InlineDivider>{t('auth.or')}</InlineDivider> */}

							<LoginForm />

							{/* <LoginFooter /> */}
						</FlowCard.Content>

						<FlowCard.Image />
					</FlowCard>
				</Section>
			</Page.Content>
		</Page>
	)
}

export default page;