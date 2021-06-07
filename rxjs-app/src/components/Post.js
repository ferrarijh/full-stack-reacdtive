const Post = (props) => {
    return (
        <div className='post'>
            <img className="img" src={props.post['largeImageURL']} 
                alt={"image for id:"+props.post['id']} 
                />
                <div className='postInfo'>
                    <p>username: {props.post['user']}<br/>
                    {/* {props.post['likes']+' likes'}<br/>
                    {props.post['favorites']+' favorites'} */}
                    </p>
                </div>
        </div>
    )
}

export default Post