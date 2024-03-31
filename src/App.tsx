import {useEffect} from 'react'
import { Container } from "./components/UI/Container"
import { useAppDispatch, useAppSelector } from "./store/redux-hooks";
import { checkAuth } from "./store/authSlice";
import AppRouter from './AppRouter';



function App() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((store)=>store.auth)
    useEffect(()=>{
          dispatch(checkAuth());
        
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