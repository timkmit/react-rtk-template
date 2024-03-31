import {useEffect} from 'react'
import { Container } from "./components/UI/Container"
import { useAppDispatch, useAppSelector } from "./store/redux-hooks";
import { checkAuth } from "./store/authSlice";
import AppRouter from './AppRouter';

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function App() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((store)=>store.auth)
    useEffect(()=>{
        if(getCookie('token')){
          dispatch(checkAuth());
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(()=>{
      if(auth.isAuth){
        console.log("AUTH")
      }
    },[auth.isAuth])
  return (
    <>
      
      <Container>
        <AppRouter/>
      </Container>
    </>
  )
}

export default App