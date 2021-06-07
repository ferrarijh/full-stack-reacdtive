import Post from './Post'

const Posts = (props) => {
    return (
        <div className='posts'>
            {props.posts.map((post)=>
                <Post key={post.id} post={post}/>
            )}
        </div>
    )
}

export default Posts
 