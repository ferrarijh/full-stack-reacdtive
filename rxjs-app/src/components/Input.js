import {useState} from 'react'

const Input = (props)=>{
    const [query, setQuery] = useState('')

    const handleSubmit = (e)=>{
        props.handleSubmit(e.target.value)
        console.log(e.target.value)
        e.preventDefault()
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label>Keyword: </label>
                <input type="text"/>
                <button type="submit">Go </button>
            </form>
        </div>
    )
}

export default Input