import { getTranslations } from "next-intl/server"

const page = async () => {
	const t = await getTranslations("Login")

  return <h1>{t('title')}</h1>
}
