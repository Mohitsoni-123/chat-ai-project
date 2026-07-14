import React, { useEffect, useState } from 'react'
import { checkHeading, replaceHeadingStars } from '../helper'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown'

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
      else{
        setHeading(false);
        setAnswer(ans)
      }
      
    }, [ans])

    const renderer = {
      code({node, inline, className, children, ...props}){
        const match = /Language=(\w+)/.exec(className ||'')
        return !inline && match ? (
          <SyntaxHighlighter 
            {...props}
            children={String(children).replace(/\n$/, '')}
            language={match[1]}
            style={dark}
            preTag="div"
          />
        ):(
          <code {...props} className={className}>
            {children}

          </code>
        )
      }
    }
  return (
    <>
    {
      index === 0 && totalResult>1 ? <span className="pt-0 text-xl block dark:text-white text-black">{answer}</span> : 
      heading ? <span className= {'pt-2 text-lg md:text-xl block dark:text-white text-black'}> {answer} </span> 
      : <span className={type==='q' ? 'pl-1' : 'pl-5'}> 
        <ReactMarkdown components={renderer}>{answer}</ReactMarkdown>
       </span>
    }
      
    </>
  )
}

export default Answers
