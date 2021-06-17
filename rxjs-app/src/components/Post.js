const Post = (props) => {

    const onMouseEnter = (e) => {e.target.style.opacity = 0.5}
    const onMouseLeave = (e) => {e.target.style.opacity = 1}
    const onImgClick = ()=>{props.onImgClick(props.post['largeImageURL'])}

    return (
        <div className='post'>
            <img className="img"
                src={props.post['largeImageURL']} 
                alt={"image for id:"+props.post['id']}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onImgClick}/>
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