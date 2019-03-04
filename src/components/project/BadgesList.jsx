import React from 'react';
import BadgeSummary from './BadgeSummary';

function BadgeList(props) {
  return (
    <BadgeSummary name="abc" metadata="def" />
  )
  // const { posts } = this.state
  // const postList = posts.length ? (
  //   posts.map(post => {
  //     return (
  //       <div className="post card" key={post.id}>
  //         <div className="card-content">
  //           <Link to={'/' + post.id}>
  //             <span className="card-title red-text">{post.title}</span>
  //           </Link>
  //           <p>{post.body}</p>
  //         </div>
  //       </div>
  //     )
  //   })
  // ) : (
  //     <div className="center">No posts to show</div>
  //   );

  // return (
  //   <div>
  //     <div className="container">
  //       <h4 className="center">Home</h4>
  //       {postList}
  //     </div>
  //   </div>
  // )
}

export default BadgeList;
