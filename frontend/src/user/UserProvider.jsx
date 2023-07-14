


// https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications


/*

    https://security.stackexchange.com/questions/166724/should-i-use-csrf-protection-on-rest-api-endpoints/166798#166798
    https://stackoverflow.com/questions/520https://www.predic8.de/bearer-token-autorisierung-api-security.htm#:~:text=Der%20Begriff%20Bearer%20bedeutet%20auf,eine%20bestimmte%20Identit%C3%A4t%20gebunden%20ist.


    SECURITY

    XSS - Cross Site Scripting

    Hier wird in der Website schadhafter Code untergebracht, welcher dann an die Client Browser geschickt und dort
    ausgeführt wird. Dort ließt der schadhafte Code beliebige Daten aus (localstorage, sessionstorage, javascript
    memory usw usw) und sendet die irgendwo hin. Außerdem kann der schadhafte Code direkt mit Hilfe der Tokens
    Anfragen ausführen und so die User Authentification übernehmen um API Aktionen durchzuführen.

    Angegriffen wird zunächst die Website durch Ausnutzung einer Schwachstelle um dann die Nutzer der Seite anzugreifen
    und im weiteren Sinne dann auch wieder die Website durch Verwendung der Userrechte anzugreifen.

    Absicherungen:

    1. Die Website muss vor Einschleusen von Code geschützt werden. Das heißt, beim rendern der Website im User Browser
       muss peinlich genau darauf geachtet werden, keinen Code zu generieren, beispielsweise aus Datenbankinhalten,
       Queryparametern, Usereingaben, Inhalten (z.b. "Bildern" oder anderen Dokumenten) die von extern Seiten gezogen
       werden. Alle diese möglichkeiten müssen geprüft werden, damit kein fremder Code in die Datenbank/Website gelangt
       und an die Browser der User geschickt wird. Dies kann insbesondere durch korrektes Escaping von Inhalten passieren.

       Ein komplett offensichtliches Problem ist das benutzen fremder JS libraries, wenn hier z.b. fälschlicherweise
       vertraut wird oder wenn schadcode in eine extern eingebundenen bibliothek utergebracht wird.

    2. Sensible Daten (Token, Authentifizierungsinfos etc.) sollten nach möglichkeit gar nicht für JS sichbar sein. Das ist
       eigentlich nur dan der Fall, wenn man z.b. JWT Token im Browser des Users als Cookie mit der Option http only
       speichert. In diesem Fall hat JS kein zugang zu dem Cookie Inhalt. Sowohl sessionstorage, localstorage als auch der
       lokale JS Speicher können von JS gelesen werden (weil das skript ja direkt als teil der seite ausgeführt wird, kann
       somit alles sehen, was auch die seite sieht)
       Der große Nachteil der Cookies ist, dass diese direkt CSRF ermöglichen. Außerdem ist es immer noch möglich, dass der
       Schadcode Anfragen startet, die den Cookie verwenden.




    CSRF - Cross-Site Request Forgery

    Hier wird es ausgenutzt, dass der Browser in manchen Fällen automatisch bestimmte Authentifizierungs Infos an Requests
    anhängt (beispielsweise wenn Token in Cookies gespeichert werden). In diesem Fall besucht man gleichzeitig eine schadhafte
    Website, welche dann über den User Browser einen Request an eine Zielwebsite schickt, auf der der User zeitgleich
    eingeloggt ist. Das Token der Zielwebseite wird über den schadhaften Request automatisch vom Browser mitgeschickt.

    Problematisch sind nicht nur Cookies, sondern z.b. auch der "Basic Auth" Methode, da diese auch automatisch geschickt wird,
    falls Zugangsdaten vom User für die Session eingegeben wurden.
    Similarly, digest authentication, ntlm, negotiate and certificate auth can all be vulnerable to crsf.

    Absicherungen:

    1. Automatisches Authentifizieren durch den Browser verhindern. Der gängiste Weg ist, JWT nicht in Cookies zu speichern,
       sondern bei jedem Request als Authorization: Bearer <token> http header.

    2. CSRF Token
       Auf jeder "Seite" von der aus eine Aktion druchgeführt werden können soll, wird serverseitig ein CSRF Token erzeugt
       und dem User Browser zurückgeschickt.
       Um ein API Request zu authentifizieren, muss dieses Token bei der Anfragen mit übergeben werden.
       Diese Methode ist sehr sicher, aber bringt jede menge overhead mit. Im Prinzip muss das Token auch serverseitig
       gespeichert werden. Wahrscheinlich gibt es möglichkeiten, Token serverseitig zu schicken, dann zu vergessen und nur mit
       Hilfe eines private keys zu verifizieren.
       Gibt es hierfür Libraries, die das ganze sowohl server- als auch clientseitig übernehmen?



    Bei Cookies ist sameSite flag essentiell wichtig als abwehr von CSRF
    httpOnly
    siehe auch secure cookies
    cryptographically secured cookies





    Wo sollten JWT Token gespeichert werden?

    https://dev.to/cotter/localstorage-vs-cookies-all-you-need-to-know-about-storing-jwt-tokens-securely-in-the-front-end-15id
    https://dev.to/rdegges/please-stop-using-local-storage-1i04

    1. sessionstorage oder localstorage
       Das ermöglicht im Falle des localstroage ein automatisches Einloggen beim einem späteren aufruf (auch nachdem der Browser
       beendet wurde).
       Allerdings kann das einfach von jedem gelesen werden. Generll ist davon abzuraten, localstorage zu verwenden.

       

       GENERELL:
       Eine sichere Webapplication sollte IMMER DARAUF VERZICHTEN die sessions dauerhaft zu machen, egal ob über JWT in
       cookies oder localstorage. Die Cookies sollten auslaufen nach einer bestimmten Zeit und nur erneuert werden, wenn
       der User aktiv ist. Genauso sollte sich das Frontend ausloggen nach einer bestimmten Zeit.

       Dsa heißt, dass man sich immer neu Einloggen muss, was aber bei im browser password store gespeicherten passwörtern
       kein problem sein sollte!!!

       Verliert man dadurch bei einer Single Page App zwingend den Login bei einem site refresh?

       Generell wird empfohlen, auch CSRF Tokens zu verwenden...

       Folgendes ist gut:
       https://medium.com/tresorit-engineering/modern-csrf-mitigation-in-single-page-applications-695bcb538eec

       Eigentlich müsste es eine Bibliothek geben, welche es ermöglich temporäre tokens zu erstellen und damit
       bestimmte aktionen im vorfeld zu signen (vielleicht kann ja auch die verschlüsselte payload im token angeben
       für welche aktion das ganze jetzt verwender werdn kann)
       Es bleibt trotzdem etwas overhead

*/



