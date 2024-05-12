import React from 'react'
import { auth } from '../../Firebase'

function SignOut() {
  return (
    <div>
        <button onClick={() => auth.signOut()}>サインアウト</button>
    </div>
  )
}

export default SignOut;