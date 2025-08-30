import React from 'react'

const Loading = () => {
    return (
        <div className='flex flex-col gap-8 flex-start px-6'>
            <div className='w-44 h-6 text-xl rounded-lg bg-gray-200 animate-pulse'></div>

            <div className='w-64 h-6 text-xl rounded-lg bg-gray-200 animate-pulse'></div>
            <div className='w-64 h-6 text-xl rounded-lg bg-gray-200 animate-pulse'></div>
            <div className='w-64 h-6 text-xl rounded-lg bg-gray-200 animate-pulse'></div>

        </div>
    )
}

export default Loading