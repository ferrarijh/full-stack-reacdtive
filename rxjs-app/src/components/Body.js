import Input from './Input'

const Body = (props) => {
    return (
        <div>
            <Input handleSubmit={props.handleSubmit}/>
            <p>observed: {props.buf}</p>
        </div>
    )
}

export default Body