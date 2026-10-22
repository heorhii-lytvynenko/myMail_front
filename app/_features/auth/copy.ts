import type { AppLocale } from 'i18n/locales'

const en = {
  welcome: 'Welcome back', create: 'Create your account', loginCopy: 'Log in to your mail workspace.',
  registerCopy: 'Get started with your personal mail workspace.', email: 'Email', password: 'Password',
  confirmation: 'Confirm password', passwordHint: 'Use at least 8 characters. Spaces are preserved.',
  login: 'Log in', register: 'Create account', waiting: 'Please wait…', existing: 'Already have an account?',
  newUser: 'New to myMail?', invalidEmail: 'Enter a valid email address.',
  invalidPassword: 'Enter your password (up to 1,024 characters).', shortPassword: 'Use between 8 and 1,024 characters.',
  mismatch: 'Passwords do not match.', invalidCredentials: 'Incorrect email or password.',
  accountExists: 'An account with this email already exists. Please log in.',
  registrationRejected: 'Your password did not meet the account requirements. Use a longer, stronger password and try again.',
  rateLimited: 'Too many attempts. Please wait before trying again.', forbidden: 'Your account does not have permission to perform this action.',
  unavailable: 'The service is temporarily unavailable. Please try again.', expired: 'Your session expired. Please log in again.',
  loggedIn: 'Your account', greeting: 'Logged in as', logout: 'Log out', loggingOut: 'Logging out…',
  retry: 'Try again', accountError: 'We could not load your account. You can retry or log out.',
  gmail: 'Gmail connection', gmailUnavailable: 'Gmail connection is not available yet.',
  consent: 'Connect Google to let myMail read your Gmail messages. This does not grant permission to send or delete mail. You can disconnect at any time.',
  connect: 'Connect Google', reconnect: 'Reconnect Google', disconnect: 'Disconnect Gmail',
  connecting: 'Opening Google…', disconnecting: 'Disconnecting…', checking: 'Checking Gmail connection…',
  connected: 'Gmail is connected.', disconnected: 'No Gmail account is connected.',
  reconnectRequired: 'Google access has expired or been revoked. Reconnect to continue.',
  cancelled: 'Google connection was cancelled. Your existing connection was not changed.',
  callbackFailed: 'Google connection could not be completed. Please try connecting again.',
  connectionError: 'We could not check your Gmail connection. Please try again.',
  disconnectedNotice: 'Gmail has been disconnected.',
}
type Copy = typeof en
const pl: Copy = {
  welcome: 'Witaj ponownie', create: 'Utwórz konto', loginCopy: 'Zaloguj się do swojej poczty.',
  registerCopy: 'Zacznij korzystać z osobistej przestrzeni pocztowej.', email: 'E-mail', password: 'Hasło',
  confirmation: 'Potwierdź hasło', passwordHint: 'Użyj co najmniej 8 znaków. Spacje są zachowywane.',
  login: 'Zaloguj się', register: 'Utwórz konto', waiting: 'Proszę czekać…', existing: 'Masz już konto?',
  newUser: 'Nie masz konta?', invalidEmail: 'Wpisz poprawny adres e-mail.',
  invalidPassword: 'Wpisz hasło (maksymalnie 1024 znaki).', shortPassword: 'Użyj od 8 do 1024 znaków.',
  mismatch: 'Hasła nie są takie same.', invalidCredentials: 'Niepoprawny e-mail lub hasło.',
  accountExists: 'Konto z tym adresem już istnieje. Zaloguj się.',
  registrationRejected: 'Hasło nie spełnia wymagań konta. Użyj dłuższego, silniejszego hasła i spróbuj ponownie.',
  rateLimited: 'Zbyt wiele prób. Poczekaj przed kolejną próbą.', forbidden: 'Twoje konto nie ma uprawnień do wykonania tej czynności.',
  unavailable: 'Usługa jest chwilowo niedostępna. Spróbuj ponownie.', expired: 'Sesja wygasła. Zaloguj się ponownie.',
  loggedIn: 'Twoje konto', greeting: 'Zalogowano jako', logout: 'Wyloguj się', loggingOut: 'Wylogowywanie…',
  retry: 'Spróbuj ponownie', accountError: 'Nie udało się wczytać konta. Spróbuj ponownie lub wyloguj się.',
  gmail: 'Połączenie z Gmailem', gmailUnavailable: 'Połączenie z Gmailem nie jest jeszcze dostępne.',
  consent: 'Połącz Google, aby myMail mógł czytać wiadomości Gmail. Nie daje to prawa do wysyłania ani usuwania poczty. Możesz odłączyć konto w każdej chwili.',
  connect: 'Połącz Google', reconnect: 'Połącz Google ponownie', disconnect: 'Odłącz Gmail',
  connecting: 'Otwieranie Google…', disconnecting: 'Odłączanie…', checking: 'Sprawdzanie połączenia z Gmailem…',
  connected: 'Gmail jest połączony.', disconnected: 'Żadne konto Gmail nie jest połączone.',
  reconnectRequired: 'Dostęp do Google wygasł lub został cofnięty. Połącz konto ponownie.',
  cancelled: 'Anulowano łączenie Google. Istniejące połączenie nie zostało zmienione.',
  callbackFailed: 'Nie udało się połączyć Google. Spróbuj ponownie.',
  connectionError: 'Nie udało się sprawdzić połączenia z Gmailem. Spróbuj ponownie.',
  disconnectedNotice: 'Gmail został odłączony.',
}
const ua: Copy = {
  welcome: 'З поверненням', create: 'Створіть обліковий запис', loginCopy: 'Увійдіть до своєї пошти.',
  registerCopy: 'Почніть користуватися особистим поштовим простором.', email: 'Електронна пошта', password: 'Пароль',
  confirmation: 'Підтвердьте пароль', passwordHint: 'Використайте щонайменше 8 символів. Пробіли зберігаються.',
  login: 'Увійти', register: 'Створити обліковий запис', waiting: 'Зачекайте…', existing: 'Уже маєте обліковий запис?',
  newUser: 'Ще не маєте облікового запису?', invalidEmail: 'Введіть правильну адресу електронної пошти.',
  invalidPassword: 'Введіть пароль (до 1024 символів).', shortPassword: 'Використайте від 8 до 1024 символів.',
  mismatch: 'Паролі не збігаються.', invalidCredentials: 'Неправильна пошта або пароль.',
  accountExists: 'Обліковий запис із цією адресою вже існує. Увійдіть.',
  registrationRejected: 'Пароль не відповідає вимогам. Використайте довший, надійніший пароль і спробуйте ще раз.',
  rateLimited: 'Забагато спроб. Зачекайте перед наступною спробою.', forbidden: 'Ваш обліковий запис не має дозволу на цю дію.',
  unavailable: 'Сервіс тимчасово недоступний. Спробуйте ще раз.', expired: 'Сеанс завершився. Увійдіть ще раз.',
  loggedIn: 'Ваш обліковий запис', greeting: 'Ви увійшли як', logout: 'Вийти', loggingOut: 'Вихід…',
  retry: 'Спробувати ще раз', accountError: 'Не вдалося завантажити обліковий запис. Спробуйте ще раз або вийдіть.',
  gmail: 'Підключення Gmail', gmailUnavailable: 'Підключення Gmail поки недоступне.',
  consent: 'Підключіть Google, щоб myMail міг читати листи Gmail. Це не надає дозволу надсилати або видаляти листи. Ви можете відключити обліковий запис будь-коли.',
  connect: 'Підключити Google', reconnect: 'Підключити Google знову', disconnect: 'Відключити Gmail',
  connecting: 'Відкриття Google…', disconnecting: 'Відключення…', checking: 'Перевірка підключення Gmail…',
  connected: 'Gmail підключено.', disconnected: 'Жоден обліковий запис Gmail не підключено.',
  reconnectRequired: 'Доступ Google завершився або був відкликаний. Підключіть обліковий запис знову.',
  cancelled: 'Підключення Google скасовано. Наявне підключення не змінено.',
  callbackFailed: 'Не вдалося підключити Google. Спробуйте ще раз.',
  connectionError: 'Не вдалося перевірити підключення Gmail. Спробуйте ще раз.',
  disconnectedNotice: 'Gmail відключено.',
}

export function authCopy(locale?: AppLocale): Copy {
  return locale === 'pl' ? pl : locale === 'ua' ? ua : en
}

export function errorCopy(code: string, copy: Copy) {
  const messages: Record<string, string> = {
    INVALID_CREDENTIALS: copy.invalidCredentials, ACCOUNT_EXISTS: copy.accountExists,
    REGISTRATION_REJECTED: copy.registrationRejected, RATE_LIMITED: copy.rateLimited,
    FORBIDDEN: copy.forbidden, SESSION_EXPIRED: copy.expired,
  }
  return messages[code] ?? copy.unavailable
}
