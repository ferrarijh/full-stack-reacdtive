import Post from './Post'
import Spinner from './Spinner'
import LoadingStatus from '../LoadingStatus'

const Posts = (props) => {
    return (
        <div className='posts'>
            {props.loadingStatus === LoadingStatus.LOADING && <Spinner/>}
            {props.posts.length === 0 && <p><i style={{color:'#888'}}>(Posts will be shown here)</i></p>}
            {props.posts.map((post)=>
                <Post key={post['id']} post={post} onImgClick={props.onImgClick}/>
            )}
        </div>
    )
}

export default Posts
 