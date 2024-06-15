import React from 'react'
import { auth } from '../../Firebase'

function SignOut() {
  return (
    <div className="btn_container">
        <button className='btn_link' onClick={() => auth.signOut()}>サインアウト</button>
    </div>
  )
}

export default SignOut;