import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import API from '../api/fetchAPI'
import { setUser, clearUser } from '../store/user'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import LoginIcon from '@mui/icons-material/Login'
import PasswordVisibleIcon from '@mui/icons-material/Visibility'
import PasswordInvisibleIcon from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import Slide from '@mui/material/Slide'
import Collapse from '@mui/material/Collapse'
import ErrorIcon from '@mui/icons-material/Error'
// import LoginSuccessIcon from '@mui/icons-material/Done'
import LoginSuccessIcon from '@mui/icons-material/CheckCircle'
import Fade from '@mui/material/Fade';

import { Icon as IconifyIcon, InlineIcon as IconifyIconInline } from "@iconify/react"

import templates from '../util/mail/base/Templates'

import './UserProvider.scss'

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default function LoginProvider({ children }) {

    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [username, setUsername] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)
    const [password, setPassword] = React.useState('')
    const [errorMessage, setErrorMessage] = React.useState(null)
    const [loginInProgress, setLoginInProgress] = React.useState(false)
    const [loginSuccessful, setLoginSuccessful] = React.useState(false)

    const [showForgotPasswordView, setShowForgotPasswordView] = React.useState(false)
    const [email, setEmail] = React.useState('')
    const [infoMessage, setInfoMessage] = React.useState(null)
    const [usernameSent, setUsernameSent] = React.useState(false)

    const [passwordResetInProgress, setPasswordResetInProgress] = React.useState(false)
    const [passwordResetSent, setPasswordResetSent] = React.useState(false)

    React.useEffect(() => {
        console.log("USER PROVIDER CHECK AUTH")
        API.get('/api/user/auth', { doNotThrowFor: [400,401] })
        .then( user => {
            dispatch(setUser(user))
        }).catch(err => {
            // no authentication, login required
            console.log("ERROR")
        })
    }, [])

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const onFieldKeyDown = (event) => {
        if(event.key === "Enter" && username.trim().length > 0 && password.length > 0) {
            doLogin()
        }
    }

    const gotoPasswordClick = (event) => {
        setShowForgotPasswordView(true)
    }

    const gotoLogin = (event) => {
        setInfoMessage(null)
        setShowForgotPasswordView(false)
        setUsernameSent(false)
        setErrorMessage(null)
        setPasswordResetInProgress(false)
        setPasswordResetSent(false)
    }

    const forgotUsernameToo = () => {
        if(usernameSent) {
            return
        }

        if(typeof email === 'string' && email.length > 0 && EMAIL_REGEX.test(email)) {

            setUsernameSent(true)
            setInfoMessage(<>The username has been sent to <b>{email}</b> (provided that this email address is associated with an existing acount)</>)

            API.post('/api/user/send-username', {
                params: {
                    email: email.trim(),
                    template: templates['sendUsername']
                },
                doNotThrowFor: [401]
            }).then( () => {
                // empty
            }).catch( err => {
                setErrorMessage()
            })
            
        } else {
            setInfoMessage('Please enter the email address associated with your account. Then click \'Send me my username \' to receive your username by email.')
        }
    }

    const doLogin = () => {
        setErrorMessage(null)
        setLoginSuccessful(false)
        setLoginInProgress(true)

        API.post('/api/user/login', {
            params: {
                username: username.trim(),
                password: password
            },
            doNotThrowFor: [401]
        }).then( user => {
            setLoginSuccessful(true)
            setTimeout(() => {
                setLoginInProgress(false)
                setLoginSuccessful(false)
            }, 2000 )
            setTimeout(() => {
                dispatch(setUser(user))
            }, 500 )
        }).catch(err => {
            setLoginInProgress(false)
            setErrorMessage("Credentials could not be verified")
        })
    }


    const doPasswordReset = () => {

        setPasswordResetInProgress(true)
        setInfoMessage(null)

        API.post('/api/user/reset-password-user', {
            params: {
                username: username.trim(),
                email: email.trim(),
                template: templates['resetPassword']
            },
            doNotThrowFor: [401]
        }).then( user => {
            setPasswordResetSent(true)
            setInfoMessage(<>A link to reset your password has been sent to <b>{email}</b> (provided that username / email can be associated with an existing account.)</>)
            setPasswordResetInProgress(false)
        }).catch(err => {
        })
    }


    const renderLogin = () =>
        <div className="login-screen">

            <div className="login-box">

                { showForgotPasswordView ? 

                    <>
                        <h2>Password Reset</h2>

                        <span className="light">Enter your username and email. A link to reset your password will be sent to your email address.</span>

                        <TextField
                            disabled={passwordResetInProgress === true || passwordResetSent === true}
                            className="inputfield username"
                            label="Username"
                            variant="filled"
                            value={username}
                            onChange={handleUsernameChange}
                        />

                        <TextField
                            disabled={usernameSent === true || passwordResetInProgress === true || passwordResetSent === true}
                            className="inputfield email"
                            label="Email"
                            variant="filled"
                            value={email}
                            onChange={handleEmailChange}
                        />

                        <LoadingButton
                            className="main-button"
                            disabled={username.trim().length <= 0 || email.trim().length <= 0 || EMAIL_REGEX.test(email) == false || passwordResetSent === true}
                            variant="text"
                            onClick={doPasswordReset}
                            startIcon={<IconifyIcon icon="material-symbols:lock-reset-rounded"/>}
                            loading={passwordResetInProgress}
                            loadingPosition="center"
                            style={{marginTop: '8px'}}
                        >
                            Reset Password
                        </LoadingButton>

                        { usernameSent == false ? 
                            <div className="sublink">
                                <a className={usernameSent ? 'disabled' : ''} onClick={forgotUsernameToo}>Send me my username</a>
                            </div>                    
                        : null }

                        { infoMessage ? 
                            <div className="message">
                                <div className="icon-container">
                                    <IconifyIcon className="icon" icon={(usernameSent || passwordResetSent) ? "mingcute:check-2-fill" : "mingcute:hand-finger-2-fill"} />
                                </div>
                                <div className="text-container">
                                    {infoMessage}
                                </div>
                            </div>
                        : null }

                        <div className="sublink">
                            <a onClick={gotoLogin}>Go back to Login</a>
                        </div>                    



                    </>

                    :
            
                    <>
                        <h2>Login</h2>

                        <span>Please login to use this service</span>

                        <TextField
                            className="inputfield username"
                            label="Email / Username"
                            variant="filled"
                            value={username}
                            onChange={handleUsernameChange}
                            onKeyDown={onFieldKeyDown}
                        />

                        <div className="password-box">
                            <TextField
                                className="inputfield password"
                                id="standard-password-input"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                autoComplete="current-password"
                                variant="filled"
                                onKeyDown={onFieldKeyDown}
                            />
                            <IconButton
                                className="password-button"
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <PasswordVisibleIcon /> : <PasswordInvisibleIcon />}
                            </IconButton>
                        </div>

                        <Collapse orientation="vertical" in={errorMessage !== null}>
                            <div className="message old error">
                                <div className="icon">
                                    <ErrorIcon />
                                </div>
                                <div>
                                    {errorMessage}
                                </div>
                            </div>
                        </Collapse>

                        <Collapse orientation="vertical" in={loginSuccessful}>
                            <div className="message old success">
                                <div className="icon">
                                    <LoginSuccessIcon />
                                </div>
                                <div>
                                    Login Successful
                                </div>
                            </div>
                        </Collapse>

                        <LoadingButton
                            className="main-button"
                            disabled={username.trim().length <= 0 || password.length <= 0}
                            variant="text"
                            onClick={doLogin}
                            startIcon={<LoginIcon />}
                            loading={loginInProgress}
                            loadingPosition="center"
                        >
                            Login
                        </LoadingButton>

                        <div className="sublink">
                            <a onClick={gotoPasswordClick}>Forgot password?</a>
                        </div>                    
                    </>

                }
            </div>
        </div>


    return (
        <>

            <Fade timeout={{ enter: 1000, exit: 1000 }} in={user.id == null} mountOnEnter unmountOnExit>
                {
                    renderLogin()
                }
            </Fade>

            <Fade timeout={{ enter: 1000, exit: 1000 }} in={user.id != null} mountOnEnter unmountOnExit>
                <div className="fade-container">
                    { children }
                </div>
            </Fade>

            {/* <Slide direction="right" timeout={{ enter: 1000, exit: 1000 }} in={user.id == null} mountOnEnter unmountOnExit>
                {
                    renderLogin()
                }
            </Slide>

            <Slide direction="left" timeout={{ enter: 1000, exit: 1000 }} in={user.id != null} mountOnEnter unmountOnExit>
                <div className="fade-container">
                    { children }
                </div>
            </Slide> */}

            {/* { user.id != null ? children : <></> } */}
        </>
    )

}









