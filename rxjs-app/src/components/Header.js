import {ajax} from 'rxjs/ajax'
import {useState} from 'react'

const Header = (props) => {

    const [postsCnt, setPostsCnt] = useState('')
    const [bounce, setBounce] = useState('bounce')
    const [cnt, setCnt] = useState('')

    const handleSubmit = (e)=>{
        e.preventDefault()
        setCnt('...')
        setBounce('bounce')
        const url = props.baseUrl + "/count"

        ajax({
            url: url,
            method: 'GET',
            headers: {
                'Content-Type':'text/html; charset=UTF-8'
            }
        }).subscribe({
            next: (ajaxRes)=>{setPostsCnt(ajaxRes.response)},
            error: (err)=>{
                setBounce(null)
                setCnt(JSON.stringify(JSON.parse(JSON.stringify(err))["response"]))
            },
            complete: ()=>{setCnt('')}
        })
    }

    return (
        <div className="header">
            <h1>Query Result Count: {props.postsLength}</h1>
            <form onSubmit={handleSubmit}>
                <label>Number of posts saved in db: </label>
                {postsCnt!==''? <b>{postsCnt}</b> : <b className={bounce}>{cnt}</b>}
                <br/><input type="submit" value="Get"/>
            </form>
        </div>
    )
}

export default Header
