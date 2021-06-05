import {useState} from 'react'

const Input = (props)=>{
    const [query, setQuery] = useState('')

    // const handleSubmit = (e)=>{
    //     e.preventDefault()
    //     console.log(query)
    // }

    return(
        <div>
            <form onSubmit={(e)=>props.handleSubmit(e,query)}>
                <label>Keyword: </label>
                <input type="text" onChange={(e)=>setQuery(e.target.value)}/>
                <input type="submit" value="Go"/>
            </form>
        </div>
    )
}

export default Input