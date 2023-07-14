import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import { HeaderComponents } from 'components/Header/HeaderComponents'
import { useLocation } from 'react-router-dom'
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from 'utils/consts'
import './stylePage.scss'
import { useDispatch } from 'react-redux'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth'
import { SetUser } from 'reducers/authReducer'

export const StartPage = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const isLogin = location.pathname === LOGIN_ROUTE
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    if (isLogin) {
      loginUser(email, password)
    } else {
      createUser(email, password)
    }
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const loginUser = (email: string, password: string) => {
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
      .then(user => {
        console.log(user)
      })
      .catch(console.error)
  }

  const createUser = async (email: string, password: string) => {
    const auth = getAuth()

    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        getTokenSetUser(user)
      })

      .catch(console.error)
  }

  const getTokenSetUser = async (user: User) => {
    const token = await user.getIdToken()
    console.log('token', token)
    dispatch(
      SetUser({
        email: user.email,
        token: token,
        id: user.uid,
      }),
    )
    return token
  }
  return (
    <>
      <HeaderComponents />
      <Button type="primary" onClick={showModal}>
        Авторизация
      </Button>
      <Modal
        title={isLogin ? 'Авторизация' : 'Регистрация'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="modal"
        width={350}
      >
        <div>
          <p>Email</p>
          <input
            type="text"
            placeholder="Введите Email"
            required
            onChange={e => setEmail(e.target.value)}
          />
          <p>Пароль</p>
          <input
            type="password"
            placeholder="Введите пароль"
            required
            onChange={e => setPassword(e.target.value)}
          />
          {isLogin ? (
            <div className="anotherModal">
              Нет аккаунта? <a href={REGISTRATION_ROUTE}>Регистрация</a>
            </div>
          ) : (
            <div className="anotherModal">
              Есть аккаунт? <a href={LOGIN_ROUTE}>Авторизация</a>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
function setUser(arg0: {}): any {
  throw new Error('Function not implemented.')
}