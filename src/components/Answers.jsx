import React, { useEffect, useState } from 'react'
import { checkHeading, replaceHeadingStars } from '../helper'

const Answers = ({ans, totalResult, index, type}) => {
    // console.log(ans, key)
    const [heading, setHeading] = useState(false)
    const [answer, setAnswer] = useState(ans)
    console.log(index)
    useEffect(()=>{
      if(checkHeading(ans)){
        setHeading(true);
        setAnswer(replaceHeadingStars(ans))
      }
      
    }, [])
  return (
    <>
    {
      index == 0 && totalResult>1 ? <span className='pt-2 text-xl block dark:text-white text-black'>{answer}</span> : 
      heading ? <span className= {'pt-2 text-xl block dark:text-white text-black'}> {answer} </span> 
      : <span className={type=='q' ? 'pl-1' : 'pl-5'}> {answer} </span>
    }
      
    </>
  )
}

export default Answers
