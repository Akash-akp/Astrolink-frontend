import React from 'react'

const CommonBtn = ({title,func,theme='purple'}) => {
  return (
    <button
        onClick={() => func()}
        className={`px-4 py-2 ${theme=='purple'?('bg-purple-900/50 text-purple-400 hover:text-purple-300 '):('bg-white/70 text-gray-700 hover:text-black')}  text-sm font-medium rounded-lg transition-colors`}
    >
        {title}
    </button>
  )
}

export default CommonBtn
