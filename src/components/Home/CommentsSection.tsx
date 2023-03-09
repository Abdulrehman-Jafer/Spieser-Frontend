import React, { useEffect, useState,useRef } from 'react'
import Comment from './Comment'
import { ofComment } from './Post'
import { GetAllCommenstUrl } from '../../globles/globles'
import axios from 'axios'
import { v4 } from "uuid";
import Loader from '../../globles/Loader'
const CommentsSection = ({ postId, showComments,reload }: { postId: string, showComments: boolean,reload:number }) => {
  const [comments, setComments] = useState<ofComment[]>([])
  const [loading, setLoading] = useState(false)
  const commentBoxRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const getAllComments = async () => {
      setLoading(true)
      await axios.post(GetAllCommenstUrl, { postId }).then((res) => {
        if (res.status == 200) {
          setLoading(false)
          return setComments(res.data.comments)
        }
      }).catch(err => {
        console.log(err)
        return setLoading(false)
      })
    }
    if (showComments) {
      getAllComments()
    }
  }, [showComments,reload])
  const CommentsMap = comments.length ? comments.map(({ commentBody, userimage, username }) => {
    return <Comment key={v4()} username={username} userimage={userimage} commentBody={commentBody} />
  }) : <p className='text-fourth text-center underline'>This post has no comments.</p>
  return (
   <main ref={commentBoxRef} className={`flex flex-col gap-[1rem] overflow-y-auto max-h-[100px] customScroll bg-black ${showComments ? "" : "hidden"}`}>
      { loading ? <Loader/> : CommentsMap}
    </main>
  )
}

export default CommentsSection
