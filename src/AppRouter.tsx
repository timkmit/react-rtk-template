import { Routes,Route,Navigate } from "react-router-dom";
import { userRoutes, adminRoutes,publicRoutes } from './routes';
import { useAppSelector } from "./store/redux-hooks";

const AppRouter = () => {
  const auth = useAppSelector(store=> store.auth)
  if(auth.status=='loading'){
    return (<p>Loading..</p>)
  }
  console.log(auth.isAuth);
    if(auth.isAuth){
      if(auth.user.role=='ADMIN'){
        return ( 
          <Routes>
           {adminRoutes.map((route,i)=>
          <Route key = {i} path = {route.path} element={<route.element/>}/>
            )}
            <Route path='/*' element={<Navigate to="/admin" replace/>}/>

          </Routes>
        )
      }else if (auth.user.role=='USER'){
        return ( 
          <Routes>
            {userRoutes.map((route,i)=>
              <Route key = {i} path = {route.path} element={<route.element/>}/>
            )}
            <Route path='/*' element={<Navigate to="/user" replace/>}/>
        </Routes>
        )
      }
    }else{ 
      return (
        <Routes>
        {publicRoutes.map((route,i)=>
          <Route key = {i} path = {route.path} element={<route.element/>}/>
        )}
        <Route path='/*' element={<Navigate to="/" replace/>}/>
        </Routes>
       )
    }
}

export default AppRouter