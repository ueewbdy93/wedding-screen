import { Comment } from '../comments/types';

class CommentWorker {
  private comments: Comment[] = [];
  run() {
    if (this.comments.length === 0) {
      const remainTime = 1; // calculate the next round start time
      setTimeout(
        () => {
        // get comments from store
        // dispatch action to remove comments from store
          this.run();
        },
        remainTime);
    } else {
      const comment = this.comments.shift();
      const remainTime = Date.now() - comment!.timestamp.getTime();
      setTimeout(
        () => {
        // dispatch action to add comment
          this.run();
        },
        remainTime);
    }
  }
}
