import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { IUser } from '../models/IUser';
import { AuthResponse } from '../models/IAuthResponse';

type AuthSlice = { 
    status: 'idle' | 'loading' | 'finished' | 'error';
    user: IUser;
    isAuth: boolean

}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
    const date = new Date();
      date.setTime(date.getTime() + (days  *  24  *  60  *  60  *  1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  
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

  export const setUserAuth = createAsyncThunk(
    'users/setUserAuth',
    async ({ login, password }: { login: string; password: string }, { rejectWithValue, dispatch }) => {
        try {
            const token = getCookie('refresh');
            const response = await fetch('http://localhost:8888/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ login, password }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Server Error!');
            }

            const data: Promise<AuthResponse> = await response.json();

            dispatch(setAuth((await data).user));
        } catch (e) {
            if (e instanceof Error) return rejectWithValue(e.message);
            return String(e);
        }
    }
);
export const registerUser = createAsyncThunk(
    'users/registerUser',
    async function({login,password}:{login:string, password: string},{rejectWithValue,dispatch}) {
        try{ 
            
            const response = await fetch('http://localhost:8888/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({login,password}),
                credentials: 'include'
            });
            if(!response.ok){
                throw new Error('Server Error!');
                }
            console.log(response)
            const data:Promise<AuthResponse> = await response.json();
            dispatch(setAuth((await data).user))
        }catch(e){ 
            if (e instanceof Error) return rejectWithValue(e.message)
            return String(e)
        }
    }
)
export const logoutUser = createAsyncThunk(
    'users/setUserAuth',
    async function(_,{rejectWithValue,dispatch}) {
        try{ 
            setCookie('refresh', '', -1);
            dispatch(logout())
        }catch(e){ 
            if (e instanceof Error) return rejectWithValue(e.message)
            return String(e)
        }
    }
)

export const checkAuth = createAsyncThunk(
    'users/checkAuth',
    async function (_,{rejectWithValue,dispatch}) {
        try{ 
            const token = getCookie('refresh');
            const response = await fetch('http://localhost:8888/auth/login', {
                method: 'GET',
                headers: {
                    credentials: 'include',
                    Authorization: `Bearer ${token}`
                },
            });
            if(!response.ok){
                throw new Error('Server Error!');
                }
            const data:Promise<AuthResponse> = await response.json();
            setCookie('token', 'Bearer ' +(await data).token, 7);
            dispatch(setAuth((await data).user))
        }catch(e:unknown){ 
            if (e instanceof Error) return rejectWithValue(e.message)
            return String(e)
        }
    }
)

const initialState:AuthSlice  = {
    status: 'idle',
    user: {} as IUser,
    isAuth : false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state,action) {
            state.isAuth = true;
            if(!action.payload.role){
                const newUser = action.payload;
                newUser.role = 'USER';
                state.user = newUser;
            }
            state.user = action.payload;
            state.status='finished';

        },
        logout(state){
            state.isAuth = false;
            state.user = {} as IUser;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(setUserAuth.pending, (state)=>{
            state.status = 'loading';
        }),
        builder.addCase(setUserAuth.fulfilled, (state)=>{
            state.status = 'finished';
        })
        builder.addCase(setUserAuth.rejected, (state)=>{
            state.status = 'error';
        }),
        builder.addCase(registerUser.pending, (state)=>{
            state.status = 'loading';
        }),
        builder.addCase(registerUser.fulfilled, (state)=>{
            state.status = 'finished';
        }),
        builder.addCase(registerUser.rejected, (state)=>{
            state.status = 'error';
        }),
        builder.addCase(checkAuth.rejected, (state)=>{
            state.status = 'error';
            state.user = {} as IUser;
            state.isAuth = false;
            setCookie('refresh', '', -1);
        })
        
    }
})
export const {setAuth,logout} = authSlice.actions;
export default authSlice.reducer;