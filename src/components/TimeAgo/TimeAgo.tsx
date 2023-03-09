import React from 'react'
const Timeago = ({createdOn}:{createdOn:string}) => {
    const date = new Date(createdOn).toLocaleDateString()
    return (
        <main className='text-gray-500 flex gap-[2px]'>
            <span className='sm:block hidden'>Posted on {date} </span>
        </main>
    )
}

export default Timeago
