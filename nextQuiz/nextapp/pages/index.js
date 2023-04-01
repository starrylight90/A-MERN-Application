import Head from 'next/head'
import styles from '../styles/Home.module.css'
import useSWR, { mutate } from 'swr'

import Question from './Question';


const fetcher = url => fetch(url).then(r=>r.json());

export async function getStaticProps(context) {
  
   const words = await fetcher('http://localhost:9000/api/word');
 

   if(!words){
     return {
     notFound:true,
    }
   }
  return {

    props: { words }, // will be passed to the page component as props
  }
}


export default function Home({words}) {
  
  const {data, error} = useSWR('http://localhost:9000/api/word', fetcher)
  if(error) return <div>failed to load</div>
  if (!data) return <div>loading ...</div>

  return (
    <div>
      <Head>
        <title>Word Quiz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to Word Quiz!
        </h1>

        <div className={styles.words}>
         {words.map((word)=> (
           <div>{word.word} : {word.def}</div>
         ))}
        </div>
        
          <Question words={data}></Question>
        <button onClick={() => {
          // expire cookie
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
          // tell all SWRs with this key to revalidate (include mutate)
          mutate('http://localhost:9000/api/word');
        }}>Load new Question</button>

        
      </main>

  
    </div>
  )
}
